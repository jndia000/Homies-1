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
template = Jinja2Templates(directory = "app/public/home/views")


# Router
router = APIRouter(tags = ["Authentication Web Route"])


# Home Page
@router.get("/")
def home(req: Request):
    return template.TemplateResponse("content/home.html", {
        "request": req,
        "page_title": "Welcome to HOMIES!"
    })


# Login Page
@router.get("/login")
def home(req: Request):
    return template.TemplateResponse("content/login.html", {
        "request": req,
        "page_title": "Login"
    })