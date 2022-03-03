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

# Import Submodule files
from app.internal.human_resource.rms.routers.web \
    import errPages_templates as errTemplate


# Template
template = Jinja2Templates(directory = "app/internal/human_resource/rms/views")


# Router
router = APIRouter(prefix = "/dh")


# Templates Path
TEMPLATES_PATH = "/pages/department_head/"


# Authorization
AUTHORIZED_SUBSYSTEM = "Recruitment"
AUTHORIZED_ROLE = "Department Head"


# Redirect Root
REDIRECT_ROOT = "/rms/dh/"


# ===========================================================
# WEB ROUTES
# ===========================================================


# Redirect if url is blank
@router.get("", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):

    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # If authorized, return template response
    return RedirectResponse(f"{REDIRECT_ROOT}dashboard")


# Department Head Dashboard
@router.get("/dashboard", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):

    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # If authorized, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "dashboard.html", {
        "request": req,
        "page_title": "Dashboard",
        "sub_title": "Manage your tasks and activities here using this dashboard",
        "active_navlink": "Dashboard"
    })


# ===========================================================
# MANPOWER REQUESTS
# ===========================================================


# Manpower Requests
@router.get("/manpower-requests", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):

    # If user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # If authorized, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "manpower_requests.html", {
        "request": req,
        "page_title": "Manpower Requests",
        "sub_title": "Manpower Requests to manage requests for employees",
        "active_navlink": "Manpower Requests"
    })


# Manpower Request Details
@router.get("/manpower-requests/{manpower_request_id}", response_class=HTMLResponse)
def render(
    manpower_request_id: str,
    req: Request, 
    db: Session = Depends(get_db), 
    user_data: dict = Depends(get_token)
):
    # If user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # If manpower request not exist in database
    manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id).first()
    if not manpower_request:
        return errTemplate.page_not_found(req)
    
    # If authorized and manpower request exist in database
    return template.TemplateResponse(TEMPLATES_PATH  + "view_manpower_request.html", {
        "request": req,
        "page_title": "Manpower Request Details",
        "sub_title": "View the details of manpower request here",
        "active_navlink": "Manpower Requests"
    })


# ===========================================================
# HIRED APPLICANTS
# ===========================================================


# Hired Applicants
@router.get("/hired-applicants", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    return template.TemplateResponse(TEMPLATES_PATH  + "hired_applicants.html", {
        "request": req,
        "page_title": "Hired Applicants",
        "sub_title": "Hired Applicants",
        "active_navlink": "Hired Applicants"
    })


# ===========================================================
# ONBOARDING EMPLOYEES
# ===========================================================


# Onboarding Employees
@router.get("/onboarding-employees", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    return template.TemplateResponse(TEMPLATES_PATH + "onboarding_employees.html", {
        "request": req,
        "page_title": "Onboarding Employees",
        "sub_title": "Onboarding Employees to manage new employees on board",
        "active_navlink": "Onboarding Employees"
    })


# ===========================================================
# ONBOARDING EMPLOYEE TASKS
# ===========================================================


# Onboarding Employee Tasks
@router.get("/onboarding-employees/{onboarding_employee_id}/onboarding-tasks", response_class=HTMLResponse)
def render(
    onboarding_employee_id: str, 
    req: Request, 
    db: Session = Depends(get_db), 
    user_data: dict = Depends(get_token)
):
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    user_department = db.query(Department).join(SubDepartment).filter(
        Department.department_id == SubDepartment.department_id
    ).join(Position).filter(
        SubDepartment.sub_department_id == Position.sub_department_id
    ).join(Employee).filter(
        Employee.employee_id == user_data['employee_id'], 
        Employee.position_id == Position.position_id
    ).first()
    
    onboarding_employee = db.query(OnboardingEmployee).filter(
        OnboardingEmployee.onboarding_employee_id == onboarding_employee_id,
        OnboardingEmployee.status == "Onboarding",
    ).join(Position).filter(
        OnboardingEmployee.position_id == Position.position_id
    ).join(SubDepartment).filter(
        SubDepartment.sub_department_id == Position.sub_department_id
    ).join(Department).filter(
        SubDepartment.department_id == Department.department_id, 
        Department.department_id ==  user_department.department_id
    ).first()

    if not onboarding_employee:
        return errTemplate.page_not_found(req)
    else:
        return template.TemplateResponse(TEMPLATES_PATH + "onboarding_employee_tasks.html", {
            "request": req,
            "page_title": "Onboarding Tasks",
            "sub_title": "Manage employee tasks and monitor performance",
            "active_navlink": "Onboarding Employees"
        })