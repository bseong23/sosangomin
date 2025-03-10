# test_mongo_connection.py

import logging
import sys
from datetime import datetime

# # 로깅 설정
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

try:
    from database.mongo_connector import mongo_instance

    collections = mongo_instance.db.list_collection_names()
    print(f"연결 성공! 사용 가능한 컬렉션: {collections}")
    
    mongo_instance.close()
    
except Exception as e:
    print(f"연결 실패: {str(e)}")
    sys.exit(1)

# from database.mongo_connector import mongo_instance
# from bson import ObjectId

# class DataAnalysisService:
#     def __init__(self):
#         self.data_sources = mongo_instance.get_collection("DataSources")
#         self.analysis_results = mongo_instance.get_collection("AnalysisResults")
    
#     async def save_analysis_result(self, source_id, result_data, analysis_type):
#         result = self.analysis_results.insert_one({
#             "source_id": ObjectId(source_id),
#             "analysis_type": analysis_type,
#             "created_at": datetime.now(),
#             "result_data": result_data,
#             "status": "completed"
#         })
        
#         return str(result.inserted_id)