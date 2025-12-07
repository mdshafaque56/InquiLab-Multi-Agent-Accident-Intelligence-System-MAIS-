# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes import health, detect, risk, alert, incidents, metrics, arvt
from backend.app.routes import metrics

app = FastAPI(title="InquiLab Accident Intelligence", version="1.0.0")
app.include_router(arvt.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mount routers
app.include_router(health.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(alert.router)
app.include_router(detect.router)

@app.get("/")
def root():
    return {"status": "InquiLab Backend Running 🚀"}
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Serve /frontend directory at root "/"
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

# Optional explicit route for arvt.html
@app.get("/arvt")
async def arvt_page():
    return FileResponse("frontend/arvt.html")

# Optional explicit route for dashboard.html
@app.get("/dashboard")
async def dashboard_page():
    return FileResponse("frontend/dashboard.html")
