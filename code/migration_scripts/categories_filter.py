from pymongo import MongoClient
import pandas as pd
import ast

dataframe1 = pd.read_csv('archive/books_data.csv')
dataframe1 = dataframe1.drop(columns=['previewLink', 'infoLink', 'ratingsCount'])
new_df = pd.DataFrame()
    
new_df['categories'] = dataframe1['categories']
new_df = new_df.dropna()
categories_list = new_df['categories'].to_list()

list = []
for elem in categories_list:
    t_list = ast.literal_eval(elem)
    for obj in t_list:
        list.append(obj)
            
print(f"Total categories: {len(list)}\n\n")

df = pd.DataFrame(list, columns=['category'])
category_counts = df['category'].value_counts()
top_categories = category_counts.head(50).to_dict()

final_list = []
for category in top_categories.keys():
    final_list.append(category)

doc = {}
doc['categories'] = final_list
print(str(doc))

client = MongoClient('localhost', 27017)
db = client['assignment']
collection = db['meta_data']
collection.insert_one(doc)
print("Document inserted successfully")


