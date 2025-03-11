# test_eda.py

import pandas as pd
import json
import os
from datetime import datetime
import asyncio

# 필요한 폴더 생성
os.makedirs("temp_files", exist_ok=True)

# EDA 서비스 import
from services.automl import preprocess_data

# 테스트 파일 경로
TEST_FILE_PATH = 'test_data/상품.xlsx'

def generate_chart_data(df):
    """Chart.js에 적합한 데이터 구조 생성"""
    chart_data = {}
    
    # 1. 기본 통계량 계산
    total_sales = df['총매출'].sum() if '총매출' in df.columns else 0
    avg_transaction = df['총매출'].mean() if '총매출' in df.columns else 0
    total_transactions = len(df)
    unique_products = df['상품 명칭'].nunique() if '상품 명칭' in df.columns else 0
    
    # 기본 통계량
    chart_data["basic_stats"] = {
        "total_sales": float(total_sales),
        "avg_transaction": float(avg_transaction),
        "total_transactions": total_transactions,
        "unique_products": unique_products
    }
    
    # 2. 요일별 매출
    if '요일' in df.columns and '총매출' in df.columns:
        weekday_sales_dict = df.groupby('요일')['총매출'].sum().to_dict()
        chart_data["weekday_sales"] = weekday_sales_dict
    
    # 3. 시간대별 매출
    if '시간대' in df.columns and '총매출' in df.columns:
        time_period_dict = df.groupby('시간대')['총매출'].sum().to_dict()
        chart_data["time_period_sales"] = time_period_dict
    
    # 4. 시간별 매출
    if '시' in df.columns and '총매출' in df.columns:
        hourly_dict = df.groupby('시')['총매출'].sum().to_dict()
        chart_data["hourly_sales"] = {str(k): float(v) for k, v in hourly_dict.items()}
    
    # 5. 상위 상품
    if '상품 명칭' in df.columns and '총매출' in df.columns:
        top_products_dict = df.groupby('상품 명칭')['총매출'].sum().sort_values(ascending=False).head(5).to_dict()
        chart_data["top_products"] = top_products_dict
    
    # 6. 평일/휴일 매출
    if '공휴일' in df.columns and '총매출' in df.columns:
        holiday_dict = df.groupby('공휴일')['총매출'].sum().to_dict()
        chart_data["holiday_sales"] = holiday_dict
    
    # 7. 계절별 매출
    if '계절' in df.columns and '총매출' in df.columns:
        season_dict = df.groupby('계절')['총매출'].sum().to_dict()
        chart_data["season_sales"] = season_dict
    
    # 8. 일자별 매출
    if all(col in df.columns for col in ['년', '월', '일']) and '총매출' in df.columns:
        try:
            df['날짜'] = pd.to_datetime(df[['년', '월', '일']])
            daily_dict = df.groupby(df['날짜'].dt.date)['총매출'].sum().to_dict()
            chart_data["daily_sales"] = {str(k): float(v) for k, v in daily_dict.items()}
        except:
            # 날짜 변환 실패 시 무시
            pass
    
    # 9. 고객당 평균 매출
    if '고객 수' in df.columns and '총매출' in df.columns and df['고객 수'].sum() > 0:
        customer_avg = df['총매출'].sum() / df['고객 수'].sum()
        chart_data["basic_stats"]["customer_avg"] = float(customer_avg)
        
    return chart_data

async def test_eda_analysis():
    print("===== EDA 분석 테스트 시작 =====")
    print(f"테스트 파일: {TEST_FILE_PATH}")
    
    try:
        # 1. 파일 읽기
        print("\n[1] 파일 읽기")
        try:
            df = pd.read_excel(TEST_FILE_PATH, header=2)
            print(f"파일 성공적으로 로드됨: {df.shape} 형태의 데이터")
            print(f"첫 5개 행:")
            print(df.head())
        except Exception as e:
            print(f"파일 읽기 오류: {str(e)}")
            return
        
        # 2. 데이터 전처리
        print("\n[2] 데이터 전처리")
        try:
            processed_df = preprocess_data(df)
            print(f"전처리 완료: {processed_df.shape} 형태의 데이터")
            print(f"컬럼 목록: {processed_df.columns.tolist()}")
            print(f"전처리된 첫 5개 행:")
            print(processed_df.head())
        except Exception as e:
            print(f"전처리 오류: {str(e)}")
            return
        
        # 3. 차트 데이터 생성
        print("\n[3] 차트 데이터 생성")
        try:
            chart_data = generate_chart_data(processed_df)
            print("차트 데이터 생성 완료")
            
            # 차트 유형별 데이터 출력
            for chart_type, data in chart_data.items():
                print(f"\n{chart_type}:")
                if isinstance(data, dict):
                    if len(data) > 10:  # 데이터가 많은 경우 일부만 표시
                        print(json.dumps({k: data[k] for k in list(data.keys())[:5]}, 
                                        ensure_ascii=False, indent=2))
                        print(f"... 외 {len(data) - 5}개 항목")
                    else:
                        print(json.dumps(data, ensure_ascii=False, indent=2))
                else:
                    print(data)
        except Exception as e:
            print(f"차트 데이터 생성 오류: {str(e)}")
            return
        
        # 4. JSON 직렬화 테스트
        print("\n[4] JSON 직렬화 테스트")
        try:
            json_str = json.dumps(chart_data, ensure_ascii=False)
            print("JSON 직렬화 성공")
            print(f"JSON 데이터 크기: {len(json_str)} 바이트")
        except Exception as e:
            print(f"JSON 직렬화 오류: {str(e)}")
            return
        
        # 5. 결과 파일 저장
        print("\n[5] 결과 파일 저장")
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            result_file = f"eda_result_{timestamp}.json"
            
            with open(result_file, "w", encoding="utf-8") as f:
                json.dump(chart_data, f, ensure_ascii=False, indent=2)
            
            print(f"결과 파일 저장 완료: {result_file}")
        except Exception as e:
            print(f"결과 파일 저장 오류: {str(e)}")
            return
        
        print("\n===== EDA 분석 테스트 완료 =====")
        print(f"모든 테스트가 성공적으로 완료되었습니다. 결과는 {result_file}에 저장되었습니다.")
        
    except Exception as e:
        print(f"테스트 중 예기치 않은 오류 발생: {str(e)}")

if __name__ == "__main__":
    # asyncio 이벤트 루프 실행
    asyncio.run(test_eda_analysis())