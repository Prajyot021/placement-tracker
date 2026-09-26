from fastapi import FastAPI

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