# Import Packages
from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from jwt_token import get_token
from sqlalchemy.orm import Session
from database import get_db
from oauth2 import hasAccess, isAuthorized, get_user
from fastapi.templating import Jinja2Templates

# Import Models
from models import *



# Template
template = Jinja2Templates(directory = "app/internal/core/mrs/views")


# Router
router = APIRouter(prefix = "/records")

# Redirect if url is blank
@router.get("", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):

    # Check if user is not authorized
    # if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
    #     return errTemplate.page_not_found(req)
    
    # If authorized, return template response
    return RedirectResponse("/mrs/records/dashboard")

# Medical Record Dashboard
@router.get("/dashboard", response_class=HTMLResponse)
def dashboard(req: Request, user_data: dict = Depends(get_token)):

    # Check if user is not authorized
    # if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
    #     return errTemplate.page_not_found(req)
    
    # If authorized, return template response
    return template.TemplateResponse("records/dashboard.html", {
        "request": req
        # "page_title": "Dashboard",
        # "sub_title": "Manage your tasks and activities here using this dashboard",
        # "active_navlink": "Dashboard"
    })

# Patient List (Record)
@router.get("/patients", response_class=HTMLResponse)
def patients(req: Request, user_data: dict = Depends(get_token)):

    return template.TemplateResponse("records/patients/patient_lists.html", {
        "request": req})


# View Record (Record)
@router.get("/patient-record", response_class=HTMLResponse)
def patient_record(req: Request, user_data: dict = Depends(get_token)):

    return template.TemplateResponse("records/patients/patient_records.html", {
        "request": req})


# Record Request (Record)
@router.get("/requests", response_class=HTMLResponse)
def requests(req: Request, user_data: dict = Depends(get_token)):

    return template.TemplateResponse("records/record_requests/record_requests.html", {
        "request": req})

