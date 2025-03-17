# services/rag_service.py

import os
import logging
import json
import numpy as np
from typing import List, Dict, Tuple, Any
from sentence_transformers import SentenceTransformer, CrossEncoder # type: ignore
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self, data_path: str = "./data/qa_data.json", 
                embeddings_path: str = "./data/processed/question_embeddings.npy"):
        """RAG 서비스 초기화"""
        load_dotenv("./config/.env")
        
        self.bi_encoder = SentenceTransformer('distiluse-base-multilingual-cased-v1')
        self.cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
        
        self.qa_data = self._load_data(data_path)
        self.embeddings = self._load_embeddings(embeddings_path)
        
        if not self.embeddings.size and self.qa_data:
            logger.info("임베딩 파일이 없어 새로 생성합니다.")
            self.embeddings = self._create_embeddings()
            self._save_embeddings(embeddings_path)
        
        logger.info(f"RAG 서비스 초기화 완료: {len(self.qa_data)} 개의 QA 쌍 로드됨")
    
    def _load_data(self, data_path: str) -> List[Dict]:
        """QA 데이터 로드"""
        try:
            if not os.path.exists(data_path):
                logger.error(f"데이터 파일이 존재하지 않습니다: {data_path}")
                return []
                
            with open(data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for i, item in enumerate(data):
                item['id'] = i
            
            return data
        except Exception as e:
            logger.error(f"데이터 로드 중 오류: {str(e)}")
            return []
    
    def _load_embeddings(self, embeddings_path: str) -> np.ndarray:
        """임베딩 로드"""
        try:
            if not os.path.exists(embeddings_path):
                logger.warning(f"임베딩 파일이 존재하지 않습니다: {embeddings_path}")
                return np.array([])
                
            return np.load(embeddings_path)
        except Exception as e:
            logger.error(f"임베딩 로드 중 오류: {str(e)}")
            return np.array([])
    
    def _create_embeddings(self) -> np.ndarray:
        """질문에 대한 임베딩 생성"""
        try:
            questions = [item['question'] for item in self.qa_data]
            embeddings = self.bi_encoder.encode(questions, convert_to_tensor=False, show_progress_bar=True)
            return embeddings
        except Exception as e:
            logger.error(f"임베딩 생성 중 오류: {str(e)}")
            return np.array([])
    
    def _save_embeddings(self, embeddings_path: str):
        """임베딩 저장"""
        try:
            os.makedirs(os.path.dirname(embeddings_path), exist_ok=True)
            np.save(embeddings_path, self.embeddings)
            logger.info(f"임베딩 저장 완료: {embeddings_path}")
        except Exception as e:
            logger.error(f"임베딩 저장 중 오류: {str(e)}")
    
    def retrieve(self, query: str, top_k_stage1: int = 10, top_k_stage2: int = 3) -> List[Dict]:
        """2단계 검색 프로세스"""
        try:
            if not self.qa_data or not self.embeddings.size:
                logger.warning("QA 데이터 또는 임베딩이 로드되지 않았습니다.")
                return []
                
            # Stage 1: Bi-encoder
            query_embedding = self.bi_encoder.encode(query, convert_to_tensor=False)
            scores = np.dot(self.embeddings, query_embedding) / (
                np.linalg.norm(self.embeddings, axis=1) * np.linalg.norm(query_embedding)
            )
            
            top_k_indices = np.argsort(-scores)[:top_k_stage1]
            stage1_candidates = [self.qa_data[idx] for idx in top_k_indices]
            
            # Stage 2: Cross-encoder
            cross_inp = [[query, candidate['question']] for candidate in stage1_candidates]
            cross_scores = self.cross_encoder.predict(cross_inp)
            
            for idx, score in enumerate(cross_scores):
                stage1_candidates[idx]['score'] = float(score)
            
            sorted_candidates = sorted(stage1_candidates, key=lambda x: x['score'], reverse=True)
            top_results = sorted_candidates[:top_k_stage2]
            
            logger.info(f"쿼리 '{query}'에 대해 {len(top_results)}개의 답변 검색됨")
            return top_results
        except Exception as e:
            logger.error(f"검색 중 오류: {str(e)}")
            return []

    def get_categories(self) -> List[str]:
        """사용 가능한 모든 카테고리 목록 반환"""
        try:
            categories = set(item['category'] for item in self.qa_data)
            return sorted(list(categories))
        except Exception as e:
            logger.error(f"카테고리 목록 조회 중 오류: {str(e)}")
            return []
    
    def get_subcategories(self, category: str) -> List[str]:
        """특정 카테고리의 서브카테고리 목록 반환"""
        try:
            subcategories = set(
                item['subcategory'] for item in self.qa_data 
                if item['category'] == category
            )
            return sorted(list(subcategories))
        except Exception as e:
            logger.error(f"서브카테고리 목록 조회 중 오류: {str(e)}")
            return []
    
    def search_by_category(self, query: str, category: str, top_k: int = 3) -> List[Dict]:
        """특정 카테고리 내에서만 검색"""
        try:
            category_data = [
                item for item in self.qa_data 
                if item['category'] == category
            ]
            
            if not category_data:
                logger.warning(f"카테고리 '{category}'에 해당하는 데이터가 없습니다.")
                return []
                
            category_questions = [item['question'] for item in category_data]
            
            category_embeddings = self.bi_encoder.encode(
                category_questions, convert_to_tensor=False
            )
            
            query_embedding = self.bi_encoder.encode(query, convert_to_tensor=False)
            scores = np.dot(category_embeddings, query_embedding) / (
                np.linalg.norm(category_embeddings, axis=1) * np.linalg.norm(query_embedding)
            )
            
            top_k_indices = np.argsort(-scores)[:top_k]
            results = [category_data[idx] for idx in top_k_indices]
            
            return results
        except Exception as e:
            logger.error(f"카테고리 검색 중 오류: {str(e)}")
            return []

rag_service = RAGService()