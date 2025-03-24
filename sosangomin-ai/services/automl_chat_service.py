# services/automl_chat_service.py

import os
import logging
import json
from typing import Dict, Any
from anthropic import Anthropic
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class AutomlChatService:
    def __init__(self):
        load_dotenv("./config/.env")
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.error("Anthropic API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
            api_key = "NOT_SET"  
        
        self.client = Anthropic(api_key=api_key)
        
        self.system_prompt = """
        당신은 소상공인을 위한 데이터 분석 플랫폼에서 일하는 데이터 분석가입니다.
        당신의 역할은 데이터를 잘 모르는 사용자에게 분석 결과를 쉽고, 실용적이며, 친절하게 전달하는 것입니다.

        [매출 예측 결과 설명]
        - 향후 30일 예측된 매출 흐름을 쉽게 설명하세요.
        - 매출이 높거나 낮을 것으로 예상되는 시기와 그 이유를 알려주세요.
        - 총 예상 매출, 일평균 매출 등을 포함해 실제 얼마나 벌 것 같은지 감이 오게 설명하세요.
        - 지난달 대비 증감도 포함해 주세요.
        - 운영에 도움이 될 만한 실질적인 조언(재고, 인력, 이벤트 전략 등)을 함께 제안하세요.
        - 숫자에 대한 기술적인 용어나 평가 지표는 사용하지 마세요.

        [클러스터링 결과 설명]
        - 비슷한 상품들을 어떻게 나누었는지 쉽게 설명하세요.
        - 각 그룹(클러스터)의 특징을 간단한 문장으로 소개하고, 어떻게 활용하면 좋을지 아이디어를 제안하세요.
        - 어려운 통계 용어는 쓰지 말고, 실제 장사에 도움이 될 수 있는 방향으로 작성하세요.
        """
    
    async def generate_sales_forecast_summary(self, prediction_result: Dict[str, Any]) -> str:
    """소상공인을 위한 향후 30일 매출 예측 설명 생성"""
    try:
        forecast_data = prediction_result.get("predictions", [])
        seasonal_trend = prediction_result.get("seasonal_trend", [])

        # 총 매출 및 평균 계산
        total_sales = sum([item["예측 매출"] for item in forecast_data])
        avg_sales = round(total_sales / len(forecast_data), 2) if forecast_data else 0

        # 날짜 및 매출 예측 리스트 간략 요약
        preview = forecast_data[:5]
        preview_text = f"{preview} ... (외 {len(forecast_data)-5}일)"

        prompt = f"""
        다음은 소상공인 사업장의 향후 30일 매출 예측 결과입니다:

        - 총 예상 매출: 약 {round(total_sales):,}원
        - 일일 평균 매출: 약 {avg_sales:,}원
        - 일부 예측 데이터 샘플: {preview_text}

        이 정보를 바탕으로 다음과 같은 내용을 포함해 주세요:
        1. 언제 매출이 높고, 언제 낮은지 쉽게 설명
        2. 지난달과 비교하여 좋아졌는지 나빠졌는지 요약
        3. 어떤 날에 준비를 더 해야 하는지, 장사에 도움이 될 조언 제시

        숫자를 너무 기술적으로 설명하지 말고, 장사를 모르는 사람도 이해할 수 있게 말해 주세요.
        """

        response = self.client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=800,
            temperature=0.2,
            system=self.system_prompt,
            messages=[{"role": "user", "content": prompt}]
        )

        return response.content[0].text.strip()

    except Exception as e:
        logger.error(f"매출 예측 설명 생성 중 오류: {str(e)}")
        return "향후 30일의 매출 흐름을 기반으로 장사 준비에 도움이 될 정보를 제공할 수 있습니다."


    async def generate_cluster_summary(self, cluster_result: Dict[str, Any]) -> str:
    """소상공인을 위한 상품 클러스터링 결과 설명 생성"""
    try:
        clusters = cluster_result.get("clusters", [])
        optimal_k = cluster_result.get("optimal_k", "알 수 없음")
        preview = clusters[:5]

        prompt = f"""
        다음은 상품을 비슷한 특징끼리 묶은 클러스터링 분석 결과입니다.
        총 {optimal_k}개의 그룹으로 나뉘었고, 일부 예시는 다음과 같습니다:
        {json.dumps(preview, ensure_ascii=False, indent=2)} ... (외 {len(clusters)-5}개)

        이 결과를 바탕으로 다음 내용을 포함해 설명해 주세요:
        1. 상품들이 어떤 기준으로 묶였는지 직관적으로 설명
        2. 각 그룹의 특징을 짧고 알기 쉽게 소개
        3. 이 결과를 장사에 어떻게 활용하면 좋은지 구체적인 아이디어 제시

        분석 용어나 통계 용어는 최대한 피하고, 장사를 처음 하는 사람도 이해할 수 있도록 설명해 주세요.
        """

        response = self.client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=1000,
            temperature=0.2,
            system=self.system_prompt,
            messages=[{"role": "user", "content": prompt}]
        )

        return response.content[0].text.strip()

    except Exception as e:
        logger.error(f"클러스터링 설명 생성 중 오류: {str(e)}")
        return "비슷한 상품들을 묶어 장사에 도움이 되는 방향으로 분석할 수 있습니다."

automl_chat_service = AutomlChatService()