# Import Packages
from fastapi import Depends
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt_token import verify_token


# OAuth2 Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "api/auth/login")


# Get User
def get_user(token: str = Depends(oauth2_scheme)):
    return verify_token(token)


# Check Priviledge
def authorized(user_data, user_type: str):
    if user_type not in user_data.roles:
        raise HTTPException(
            status_code = 401,
            detail = "Unauthorized",
            headers = {"WWW-Authenticate": "Bearer"}
        )
    else:
        return True