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
    news_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    link = Column(Text, nullable=False)
    pub_date = Column(Date, nullable=False)
    image_url = Column(Text)
    category = Column(String(50), nullable=False)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class ChatSession(Base):
    __tablename__ = 'chat_sessions'
    uid = Column(String(36), primary_key=True)
    user_id = Column(String(16))
    created_at = Column(DateTime(timezone=True)) 
    updated_at = Column(DateTime(timezone=True))  
    conversations = relationship("ChatHistory", back_populates="session")

class ChatHistory(Base):
    __tablename__ = 'chat_histories'
    index = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(50), ForeignKey('chat_sessions.uid'))
    user_id = Column(Integer)
    user_message = Column(Text)
    bot_message = Column(Text)
    created_at = Column(DateTime(timezone=True))
    session = relationship("ChatSession", back_populates="conversations")

class Weathers(Base):
    __tablename__ = 'weathers'

    weather_id = Column(Integer, primary_key=True, autoincrement=True, comment='날씨 데이터 ID (PK)')
    datetime = Column(Integer, unique=True, comment='YYYYMMDDHH 형식의 단일 datetime 키')
    year = Column(String(4), comment='연도 (YYYY)')
    month = Column(String(2), comment='월 (MM, 두 자리)')
    day = Column(String(2), comment='일 (DD, 두 자리)')
    hour = Column(String(2), nullable=False, comment='시간 (HH, 두 자리)')
    location = Column(String(20), comment='지역명 (예: 서울)')
    
    ta = Column(Float, nullable=True, comment='기온 (°C)')
    ws = Column(Float, nullable=True, comment='풍속 (m/s)')
    hm = Column(Float, nullable=True, comment='습도 (%)')
    rn = Column(Float, nullable=True, comment='강수량 (mm)')

    # def __repr__(self):
    #     return f"<Weathers(datetime={self.datetime}, location={self.location}, ta={self.ta}, ws={self.ws}, hm={self.hm}, rn={self.rn})>"
