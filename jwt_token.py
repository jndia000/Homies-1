# Import Packages
from fastapi import Cookie, HTTPException
from datetime import datetime, timedelta
from typing import Dict, Optional
from jose import JWTError, jwt
from pydantic import BaseModel


# Token Data
class TokenData(BaseModel):
    user_id: str
    employee_id: str
    roles: Dict[str,str]


# Constants
SECRET_KEY = "e8b1be77208bc8a2ebcb7e5b7067baa7dc90449d5a2f4ded268e159cf43d1227c86b513c7d3112308da7861c0827c7f8d2c0951c6517f48969583826ca7f3c51"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 12400


# Generate Token
def generate_token(data: dict, remember: bool, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if remember:
        expires_delta = 31536000

    if expires_delta:
        expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)


# Verify Token
def verify_token(token: str):
    credentials_exception = HTTPException(
        status_code = 401,
        detail = "Invalid credentials",
        headers = {"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        employee_id: str = payload.get("employee_id")
        roles: str = payload.get("roles")
        if not user_id or not roles:
            raise credentials_exception
        return TokenData(
            user_id = user_id,
            employee_id = employee_id,
            roles = roles
        )
    except JWTError:
        print(JWTError)
        raise credentials_exception


# Get Token
def get_token(access_token: str = Cookie('access_token')):
    try:
        user = jwt.decode(access_token, SECRET_KEY)
        if user:
            return user
        else:
            raise HTTPException(status_code = 401, detail = "Invalid token")
    except JWTError:
        raise HTTPException(status_code = 401, detail = "Please login first")