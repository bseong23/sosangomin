# preprocess_qa_data.py

import os
import json
import argparse
import logging
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import numpy as np
import pandas as pd

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_json_data(file_path: str) -> List[Dict[str, Any]]:
    """JSON 파일에서 QA 데이터 로드"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logger.info(f"데이터 로드 완료: {len(data)} 개의 QA 쌍")
        return data
    except Exception as e:
        logger.error(f"데이터 로드 중 오류 발생: {str(e)}")
        return []

def create_embeddings(data: List[Dict[str, Any]], model_name: str = 'distiluse-base-multilingual-cased-v1') -> np.ndarray:
    """QA 질문에 대한 임베딩 생성"""
    try:
        model = SentenceTransformer(model_name)
        logger.info(f"임베딩 모델 로드 완료: {model_name}")
        
        questions = [item['question'] for item in data]
        embeddings = model.encode(questions, show_progress_bar=True)
        
        logger.info(f"임베딩 생성 완료: {embeddings.shape}")
        return embeddings
    except Exception as e:
        logger.error(f"임베딩 생성 중 오류 발생: {str(e)}")
        return np.array([])

def add_metadata(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """QA 데이터에 메타데이터 추가"""
    try:
        for i, item in enumerate(data):
            item['id'] = i
            
            item['question_length'] = len(item['question'])
            
            item['answer_length'] = len(item['answer'])
            
            words = item['question'].split()
            item['keywords'] = [word for word in words if len(word) > 1]
        
        logger.info("메타데이터 추가 완료")
        return data
    except Exception as e:
        logger.error(f"메타데이터 추가 중 오류 발생: {str(e)}")
        return data

def analyze_data(data: List[Dict[str, Any]]) -> None:
    """데이터 분석 및 요약 정보 출력"""
    try:
        df = pd.DataFrame(data)
        
        logger.info(f"카테고리 수: {df['category'].nunique()}")
        logger.info(f"서브카테고리 수: {df['subcategory'].nunique()}")
        
        category_counts = df['category'].value_counts()
        logger.info(f"카테고리별 QA 쌍 수:\n{category_counts}")
        
        question_lengths = df['question'].apply(len)
        answer_lengths = df['answer'].apply(len)
        
        logger.info(f"질문 길이 - 평균: {question_lengths.mean():.2f}, 최소: {question_lengths.min()}, 최대: {question_lengths.max()}")
        logger.info(f"답변 길이 - 평균: {answer_lengths.mean():.2f}, 최소: {answer_lengths.min()}, 최대: {answer_lengths.max()}")
        
        duplicate_questions = df[df.duplicated(subset=['question'], keep=False)]
        if not duplicate_questions.empty:
            logger.warning(f"중복된 질문 {len(duplicate_questions)} 개 발견")
        
        subcategory_counts = df['subcategory'].value_counts()
        logger.info(f"상위 5개 서브카테고리:\n{subcategory_counts.head()}")
        
    except Exception as e:
        logger.error(f"데이터 분석 중 오류 발생: {str(e)}")

def save_processed_data(data: List[Dict[str, Any]], embeddings: np.ndarray, output_dir: str) -> None:
    """처리된 데이터 및 임베딩 저장"""
    try:
        os.makedirs(output_dir, exist_ok=True)
        
        with open(os.path.join(output_dir, 'processed_qa_data.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        np.save(os.path.join(output_dir, 'question_embeddings.npy'), embeddings)
        
        logger.info(f"처리된 데이터 및 임베딩 저장 완료: {output_dir}")
    except Exception as e:
        logger.error(f"데이터 저장 중 오류 발생: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description='QA 데이터 전처리 및 임베딩 생성')
    parser.add_argument('--input', type=str, default='data/qa_data.json', help='입력 QA 데이터 JSON 파일 경로')
    parser.add_argument('--output-dir', type=str, default='data/processed', help='처리된 데이터 저장 디렉토리')
    parser.add_argument('--model', type=str, default='distiluse-base-multilingual-cased-v1', help='임베딩 모델 이름')
    
    args = parser.parse_args()
    
    logger.info("데이터 처리 시작")
    
    data = load_json_data(args.input)
    if not data:
        logger.error("데이터 로드 실패. 처리 중단.")
        return
    
    data = add_metadata(data)
    
    analyze_data(data)
    
    embeddings = create_embeddings(data, args.model)
    if embeddings.size == 0:
        logger.error("임베딩 생성 실패. 처리 중단.")
        return
    
    save_processed_data(data, embeddings, args.output_dir)
    
    logger.info("데이터 처리 완료")

if __name__ == "__main__":
    main()