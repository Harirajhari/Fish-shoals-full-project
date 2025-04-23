from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import timedelta
from passlib.context import CryptContext
from .database import load_db, save_db
from .models import UserCreate
from .config import SECRET_KEY, ALGORITHM
from datetime import datetime, timedelta

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(username: str, expires_delta: timedelta = timedelta(hours=1)):
    expire = datetime.utcnow() + expires_delta
    expire_timestamp = int(expire.timestamp())  # Convert to Unix timestamp

    return jwt.encode({"sub": username, "exp": expire_timestamp}, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/signup")
def signup(user: UserCreate):
    db = load_db()
    if any(u["username"] == user.username for u in db["users"]):
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = pwd_context.hash(user.password)
    db["users"].append({"username": user.username, "password": hashed_password})
    save_db(db)
    
    return {"message": "User registered successfully" , hashed_password: hashed_password}

@router.post("/login")
def login(user: UserCreate):
    db = load_db()
    user_data = next((u for u in db["users"] if u["username"] == user.username), None)

    if not user_data or not pwd_context.verify(user.password, user_data["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}
