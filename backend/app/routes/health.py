"""
Health-check route.

GET /api/health → HealthResponse
"""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas.prediction import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse, summary="API health check")
async def health_check() -> HealthResponse:
    """
    Return a simple liveness signal confirming the API is running.

    Returns
    -------
    HealthResponse
        ``status="ok"``, API version, and current UTC timestamp.
    """
    return HealthResponse(
        status="ok",
        version="1.0.0",
        timestamp=datetime.now(tz=timezone.utc).isoformat(),
    )
