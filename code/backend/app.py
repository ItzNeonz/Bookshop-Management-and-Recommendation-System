from flask import Flask, jsonify, make_response, request
from pymongo import MongoClient
import jwt
import datetime
import json
from bson import json_util
import uuid
from flask_cors import CORS
from bson import ObjectId
from joblib import load

app = Flask(__name__)
CORS(app)

#Establish connection with mongodb
client = MongoClient("mongodb://127.0.0.1:27017")
db = client.assignment
books = db.books
users = db.users
meta = db.meta_data

#Load ML model and dataset
dataset = load('dataset.joblib')
cosine_sim = load('cosine_similarity_matrix.joblib')


# Secret key for JWT
app.config['SECRET_KEY'] = 'nOYIq8kI0pCqYci5VrHS1GjHAoFTPrie_E_NyRH61EeobiGHPRkHCHqswTgGYTt13brOh2xxsaRMvb9f-VbgQg'

#Home endpoint to test if server is running
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "server is running!"}) , 200


#Returns list of top 50 categories to be displayed on categories page
@app.route("/categories", methods=["GET"])
def get_categories():
    docs = meta.find()
    for doc in docs:
        if 'categories' in doc:
            doc.pop('_id')
            return make_response(jsonify(doc), 200)
    return make_response(jsonify({'message': 'record not found'}), 200)


#Registers a new user. If registration is successful,
#login user and return authentication token
@app.route("/register", methods=["POST"])
def register():
    req = request.json

    if "Email" and "Password" not in req:
        return jsonify({'message': 'Invalid request!'}), 404
    
    current_user = users.find_one({"Email": req['Email'], "Password": req['Password']})
    if current_user is not None:
        return jsonify({'message': 'User already exists'}), 409
    
    users.insert_one(req)
    login_resp = login()
    return login_resp


