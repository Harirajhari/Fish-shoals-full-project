from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str

class PredictionRequest(BaseModel):
    location: str
    date: str


class PredictionRequest2(BaseModel):
    location: str
    date: str
    site: str
