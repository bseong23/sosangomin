from fastapi import APIRouter, HTTPException, Path, Depends
from sqlalchemy.orm import Session
from database.connector import database_instance as mariadb
from db_models import Population
from typing import List
import logging
from database import get_db

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/area",
    tags=["상권 분석"],
    responses={404: {"description": "찾을 수 없음"}},
)

# 전체 population 데이터 조회
@router.get("/all", response_model=List[dict])
async def get_all_population():
    try:
        db: Session = mariadb.pre_session()
        results = db.query(Population).all()

        if not results:
            raise HTTPException(status_code=404, detail="인구 데이터가 없습니다.")

        return [row.__dict__ for row in results]  # SQLAlchemy 객체를 딕셔너리로 변환

    except Exception as e:
        logger.error(f"인구 전체 조회 실패: {e}")
        raise HTTPException(status_code=500, detail="인구 데이터를 불러오는 중 오류 발생")
    finally:
        db.close()

# 특정 동의 인구 정보 조회
@router.get("/{dong_name}", response_model=dict)
async def get_population_by_dong(
    dong_name: str = Path(..., description="조회할 동 이름")
):
    try:
        db: Session = mariadb.pre_session()
        result = db.query(Population).filter(Population.dong_name == dong_name).first()

        if not result:
            raise HTTPException(status_code=404, detail=f"{dong_name}에 대한 인구 데이터가 없습니다.")

        return result.__dict__

    except Exception as e:
        logger.error(f"[오류] {dong_name} 인구 조회 실패: {e}")
        raise HTTPException(status_code=500, detail="인구 데이터를 불러오는 중 오류 발생")
    finally:
        db.close()

@router.get("/resident-only")
def get_resident_data(db: Session = Depends(get_db)):
    # 상주 인구 관련 데이터만 조회
    repop_columns = [
        col for col in Population.__table__.columns
        if "repop" in col.name
    ]

    # dong_name도 추가로 포함
    repop_columns.insert(0, Population.dong_name)

    # 쿼리 실행
    result = db.query(*repop_columns).filter(Population.tot_repop != None).all()

    return result

@router.get("/working-only")
def get_working_data(db: Session = Depends(get_db)):
    # 직장 인구 관련 데이터만 조회
    wrpop_columns = [
        col for col in Population.__table__.columns
        if "wrpop" in col.name
    ]

    # dong_name도 추가로 포함
    wrpop_columns.insert(0, Population.dong_name)

    # 쿼리 실행
    result = db.query(*wrpop_columns).filter(Population.tot_wrpop != None).all()

    return result

@router.get("/floating-only")
def get_floating_data(db: Session = Depends(get_db)):
    # 유동 인구 관련 데이터만 조회
    fpop_columns = [
        col for col in Population.__table__.columns
        if "fpop" in col.name
    ]

    # dong_name도 추가로 포함
    fpop_columns.insert(0, Population.dong_name)

    # 쿼리 실행
    result = db.query(*fpop_columns).filter(Population.tot_fpop != None).all()

    return result
