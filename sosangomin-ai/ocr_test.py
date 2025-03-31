#!/usr/bin/env python3
"""
범용 사업자등록증 OCR 및 검증
- 어떤 사업자등록증이든 처리 가능
- 필요 라이브러리: easyocr, opencv-python, numpy, requests
- 설치: pip install easyocr opencv-python numpy requests
"""

import cv2
import numpy as np
import easyocr
import re
import argparse
import logging
import json
import requests
from typing import Dict, List, Optional, Any

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BusinessLicenseOCR:
    """범용 사업자등록증 OCR 클래스"""
    
    def __init__(self, use_gpu=False):
        """초기화"""
        # EasyOCR 리더 초기화
        logger.info("EasyOCR 모델 로딩 중...")
        self.reader = easyocr.Reader(['ko', 'en'], gpu=use_gpu)
        logger.info("EasyOCR 모델 로딩 완료!")
    
    def process_image(self, image_path: str) -> Dict[str, str]:
        """이미지에서 사업자등록증 핵심 정보 추출"""
        try:
            # 이미지 로드
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"이미지를 읽을 수 없습니다: {image_path}")
            
            # 이미지 전처리
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # 대비 향상
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            enhanced = clahe.apply(gray)
            
            # OCR 실행
            logger.info("OCR 텍스트 추출 중...")
            results = self.reader.readtext(enhanced)
            
            # 인식된 모든 텍스트를 한 줄로 결합
            all_text = ' '.join([text for _, text, _ in results])
            
            # 각 줄을 분석하기 위한 텍스트 정리
            text_lines = [text for _, text, _ in results]
            
            # 핵심 정보 추출
            business_number = self.extract_business_number(text_lines, all_text)
            business_name = self.extract_business_name(text_lines, all_text)
            representative = self.extract_representative(text_lines, all_text)
            opening_date = self.extract_opening_date(text_lines, all_text)
            
            result = {
                'business_number': business_number,
                'business_name': business_name,
                'representative': representative,
                'opening_date': opening_date
            }
            
            return result
            
        except Exception as e:
            logger.error(f"이미지 처리 중 오류 발생: {str(e)}")
            raise
    
    def extract_business_number(self, text_lines, all_text):
        """사업자등록번호 추출"""
        # 패턴: 000-00-00000 형식 또는 등록번호 근처의 숫자
        patterns = [
            r'(\d{3}-\d{2}-\d{5})',
            r'등록번호\s*:?\s*(\d{3}-\d{2}-\d{5})',
            r'등록번호\s*:?\s*(\d{3}\s*-?\s*\d{2}\s*-?\s*\d{5})',
            r'사업자\s*등록\s*번호\s*:?\s*(\d{3}\s*-?\s*\d{2}\s*-?\s*\d{5})'
        ]
        
        # 전체 텍스트에서 패턴 검색
        for pattern in patterns:
            match = re.search(pattern, all_text)
            if match:
                # 숫자만 추출하여 반환
                number = match.group(1)
                number = re.sub(r'[^0-9]', '', number)
                # 10자리인지 확인
                if len(number) == 10:
                    # 등록번호 형식으로 변환 (000-00-00000)
                    return f"{number[:3]}-{number[3:5]}-{number[5:]}"
        
        # 개별 텍스트 라인에서 등록번호 찾기
        for line in text_lines:
            if "등록번호" in line:
                # 해당 라인에서 숫자와 하이픈만 추출
                digits_and_hyphens = ''.join(c for c in line if c.isdigit() or c == '-')
                
                # 등록번호 패턴 검색
                num_match = re.search(r'(\d{3}-\d{2}-\d{5})', digits_and_hyphens)
                if num_match:
                    return num_match.group(1)
                
                # 숫자만 추출하여 패턴 검색
                digits = re.sub(r'[^0-9]', '', line)
                if len(digits) >= 10:
                    number = digits[:10]
                    return f"{number[:3]}-{number[3:5]}-{number[5:]}"
        
        # 마지막 방법: 10자리 숫자 찾기
        for line in text_lines:
            digits = re.sub(r'[^0-9]', '', line)
            if len(digits) == 10:
                return f"{digits[:3]}-{digits[3:5]}-{digits[5:]}"
        
        return None
    
    def extract_business_name(self, text_lines, all_text):
        """상호 추출"""
        # 상호 관련 패턴
        for i, line in enumerate(text_lines):
            # '상호' 키워드가 있는 라인 찾기
            if '상호' in line or '상 호' in line:
                # 콜론이 있는 경우 (상호: XXX)
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) > 1 and parts[1].strip():
                        return parts[1].strip()
                # '상호' 다음 줄에 상호명이 있는 경우
                elif i + 1 < len(text_lines) and text_lines[i + 1].strip() and '성' not in text_lines[i + 1]:
                    return text_lines[i + 1].strip()
                # '상호' 또는 '호' 다음에 텍스트가 있는 경우
                else:
                    # '상호' 키워드 이후 텍스트 추출
                    if '상호' in line:
                        parts = line.split('상호', 1)
                        if len(parts) > 1 and parts[1].strip():
                            return parts[1].strip()
                    # '호' 키워드 이후 텍스트 추출
                    elif '호' in line:
                        parts = line.split('호', 1)
                        if len(parts) > 1 and parts[1].strip():
                            return parts[1].strip()
        
        # 정규식 패턴 사용
        pattern = r'상\s*호\s*:?\s*([가-힣A-Za-z0-9\s\(\)\.]{2,30})'
        match = re.search(pattern, all_text)
        if match:
            return match.group(1).strip()
        
        return None
    
    def extract_representative(self, text_lines, all_text):
        """대표자 성명 추출"""
        # 대표자/성명 관련 패턴
        for i, line in enumerate(text_lines):
            # '성명' 또는 '대표자' 키워드가 있는 라인 찾기
            if ('성명' in line or '성 명' in line or '대표자' in line) and len(line) < 30:
                # 콜론이 있는 경우 (성명: XXX)
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) > 1 and parts[1].strip():
                        # 생년월일 등 추가 텍스트 제거
                        name = parts[1].strip()
                        # 생년월일 등 제거
                        name = re.sub(r'생\s*년\s*월\s*일.*', '', name)
                        return name.strip()
                # '성명' 다음 줄에 대표자명이 있는 경우
                elif i + 1 < len(text_lines) and text_lines[i + 1].strip():
                    next_line = text_lines[i + 1].strip()
                    # 다음 줄이 짧은 텍스트이고 한글 이름일 가능성이 높은 경우
                    if len(next_line) <= 5 and re.match(r'^[가-힣\s]+$', next_line):
                        return next_line
                # '성명' 또는 '대표자' 키워드 이후 텍스트 추출
                else:
                    for keyword in ['성명', '대표자']:
                        if keyword in line:
                            parts = line.split(keyword, 1)
                            if len(parts) > 1 and parts[1].strip():
                                name = parts[1].strip()
                                # 생년월일 등 제거
                                name = re.sub(r'생\s*년\s*월\s*일.*', '', name)
                                return name.strip()
        
        # 정규식 패턴 사용
        patterns = [
            r'(성\s*명|대표자)\s*:?\s*([가-힣A-Za-z\s]{2,10})',
            r'대표자\s*:\s*([가-힣A-Za-z\s]{2,10})',
            r'성\s*명\s*:\s*([가-힣A-Za-z\s]{2,10})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, all_text)
            if match:
                if len(match.groups()) > 1:
                    return match.group(2).strip()
                else:
                    return match.group(1).strip()
        
        return None
    
    def extract_opening_date(self, text_lines, all_text):
        """개업년월일 추출"""
        # 개업년월일 관련 패턴
        date_keywords = ['개업', '개 업', '개업일', '개 업 일', '개업연월일', '개 업 연 월 일', '사업개시일']
        
        # 라인별로 개업 키워드 검색
        for i, line in enumerate(text_lines):
            for keyword in date_keywords:
                if keyword in line:
                    # 해당 라인에서 날짜 추출
                    date_match = re.search(r'(\d{4})\s*[년\.-]\s*(\d{1,2})\s*[월\.-]\s*(\d{1,2})', line)
                    if date_match:
                        year = date_match.group(1)
                        month = date_match.group(2).zfill(2)
                        day = date_match.group(3).zfill(2)
                        return f"{year}{month}{day}"
                    
                    # 다음 라인에서 날짜 확인
                    if i+1 < len(text_lines):
                        next_line = text_lines[i+1]
                        date_match = re.search(r'(\d{4})\s*[년\.-]\s*(\d{1,2})\s*[월\.-]\s*(\d{1,2})', next_line)
                        if date_match:
                            year = date_match.group(1)
                            month = date_match.group(2).zfill(2)
                            day = date_match.group(3).zfill(2)
                            return f"{year}{month}{day}"
        
        # "YYYY년 MM월 DD일" 패턴 검색
        pattern = r'(\d{4})\s*[년\.-]\s*(\d{1,2})\s*[월\.-]\s*(\d{1,2})'
        all_dates = re.finditer(pattern, all_text)
        dates = []
        
        for match in all_dates:
            year = match.group(1)
            month = match.group(2).zfill(2)
            day = match.group(3).zfill(2)
            dates.append((year, month, day))
        
        # 여러 날짜 중 개업일 찾기 (개업일 근처의 텍스트 활용)
        for i, (year, month, day) in enumerate(dates):
            # 해당 날짜 앞뒤 20글자 내에 개업 관련 키워드가 있는지 확인
            date_str = f"{year}년{month}월{day}일"
            date_pos = all_text.find(date_str)
            
            if date_pos >= 0:
                # 날짜 앞뒤 20글자 추출
                start = max(0, date_pos - 20)
                end = min(len(all_text), date_pos + len(date_str) + 20)
                context = all_text[start:end]
                
                # 개업 관련 키워드가 있는지 확인
                if any(keyword in context for keyword in date_keywords):
                    return f"{year}{month}{day}"
        
        # 여러 날짜 중 최근 날짜를 개업일로 추정
        if dates:
            # 가장 최근 날짜 반환
            dates.sort(reverse=True)
            year, month, day = dates[0]
            return f"{year}{month}{day}"
        
        return None

class BusinessVerifier:
    """국세청 API를 사용하여 사업자등록 정보 검증"""
    
    def __init__(self, service_key):
        """초기화"""
        self.service_key = service_key
        self.validate_url = "https://api.odcloud.kr/api/nts-businessman/v1/validate"
        self.status_url = "https://api.odcloud.kr/api/nts-businessman/v1/status"
        
    def validate_business(self, business_info: Dict[str, str]) -> Dict[str, Any]:
        """사업자등록 정보 진위 확인"""
        if not business_info.get('business_number') or not business_info.get('representative') or not business_info.get('opening_date'):
            return {
                "valid": False,
                "message": "필수 정보가 누락되었습니다 (사업자등록번호, 대표자명, 개업일)",
                "result": None
            }
        
        # 사업자번호 포맷 변경 (하이픈 제거)
        b_no = business_info['business_number'].replace('-', '')
        
        # API 요청 데이터 준비
        request_data = {
            "businesses": [
                {
                    "b_no": b_no,
                    "start_dt": business_info['opening_date'],
                    "p_nm": business_info['representative'],
                }
            ]
        }
        
        # 상호명이 있으면 포함
        if business_info.get('business_name'):
            request_data["businesses"][0]["b_nm"] = business_info['business_name']
        
        try:
            # API 호출
            logger.info("국세청 API 진위확인 요청 중...")
            response = requests.post(
                f"{self.validate_url}?serviceKey={self.service_key}",
                json=request_data,
                headers={"Content-Type": "application/json"}
            )
            
            # 응답 확인
            response.raise_for_status()  # HTTP 오류 체크
            result = response.json()
            
            # 진위 확인 결과 파싱
            if result.get("data") and len(result["data"]) > 0:
                valid_code = result["data"][0].get("valid")
                valid_msg = result["data"][0].get("valid_msg", "")
                status = result["data"][0].get("status", {})
                
                if valid_code == "01":  # 유효한 사업자
                    return {
                        "valid": True,
                        "message": "유효한 사업자등록 정보입니다",
                        "result": result,
                        "business_status": status
                    }
                else:
                    return {
                        "valid": False,
                        "message": valid_msg or "유효하지 않은 사업자등록 정보입니다",
                        "result": result
                    }
            else:
                return {
                    "valid": False,
                    "message": "API 응답에 데이터가 없습니다",
                    "result": result
                }
                
        except requests.RequestException as e:
            logger.error(f"API 요청 중 오류 발생: {str(e)}")
            return {
                "valid": False,
                "message": f"API 요청 오류: {str(e)}",
                "result": None
            }
        except Exception as e:
            logger.error(f"결과 처리 중 오류 발생: {str(e)}")
            return {
                "valid": False,
                "message": f"결과 처리 오류: {str(e)}",
                "result": None
            }
    
    def check_business_status(self, business_number: str) -> Dict[str, Any]:
        """사업자등록 상태 확인"""
        if not business_number:
            return {
                "valid": False,
                "message": "사업자등록번호가 누락되었습니다",
                "result": None
            }
        
        # 사업자번호 포맷 변경 (하이픈 제거)
        b_no = business_number.replace('-', '')
        
        # API 요청 데이터 준비
        request_data = {
            "b_no": [b_no]
        }
        
        try:
            # API 호출
            logger.info("국세청 API 상태조회 요청 중...")
            response = requests.post(
                f"{self.status_url}?serviceKey={self.service_key}",
                json=request_data,
                headers={"Content-Type": "application/json"}
            )
            
            # 응답 확인
            response.raise_for_status()  # HTTP 오류 체크
            result = response.json()
            
            # 상태 확인 결과 파싱
            if result.get("data") and len(result["data"]) > 0:
                status_info = result["data"][0]
                
                # 국세청에 등록되지 않은 경우
                if "국세청에 등록되지 않은" in status_info.get("tax_type", ""):
                    return {
                        "valid": False,
                        "message": status_info.get("tax_type"),
                        "result": result
                    }
                
                # 상태 정보 반환
                status_code = status_info.get("b_stt_cd")
                status_name = status_info.get("b_stt")
                
                status_message = f"사업자 상태: {status_name or '알 수 없음'}"
                if status_code == "01":
                    status_message = f"계속사업자입니다. ({status_info.get('tax_type', '')})"
                elif status_code == "02":
                    status_message = f"휴업자입니다. (휴업일: {status_info.get('end_dt', '정보 없음')})"
                elif status_code == "03":
                    status_message = f"폐업자입니다. (폐업일: {status_info.get('end_dt', '정보 없음')})"
                
                return {
                    "valid": status_code == "01",  # 계속사업자인 경우만 유효
                    "message": status_message,
                    "result": result,
                    "status_info": status_info
                }
            else:
                return {
                    "valid": False,
                    "message": "API 응답에 데이터가 없습니다",
                    "result": result
                }
                
        except requests.RequestException as e:
            logger.error(f"API 요청 중 오류 발생: {str(e)}")
            return {
                "valid": False,
                "message": f"API 요청 오류: {str(e)}",
                "result": None
            }
        except Exception as e:
            logger.error(f"결과 처리 중 오류 발생: {str(e)}")
            return {
                "valid": False,
                "message": f"결과 처리 오류: {str(e)}",
                "result": None
            }

def main():
    """메인 함수"""
    parser = argparse.ArgumentParser(description='사업자등록증 OCR 및 API 검증')
    parser.add_argument('image_path', help='사업자등록증 이미지 경로')
    parser.add_argument('--service_key', required=True, help='국세청 OpenAPI 서비스키')
    parser.add_argument('--status_only', action='store_true', help='상태조회 API만 사용')
    parser.add_argument('--gpu', action='store_true', help='GPU 사용 (기본값: CPU만 사용)')
    parser.add_argument('--json_only', action='store_true', help='JSON 결과만 출력')
    args = parser.parse_args()
    
    try:
        # OCR 처리
        ocr = BusinessLicenseOCR(use_gpu=args.gpu)
        extracted_info = ocr.process_image(args.image_path)
        
        # API 검증
        verifier = BusinessVerifier(args.service_key)
        
        if args.status_only and extracted_info.get('business_number'):
            # 상태조회 API만 사용
            verification_result = verifier.check_business_status(extracted_info['business_number'])
        else:
            # 진위확인 API 사용
            verification_result = verifier.validate_business(extracted_info)
        
        # 결과 출력
        if args.json_only:
            result = {
                "extracted_info": extracted_info,
                "verification_result": {
                    "valid": verification_result["valid"],
                    "message": verification_result["message"]
                }
            }
            if verification_result.get("business_status"):
                result["verification_result"]["business_status"] = verification_result["business_status"]
            if verification_result.get("status_info"):
                result["verification_result"]["status_info"] = verification_result["status_info"]
                
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            # 추출 정보 출력
            print("\n===== 사업자등록증 OCR 결과 =====")
            print(f"사업자등록번호: {extracted_info.get('business_number') or '인식 실패'}")
            print(f"상호: {extracted_info.get('business_name') or '인식 실패'}")
            print(f"대표자 성명: {extracted_info.get('representative') or '인식 실패'}")
            print(f"개업년월일: {extracted_info.get('opening_date') or '인식 실패'}")
            
            # 검증 결과 출력
            print("\n===== 국세청 API 검증 결과 =====")
            print(f"검증 결과: {'유효함' if verification_result['valid'] else '유효하지 않음'}")
            print(f"메시지: {verification_result['message']}")
            
            # 추가 상태 정보 (진위확인 API 사용 시)
            if verification_result.get("business_status"):
                status = verification_result["business_status"]
                print("\n사업자 상태 정보:")
                print(f"- 납세자상태: {status.get('b_stt', '정보 없음')}")
                print(f"- 과세유형: {status.get('tax_type', '정보 없음')}")
                if status.get('end_dt'):
                    print(f"- 폐업일: {status.get('end_dt')}")
            
            # 추가 상태 정보 (상태조회 API 사용 시)
            if verification_result.get("status_info"):
                status = verification_result["status_info"]
                print("\n사업자 상태 정보:")
                print(f"- 납세자상태: {status.get('b_stt', '정보 없음')}")
                print(f"- 과세유형: {status.get('tax_type', '정보 없음')}")
                if status.get('end_dt'):
                    print(f"- 폐업일: {status.get('end_dt')}")
        
    except Exception as e:
        logger.error(f"프로그램 실행 중 오류 발생: {str(e)}")
        if args.json_only:
            error_result = {
                "error": True,
                "message": str(e)
            }
            print(json.dumps(error_result, ensure_ascii=False))
        else:
            print(f"오류: {str(e)}")

if __name__ == "__main__":
    main()