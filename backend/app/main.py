from fastapi import FastAPI, HTTPException
from app.database import test_database_connection


app = FastAPI(
    title="Placement Tracker API",
    description="Backend API for college placement tracking",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Placement Tracker API is running"
    }


@app.get("/health")
def health_check():
    if not test_database_connection():
        raise HTTPException(
            status_code=503,
            detail="Database connection failed"
        )

    return {
        "status": "ok"
    }