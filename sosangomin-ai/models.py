# models.py
import os
import logging
from sqlalchemy import create_engine, event, Column, String, DateTime, Integer, Text, ForeignKey, Date, Enum, Float, Boolean, func
from sqlalchemy.ext.declarative import declarative_base


# 로깅 설정
logger = logging.getLogger(__name__)

Base = declarative_base()

class News(Base):
    __tablename__ = 'news'
    news_id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    link = Column(Text, nullable=False)
    pub_date = Column(Date, nullable=False)
    image_url = Column(Text)
    category = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True))