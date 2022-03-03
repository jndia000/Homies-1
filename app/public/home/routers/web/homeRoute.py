# Import Packages
from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


# Template
template = Jinja2Templates(directory = "app/public/home/views")


# Router
router = APIRouter()


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
