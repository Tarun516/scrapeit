# backend/db/models.py

from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv 

MONGO_URI = os.getenv("MONGO_URI")
print(MONGO_URI)
client = MongoClient(MONGO_URI)
db = client["scrape_app"]   

# User schema
class User:
    def __init__(self, username, email, hashed_password):
        self.username = username
        self.email = email
        self.hashed_password = hashed_password
        self.created_at = datetime.now()

    @staticmethod
    def create_user(user_data):
        user_collection = db["users"]
        return user_collection.insert_one(user_data)

    @staticmethod
    def get_user_by_email(email):
        user_collection = db["users"]
        return user_collection.find_one({"email": email})

    @staticmethod
    def get_user_by_id(user_id):
        user_collection = db["users"]
        return user_collection.find_one({"_id": ObjectId(user_id)})

# ScrapedContent schema
class ScrapedContent:
    def __init__(self, user_id, url, title, content, summary, pinecone_id):
        self.user_id = user_id
        self.url = url
        self.summary = summary
        self.created_at = datetime.now()

    @staticmethod
    def save_scraped_content(scraped_data):
        content_collection = db["scraped_content"]
        return content_collection.insert_one(scraped_data)

    @staticmethod
    def get_user_scrapes(user_id):
        content_collection = db["scraped_content"]
        return content_collection.find({"user_id": ObjectId(user_id)})

    @staticmethod
    def get_scrape_by_id(scrape_id):
        content_collection = db["scraped_content"]
        return content_collection.find_one({"_id": ObjectId(scrape_id)})

 
class UserQuery:
    def __init__(self, user_id, query, context_ids, response):
        self.user_id = user_id
        self.query = query
        self.context_ids = context_ids  # List of ScrapedContent IDs used for context
        self.response = response
        self.created_at = datetime.utcnow()

    @staticmethod
    def save_query(query_data):
        query_collection = db["user_queries"]
        return query_collection.insert_one(query_data)

    @staticmethod
    def get_queries_by_user(user_id):
        query_collection = db["user_queries"]
        return query_collection.find({"user_id": ObjectId(user_id)})
