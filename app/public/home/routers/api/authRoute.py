# Import Packages
from jwt_token import generate_token
from fastapi import APIRouter, Depends, Response, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from hashing import Hash


# Import Models
from models import *


# Router Instance
router = APIRouter(prefix = "/api/auth", tags = ["Authentication API"])


# Login
@router.post("/login")
def login(
    remember: bool,
    res: Response, 
    req: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    
    # Get user credentials
    user_credentials = db.query(InternalUser).filter(
        InternalUser.email == req.username
    ).join(UserRole).filter(
        UserRole.user_id == InternalUser.id
    ).join(Role).filter(
        UserRole.role_id == Role.id
    ).first()

    # For Inavlid Login Details
    ACCESS_DENIED_MESSAGE = {"authorized": False, "message": "Incorrect credentials"}

    # Check if user is existing in database
    if not user_credentials:
        return ACCESS_DENIED_MESSAGE

    # Check is user password is matched in database
    if not Hash.verify(req.password, user_credentials.password):
        return ACCESS_DENIED_MESSAGE

    # If no error, setup cookies and access tokens for giving user previledge
    
    # Format
    # roles = {
    #     "Subsystem1": "role1",
    #     "Subsystem2": "role1",
    #     "SubsystemN": "role1"
    # }
    
    # Get Roles
    roles = {}
    for user_role in user_credentials.roles:
        key = user_role.role.subsystem
        val = user_role.role.name

        roles[key] = val

    # Setup token data
    token_data = { 
        "user_id": user_credentials.id, 
        "roles": roles
    }

    # Setup access token
    access_token = generate_token(data = token_data, remember=remember)

    res.set_cookie(key = "access_token", value = access_token, httponly = True, max_age = 31536000 if remember else None)
    res.set_cookie(key = "roles", value = roles, httponly = True)
    
    return { 
        "authorized": True, 
        "access_token": access_token, 
        "token_type": "bearer" 
    }


# Logout
@router.get("/logout")
def logout(res: Response):
    res.delete_cookie("access_token")
    res.delete_cookie("roles")
    return {
        "status": "Success", 
        "message": "Log out is successful"
    }