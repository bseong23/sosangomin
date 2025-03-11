from fastapi.testclient import TestClient
from main import app 
from database.mongo_connector import mongo_instance
from bson import ObjectId


client = TestClient(app)


def test_analyze_from_s3_and_check_mongo():
    # Given
    store_id = 1
    source_id = "67cfebcc65dccfd300caf051"  # 실제 존재하는 DataSources의 _id
    analysis_type = "clustering"  # 예시로 군집화

    # When
    response = client.post(
        "/api/data-analysis/analyze-from-s3",
        data={
            "store_id": store_id,
            "source_id": source_id,
            "analysis_type": analysis_type
        }
    )

    # Then
    assert response.status_code == 200  # 요청 성공 확인

    res_json = response.json()
    print("API 응답:", res_json)

    assert res_json["store_id"] == store_id
    assert res_json["source_id"] == source_id
    assert res_json["analysis_type"] == analysis_type
    assert "result" in res_json

    # MongoDB에 저장된 분석 결과 확인
    analysis_results = mongo_instance.get_collection("AnalysisResults")
    saved_result = analysis_results.find_one({
        "source_id": ObjectId(source_id),
        "store_id": store_id,
        "analysis_type": analysis_type
    })

    assert saved_result is not None, "MongoDB에 분석 결과가 저장되지 않았습니다."
    assert saved_result["status"] in ["complete", "fail"]  # 상태 확인
    assert "result" in saved_result  # 결과 포함 확인

    print("MongoDB 저장 데이터:", saved_result)


# 파일로 직접 실행 시 아래 코드 실행
if __name__ == "__main__":
    test_analyze_from_s3_and_check_mongo()
