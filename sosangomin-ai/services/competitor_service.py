# services/competitor_service.py

import os
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from bson import ObjectId
from database.mongo_connector import mongo_instance
from services.store_service import simple_store_service as store_service
from services.review_service import review_service
from services.eda_chat_service import eda_chat_service

logger = logging.getLogger(__name__)

class CompetitorService:
    def __init__(self):
        pass

    async def search_competitor(self, competitor_name: str) -> Dict[str, Any]:
        """
        경쟁사 검색 - 이름으로 경쟁사 정보 및 place_id 조회
        
        Args:
            competitor_name: 경쟁사 이름
            
        Returns:
            Dict: 경쟁사 정보 (DB에 저장하지 않음)
        """
        try:
            search_result = await store_service._search_naver_store(competitor_name)
            
            if not search_result:
                return {
                    "status": "error",
                    "message": f"'{competitor_name}' 검색 결과가 없습니다."
                }
            
            place_id = search_result.get("place_id")
            
            if not place_id or place_id == search_result.get("place_url"):
                place_id = await store_service._get_place_id_with_selenium(competitor_name)
                
                if place_id:
                    search_result["place_id"] = place_id
                    logger.info(f"Selenium으로 place_id 추출 성공: {place_id}")
            
            return {
                "status": "success",
                "message": "경쟁사 검색 결과입니다.",
                "competitor_info": {
                    "store_name": search_result.get("store_name"),
                    "address": search_result.get("address") or search_result.get("road_address", ""),
                    "place_id": search_result.get("place_id"),
                    "category": search_result.get("category", ""),
                    "phone": search_result.get("phone", ""),
                    "latitude": search_result.get("latitude"),
                    "longitude": search_result.get("longitude")
                }
            }
            
        except Exception as e:
            logger.error(f"경쟁사 검색 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"경쟁사 검색 중 오류가 발생했습니다: {str(e)}"
            }

    async def analyze_competitor_reviews(self, store_id: int, competitor_name: str) -> Dict[str, Any]:
        """
        경쟁사 리뷰 분석 (DB에 저장하지 않음)
        
        Args:
            store_id: 내 매장 ID (참조용, 로깅 및 데이터 추적만을 위해 사용)
            competitor_name: 경쟁사 이름
            
        Returns:
            Dict: 경쟁사 리뷰 분석 결과
        """
        try:
            search_result = await self.search_competitor(competitor_name)
            
            if search_result.get("status") == "error":
                return search_result
            
            competitor_info = search_result.get("competitor_info", {})
            place_id = competitor_info.get("place_id")
            
            if not place_id:
                return {
                    "status": "error",
                    "message": "경쟁사의 네이버 플레이스 ID를 찾을 수 없습니다."
                }
            
            reviews = await review_service.fetch_reviews_with_selenium(place_id)
            
            if not reviews:
                return {
                    "status": "error",
                    "message": "경쟁사의 리뷰를 가져올 수 없습니다."
                }
            
            analyzed_reviews = await review_service.analyze_sentiment(reviews)
            word_cloud_data = await review_service.generate_word_cloud_data(analyzed_reviews)
            insights = await review_service.generate_insights(analyzed_reviews, place_id)
            
            total_reviews = len(analyzed_reviews)
            avg_rating = sum(r.get("rating", 0) for r in analyzed_reviews) / total_reviews if total_reviews > 0 else 0
            sentiment_counts = {
                "positive": sum(1 for r in analyzed_reviews if r.get("sentiment") == "positive"),
                "neutral": sum(1 for r in analyzed_reviews if r.get("sentiment") == "neutral"),
                "negative": sum(1 for r in analyzed_reviews if r.get("sentiment") == "negative")
            }
            
            analysis_result = {
                "competitor_name": competitor_info.get("store_name"),
                "place_id": place_id,
                "reviews": analyzed_reviews[:10],  
                "review_count": total_reviews,
                "average_rating": round(avg_rating, 1),
                "sentiment_distribution": sentiment_counts,
                "word_cloud_data": word_cloud_data,
                "insights": insights,
                "analysis_time": datetime.now().isoformat()
            }
            
            return {
                "status": "success",
                "message": "경쟁사 리뷰 분석이 완료되었습니다.",
                "competitor_info": competitor_info,
                "analysis_result": analysis_result
            }
            
        except Exception as e:
            logger.error(f"경쟁사 리뷰 분석 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"경쟁사 리뷰 분석 중 오류가 발생했습니다: {str(e)}"
            }

    async def compare_with_competitor(self, store_id: int, competitor_place_id: str, analysis_id: Optional[str] = None) -> Dict[str, Any]:
        """
        내 점포와 경쟁사 리뷰 비교 분석 (결과는 DB에 저장)
        
        Args:
            store_id: 내 매장 ID
            competitor_place_id: 경쟁사 네이버 플레이스 ID
            analysis_id: 내 점포 분석 ID (없으면 최신 분석 사용)
            
        Returns:
            Dict: 비교 분석 결과
        """
        try:
            reviews_collection = mongo_instance.get_collection("StoreReviews")
            
            my_analysis = None
            if analysis_id:
                my_analysis = reviews_collection.find_one({"_id": ObjectId(analysis_id), "store_id": store_id})
            else:
                my_analysis = reviews_collection.find_one({"store_id": store_id}, sort=[("created_at", -1)])
            
            if not my_analysis:
                return {
                    "status": "error",
                    "message": "내 매장의 리뷰 분석 결과가 없습니다. 먼저 리뷰 분석을 진행해주세요."
                }
            
            competitor_reviews = await review_service.fetch_reviews_with_selenium(competitor_place_id)
            
            if not competitor_reviews:
                return {
                    "status": "error",
                    "message": "경쟁사의 리뷰를 가져올 수 없습니다."
                }
            
            competitor_analyzed_reviews = await review_service.analyze_sentiment(competitor_reviews)
            competitor_word_cloud = await review_service.generate_word_cloud_data(competitor_analyzed_reviews)
            
            competitor_info = None
            try:
                from services.store_service import store_service
                competitor_reviews_text = " ".join([r.get("text", "") for r in competitor_reviews[:5]])
                competitor_name = competitor_place_id
            except Exception:
                competitor_name = f"경쟁사 (ID: {competitor_place_id})"
            
            my_review_count = my_analysis.get("review_count", 0)
            my_sentiment = my_analysis.get("sentiment_distribution", {})
            my_avg_rating = my_analysis.get("average_rating", 0)
            my_word_cloud = my_analysis.get("word_cloud_data", {})
            my_reviews_sample = my_analysis.get("reviews", [])[:5]  
            
            competitor_review_count = len(competitor_analyzed_reviews)
            competitor_sentiment = {
                "positive": sum(1 for r in competitor_analyzed_reviews if r.get("sentiment") == "positive"),
                "neutral": sum(1 for r in competitor_analyzed_reviews if r.get("sentiment") == "neutral"),
                "negative": sum(1 for r in competitor_analyzed_reviews if r.get("sentiment") == "negative")
            }
            competitor_reviews_sample = competitor_analyzed_reviews[:5] 
            
            if competitor_review_count > 0:
                pos_ratio = competitor_sentiment.get("positive", 0) / competitor_review_count
                competitor_avg_rating = 3.0 + (pos_ratio - 0.5) * 2
                competitor_avg_rating = max(1.0, min(5.0, round(competitor_avg_rating, 1)))
            
            comparison_data = {
                "my_store": {
                    "review_count": my_review_count,
                    "average_rating": my_avg_rating,
                    "sentiment_distribution": my_sentiment,
                    "positive_rate": (my_sentiment.get("positive", 0) / my_review_count * 100) if my_review_count > 0 else 0,
                    "sample_reviews": [r.get("text", "") for r in my_reviews_sample]
                },
                "competitor": {
                    "name": competitor_name,
                    "review_count": competitor_review_count,
                    "average_rating": competitor_avg_rating,
                    "sentiment_distribution": competitor_sentiment,
                    "positive_rate": (competitor_sentiment.get("positive", 0) / competitor_review_count * 100) if competitor_review_count > 0 else 0,
                    "sample_reviews": [r.get("text", "") for r in competitor_reviews_sample]
                },
                "word_cloud_comparison": {
                    "my_store": my_word_cloud,
                    "competitor": competitor_word_cloud
                }
            }
            
            comparison_insight = await self._generate_comparison_insight(comparison_data)
            
            comparison_collection = mongo_instance.get_collection("CompetitorComparisons")
            
            comparison_doc = {
                "store_id": store_id,
                "store_analysis_id": str(my_analysis["_id"]),
                "competitor_place_id": competitor_place_id,
                "competitor_name": competitor_name,
                "comparison_data": comparison_data,
                "comparison_insight": comparison_insight,
                "created_at": datetime.now()
            }
            
            comparison_id = comparison_collection.insert_one(comparison_doc).inserted_id
            
            return {
                "status": "success",
                "message": "내 매장과 경쟁사 비교 분석이 완료되었습니다.",
                "comparison_id": str(comparison_id),
                "comparison_data": comparison_data,
                "comparison_insight": comparison_insight
            }
            
        except Exception as e:
            logger.error(f"비교 분석 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"비교 분석 중 오류가 발생했습니다: {str(e)}"
            }

    async def _generate_comparison_insight(self, comparison_data: Dict[str, Any]) -> str:
        """
        비교 분석 인사이트 생성
        
        Args:
            comparison_data: 비교 분석 데이터
            
        Returns:
            str: 비교 분석 인사이트
        """
        try:
            my_store = comparison_data.get("my_store", {})
            competitor = comparison_data.get("competitor", {})
            word_cloud_comparison = comparison_data.get("word_cloud_comparison", {})
            
            prompt = f"""
                다음은 내 매장과 경쟁사의 리뷰 분석 비교 데이터입니다:
                
                내 매장:
                - 리뷰 수: {my_store.get("review_count")}
                - 평균 평점: {my_store.get("average_rating")}
                - 긍정 리뷰 비율: {my_store.get("positive_rate"):.1f}%
                - 감성 분포: {my_store.get("sentiment_distribution")}
                - 자주 언급되는 긍정적 키워드: {', '.join(list(word_cloud_comparison.get("my_store", {}).get("positive_words", {}).keys())[:10])}
                - 자주 언급되는 부정적 키워드: {', '.join(list(word_cloud_comparison.get("my_store", {}).get("negative_words", {}).keys())[:10])}
                
                경쟁사 ({competitor.get("name")}):
                - 리뷰 수: {competitor.get("review_count")}
                - 평균 평점: {competitor.get("average_rating")}
                - 긍정 리뷰 비율: {competitor.get("positive_rate"):.1f}%
                - 감성 분포: {competitor.get("sentiment_distribution")}
                - 자주 언급되는 긍정적 키워드: {', '.join(list(word_cloud_comparison.get("competitor", {}).get("positive_words", {}).keys())[:10])}
                - 자주 언급되는 부정적 키워드: {', '.join(list(word_cloud_comparison.get("competitor", {}).get("negative_words", {}).keys())[:10])}
                
                리뷰 키워드 비교:
                - 내 매장에만 있는 긍정 키워드: {', '.join(set(word_cloud_comparison.get("my_store", {}).get("positive_words", {}).keys()) - set(word_cloud_comparison.get("competitor", {}).get("positive_words", {}).keys()))[:20]}
                - 경쟁사에만 있는 긍정 키워드: {', '.join(set(word_cloud_comparison.get("competitor", {}).get("positive_words", {}).keys()) - set(word_cloud_comparison.get("my_store", {}).get("positive_words", {}).keys()))[:20]}
                - 내 매장에만 있는 부정 키워드: {', '.join(set(word_cloud_comparison.get("my_store", {}).get("negative_words", {}).keys()) - set(word_cloud_comparison.get("competitor", {}).get("negative_words", {}).keys()))[:20]}
                - 경쟁사에만 있는 부정 키워드: {', '.join(set(word_cloud_comparison.get("competitor", {}).get("negative_words", {}).keys()) - set(word_cloud_comparison.get("my_store", {}).get("negative_words", {}).keys()))[:20]}
                
                이 데이터를 분석하여 다음 내용이 포함된 비교 인사이트를 제공해 주세요:
                
                1. 내 매장과 경쟁사의 주요 차이점
                2. 내 매장의 강점과 약점 (경쟁사와 비교하여)
                3. 고객이 중요하게 생각하는 요소 분석
                4. 경쟁력 강화를 위한 구체적인 개선 방안
                5. 마케팅 및 운영 전략에 대한 제안
                
                최대한 리뷰 텍스트 분석에서 나온 실제 키워드를 활용하여 구체적인 인사이트를 제공해 주세요.
            """
            
            response = await eda_chat_service.generate_overall_summary({"비교 분석 데이터": prompt})
            
            return response.strip()
            
        except Exception as e:
            logger.error(f"비교 분석 인사이트 생성 중 오류: {str(e)}")
            return "비교 분석 결과, 내 매장과 경쟁사 간에 고객 만족도와 서비스 품질에 차이가 있습니다. 자세한 인사이트는 현재 제공할 수 없습니다."

    async def get_comparison_result(self, comparison_id: str) -> Dict[str, Any]:
        """
        비교 분석 결과 조회
        
        Args:
            comparison_id: 비교 분석 결과 ID
            
        Returns:
            Dict: 비교 분석 결과
        """
        try:
            comparison_collection = mongo_instance.get_collection("CompetitorComparisons")
            
            result = comparison_collection.find_one({"_id": ObjectId(comparison_id)})
            
            if not result:
                return {
                    "status": "error",
                    "message": f"ID가 {comparison_id}인 비교 분석 결과를 찾을 수 없습니다."
                }
            
            result["_id"] = str(result["_id"])
            
            return {
                "status": "success",
                "comparison_result": result
            }
            
        except Exception as e:
            logger.error(f"비교 분석 결과 조회 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"비교 분석 결과 조회 중 오류가 발생했습니다: {str(e)}"
            }

    async def get_store_comparison_list(self, store_id: int) -> Dict[str, Any]:
        """
        매장의 비교 분석 목록 조회
        
        Args:
            store_id: 매장 ID
            
        Returns:
            Dict: 비교 분석 목록
        """
        try:
            comparison_collection = mongo_instance.get_collection("CompetitorComparisons")
            
            cursor = comparison_collection.find({"store_id": store_id}).sort("created_at", -1)
            
            results = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                results.append({
                    "comparison_id": doc["_id"],
                    "competitor_name": doc.get("competitor_name", ""),
                    "competitor_place_id": doc.get("competitor_place_id", ""),
                    "created_at": doc.get("created_at", ""),
                    "summary": doc.get("comparison_insight", "")[:150] + "..." if len(doc.get("comparison_insight", "")) > 150 else doc.get("comparison_insight", "")
                })
            
            return {
                "status": "success",
                "count": len(results),
                "comparisons": results
            }
            
        except Exception as e:
            logger.error(f"비교 분석 목록 조회 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"비교 분석 목록 조회 중 오류가 발생했습니다: {str(e)}"
            }

competitor_service = CompetitorService()