# services/business_verification_service.py

import os
import logging
import requests
from typing import Dict, Any
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class BusinessVerificationService:
    def __init__(self):
        load_dotenv("./config/.env")
        self.service_key = os.getenv("NTS_SERVICE_KEY")
        
        if not self.service_key:
            logger.error("국세청 API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
            self.service_key = "NOT_SET"
        
        self.status_url = "https://api.odcloud.kr/api/nts-businessman/v1/status"
    
    async def verify_business_number(self, business_number: str) -> Dict[str, Any]:
        """
        사업자등록번호 상태 확인
        
        Args:
            business_number: 사업자등록번호 (하이픈 있어도 무관)
            
        Returns:
            Dict: 인증 결과
        """
        try:
            b_no = business_number.replace('-', '')
            
            if not b_no.isdigit() or len(b_no) != 10:
                return {
                    "valid": False,
                    "message": "사업자등록번호는 10자리 숫자여야 합니다.",
                    "status_code": "INVALID_FORMAT"
                }
            
            request_data = {
                "b_no": [b_no]
            }
            
            response = requests.post(
                f"{self.status_url}?serviceKey={self.service_key}",
                json=request_data,
                headers={"Content-Type": "application/json"}
            )
            
            response.raise_for_status()
            result = response.json()
            
            if result.get("data") and len(result["data"]) > 0:
                status_info = result["data"][0]
                
                if "국세청에 등록되지 않은" in status_info.get("tax_type", ""):
                    return {
                        "valid": False,
                        "message": "국세청에 등록되지 않은 사업자등록번호입니다.",
                        "status_code": "NOT_REGISTERED"
                    }
                
                status_code = status_info.get("b_stt_cd")
                status_name = status_info.get("b_stt")
                
                if status_code == "01":  
                    return {
                        "valid": True,
                        "message": f"유효한 사업자입니다. 과세유형: {status_info.get('tax_type', '정보 없음')}",
                        "status_code": "VALID",
                        "status_info": status_info
                    }
                elif status_code == "02":  
                    return {
                        "valid": False,
                        "message": f"휴업자입니다. (휴업일: {status_info.get('end_dt', '정보 없음')})",
                        "status_code": "SUSPENDED",
                        "status_info": status_info
                    }
                elif status_code == "03":  
                    return {
                        "valid": False,
                        "message": f"폐업자입니다. (폐업일: {status_info.get('end_dt', '정보 없음')})",
                        "status_code": "CLOSED",
                        "status_info": status_info
                    }
                else:
                    return {
                        "valid": False,
                        "message": f"알 수 없는 상태코드입니다: {status_code}",
                        "status_code": "UNKNOWN",
                        "status_info": status_info
                    }
            else:
                return {
                    "valid": False,
                    "message": "API 응답에 데이터가 없습니다.",
                    "status_code": "NO_DATA"
                }
                
        except requests.RequestException as e:
            logger.error(f"국세청 API 요청 중 오류 발생: {str(e)}")
            return {
                "valid": False,
                "message": f"API 요청 오류: {str(e)}",
                "status_code": "API_ERROR"
            }
        except Exception as e:
            logger.error(f"사업자번호 검증 중 오류 발생: {str(e)}")
            return {
                "valid": False,
                "message": f"검증 중 오류: {str(e)}",
                "status_code": "UNKNOWN_ERROR"
            }


business_verification_service = BusinessVerificationService()