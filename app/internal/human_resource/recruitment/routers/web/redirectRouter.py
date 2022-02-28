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
template = Jinja2Templates(directory = "app/internal/human_resource/views")


# Router
router = APIRouter(prefix="/recruitment")


# ===========================================================
# WEB ROUTES
# ===========================================================

# Redirect
@router.get("/")
def home(req: Request, user_data: dict = Depends(get_token)):
    redirectPath = {
        "Department Head"   : "/dh",
        "Department Manager": "/dm",
        "Hiring Manager"    : "/h",
        "Talent Recruiter"  : "/r",
    }

    userRoles = user_data["roles"]

    if "Recruitment" not in userRoles and userRoles["Recruitment"] not in redirectPath:
        return "page not found (2)"

    return RedirectResponse("/internal/recruitment" + redirectPath[userRoles["Recruitment"]])
