import os
import logging
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from bson import ObjectId
from database.mongo_connector import mongo_instance
from services.review_service import review_service
from services.store_service import simple_store_service as store_service
from services.auto_analysis import autoanalysis_service
from services.competitor_service import competitor_service
from services.eda_chat_service import eda_chat_service
from services.location_info_service import location_info_service
from dotenv import load_dotenv
import re

logger = logging.getLogger(__name__)

class FinalReportService:
    def __init__(self):
        load_dotenv("./config/.env")
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            logger.warning("ANTHROPIC_API_KEY가 설정되지 않았습니다.")

    async def call_claude_api(self, prompt: str) -> Dict[str, Any]:
        """Claude API를 호출하여 SWOT 분석 생성"""
        try:
            import aiohttp
            
            if not self.api_key:
                logger.error("ANTHROPIC_API_KEY가 없어 분석을 수행할 수 없습니다.")
                return {
                    "status": "error", 
                    "message": "API 키가 설정되지 않았습니다. 환경 변수를 확인하세요."
                }
                
            url = "https://api.anthropic.com/v1/messages"
            headers = {
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            
            data = {
                "model": "claude-3-7-sonnet-20250219",
                "max_tokens": 7000,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "system": "당신은 소상공인을 위한 사업 분석 전문가입니다. 주어진 데이터를 바탕으로 정확하고 객관적인 SWOT 분석을 제공합니다."
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, json=data) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Claude API 오류: {response.status}, {error_text}")
                        return {
                            "status": "error",
                            "message": f"Claude API 오류: {response.status}"
                        }
                        
                    response_json = await response.json()
                    return {
                        "status": "success",
                        "content": response_json["content"][0]["text"]
                    }
                    
        except Exception as e:
            logger.error(f"Claude API 호출 중 오류: {e}")
            return {
                "status": "error",
                "message": f"API 호출 중 오류가 발생했습니다: {str(e)}"
            }

    async def get_latest_analysis_results(self, store_id: int) -> Dict[str, Any]:
        """매장의 최신 분석 결과들을 가져오는 함수"""
        try:
            results = {}
            missing_analyses = []
            
            # 1. 리뷰 분석 결과 가져오기
            reviews_collection = mongo_instance.get_collection("StoreReviews")
            review_analysis = reviews_collection.find_one({"store_id": store_id}, sort=[("created_at", -1)])
            
            if review_analysis:
                results["review_analysis"] = review_analysis
            else:
                missing_analyses.append("리뷰 분석")
            
            # 2. 자동 분석 결과와 EDA 분석 결과(종합 분석) 가져오기
            analysis_results = mongo_instance.get_collection("AnalysisResults")
            combined_analysis = analysis_results.find_one(
                {"store_id": store_id, "analysis_type": "combined_analysis"}, 
                sort=[("created_at", -1)]
            )
            
            if combined_analysis:
                results["combined_analysis"] = combined_analysis
                # 자동 분석 결과도 combined_analysis에서 가져옴
                if "auto_analysis_results" in combined_analysis:
                    results["auto_analysis"] = {
                        "results": combined_analysis["auto_analysis_results"],
                        "summaries": combined_analysis.get("summaries", {})
                    }
            else:
                pass
            
            # 3. 경쟁사 비교 분석 결과 가져오기
            competitor_collection = mongo_instance.get_collection("CompetitorComparisons")
            competitor_analysis = competitor_collection.find_one(
                {"store_id": store_id}, 
                sort=[("created_at", -1)]
            )
            
            if competitor_analysis:
                results["competitor_analysis"] = competitor_analysis
            else:
                missing_analyses.append("경쟁사 비교 분석")
            
            # 4. 매장 위치 기반 행정동 정보 가져오기
            store_info = None
            try:
                store_result = await store_service.get_store(store_id)
                if store_result.get("status") == "success":
                    store_info = store_result.get("store_info")
                    
                    # 주소에서 행정동 추출
                    if store_info and "address" in store_info:
                        dong_name = location_info_service.extract_dong_from_address(store_info["address"])
                        
                        if dong_name:
                            # 행정동 정보 조회
                            location_result = await location_info_service.get_dong_info(dong_name)
                            
                            if location_result.get("status") == "success":
                                results["location_info"] = {
                                    "dong_name": dong_name,
                                    "data": location_result.get("data", {})
                                }
            except Exception as e:
                logger.warning(f"매장 위치 정보를 가져오지 못했습니다 (ID: {store_id}): {str(e)}")
            
            return {
                "results": results,
                "missing_analyses": missing_analyses,
                "status": "missing" if missing_analyses else "complete"
            }
            
        except Exception as e:
            logger.error(f"분석 결과 조회 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"분석 결과 조회 중 오류가 발생했습니다: {str(e)}"
            }

    async def extract_swot_from_response(self, response_text: str) -> Dict[str, Any]:
        """Claude API 응답에서 SWOT 분석 결과를 추출하여 JSON 형태로 반환"""
        try:
            matches = re.findall(r'```json\s*([\s\S]*?)\s*```', response_text)
            if matches:
                try:
                    logger.debug(f"찾은 JSON 문자열 (처음 100자): {matches[0][:100]}...")
                    return json.loads(matches[0])
                except json.JSONDecodeError as e:
                    logger.warning(f"JSON 포맷 추출 실패: {e}, 직접 파싱 시도")
            
            # 직접 파싱 시도
            swot = {
                "strengths": [],
                "weaknesses": [],
                "opportunities": [],
                "threats": []
            }
            
            sections = {
                "strengths": ["강점", "strength"],
                "weaknesses": ["약점", "weakness"],
                "opportunities": ["기회", "opportunity"],
                "threats": ["위협", "threat"]
            }
            
            for key, keywords in sections.items():
                for keyword in keywords:
                    pattern = rf'(?i)#{{{1,3}}}\s*{keyword}.*?(?=#{{{1,3}}}\s*|$)'
                    matches = re.findall(pattern, response_text, re.DOTALL)
                    if matches:
                        items = re.findall(r'[-*]\s*(.*?)(?:\n|$)', matches[0])
                        if items:
                            swot[key] = [item.strip() for item in items if item.strip()]
                            break
            
            summary_pattern = r'(?i)#{1,3}\s*요약.*?(?=#{1,3}\s*|$)'
            summary_matches = re.findall(summary_pattern, response_text, re.DOTALL)
            
            if summary_matches:
                swot["summary"] = summary_matches[0].replace(re.findall(r'#{1,3}\s*요약.*?\n', summary_matches[0])[0], '').strip()
            else:
                # 요약 없으면 전체 응답의 처음 200자를 요약으로 사용
                swot["summary"] = response_text[:200].strip()
            
            # 권장사항 추출
            recommendations_pattern = r'(?i)#{1,3}\s*(권장|제안|추천|recommendation).*?(?=#{1,3}\s*|$)'
            recommendation_matches = re.findall(recommendations_pattern, response_text, re.DOTALL)
            
            if recommendation_matches:
                items = re.findall(r'[-*]\s*(.*?)(?:\n|$)', recommendation_matches[0])
                if items:
                    swot["recommendations"] = [item.strip() for item in items if item.strip()]
            else:
                swot["recommendations"] = []
            
            return swot
            
        except Exception as e:
            logger.error(f"SWOT 분석 추출 중 오류: {str(e)}")
            return {
                "strengths": [],
                "weaknesses": [],
                "opportunities": [],
                "threats": [],
                "summary": "분석 결과를 구조화하는 중 오류가 발생했습니다.",
                "recommendations": []
            }

    async def generate_final_report(self, store_id: int) -> Dict[str, Any]:
        """종합 SWOT 분석 보고서 생성"""
        try:
            # 분석 결과 가져오기
            analysis_data = await self.get_latest_analysis_results(store_id)
            
            if analysis_data.get("status") == "error":
                return analysis_data
            
            if analysis_data.get("status") == "missing":
                return {
                    "status": "incomplete",
                    "message": f"필요한 분석이 누락되었습니다: {', '.join(analysis_data['missing_analyses'])}",
                    "missing_analyses": analysis_data["missing_analyses"]
                }
            
            results = analysis_data.get("results", {})
            
            # 매장 정보 가져오기
            store_info = None
            try:
                store_result = await store_service.get_store(store_id)
                if store_result.get("status") == "success":
                    store_info = store_result.get("store_info")
            except Exception as e:
                logger.warning(f"매장 정보를 가져오지 못했습니다 (ID: {store_id}): {str(e)}")
            
            # 프롬프트 구성
            prompt = self._build_swot_prompt(store_id, store_info, results)
            
            # Claude API 호출
            api_response = await self.call_claude_api(prompt)
            
            if api_response.get("status") == "error":
                return api_response
            
            response_content = api_response.get("content", "")
            
            # SWOT 분석 결과 추출
            swot_analysis = await self.extract_swot_from_response(response_content)
            
            # 최종 보고서 DB에 저장
            final_report_doc = {
                "store_id": store_id,
                "store_name": store_info.get("store_name", "알 수 없음") if store_info else "알 수 없음",
                "created_at": datetime.now(),
                "swot_analysis": swot_analysis,
                "full_response": response_content,
                "related_analyses": {
                    "review_analysis_id": str(results.get("review_analysis", {}).get("_id", "")) if "review_analysis" in results else None,
                    "combined_analysis_id": str(results.get("combined_analysis", {}).get("_id", "")) if "combined_analysis" in results else None,
                    "competitor_analysis_id": str(results.get("competitor_analysis", {}).get("_id", "")) if "competitor_analysis" in results else None
                }
            }
            

            final_reports = mongo_instance.get_collection("FinalReports")
            report_id = final_reports.insert_one(final_report_doc).inserted_id
            
            return_report = {
                "report_id": report_id,
                "store_name": store_info.get("store_name", "알 수 없음") if store_info else "알 수 없음",
                "created_at": datetime.now(),
                "swot_analysis": swot_analysis,
                "full_response": response_content,
                "related_analyses": {
                    "review_analysis_id": str(results.get("review_analysis", {}).get("_id", "")) if "review_analysis" in results else None,
                    "combined_analysis_id": str(results.get("combined_analysis", {}).get("_id", "")) if "combined_analysis" in results else None,
                    "competitor_analysis_id": str(results.get("competitor_analysis", {}).get("_id", "")) if "competitor_analysis" in results else None
                }
            }

            logger.debug(f"최종 반환 데이터 (swot_analysis): {swot_analysis}")
            return return_report
            
        except Exception as e:
            logger.error(f"SWOT 보고서 생성 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"SWOT 보고서 생성 중 오류가 발생했습니다: {str(e)}"
            }

    def _build_swot_prompt(self, store_id: int, store_info: Optional[Dict], results: Dict) -> str:
        """SWOT 분석을 위한 Claude API 프롬프트 구성"""
        prompt = f"""
        # 소상공인 종합 SWOT 분석 보고서 작성 요청
        
        당신은 소상공인을 위한 데이터 분석 전문가입니다. 다음 데이터를 바탕으로 매장 ID {store_id}에 대한 종합적인 SWOT 분석 보고서를 작성해 주세요.
        
        ## 매장 정보
        """
        
        if store_info:
            prompt += f"""
            - 매장명: {store_info.get('store_name', '정보 없음')}
            - 주소: {store_info.get('address', '정보 없음')}
            - 업종: {store_info.get('category', '정보 없음')}
            """
        else:
            prompt += "- 매장 정보가 제공되지 않았습니다.\n"
        
        # 리뷰 분석 데이터 추가
        if "review_analysis" in results:
            review_data = results["review_analysis"]
            insights = review_data.get('insights', '').replace('\n', ' ').strip()[:300]
            prompt += f"""
            ## 고객 리뷰 분석 데이터
            - 총 리뷰 수: {review_data.get('review_count', 0)}개
            - 평균 평점: {review_data.get('average_rating', 0)}점
            - 감성 분포: 긍정 {review_data.get('sentiment_distribution', {}).get('positive', 0)}개, 부정 {review_data.get('sentiment_distribution', {}).get('negative', 0)}개, 중립 {review_data.get('sentiment_distribution', {}).get('neutral', 0)}개
            - 리뷰 인사이트: {insights}...
            """
            
            # 워드 클라우드 키워드 추가
            word_cloud = review_data.get('word_cloud_data', {})
            if word_cloud:
                pos_words = list(word_cloud.get('positive_words', {}).keys())[:10]
                neg_words = list(word_cloud.get('negative_words', {}).keys())[:10]
                
                prompt += f"""
            - 긍정적 키워드: {', '.join(pos_words) if pos_words else '없음'}
            - 부정적 키워드: {', '.join(neg_words) if neg_words else '없음'}
            """
        
        # 자동 분석 데이터 추가
        if "auto_analysis" in results:
            auto_data = results["auto_analysis"]
            predict_data = auto_data.get('results', {}).get('predict', {})
            cluster_data = auto_data.get('results', {}).get('cluster', {})
            
            if predict_data and 'error' not in predict_data:
                summary = auto_data.get('summaries', {}).get('predict_summary', '')
                cleaned_summary = summary.replace('\n', ' ').strip()[:300]
                prompt += f"""
            ## 매출 예측 분석 데이터
            - 예측 요약: {cleaned_summary}...
            """
                
                if 'summary' in predict_data:
                    pred_summary = predict_data.get('summary', {})
                    prompt += f"""
            - 향후 30일 총 예상 매출: {pred_summary.get('total_sales', 0):,.0f}원
            - 일평균 예상 매출: {pred_summary.get('average_daily_sales', 0):,.0f}원
            - 최고 매출 예상일: {pred_summary.get('max_sales', {}).get('date', '정보 없음')} ({pred_summary.get('max_sales', {}).get('value', 0):,.0f}원)
            - 최저 매출 예상일: {pred_summary.get('min_sales', {}).get('date', '정보 없음')} ({pred_summary.get('min_sales', {}).get('value', 0):,.0f}원)
            """
            
            if cluster_data and 'error' not in cluster_data:
                cluster_summary = auto_data.get('summaries', {}).get('cluster_summary', '')
                cleaned_cluster_summary = cluster_summary.replace('\n', ' ').strip()[:300]
                prompt += f"""
            ## 상품 클러스터링 분석 데이터
            - 클러스터링 요약: {cleaned_cluster_summary}...
            """
                
                if 'cluster_summary' in cluster_data:
                    clusters = cluster_data.get('cluster_summary', [])
                    for i, cluster in enumerate(clusters[:3]):
                        items = cluster.get('representative_items', [])
                        sales = cluster.get('매출', 0)
                        quantity = cluster.get('수량', 0)
                        formatted_sales = f"{sales:,.0f}"
                        prompt += f"""
            - 클러스터 {i+1} 대표 상품: {', '.join(items[:3]) if items else '정보 없음'}
            (평균 매출: {formatted_sales}원, 평균 수량: {quantity:.1f}개)
            """
        
        # 종합 분석 데이터 추가
        if "combined_analysis" in results:
            combined_data = results["combined_analysis"]
            eda_results = combined_data.get('eda_result', {})
            
            if 'result_data' in eda_results:
                summary = eda_results.get('summary', '').replace('\n', ' ').strip()[:300]
                prompt += f"""
            ## 데이터 종합 분석 결과
            - 종합 분석 요약: {summary}...
            """
                
                basic_stats = eda_results.get('result_data', {}).get('basic_stats', {}).get('data', {})
                if basic_stats:
                    total_sales = f"{basic_stats.get('total_sales', 0):,.0f}"
                    avg_transaction = f"{basic_stats.get('avg_transaction', 0):,.0f}"
                    total_transactions = f"{basic_stats.get('total_transactions', 0):,}"
                    unique_products = f"{basic_stats.get('unique_products', 0):,}"
                    
                    prompt += f"""
            - 총 매출: {total_sales}원
            - 평균 거래액: {avg_transaction}원
            - 총 거래 수: {total_transactions}건
            - 고유 상품 수: {unique_products}개
            """
                
                # 요일별 매출 추가
                weekday_sales = eda_results.get('result_data', {}).get('weekday_sales', {}).get('data', {})
                if weekday_sales:
                    prompt += f"""
            - 요일별 매출: """
                    for day, sales in weekday_sales.items():
                        if sales > 0:
                            prompt += f"{day}({sales:,.0f}원) "
                    prompt += "\n"
                
                time_period_sales = eda_results.get('result_data', {}).get('time_period_sales', {}).get('data', {})
                if time_period_sales:
                    prompt += f"""
            - 시간대별 매출: """
                    for period, sales in time_period_sales.items():
                        prompt += f"{period}({sales:,.0f}원) "
                    prompt += "\n"
                
                top_products = eda_results.get('result_data', {}).get('top_products', {}).get('data', {})
                if top_products:
                    prompt += f"""
            - 상위 판매 제품: """
                    count = 0
                    for product, sales in top_products.items():
                        if count < 5:  # 상위 3개 제품만 표시
                            prompt += f"{product}({sales:,.0f}원) "
                            count += 1
                    prompt += "\n"
        
        if "competitor_analysis" in results:
            comp_data = results["competitor_analysis"]
            insight = comp_data.get('comparison_insight', '')
            comparison = comp_data.get('comparison_data', {})
            
            cleaned_insight = insight.replace('\n', ' ').strip()[:300]
            
            prompt += f"""
            ## 경쟁사 비교 분석 데이터
            - 경쟁사명: {comp_data.get('competitor_name', '정보 없음')}
            - 분석 인사이트: {cleaned_insight}...
            """
            
            if comparison:
                my_store = comparison.get('my_store', {})
                competitor = comparison.get('competitor', {})
            
                my_positive_rate = f"{my_store.get('positive_rate', 0):.1f}"
                competitor_positive_rate = f"{competitor.get('positive_rate', 0):.1f}"
                
                prompt += f"""
            - 내 매장 리뷰 수: {my_store.get('review_count', 0)}개, 평균 평점: {my_store.get('average_rating', 0)}점
            - 경쟁사 리뷰 수: {competitor.get('review_count', 0)}개, 평균 평점: {competitor.get('average_rating', 0)}점
            - 내 매장 긍정 비율: {my_positive_rate}%, 경쟁사 긍정 비율: {competitor_positive_rate}%
            """
            
        # 위치 기반 히트맵 데이터 추가 (새로 추가)
        if "location_info" in results:
            location_data = results["location_info"]
            dong_data = location_data.get("data", {})
            dong_name = location_data.get("dong_name", "알 수 없음")
            
            prompt += f"""
            ## 매장 위치 분석 데이터 (행정동: {dong_name})
            - 유동인구: {dong_data.get('유동인구', 0):,.0f}명
            - 직장인구: {dong_data.get('직장인구', 0):,.0f}명  
            - 거주인구: {dong_data.get('거주인구', 0):,.0f}명
            - 외식업 총 업소 수: {dong_data.get('총 업소 수', 0):,.0f}개
            - 평균 개업률: {dong_data.get('평균 개업률', 0):.1f}%
            - 평균 폐업률: {dong_data.get('평균 폐업률', 0):.1f}%
            """
        
        prompt += """
        ## 요청사항
        위 데이터를 종합적으로 분석하여 소상공인을 위한 SWOT 분석을 다음 형식으로 작성해 주세요:
        
        1. 반드시 다음 네 항목으로 구성된 SWOT 분석을 제공해야 합니다:
        - 강점(Strengths): 내부적으로 긍정적인 요소
        - 약점(Weaknesses): 내부적으로 부정적인 요소
        - 기회(Opportunities): 외부적으로 긍정적인 요소
        - 위협(Threats): 외부적으로 부정적인 요소
        
        2. 각 항목마다 3-5개의 핵심 요소를 포함해 주세요.
        
        3. 마지막에 데이터에 기반한 구체적인 개선 제안 3-5가지를 제시해 주세요.
        
        4. 응답을 요약한 짧은 총평(2-3문장)을 제공해 주세요.
        
        5. recommendations은 상세히 마크다운 형식으로로 작성해주세요.

        6. 평균 평점 관련 정보는 무시하세요.
        ## 중요: 응답 포맷
        
        최종 결과는 다음과 같은 JSON 형식으로도 제공해 주세요:
        
        ```json
        {
            "strengths": ["강점1", "강점2", "강점3", ...],
            "weaknesses": ["약점1", "약점2", "약점3", ...],
            "opportunities": ["기회1", "기회2", "기회3", ...],
            "threats": ["위협1", "위협2", "위협3", ...],
            "summary": "분석 총평을 아주 상세히 작성",
            "recommendations": ["제안1", "제안2", "제안3", ...]
        }
        ```
        
        단, JSON 구조 이외에도 자세한 설명을 포함한 전체 분석 보고서를 마크다운 형식으로 함께 제공해 주세요.
        """
        
        return prompt

    async def get_final_report(self, report_id: str) -> Dict[str, Any]:
        """저장된 SWOT 분석 보고서 조회"""
        try:
            final_reports = mongo_instance.get_collection("FinalReports")
            
            report = final_reports.find_one({"_id": ObjectId(report_id)})
            
            if not report:
                return {
                    "status": "error",
                    "message": f"ID가 {report_id}인 보고서를 찾을 수 없습니다."
                }
            
            report["_id"] = str(report["_id"])
            
            return {
                "status": "success",
                "report": report
            }
            
        except Exception as e:
            logger.error(f"보고서 조회 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"보고서 조회 중 오류가 발생했습니다: {str(e)}"
            }
    
    async def get_store_reports_list(self, store_id: int) -> Dict[str, Any]:
        """매장의 모든 SWOT 보고서 목록 조회"""
        try:
            final_reports = mongo_instance.get_collection("FinalReports")
            
            cursor = final_reports.find({"store_id": store_id}).sort("created_at", -1)
            
            results = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                results.append({
                    "report_id": doc["_id"],
                    "store_name": doc.get("store_name", "알 수 없음"),
                    "created_at": doc.get("created_at", ""),
                    "summary": doc.get("swot_analysis", {}).get("summary", "")[:150] + "..." 
                        if len(doc.get("swot_analysis", {}).get("summary", "")) > 150 
                        else doc.get("swot_analysis", {}).get("summary", "")
                })
            
            return {
                "status": "success",
                "count": len(results),
                "reports": results
            }
            
        except Exception as e:
            logger.error(f"보고서 목록 조회 중 오류: {str(e)}")
            return {
                "status": "error", 
                "message": f"보고서 목록 조회 중 오류가 발생했습니다: {str(e)}"
            }

final_report_service = FinalReportService()