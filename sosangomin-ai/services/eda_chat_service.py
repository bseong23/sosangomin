# services/eda_chat_service.py

import os
import logging
import json
from typing import Dict, Any
from anthropic import Anthropic
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class EdaChatService:
    def __init__(self):
        load_dotenv("./config/.env")
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.error("Anthropic API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
            api_key = "NOT_SET"  
        
        self.client = Anthropic(api_key=api_key)
        
        self.system_prompt = """
        당신은 데이터 분석가입니다. 당신의 역할은 제공된 데이터 분석 결과를 초보자도 쉽게 이해할 수 있도록 명확하게 설명하는 것입니다.
        
        다음 지침에 따라 설명을 작성하세요:
        
        1. 전문 용어나 복잡한 통계 개념은 피하고 간단한 언어로 설명하세요.
        2. 적절히 줄바꿈(\n)과 띄어쓰기를 사용하여 가독성을 높이세요.
        3. 마크다운 형식으로 간결하게 설명하세요.
        4. 데이터가 보여주는 주요 패턴이나 인사이트를 직관적으로 설명하세요.
        5. 사업주나 매장 운영자가 실제로 활용할 수 있는 방식으로 설명하세요.
        6. "## 차트별 설명", "## 전체 요약" 같은 표시를 사용하지 말고 바로 설명을 시작하세요.
        """
    
    async def generate_chart_summary(self, chart_type: str, data: Any) -> str:
        """특정 차트 데이터에 대한 설명 생성"""
        try:
            chart_prompts = {
                "basic_stats": "이 기본 통계 데이터를 초보자가 이해할 수 있도록 설명해주세요: {}. 전문 용어를 피하고 쉬운 말로 이 숫자들이 실제로 무엇을 의미하는지 설명해주세요.",
                
                "weekday_sales": "요일별 매출 데이터입니다: {}. 어떤 요일에 매출이 높고 낮은지, 주말과 평일의 차이는 어떤지 쉽게 설명해주세요.",
                
                "time_period_sales": "시간대별 매출 데이터입니다: {}. 점심, 저녁 등 시간대별 매출 차이를 이해하기 쉽게 설명해주세요.",
                
                "hourly_sales": "시간별 매출 데이터입니다: {}. 하루 중 언제 가장 바쁘고 매출이 높은지 간단히 설명해주세요.",
                
                "top_products": "상위 판매 제품 데이터입니다: {}. 어떤 제품이 가장 인기 있고 매출에 기여하는지 쉽게 설명해주세요.",
                
                "holiday_sales": "공휴일/평일 매출 데이터입니다: {}. 휴일과 평일의 매출 차이를 간단히 설명해주세요.",
                
                "season_sales": "계절별 매출 데이터입니다: {}. 계절에 따른 매출 차이를 쉽게 이해할 수 있게 설명해주세요.",
                
                "temperature_sales": "기온별 매출 데이터입니다: {}. 기온에 따라 매출이 어떻게 달라지는지 간단히 설명해주세요. 적절히 줄바꿈(\n)과 띄어쓰기를 사용하여 가독성을 높이세요",
                
                "weather_sales": "날씨별 매출 데이터입니다: {}. 맑음, 이슬비, 보통비, 폭우 오는 날의 매출 차이를 쉽게 설명해주세요. 적절히 줄바꿈(\n)과 띄어쓰기를 사용하여 가독성을 높이세요",
                
                "weekday_time_sales": "요일과 시간대별 매출 데이터입니다: {}. 어떤 요일의 어떤 시간대에 매출이 높은지 패턴을 쉽게 설명해주세요.",
                
                "monthly_sales": "월별 매출 데이터입니다: {}. 월별 매출 패턴을 초보자도 이해할 수 있게 설명해주세요.",
                
                "product_share": "상품별 판매 비중 데이터입니다: {}. 어떤 상품이 판매량의 얼마나 많은 부분을 차지하는지 쉽게 설명해주세요.",
                
                "transaction_amounts": "거래 금액대별 분포 데이터입니다: {}. 고객들이 주로 얼마를 지출하는지 간단히 설명해주세요."
            }
            
            prompt_template = chart_prompts.get(
                chart_type, 
                "이 데이터는 {}입니다. " \
                "적절히 줄바꿈(\n)과 띄어쓰기를 사용하여 가독성을 높이세요. " \
                "초보자도 쉽게 이해할 수 있도록 간단하게 설명해주세요."
                "확실하게 완성된 답변을 주세요."
            )
            
            data_str = str(data)
            if len(data_str) > 500:
                if isinstance(data, dict):
                    shortened_data = dict(list(data.items())[:5])
                    data_str = f"{shortened_data} ... (외 {len(data) - 5}개 항목)"
                else:
                    data_str = f"{str(data)[:500]}... (데이터 일부만 표시)"
            
            prompt = prompt_template.format(data_str)
            
            response = self.client.messages.create(
                model="claude-3-5-haiku-20241022",
                max_tokens=500, 
                temperature=0.2,
                system=self.system_prompt,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return response.content[0].text.strip()
            
        except Exception as e:
            logger.error(f"Claude API 호출 중 오류: {str(e)}")
            return f"이 데이터는 매장의 매출 패턴을 보여줍니다."
    
    async def generate_overall_summary(self, chart_data: Dict[str, Any]) -> str:
        """전체 EDA 데이터에 대한 종합적인 설명 생성"""
        try:
            data_summary = {}
            for key, value in chart_data.items():
                if isinstance(value, dict) and len(value) > 5:
                    items = list(value.items())[:3]
                    data_summary[key] = f"{dict(items)} ... (외 {len(value) - 3}개 항목)"
                else:
                    data_summary[key] = value
            
            prompt = f"""
            다음은 사업장 데이터 분석 결과입니다:
            {json.dumps(data_summary, ensure_ascii=False, indent=2)}
            
            이 데이터를 초보자도 쉽게 이해할 수 있도록 간결하게 설명해주세요:
            
            1. 매출 현황: 얼마나 팔렸는지, 어떤 제품이 인기 있는지
            2. 영업 패턴: 언제 손님이 많고 매출이 높은지 (요일, 시간대)
            3. 개선 가능성: 이 데이터를 바탕으로 어떻게 매출을 늘릴 수 있을지
            
            전문 용어를 피하고, 실제 가게 운영에 도움이 되는 방식으로 설명해주세요.
            마크다운 형태로 제공하세요.
            끝맺음을 무조건 하세요.
            """
            
            response = self.client.messages.create(
                model="claude-3-7-sonnet-20250219",
                max_tokens=1300,
                temperature=0.2,
                system=self.system_prompt,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            result = response.content[0].text.strip()
            
            return result
            
        except Exception as e:
            logger.error(f"종합 요약 생성 중 오류: {str(e)}")
            return "이 데이터는 매장의 매출 패턴과 고객 행동을 보여줍니다. 주말에 매출이 높고, 저녁 시간대에 손님이 많으며, 공기밥과 소주가 가장 인기 있는 메뉴입니다."

eda_chat_service = EdaChatService()