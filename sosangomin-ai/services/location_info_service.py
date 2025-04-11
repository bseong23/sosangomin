# services/location_info_service.py

import re
import logging
from typing import Optional, Dict, Any, Tuple
from services.location_recommendation_service import location_recommendation_service
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class LocationInfoService:
    def __init__(self):
        """위치 정보 서비스 초기화"""
        logger.info("LocationInfoService 초기화 완료")
    
    def extract_dong_from_address(self, address: str) -> Optional[str]:
        """주소에서 행정동(동) 정보 추출
        
        Args:
            address: 매장 주소 (e.g. "대구광역시 동구 신서동 799-7 (신서동)")
            
        Returns:
            행정동명 또는 None (추출 실패 시)
        """
        try:
            pattern1 = r'\(([가-힣0-9]+동)\)'
            match1 = re.search(pattern1, address)
            if match1:
                return match1.group(1)
            
            pattern2 = r'([가-힣0-9]+동)\s+\d+'
            match2 = re.search(pattern2, address)
            if match2:
                return match2.group(1)
            
            pattern3 = r'([가-힣0-9]+동)'
            match3 = re.search(pattern3, address)
            if match3:
                return match3.group(1)
            
            return None
            
        except Exception as e:
            logger.error(f"주소에서 행정동 추출 중 오류: {str(e)}")
            return None
    
    async def get_dong_info(self, dong_name: str) -> Dict[str, Any]:
        """행정동명에 해당하는 데이터 조회
        
        Args:
            dong_name: 행정동명 (e.g. "신서동")
            
        Returns:
            행정동 관련 정보 또는 에러 메시지
        """
        try:
            heatmap_data = location_recommendation_service.prepare_initial_heatmap_data()
            
            dong_data = next((item for item in heatmap_data if item["행정동명"] == dong_name), None)
            
            if not dong_data:
                return {
                    "status": "not_found",
                    "message": f"'{dong_name}' 행정동 데이터를 찾을 수 없습니다."
                }
            
            return {
                "status": "success",
                "data": dong_data
            }
            
        except HTTPException as http_ex:
            logger.error(f"행정동 정보 조회 중 HTTP 오류: {str(http_ex)}")
            return {
                "status": "error",
                "message": f"행정동 정보 조회 중 오류가 발생했습니다: {str(http_ex)}"
            }
        except Exception as e:
            logger.error(f"행정동 정보 조회 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"행정동 정보 조회 중 오류가 발생했습니다: {str(e)}"
            }

location_info_service = LocationInfoService()