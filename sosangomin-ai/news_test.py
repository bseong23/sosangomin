from database.connector import database_instance
from sqlalchemy import text
db = database_instance.pre_session()

try:
    # 간단한 쿼리 실행
    result = db.execute(text("SELECT 1 as test"))
    print("연결 성공:", list(result))
    
    # 뉴스 테이블 쿼리
    news_count = db.execute(text("SELECT COUNT(*) FROM s12p21a306.news")).scalar()
    print(f"뉴스 수: {news_count}")
    
    # 테이블 목록 확인
    tables = db.execute(text("SHOW TABLES")).fetchall()
    print("테이블 목록:", [t[0] for t in tables])
    
except Exception as e:
    print(f"오류 발생: {e}")
finally:
    db.close()