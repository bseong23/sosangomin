# database/connector.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        load_dotenv("./config/.env")

        self.host = os.getenv("MARIA_DB_HOST")
        self.port = int(os.getenv("MARIA_DB_PORT", 3306))
        self.user = os.getenv("MARIA_DB_USER")
        self.password = os.getenv("MARIA_DB_PASSWORD")
        self.schema = os.getenv("MARIA_DB_SCHEMA")
        self.charset = os.getenv("MARIA_DB_CHARSET", "utf8")
        
        self.engine = create_engine(
            f"mysql+pymysql://{self.user}:"+
            f"{self.password}@{self.host}:{self.port}/"+
            f"{self.schema}?charset={self.charset}",
            pool_size=10,
            max_overflow=5,
            pool_recycle=120,
            pool_pre_ping=True,
            echo=False
        )

        self.pre_session = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )

    def get_pre_session(self):
        logger.info("MariaDB 연결이 성공적으로 설정.")
        return self.pre_session

database_instance = Database()
