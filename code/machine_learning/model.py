import pandas as pd
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.model_selection import train_test_split
from joblib import dump


client = MongoClient("mongodb://127.0.0.1:27017")
db = client.assignment
books = db.books

books_data = []
books_list = books.find({})
for book in books_list:
        book['_id'] = str(book['_id'])
        books_data.append(book)

# Convert to DataFrame
books_df = pd.DataFrame(books_data)

# Combine relevant features into a single string for each book
books_df['combined_features'] = books_df.apply(
    lambda row: f"{row['Title']} {row['description']} {' '.join(row['authors'])} {' '.join(row['categories'])}", axis=1)

# Initialize the TF-IDF Vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')

# Train/test split
train_data, test_data = train_test_split(books_df, test_size=0.2, random_state=42)

# Fit and transform the vectorizer on the training data
tfidf_matrix_train = tfidf_vectorizer.fit_transform(train_data['combined_features'])

# Transform the test data
tfidf_matrix_test = tfidf_vectorizer.transform(test_data['combined_features'])

# Compute the cosine similarity matrix from the TF-IDF vectors
cosine_sim = linear_kernel(tfidf_matrix_train, tfidf_matrix_train)

dump(tfidf_vectorizer, 'tfidf_vectorizer.joblib')
dump(cosine_sim, 'cosine_similarity_matrix.joblib')
dump(books_df, 'dataset.joblib')

# Function to get recommendations based on the cosine similarity score
def get_recommendations(title, cosine_sim=cosine_sim, df=train_data):
    # Get the index of the book that matches the title
    idx = df.index[df['Title'] == title].tolist()[0]

    # Get the pairwsie similarity scores of all books with that book
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the books based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 5 most similar books
    sim_scores = sim_scores[1:6]

    # Get the book indices
    book_indices = [i[0] for i in sim_scores]

    # Return the top 5 most similar books
    return df.iloc[book_indices]

# # Testing with a book title from the dataset
book_title = train_data.iloc[0]['Title']
recommended_books = get_recommendations(book_title)

# print(f"Because you read {book_title}:\n\n")
for index, row in recommended_books.iterrows():
    print(row['Title'], '-', row['categories'])
