# routers/data_router.py

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging
from bson import ObjectId
from datetime import datetime

from database.mongo_connector import mongo_instance

# 로거 설정
logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(
    prefix="/api/data",
    tags=["데이터 관리"],
    responses={404: {"description": "찾을 수 없음"}},
)

@router.get("/datasources")
async def list_datasources(
    store_id: Optional[int] = Query(None, description="특정 상점의 데이터만 조회")
):
    """
    데이터소스 목록을 조회.
    """
    try:
        data_sources = mongo_instance.get_collection("DataSources")
        
        filter_query = {}
        if store_id is not None:
            filter_query["store_id"] = store_id
        
        cursor = data_sources.find(filter_query).sort("upload_date", -1)
        
        sources = []
        for source in cursor:
            source["_id"] = str(source["_id"])
            sources.append(source)
        
        return {
            "status": "success",
            "count": len(sources),
            "datasources": sources
        }
    
    except Exception as e:
        logger.error(f"데이터소스 목록 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"데이터소스 목록 조회 중 오류가 발생했습니다: {str(e)}")

@router.get("/datasources/{source_id}")
async def get_datasource(source_id: str):
    """
    특정 데이터소스 정보를 조회.
    """
    try:
        try:
            obj_id = ObjectId(source_id)
        except:
            raise HTTPException(status_code=400, detail="유효하지 않은 데이터소스 ID입니다.")
            
        data_sources = mongo_instance.get_collection("DataSources")
        source = data_sources.find_one({"_id": obj_id})
        
        if not source:
            raise HTTPException(status_code=404, detail=f"ID가 {source_id}인 데이터소스를 찾을 수 없습니다.")
        
        source["_id"] = str(source["_id"])
        
        return {
            "status": "success",
            "datasource": source
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"데이터소스 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"데이터소스 조회 중 오류가 발생했습니다: {str(e)}")
    
@router.get("/analysis")
async def list_analysis_results(
    source_id: Optional[str] = Query(None, description="특정 데이터소스의 분석 결과만 조회")
):
    """
    분석 결과 목록을 조회.
    """
    try:
        analysis_results = mongo_instance.get_collection("AnalysisResults")
        
        filter_query = {}
        if source_id:
            try:
                filter_query["source_id"] = ObjectId(source_id)
            except:
                raise HTTPException(status_code=400, detail="유효하지 않은 데이터소스 ID입니다.")
        
        cursor = analysis_results.find(filter_query).sort("created_at", -1)
        
        results = []
        for result in cursor:
            result["_id"] = str(result["_id"])
            result["source_id"] = str(result["source_id"])
            results.append(result)
        
        return {
            "status": "success",
            "count": len(results),
            "analysis_results": results
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"분석 결과 목록 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"분석 결과 목록 조회 중 오류가 발생했습니다: {str(e)}")

@router.get("/analysis/{analysis_id}")
async def get_analysis_result(analysis_id: str):
    """
    특정 분석 결과를 조회.
    """
    try:
        try:
            obj_id = ObjectId(analysis_id)
        except:
            raise HTTPException(status_code=400, detail="유효하지 않은 분석 결과 ID입니다.")
            
        analysis_results = mongo_instance.get_collection("AnalysisResults")
        result = analysis_results.find_one({"_id": obj_id})
        
        if not result:
            raise HTTPException(status_code=404, detail=f"ID가 {analysis_id}인 분석 결과를 찾을 수 없습니다.")
        
        result["_id"] = str(result["_id"])
        result["source_id"] = str(result["source_id"])
        
        return {
            "status": "success",
            "analysis_result": result
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"분석 결과 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"분석 결과 조회 중 오류가 발생했습니다: {str(e)}")
    
@router.get("/datasources/{source_id}/download-url")
async def get_datasource_download_url(
    source_id: str,
    expiration: int = Query(3600, description="URL 만료 시간(초)")
):
    """
    특정 데이터소스의 파일에 접근하기 위한 다운로드 URL을 생성.
    """
    try:
        try:
            obj_id = ObjectId(source_id)
        except:
            raise HTTPException(status_code=400, detail="유효하지 않은 데이터소스 ID입니다.")
            
        data_sources = mongo_instance.get_collection("DataSources")
        source = data_sources.find_one({"_id": obj_id})
        
        if not source:
            raise HTTPException(status_code=404, detail=f"ID가 {source_id}인 데이터소스를 찾을 수 없습니다.")
        
        s3_key = source.get("file_path")
        if not s3_key:
            raise HTTPException(status_code=404, detail="파일 경로 정보가 없습니다.")
        
        from services.s3_service import get_s3_presigned_url
        url = get_s3_presigned_url(s3_key, expiration)
        
        data_sources.update_one(
            {"_id": obj_id},
            {"$set": {"last_accessed": datetime.now()}}
        )
        
        return {
            "status": "success",
            "source_id": source_id,
            "source_name": source.get("source_name"),
            "original_filename": source.get("original_filename"),
            "download_url": url,
            "expires_in": expiration
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"다운로드 URL 생성 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"다운로드 URL 생성 중 오류가 발생했습니다: {str(e)}")