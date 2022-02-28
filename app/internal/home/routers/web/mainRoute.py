# Import Packages
from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from jwt_token import get_token


# Import Templates
from fastapi.templating import Jinja2Templates


# Template
template = Jinja2Templates(directory = "app/internal/home/views")


# Router
router = APIRouter()

# ===========================================================
# WEB ROUTES
# ===========================================================


# Redirect
@router.get("/")
def redirect(req: Request, user_data: dict = Depends(get_token)):
    if user_data:
        return RedirectResponse("/internal/home")
    return "page not found"


# Main Dashboard
@router.get("/home", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):
    if user_data:
        return template.TemplateResponse("content/main_dashboard.html", {
            "request": req,
            "page_title": "Main Dashboard",
            "sub_title": "Manage your tasks and activities here using this dashboard",
            "active_navlink": "Main Dashboard"
        })
    return "page not found"