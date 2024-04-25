import pandas as pd
from pymongo import MongoClient
import ast

def update_categories(categories, rating):
    if rating > 4.2:
        categories.append("Best Seller")
    if rating == 5:
        categories.append("Top Rated")
    return categories


def db_migrate():
    dataframe1 = pd.read_csv('archive/books_data.csv')
    dataframe1 = dataframe1.drop(columns=['previewLink', 'infoLink', 'ratingsCount'])

    dataframe2 = pd.read_csv('archive/books_rating.csv')
    dataframe2 = dataframe2.drop(columns=['Id', 'User_id', 'profileName', 'review/helpfulness', 'review/time', 'review/summary', 'review/text'])
    dataframe2 = dataframe2.groupby('Title').agg({
        'Price': 'first',
        'review/score': 'mean'
    })

    books_df = pd.merge(dataframe1, dataframe2, on='Title', how='left')
    books_df = books_df.fillna('')
    print(f"Books df size level 1: {len(books_df)}")
    books_df = books_df[books_df['image'] != '']
    books_df = books_df[books_df['Price'] != '']
    books_df['authors'] = books_df['authors'].replace('', '[]')
    books_df['categories'] = books_df['categories'].replace('', '[]')

    books_df['authors'] = books_df['authors'].apply(ast.literal_eval)
    books_df['categories'] = books_df['categories'].apply(ast.literal_eval)
    books_df['categories'] = books_df.apply(lambda row: update_categories(row['categories'], row['review/score']), axis=1)

    books_df['publishedDate'] = pd.to_datetime(books_df['publishedDate'], errors='coerce', exact=False)
    books_df['publishedYear'] = books_df['publishedDate'].dt.year
    books_df.drop('publishedDate', axis=1, inplace=True)

    print(f"Books df size level 2: {len(books_df)}\n\n")

    documents = books_df.to_dict(orient='records')
    client = MongoClient('localhost', 27017)
    db = client['assignment']
    collection = db['books']
    collection.insert_many(documents)
    print("Documents inserted successfully")

db_migrate()