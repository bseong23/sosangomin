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
        당신은 데이터 분석가입니다. 당신의 역할은 제공된 데이터 분석 결과를 명확하게 설명하는 것입니다.
        
        차트별 설명과 전체 요약을 다음과 같이 다르게 작성하세요:
        
        1. 차트별 설명: 
           - 시각 자료를 설명하듯 차트에 표시된 내용을 간결하게 해석합니다.
           - 단일 문단으로 구성합니다.
           - 간단하고 명확한 언어를 사용합니다.
           
        2. 전체 요약 (보고서):
           - 데이터 전체를 종합적으로 분석하여 통찰력 있는 보고서 형식으로 작성합니다.
           - 구체적인 수치와 비율을 포함하되, 그 의미를 명확히 설명합니다.
           - 비즈니스에 실제로 적용 가능한 인사이트와 전략을 제공합니다.
           - 명확한 구조와 형식을 갖추어 전문적인 보고서처럼 작성합니다.
        """
    
    async def generate_chart_summary(self, chart_type: str, data: Any) -> str:
        """특정 차트 데이터에 대한 설명 생성"""
        try:
            chart_prompts = {
                "basic_stats": "이 기본 통계 데이터는 다음과 같습니다: {}. 데이터에 익숙하지 않은 사람에게 이 숫자들이 실제로 무엇을 의미하는지, 비즈니스에 어떤 시사점이 있는지 쉽게 설명해주세요.",
                "weekday_sales": "요일별 매출 데이터입니다: {}. 이 패턴이 비즈니스에 어떤 의미가 있는지, 어떤 요일에 특별히 주목해야 하는지 통찰력 있게 설명해주세요.",
                "time_period_sales": "시간대별 매출 데이터입니다: {}. 이 시간대별 차이가 의미하는 바와 비즈니스 운영에 어떤 영향을 미치는지 쉽게 이해할 수 있도록 설명해주세요.",
                "hourly_sales": "시간별 매출 데이터입니다: {}. 시간에 따른 매출 흐름을 스토리텔링 방식으로 설명하고, 이것이 비즈니스 운영에 주는 통찰을 제공해주세요.",
                "top_products": "상위 판매 제품 데이터입니다: {}. 각 제품의 중요성과 전체 비즈니스에 미치는 영향을 통찰력 있게 설명해주세요.",
                "holiday_sales": "공휴일/평일 매출 데이터입니다: {}. 이 차이가 가지는 비즈니스적 의미와 운영 전략에 주는 시사점을 쉽게 이해할 수 있게 설명해주세요.",
                "season_sales": "계절별 매출 데이터입니다: {}. 계절적 패턴의 의미와 비즈니스 계획에 어떻게 활용할 수 있는지 통찰력 있게 설명해주세요.",
                "daily_sales": "일자별 매출 데이터입니다: {}. 일별 매출 패턴에서 얻을 수 있는 통찰과 실용적인 비즈니스 인사이트를 쉽게 이해할 수 있게 설명해주세요."
            }
            
            prompt_template = chart_prompts.get(
                chart_type, 
                "이 데이터는 {}입니다. 데이터에 익숙하지 않은 사람도 쉽게 이해할 수 있도록 이 데이터가 실제로 의미하는 바와 비즈니스에 주는 통찰을 설명해주세요."
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
                model="claude-3-7-sonnet-20250219",
                max_tokens=200,
                temperature=0.2,
                system=self.system_prompt,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return response.content[0].text.strip()
            
        except Exception as e:
            logger.error(f"Claude API 호출 중 오류: {str(e)}")
            return f"이 {chart_type} 데이터는 비즈니스 성과와 패턴을 보여줍니다."
    
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
            
            이 데이터를 종합적으로 분석하여, 다음 형식의 보고서를 작성해 주세요:
            
            1. 핵심 성과 지표 요약 - 주요 매출 지표와 그 의미를 객관적으로 설명
            2. 주요 매출 패턴 분석 - 시간/요일/계절 등에 따른 매출 변동의 특징적 패턴
            3. 실행 가능한 비즈니스 전략 - 데이터 분석 결과에 기반한 구체적 운영 방안
            
            구체적인 수치와 비율을 포함하되, 비즈니스에 직접 적용 가능한 실용적 정보를 제공해 주세요.
            """
            
            additional_instructions = """
            중요: 응답에서 \\n, \\t와 같은 특수 문자나 이스케이프 시퀀스를 직접 텍스트에 포함하지 마세요.
            보고서 형식은 유지하되, 각 섹션 사이에 한 번의 줄바꿈만 사용하고 다른 특수 문자는 사용하지 마세요.
            """
            
            response = self.client.messages.create(
                model="claude-3-7-sonnet-20250219",
                max_tokens=1000,
                temperature=0.2,
                system=self.system_prompt + additional_instructions,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            result = response.content[0].text.strip()
            result = result.replace("\\n", "\n").replace("\\t", " ")
            
            return result
            
        except Exception as e:
            logger.error(f"종합 요약 생성 중 오류: {str(e)}")
            return "이 데이터는 매출 패턴과 고객 행동에 대한 중요한 통찰을 제공합니다. 각 차트를 통해 비즈니스 성과를 다양한 각도에서 확인할 수 있습니다."

eda_chat_service = EdaChatService()