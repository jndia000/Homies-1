# Import Packages
from typing import Optional
from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from fastapi.responses import HTMLResponse
from jwt_token import get_token
from sqlalchemy.orm import Session
from database import get_db
from fastapi.templating import Jinja2Templates


# Template
template = Jinja2Templates(directory = "app/internal/human_resource/recruitment/views")


# Router
router = APIRouter(prefix="/recruitment/h")


def isAuthorized(user_data):
    userRoles = user_data["roles"]
    return "Recruitment" in userRoles and userRoles["Recruitment"] == "Hiring Manager"


# Redirect
@router.get("/")
def home(req: Request, user_data: dict = Depends(get_token)):
    if(isAuthorized(user_data)):
        return RedirectResponse("/internal/recruitment/h/dashboard")
    return "page not found"


# Dashboard
@router.get("/dashboard")
def home(req: Request, user_data: dict = Depends(get_token)):
    if(isAuthorized(user_data)):
        return template.TemplateResponse("content/hire_mngr/dashboard.html", {
            "request": req,
            "page_title": "Welcome to HOMIES!"
        })
    return "page not found"
