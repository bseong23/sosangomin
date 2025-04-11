# services/s3_service.py

import boto3
from botocore.exceptions import ClientError
import uuid
from datetime import datetime
import os
from fastapi import UploadFile, HTTPException
from dotenv import load_dotenv
from boto3.s3.transfer import TransferConfig

# 환경변수 로드
load_dotenv()

# S3 설정 정보
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-2")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# S3 클라 초기화
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)



# 파일 업로드
async def upload_file_to_s3(file: UploadFile, store_id: int) -> str:
    try:
        
        unique_id = str(uuid.uuid4())
        safe_filename = file.filename.replace(" ","_")

        s3_key = f"store_{store_id}/{unique_id}_{safe_filename}"

        s3_client.upload_fileobj(
            file.file,
            S3_BUCKET_NAME,
            s3_key
        )
        
        return s3_key
    
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"S3 upload error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# 사전 서명 URL 생성
def get_s3_presigned_url(s3_key: str, expiration: int = 3600) -> str:
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': S3_BUCKET_NAME,
                'Key': s3_key
            },
            ExpiresIn=expiration
        )
        return url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate URL: {str(e)}")

async def download_file_from_s3(s3_key: str, local_path: str) -> str:
    try:
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        
        config = TransferConfig(
            multipart_threshold=1 * 1024 * 1024,  
            max_concurrency=10,
            multipart_chunksize=1 * 1024 * 1024,  
            use_threads=True
        )
        
        s3_client.download_file(
            S3_BUCKET_NAME,
            s3_key,
            local_path,
            Config=config
        )
        
        if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
            return local_path
        else:
            raise Exception("Downloaded file is empty or does not exist")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 download error: {str(e)}")

# 파일 삭제
def delete_file_from_s3(s3_key: str) -> bool:
    try:
        s3_client.delete_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key
        )
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 delete error: {str(e)}")

# 테스트
def test_s3_connection():
    try:
        response = s3_client.list_buckets()
        return {
            "status": "success",
            "message": "S3 connection successful",
            "buckets": [bucket['Name'] for bucket in response['Buckets']]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 connection failed: {str(e)}")