# Import Packages
from fastapi import Depends
from typing import Dict
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt_token import verify_token
from pydantic import BaseModel


class UserData(BaseModel):
    user_id: str
    employee_id: str
    roles: Dict[str, str]


# OAuth2 Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "api/auth/login")


# Get User
def get_user(token: str = Depends(oauth2_scheme)):
    return verify_token(token)


# If Authorized
def isAuthorized(user_data, subsystem: str, role: str):
    if subsystem in user_data.roles and user_data.roles[subsystem] == role:
        return True
    raise HTTPException(
        status_code = 401,
        detail = "Unauthorized",
        headers = {"WWW-Authenticate": "Bearer"}
    )


# Has Access
def hasAccess(user_data, subsystem: str, role: str):
    return subsystem in user_data["roles"] and user_data["roles"][subsystem] == role