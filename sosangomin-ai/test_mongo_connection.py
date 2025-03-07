# test_mongo_connection.py

import logging
import sys

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

try:
    from database.mongo_connector import mongo_instance

    collections = mongo_instance.db.list_collection_names()
    print(f"연결 성공! 사용 가능한 컬렉션: {collections}")
    
    mongo_instance.close()
    
except Exception as e:
    print(f"연결 실패: {str(e)}")
    sys.exit(1)