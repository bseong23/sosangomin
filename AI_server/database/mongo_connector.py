from pymongo import MongoClient
import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

class MongoDatabase:
    def __init__(self):
        load_dotenv()  
        
        self.username = os.getenv("MONGO_USER")
        self.password = os.getenv("MONGO_PASSWORD")
        self.host = os.getenv("MONGO_HOST")
        self.database_name = os.getenv("MONGO_DB")
        
        self.connection_string = f"mongodb+srv://{self.username}:{self.password}@{self.host}/{self.database_name}?authSource=admin"
        
        try:
            self.client = MongoClient(
                self.connection_string,
                maxPoolSize=10,    
                maxIdleTimeMS=160,  
                serverSelectionTimeoutMS=160
            )
            self.client.server_info()
            
            self.db = self.client[self.database_name]
            
            logger.info("MongoDB 연결이 성공적으로 설정.")
            
        except Exception as e:
            logger.error(f"MongoDB 연결 오류: {str(e)}")
            raise
    
    def get_collection(self, collection_name):
        """
        지정된 이름의 MongoDB 컬렉션을 반환.
        
        Args:
            collection_name: 컬렉션 이름
            
        Returns:
            pymongo.collection.Collection: MongoDB 컬렉션 객체
        """
        return self.db[collection_name]
    
    def close(self):
        """
        MongoDB 연결을 닫음.
        """
        if hasattr(self, 'client') and self.client:
            self.client.close()
            logger.info("MongoDB 연결이 닫혔습니다.")

mongo_instance = MongoDatabase()