#Login registered user and return auth token
@app.route("/login", methods=["POST"])
def login():
    req = request.json

    if "Email" and "Password" not in req:
        return jsonify({'message': 'Invalid request!'}), 404
    
    current_user = users.find_one({"Email": req['Email'], "Password": req['Password']})
    if current_user is None:
        return jsonify({'message': 'Invalid email or password'}), 409
    
    token = jwt.encode({
        'username': req['Email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config['SECRET_KEY'])
    return jsonify({'message': 'success', 'token': token.decode('utf-8')}), 200


#Allow user to reset password
@app.route("/reset-password", methods=["POST"])
def reset_password():
    req = request.json

    if "Email" and "OldPassword" and "NewPassword" not in req:
        return make_response(jsonify({'message': 'Invalid request!'}), 404)
    
    current_user = users.find_one({"Email": req['Email'], "Password": req['OldPassword']})
    if current_user is None:
        return make_response(jsonify({'message': 'Invalid email or password'}), 409)
    
    users.update_one({"_id": current_user['_id']}, {"$set": {"Password": req['NewPassword']}})
    return make_response(jsonify({'message': 'success'}), 200)


#Logout user from the website
@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('x-auth-token')
    if not token:
        return jsonify({'message': 'Token is missing!'}), 401

    if not verify_token(token):
        return jsonify({'message': 'Token is invalid!'}), 401

    return jsonify({'message': 'Successfully logged out'}), 200


#Returns list of 25 books
@app.route('/books', methods=['GET'])
def get_books():
    page_num = int(request.args.get("page", 1))
    books_list = books.find({}).skip((page_num - 1) * 25).limit(25)
    final_list = []
    for book in books_list:
        book['_id'] = str(book['_id'])
        final_list.append(book)
    books_fetched = list(json.loads(json_util.dumps(final_list)))
    return {'results': books_fetched}, 200


#Returns book details matching book id
@app.route('/books/<id>', methods=['GET'])
def get_books_by_id(id):
    object_id = ObjectId(id)
    book = books.find_one({"_id": object_id})
    if not book:
        return {'message': "Book does not exist"}, 409
    
    book['_id'] = str(book['_id'])
    return {'results': book}, 200


#Returns list of 25 books for the requested category
#This endpoint supports pagination.
#Books list is fetched for the requested page number
@app.route('/books/categories/<category>', methods=['GET'])
def search_books_by_category(category):
    page_num = int(request.args.get("page", 1))
    if category == "all":
        return get_books()
    
    query = {}
    query["categories"] = {'$in': [category]}
    books_list = books.find(query).skip((page_num - 1) * 25).limit(25)
    t_list = list(books.find(query))
    final_list = []
    for book in books_list:
        book['_id'] = str(book['_id'])
        final_list.append(book)
    return jsonify({'results': final_list, 'total_books': len(t_list)}), 200


#Returns list of 25 books for the requested search term
#and page number
@app.route('/books/search', methods=['GET'])
def search_books():
    search_term= request.args.get("search-term", "")
    page_num = int(request.args.get("page", 1))
    if search_term == "":
        return get_books()
    
    books.create_index([('Title', 'text')])
    query = {'$text': {'$search': search_term}}
    books_list = books.find(query).skip((page_num - 1) * 25).limit(25)
    t_list = list(books.find(query))
    final_list = []
    for book in books_list:
        book['_id'] = str(book['_id'])
        final_list.append(book)
    return jsonify({'results': final_list, 'total_books': len(t_list)}), 200


#Creates a new order and return order id
@app.route('/customer/order', methods=['POST'])
def create_order():
    token = request.headers.get('x-auth-token')
    req = request.json
    if not token:
        return jsonify({'message': 'Token is missing!'}), 401
    elif 'order_date' and 'items' and 'address' not in req:
        return jsonify({'message': 'Invalid request!'}), 401 
    elif not verify_token(token):
        return jsonify({'message': 'Token is invalid!'}), 401
    
    orders = []
    order_id = str(ObjectId())
    req['_id'] = order_id
    
    curr_user = get_user_by_token(token)
    if "Orders" in curr_user:
        orders = curr_user["Orders"]
    orders.append(req)
    curr_user['Orders'] = orders
    users.update_one({"_id": curr_user['_id']}, {"$set": {"Orders": orders}})

    return jsonify({'message': 'Order created successfully!', 'order_id': str(req['_id'])}), 200


#Return list of all orders for the loggin user
@app.route('/orders', methods=['GET'])
async def view_orders():
    token = request.headers.get('x-auth-token')
    if not token:
        return jsonify({'message': 'Token is missing!'}), 401
    elif not verify_token(token):
        return jsonify({'message': 'Token is invalid!'}), 401
    
    curr_user = get_user_by_token(token)
    curr_user.pop("_id")
    orders = curr_user['Orders']
    order_list = []
    for order in orders:
        obj = await get_order_by_id(order['_id'])
        order_list.append(obj[0]['results'])
    return jsonify({"results": order_list}), 200


#Returns details of the requested order id
@app.route('/orders/<id>', methods=['GET'])
async def get_order_by_id(id):
    token = request.headers.get('x-auth-token')

    if not token:
        return jsonify({'message': 'Token is missing!'}), 401
    elif not verify_token(token):
        return jsonify({'message': 'Token is invalid!'}), 401
    elif not id:
        return jsonify({'message': 'Invalid order id!'}), 404
    
    curr_user = users.find_one({'Orders._id': id})
    order_to_return = None
    for order in curr_user["Orders"]:
        if order["_id"] == id:
            order_to_return = order
            break
    
    if order_to_return:
        items = []
        for item in order_to_return['items']:
            book = get_books_by_id(item['book_id'])
            if book:
                book[0]['results']['qty'] = item['qty']
                items.append(book[0]['results'])
        order_to_return['items'] = items

    return {"results": order_to_return}, 200


#Returns top 5 recommended books based on the
#most recently accessed book
@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    id = request.args.get("id", "")
    if len(id) == 0:
        return jsonify({'results': []}) , 200

    idx = dataset.index[dataset['_id'] == id].tolist()[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]
    book_indices = [i[0] for i in sim_scores]
    resp = dataset.iloc[book_indices]
    print(str(resp))
    return jsonify({'results': resp.to_dict('records')}) , 200


#Function to verify jwt token
def verify_token(token):
    try:
        jwt.decode(token, app.config['SECRET_KEY'])
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False


#Decode token and return the user object
def get_user_by_token(token):
    token_data = jwt.decode(token, app.config['SECRET_KEY'])
    curr_user = users.find_one({"Email": token_data['username']})
    return curr_user


if __name__ == "__main__":
    app.run(debug=True)