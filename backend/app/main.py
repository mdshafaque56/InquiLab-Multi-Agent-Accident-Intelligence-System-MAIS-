# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from backend.app.routes import health, detect, risk, alert
# from backend.app.routes import detect

# app.include_router(detect.router)

# app = FastAPI()

# # CORS settings
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Mount routes
# app.include_router(health.router, prefix="/api")
# app.include_router(detect.router)
# app.include_router(risk.router)
# app.include_router(alert.router)

# @app.get("/")
# def root():
#     return {"status": "InquiLab Backend Running 🚀"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes import health, detect, risk, alert

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(health.router, prefix="/api")
app.include_router(detect.router)
app.include_router(risk.router, prefix="/api")
app.include_router(alert.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "InquiLab Backend Running 🚀"}
