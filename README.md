# 소상공인 데이터 분석 플랫폼_AI서버

소상공인 데이터 분석 플랫폼은 소규모 사업자들이 데이터 기반 의사결정을 쉽게 할 수 있도록 돕는 종합 분석 서비스의 AI 서버입니다다. 매출 데이터 분석, 고객 리뷰 분석, 경쟁사 비교, 상권 분석 등을 통합하여 제공하며, AI 기반 인사이트와 SWOT 분석 보고서를 생성합니다.

## 목차
1. [주요 기능](#주요-기능)
2. [시스템 아키텍처](#시스템-아키텍처)
3. [API 상세 설명](#API-상세-설명)
4. [설치 및 설정 방법](#설치-및-설정-방법)
5. [서비스 컴포넌트 상세](#서비스-컴포넌트-상세)
6. [사용 예시](#사용-예시)

## 주요 기능

### 1. 매장 관리
- **자동 매장 등록**: 가게 이름만으로 네이버 검색 API와 Selenium을 활용한 자동 매장 정보 검색 및 등록
- **매장 정보 관리**: 주소, 카테고리, 위치 정보(위도/경도) 등 관리
- **POS 시스템 연동**: 여러 POS 시스템 유형(키움, 토스 등) 지원

### 2. 데이터 분석 기능
#### 2.1 EDA (탐색적 데이터 분석)
- **시간 패턴 분석**: 
  - 시간대별 매출 패턴 분석
  - 요일별 매출 패턴 및 고객 방문 분석
  - 월별/계절별 트렌드 분석
  - 특정 기간 매출 비교 분석
  - 고급 EDA 분석 8종류 추가가
- **상품 분석**:
  - 베스트셀러 상품 식별
  - 상품별 매출 기여도 분석
  - 상품 조합 분석 (함께 판매되는 상품 패턴)
- **고객 분석**:
  - 객단가 분석

#### 2.2 예측 분석
- **매출 예측**:
  - 향후 30일일 매출 예측

#### 2.3 클러스터링 분석
- **상품 클러스터링**:
  - 상품 특징별별 상품 그룹화

#### 2.4 종합 분석
- EDA, 예측, 클러스터링을 통합한 종합 분석
- 여러 데이터소스를 결합한 통합 인사이트 제공
- 데이터 기반 운영 개선 제안 생성

### 3. 리뷰 분석
- **자동 리뷰 수집**:
  - 네이버 플레이스 리뷰 자동 크롤링
  - 리뷰 데이터 구조화 및 저장
- **감성 분석**:
  - 긍정/부정/중립 리뷰 분류
  - 시간에 따른 감성 트렌드 분석
  - 특정 주제에 대한 감성 분석
- **키워드 분석**:
  - 주요 키워드 추출 및 빈도 분석
  - 토픽 모델링을 통한 주요 이슈 식별
  - 워드 클라우드 시각화
- **인사이트 도출**:
  - 고객 불만 사항 자동 식별
  - 개선 필요 영역 추천
  - 경쟁 우위 요소 식별

### 4. 경쟁사 분석
- **경쟁사 리뷰 분석**:
  - 경쟁사 리뷰 자동 수집 및 분석
  - 경쟁사 강점/약점 식별
- **비교 분석**:
  - 내 매장 vs 경쟁사 리뷰 비교
  - 감성 비율 비교
  - 키워드 비교 분석
- **차별화 전략 제안**:
  - 경쟁사 대비 개선 필요 영역 식별
  - 차별화 포인트 제안
  - 마케팅 전략 제안

### 5. 상권 분석
- **인구 통계 분석**:
  - 지역별 인구 구성 분석
  - 연령대별, 성별 인구 분포
  - 유동 인구 분석
- **상권 정보**:
  - 동네별 상권 특성 분석
  - 경쟁 밀도 분석
  - 상권 성장성 분석
- **입지 분석**:
  - 최적 위치 제안
  - 주변 시설과의 시너지 분석

### 6. SWOT 종합 분석 보고서
- **자동 SWOT 분석**:
  - 모든 분석 데이터를 종합한 SWOT 매트릭스 생성
  - 강점, 약점, 기회, 위협 요소 식별
- **전략 제안**:
  - SWOT 기반 사업 전략 제안
  - 단기/중기/장기 실행 계획 제안
- **시각화 보고서**:
  - 그래프, 차트를 활용한 데이터 시각화
  - 경영자를 위한 요약 리포트

### 7. AI 채팅 상담
- **데이터 기반 상담**:
  - RAG 시스템 구축축
  - 매장 데이터 및 분석 결과에 기반한 맞춤형 답변
  - 자연어 질의 처리
- **경영 조언**:
  - 매출 증대 방안 제안
  - 문제 해결 가이드
  - 운영 최적화 조언
- **사용자 친화적 인터페이스**:
  - 쉬운 질문-응답 형식
  - 복잡한 데이터를 이해하기 쉽게 설명

### 8. 파일 관리 및 S3 스토리지
- **유연한 데이터 업로드**:
  - CSV, Excel 등 다양한 포맷 지원
  - 드래그 앤 드롭 파일 업로드
- **데이터 파일 관리**:
  - 기간별 데이터 파일 관리
  - 매장별 데이터 구분
- **보안 스토리지**:
  - AWS S3 기반 안전한 클라우드 스토리지
  - 암호화된 데이터 전송 및 저장
  - 임시 URL 생성을 통한 안전한 접근

## 시스템 아키텍처

### 백엔드 구조
- **API 서버**: FastAPI 기반의 RESTful API 서버
- **데이터베이스**: MariaDB, MongoDB
- **분석 엔진**: 파이썬 기반 데이터 분석 및 머신러닝 모델
- **크롤링 엔진**: Selenium 및 BeautifulSoup을 활용한 웹 크롤링 서비스
- **스토리지**: AWS S3 기반 데이터 스토리지
- **태스크 큐**: 백그라운드 작업 처리를 위한 비동기 태스크 큐
- **캐싱 시스템**: 성능 최적화를 위한 메모리 캐싱

### 기술 스택
- **백엔드 프레임워크**: FastAPI
- **데이터베이스**: MariaDB, MongoDB, SQLAlchemy ORM
- **데이터 분석**: Pandas, NumPy, Scikit-learn, Prophet
- **머신러닝**: TensorFlow, PyTorch
- **자연어 처리**: KoNLPy(한국어)
- **웹 크롤링**: Selenium, BeautifulSoup
- **클라우드 스토리지**: AWS S3
- **컨테이너화**: Docker, Docker Compose, Jenkins
- **API 통합**: 네이버 검색 API, Claude API, 공공 API

## API 상세 설명

API는 다음과 같은 주요 섹션으로 구성되어 있습니다:

### 1. 채팅 API
- `POST /api/chat`: 통합 챗봇 API 엔드포인트

### 2. 매장 관리 API
- `POST /api/store/register`: 가게 이름으로 매장 자동 등록

### 3. 데이터 분석 API
- `POST /api/data-analysis/analyze/auto`: 자동 분석(예측 + 클러스터링) 수행
- `GET /api/data-analysis/results/{result_id}`: 특정 분석 결과 조회
- `POST /api/eda/analyze/combined`: 종합 분석(EDA, 예측, 클러스터링) 수행
- `POST /api/eda/analyze`: 여러 데이터소스에 대한 EDA 수행
- `GET /api/eda/results/{analysis_id}`: 특정 EDA 분석 결과 조회
- `GET /api/eda/results`: 특정 데이터소스의 모든 EDA 분석 결과 조회
- `GET /api/eda/latest`: 최신 EDA 분석 결과 조회
- `GET /api/eda/charts/{analysis_id}`: 차트 데이터 조회

### 4. 리뷰 분석 API
- `POST /api/reviews/analyze`: 매장 리뷰 분석
- `GET /api/reviews/store/{store_id}`: 매장 리뷰 목록 조회
- `GET /api/reviews/analysis/{analysis_id}`: 특정 리뷰 분석 결과 조회

### 5. 경쟁사 분석 API
- `POST /api/competitor/search`: 경쟁사 검색
- `POST /api/competitor/just-analyze`: 경쟁사 리뷰 분석
- `POST /api/competitor/compare`: 내 매장과 경쟁사 비교 분석
- `GET /api/competitor/comparison/{comparison_id}`: 특정 비교 분석 결과 조회
- `GET /api/competitor/comparisons/{store_id}`: 매장의 모든 비교 분석 결과 목록 조회
- `POST /api/competitor/analyze`: 원클릭 경쟁사 분석 및 비교

### 6. 상권 분석 API
- `GET /api/area/all`: 모든 인구 통계 데이터 조회
- `GET /api/area/{dong_name}`: 특정 동의 인구 통계 데이터 조회

### 7. SWOT 종합 분석 보고서 API
- `GET /api/final-reports/list/{store_id}`: 매장의 모든 SWOT 분석 보고서 목록 조회
- `GET /api/final-reports/{report_id}`: 특정 SWOT 분석 보고서 상세 조회
- `POST /api/final-reports`: 종합 SWOT 분석 보고서 생성

### 8. 파일 관리 API
- `POST /api/s3/upload`: 파일 업로드
- `GET /api/s3/url`: 파일 다운로드 URL 생성
- `DELETE /api/s3/delete`: 파일 삭제
- `GET /api/s3/test-connection`: S3 연결 테스트

### 9. 데이터소스 관리 API
- `GET /api/data/datasources`: 데이터소스 목록 조회
- `GET /api/data/datasources/{source_id}`: 특정 데이터소스 정보 조회
- `GET /api/data/analysis`: 분석 결과 목록 조회
- `GET /api/data/analysis/{analysis_id}`: 특정 분석 결과 조회
- `GET /api/data/datasources/{source_id}/download-url`: 데이터소스 파일 다운로드 URL 생성

## 설치 및 설정 방법

### 1. 사전 요구사항
- Python 3.11 이상
- Chrome 브라우저 (Selenium용)
- AWS S3 버킷 및 액세스 키
- 네이버 API 개발자 계정 및 API 키

### 2. 설치 과정

1. 저장소 클론
   ```bash
   git clone https://github.com/yourusername/small-business-analytics.git
   cd small-business-analytics
   ```

2. 가상환경 생성 및 활성화
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. 필요 패키지 설치
   ```bash
   pip install -r requirements.txt
   ```

4. Chrome 웹드라이버 설치
   ```bash
   # Linux
   apt-get update
   apt-get install -y chromium-driver
   
   # Mac (Homebrew 사용)
   brew install --cask chromedriver
   
   # Windows
   # Chrome 버전에 맞는 웹드라이버를 다운로드하여 PATH에 추가
   ```

5. 환경 변수 설정
   ```
   # ./config/.env 파일 생성 후 다음 환경 변수 설정
   
   # 데이터베이스 설정
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=small_business_db
   DB_USER=username
   DB_PASSWORD=password
   
   # AWS S3 설정
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=ap-northeast-2
   S3_BUCKET_NAME=your-bucket-name
   
   # 네이버 API 설정
   NAVER_CLIENT_ID=your_naver_client_id
   NAVER_CLIENT_SECRET=your_naver_client_secret
   
   # 기타 설정
   LOG_LEVEL=INFO
   SECRET_KEY=your_secret_key_for_jwt
   ```

6. 데이터베이스 초기화
   ```bash
   alembic upgrade head
   ```

7. 서버 실행
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

8. API 문서 확인
   - 브라우저에서 `http://localhost:8000/docs` 접속


## 서비스 컴포넌트 상세

### SimpleStoreService

매장 정보를 검색하고 등록하는 서비스입니다. 네이버 API를 사용하여 매장을 검색하고, Selenium을 활용하여 place_id를 추출하는 기능을 제공합니다.

주요 메서드:
- `register_store_by_name(user_id, store_name, pos_type)`: 가게 이름으로 검색하여 DB에 등록
- `get_store(store_id, user_id)`: DB에서 가게 정보 조회
- `_search_naver_store(query)`: 네이버 지역 검색 API를 사용하여 가게 검색
- `_extract_naver_place_id(url)`: 네이버 지도 URL에서 place_id 추출
- `_get_place_id_with_selenium(query)`: Selenium을 사용하여 place_id 추출
- `_clean_text(text)`: HTML 태그 및 특수문자 제거
- `_save_store_to_db(user_id, store_info, pos_type)`: 가게 정보를 DB에 저장

### DataAnalysisService

데이터 분석을 수행하는 서비스입니다. EDA, 예측 분석, 클러스터링 등의 기능을 제공합니다.

주요 기능:
- 데이터 로드 및 전처리
- 탐색적 데이터 분석(EDA) 수행
- 시계열 예측 모델 생성 및 예측
- 상품 및 고객 클러스터링
- 분석 결과 시각화 및 저장

### ReviewAnalysisService

리뷰 데이터를 수집하고 분석하는 서비스입니다.

주요 기능:
- 네이버 플레이스 리뷰 크롤링
- 감성 분석 (긍정/부정/중립)
- 키워드 추출 및 토픽 모델링
- 리뷰 트렌드 분석
- 인사이트 생성

### CompetitorAnalysisService

경쟁사를 검색하고 리뷰를 비교 분석하는 서비스입니다.

주요 기능:
- 경쟁사 검색 및 정보 추출
- 경쟁사 리뷰 수집 및 분석
- 내 매장과 경쟁사 리뷰 비교 분석
- 차별화 포인트 식별 및 전략 제안

### FinalReportService

종합 SWOT 분석 보고서를 생성하는 서비스입니다.

주요 기능:
- 모든 분석 데이터 통합
- SWOT 매트릭스 생성
- 맞춤형 전략 및 실행 계획 제안
- 경영자를 위한 시각화 보고서 생성

### S3StorageService

AWS S3를 활용하여 파일을 관리하는 서비스입니다.

주요 기능:
- 파일 업로드
- 다운로드 URL 생성
- 파일 삭제
- 연결 테스트

## 사용 예시

### 1. 매장 등록

```python
# 매장 등록 API 호출 예시
import requests

response = requests.post(
    "http://localhost:8000/api/store/register",
    json={
        "user_id": 1,
        "store_name": "카페 이름",
        "pos_type": "키움"
    }
)

result = response.json()
store_id = result["store_id"]
print(f"매장 등록 완료! Store ID: {store_id}")
```

### 2. 데이터 파일 업로드

```python
# 데이터 파일 업로드 예시
import requests

files = {'file': open('sales_data.csv', 'rb')}
data = {
    'store_id': 1,
    'start_month': '2023-01',
    'end_month': '2023-12'
}

response = requests.post(
    "http://localhost:8000/api/s3/upload",
    files=files,
    data=data
)

result = response.json()
source_id = result["source_id"]
print(f"파일 업로드 완료! Source ID: {source_id}")
```

### 3. 종합 분석 수행

```python
# 종합 분석 요청 예시
import requests

response = requests.post(
    "http://localhost:8000/api/eda/analyze/combined",
    json={
        "store_id": 1,
        "source_ids": ["source_id_1", "source_id_2"],
        "pos_type": "키움"
    }
)

result = response.json()
analysis_id = result["analysis_id"]
print(f"분석 요청 완료! Analysis ID: {analysis_id}")
```

### 4. 분석 결과 조회

```python
# 분석 결과 조회 예시
import requests

response = requests.get(
    f"http://localhost:8000/api/eda/results/{analysis_id}"
)

result = response.json()
print("분석 결과 요약:")
print(result["summary"])
```

### 5. 리뷰 분석

```python
# 리뷰 분석 요청 예시
import requests

response = requests.post(
    "http://localhost:8000/api/reviews/analyze",
    json={
        "store_id": 1,
        "place_id": "네이버_플레이스_ID"
    }
)

result = response.json()
analysis_id = result["analysis_id"]
print(f"리뷰 분석 요청 완료! Analysis ID: {analysis_id}")
```

### 6. SWOT 보고서 생성

```python
# SWOT 보고서 생성 요청 예시
import requests

response = requests.post(
    "http://localhost:8000/api/final-reports",
    json={
        "store_id": 1
    }
)

result = response.json()
report_id = result["report_id"]
print(f"SWOT 보고서 생성 완료! Report ID: {report_id}")
```

### 7. AI 채팅

```python
# AI 채팅 요청 예시
import requests

response = requests.post(
    "http://localhost:8000/api/chat",
    json={
        "user_id": 1,
        "message": "지난 달 대비 매출이 어떻게 변했나요?",
        "store_id": 1
    }
)

result = response.json()
print(f"AI 응답: {result['bot_message']}")
```
