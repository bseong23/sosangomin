# models.py
import os
import logging
import datetime
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
    user_id = Column(Integer)  
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
    updated_at = Column(DateTime(timezone=True))  
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

class ResidentPopulation(Base):
    __tablename__ = 'resident_populations' 

    resident_population_id = Column(Integer, primary_key=True, autoincrement=True, comment='거주 인구 데이터 ID (PK)')
    stdr_yyqu_cd = Column(String(6), comment='기준 년월분기 코드 (예: 202301)', nullable=False)
    adstrd_cd_nm = Column(String(100), comment='행정동 코드명 (예: 강남구 역삼동)', nullable=False)
    # population_type = Column(String(20), comment='인구 구분 (예: 상주인구, 유동인구, 직장인구)', nullable=False)  # 인구 구분

    # 총 인구
    tot_repop = Column(Integer, nullable=True, comment='총 인구 수')
    ml_repop = Column(Integer, nullable=True, comment='남성 인구 수')
    fml_repop = Column(Integer, nullable=True, comment='여성 인구 수')

    # 연령대별 인구
    age_10_repop = Column(Integer, nullable=True, comment='연령대_10_인구 수')
    age_20_repop = Column(Integer, nullable=True, comment='연령대_20_인구 수')
    age_30_repop = Column(Integer, nullable=True, comment='연령대_30_인구 수')
    age_40_repop = Column(Integer, nullable=True, comment='연령대_40_인구 수')
    age_50_repop = Column(Integer, nullable=True, comment='연령대_50_인구 수')
    age_60_repop = Column(Integer, nullable=True, comment='연령대_60이상_인구 수')

    # 남성 연령대별 인구
    male_10_repop = Column(Integer, nullable=True, comment='남성연령대_10_인구 수')
    male_20_repop  = Column(Integer, nullable=True, comment='남성연령대_20_인구 수')
    male_30_repop  = Column(Integer, nullable=True, comment='남성연령대_30_인구 수')
    male_40_repop  = Column(Integer, nullable=True, comment='남성연령대_40_인구 수')
    male_50_repop  = Column(Integer, nullable=True, comment='남성연령대_50_인구 수')
    male_60_repop  = Column(Integer, nullable=True, comment='남성연령대_60이상_인구 수')

    # 여성 연령대별 인구
    female_10_repop = Column(Integer, nullable=True, comment='여성연령대_10_인구 수')
    female_20_repop = Column(Integer, nullable=True, comment='여성연령대_20_인구 수')
    female_30_repop = Column(Integer, nullable=True, comment='여성연령대_30_인구 수')
    female_40_repop = Column(Integer, nullable=True, comment='여성연령대_40_인구 수')
    female_50_repop = Column(Integer, nullable=True, comment='여성연령대_50_인구 수')
    female_60_repop = Column(Integer, nullable=True, comment='여성연령대_60이상_인구 수')

    # 가구
    # tot_hshld_co = Column(Integer, nullable=True, comment='총 가구 수')
    # apt_hshld_co = Column(Integer, nullable=True, comment='아파트 가구 수')
    # non_apt_hshld_co = Column(Integer, nullable=True, comment='비아파트 가구 수')

    # 등록 일시
    created_at = Column(DateTime, default=datetime.datetime.now(), comment='데이터 수집 시점')


