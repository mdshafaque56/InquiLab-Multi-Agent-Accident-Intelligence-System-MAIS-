# backend/app/routes/health.py
from fastapi import APIRouter

router = APIRouter(tags=["Health Check"])

@router.get("/health")
async def health():
    return {"status": "ok", "message": "InquiLab API is healthy"}
