# Import Packages
from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from jwt_token import get_token


# Import Templates
from fastapi.templating import Jinja2Templates


# Template
template = Jinja2Templates(directory = "app/internal/home/views")


# Router
router = APIRouter(prefix = "/home", tags = ["Home Web Routes"])


# 404: Page Not Found
def page_not_found(req: Request):
    return template.TemplateResponse("404.html", {
        "request": req,
        "page_title": "404 Page Not Found"
    })

# ===========================================================
# WEB ROUTES
# ===========================================================

# Main Dashboard
@router.get("", response_class=HTMLResponse)
def render(
    req: Request, 
    # user_data: dict = Depends(get_token)
):
    # if user_data:
        return template.TemplateResponse("content/main_dashboard.html", {
            "request": req,
            "page_title": "Main Dashboard",
            "sub_title": "Manage your tasks and activities here using this dashboard",
            "active_navlink": "Main Dashboard"
        })
    # else:
    #     return page_not_found(req)