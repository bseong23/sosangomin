# models.py
import os
import logging
from sqlalchemy import create_engine, event, Column, String, DateTime, Integer, Text, ForeignKey, Date, Enum, Float, Boolean, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

# 로깅 설정
logger = logging.getLogger(__name__)

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    social_id = Column(Integer, nullable=True)
    user_type = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    profileImgUrl = Column(String(1023), nullable=True)
    user_role = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)

class News(Base):
    __tablename__ = 'news'
    news_id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    link = Column(Text, nullable=False)
    pub_date = Column(Date, nullable=False)
    image_url = Column(Text)
    category = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True))
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)

class ChatSession(Base):
    __tablename__ = 'chatsessions'
    uid = Column(String(36), primary_key=True)
    user_id = Column(String(16))
    created_at = Column(DateTime(timezone=True)) 
    last_active = Column(DateTime(timezone=True))  
    conversations = relationship("ChatHistory", back_populates="session")

class ChatHistory(Base):
    __tablename__ = 'chathistories'
    index = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(50), ForeignKey('chatsessions.uid'))
    user_id = Column(String(16))
    user_message = Column(Text)
    bot_message = Column(Text)
    created_at = Column(DateTime(timezone=True))
    session = relationship("ChatSession", back_populates="conversations")

