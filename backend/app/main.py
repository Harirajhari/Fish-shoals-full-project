from fastapi import FastAPI
from .auth import router as auth_router
from .predict import router as predict_router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="Fish Population Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to allowed frontend domains
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(predict_router)

@app.get("/")
def home():
    return {"message": "Welcome to the Fish Population Prediction API"}