class WorkingPopulation(Base):
    __tablename__ = 'working_populations' 

    working_population_id = Column(Integer, primary_key=True, autoincrement=True, comment='직장 인구 데이터 ID (PK)')
    stdr_yyqu_cd = Column(String(6), comment='기준 년월분기 코드 (예: 202301)', nullable=False)
    adstrd_cd_nm = Column(String(100), comment='행정동 코드명 (예: 강남구 역삼동)', nullable=False)

    # 총 인구
    tot_wrpop = Column(Integer, nullable=True, comment='총 인구 수')
    ml_wrpop = Column(Integer, nullable=True, comment='남성 인구 수')
    fml_wrpop = Column(Integer, nullable=True, comment='여성 인구 수')

    # 연령대별 인구
    age_10_wrpop = Column(Integer, nullable=True, comment='연령대_10_인구 수')
    age_20_wrpop = Column(Integer, nullable=True, comment='연령대_20_인구 수')
    age_30_wrpop = Column(Integer, nullable=True, comment='연령대_30_인구 수')
    age_40_wrpop = Column(Integer, nullable=True, comment='연령대_40_인구 수')
    age_50_wrpop = Column(Integer, nullable=True, comment='연령대_50_인구 수')
    age_60_wrpop = Column(Integer, nullable=True, comment='연령대_60이상_인구 수')

    # 남성 연령대별 인구
    male_10_wrpop = Column(Integer, nullable=True, comment='남성연령대_10_인구 수')
    male_20_wrpop  = Column(Integer, nullable=True, comment='남성연령대_20_인구 수')
    male_30_wrpop  = Column(Integer, nullable=True, comment='남성연령대_30_인구 수')
    male_40_wrpop  = Column(Integer, nullable=True, comment='남성연령대_40_인구 수')
    male_50_wrpop  = Column(Integer, nullable=True, comment='남성연령대_50_인구 수')
    male_60_wrpop  = Column(Integer, nullable=True, comment='남성연령대_60이상_인구 수')

    # 여성 연령대별 인구
    female_10_wrpop = Column(Integer, nullable=True, comment='여성연령대_10_인구 수')
    female_20_wrpop = Column(Integer, nullable=True, comment='여성연령대_20_인구 수')
    female_30_wrpop = Column(Integer, nullable=True, comment='여성연령대_30_인구 수')
    female_40_wrpop = Column(Integer, nullable=True, comment='여성연령대_40_인구 수')
    female_50_wrpop = Column(Integer, nullable=True, comment='여성연령대_50_인구 수')
    female_60_wrpop = Column(Integer, nullable=True, comment='여성연령대_60이상_인구 수')

    # 등록 일시
    created_at = Column(DateTime, default=datetime.datetime.now(), comment='데이터 수집 시점')

<<<<<<< sosangomin-ai/db_models.py


























class Store(Base):
    __tablename__ = 'stores'
    
    store_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    store_name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    place_id = Column(String(100), nullable=False)
    phone = Column(String(20))
    category = Column(String(100))
    review_count = Column(Integer)
    business_hours = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
=======
class SubwayStation(Base):
    __tablename__ = "subway_stations"

    station_id = Column(Integer, primary_key=True, autoincrement=True, comment="지하철역 데이터 ID (PK)")
    bldn_id = Column(String(20), unique=True, nullable=False, comment="역사 ID")
    station_name = Column(String(100), nullable=False, comment="역사명")
    route = Column(String(50), nullable=False, comment="호선")
    latitude = Column(Float, nullable=False, comment="위도")
    longitude = Column(Float, nullable=False, comment="경도")
    created_at = Column(DateTime, default=datetime.datetime.now, comment="데이터 수집 시점")

class BusStop(Base):
    __tablename__ = "bus_stops"

    stop_id = Column(Integer, primary_key=True, autoincrement=True, comment="정류소 데이터 ID (PK)")
    stop_no = Column(String(20), unique=True, nullable=False, comment="정류소 번호")
    stop_name = Column(String(100), nullable=False, comment="정류소 이름")
    longitude = Column(Float, nullable=False, comment="경도")
    latitude = Column(Float, nullable=False, comment="위도")
    node_id = Column(String(50), nullable=True, comment="노드 ID")
    stop_type = Column(String(50), nullable=True, comment="정류소 타입")
    created_at = Column(DateTime, default=datetime.datetime.now, comment="데이터 수집 시점")
>>>>>>> sosangomin-ai/db_models.py
