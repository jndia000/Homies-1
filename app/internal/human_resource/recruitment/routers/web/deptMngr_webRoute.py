# Import Packages
from typing import Optional
from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from starlette.responses import RedirectResponse
from jwt_token import get_token
from sqlalchemy.orm import Session
from database import get_db
from oauth2 import hasAccess
from fastapi.templating import Jinja2Templates


# Import Models
from models import *


# Import Submodule Files
from app.internal.human_resource.recruitment.routers.web \
    import errPages_templates as errTemplate


# Template
template = Jinja2Templates(directory = "app/internal/human_resource/recruitment/views")


# Router
router = APIRouter(prefix = "/dm")


# Templates Path
TEMPLATES_PATH = "/pages/department_manager/"


# Authorization
AUTHORIZED_SUBSYSTEM = "Recruitment"
AUTHORIZED_ROLE = "Department Manager"


# Redirect Root
REDIRECT_ROOT = "/rms/dm"


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

    # If no error, return template response
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

    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # If no error, return template response
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
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # Check if manpower request is not existing in database
    manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id).first()
    if not manpower_request:
        return errTemplate.page_not_found(req)
    
    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH  + "view_manpower_request.html", {
        "request": req,
        "page_title": "Manpower Request Details",
        "sub_title": "View the details of manpower request here",
        "active_navlink": "Manpower Requests"
    })


# Manpower Requests
@router.get("/manpower-requests/{manpower_request_id}/hired-applicants", response_class=HTMLResponse)
def render(
    manpower_request_id: str,
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if manpower request is not existing in database
    manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id).first()
    if not manpower_request:
        return errTemplate.page_not_found(req)
    
    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "hired_applicants_per_request.html", {
        "request": req,
        "page_title": "Hired Applicants",
        "sub_title": "Hired Applicants to manage new hired employees",
        "active_navlink": "Hired Applicants"
    })


# Manpower Request Report
@router.get("/manpower-requests/{manpower_request_id}/report", response_class=HTMLResponse)
def render(
    manpower_request_id: str,
    req: Request, 
    db: Session = Depends(get_db), 
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # Check if manpower request is not existing in the database
    if not db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id).first():
        return errTemplate.page_not_found(req)
    
    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH  + "manpower_request_report.html", {
        "request": req,
        "page_title": "Manpower Requisition Report",
        "sub_title": "View the details of manpower request here",
        "active_navlink": "Manpower Requests"
    })


# Add Manpower Request
@router.get("/add-manpower-request", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):

    # Check if user is not athorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "add_manpower_request.html", {
        "request": req,
        "page_title": "Create Manpower Request",
        "sub_title": "Create manpower request here using this form",
        "active_navlink": "Manpower Requests"
    })


# Edit Manpower Request
@router.get("/edit-manpower-request/{manpower_request_id}", response_class=HTMLResponse)
def render(
    manpower_request_id: str, 
    req: Request, 
    db: Session = Depends(get_db), 
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if manpower_request_id is not declared
    if not manpower_request_id:
        return errTemplate.page_not_found(req)
    
    # Check if requisition is not in database
    requisition = db.query(ManpowerRequest).filter(
        ManpowerRequest.manpower_request_id == manpower_request_id,
        ManpowerRequest.request_status == 'For signature'
    ).first()

    if not requisition:
        return errTemplate.page_not_found(req)
    
    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "edit_manpower_request.html", {
        "request": req,
        "page_title": "Edit Manpower Request",
        "sub_title": "Edit your manpower request here",
        "active_navlink": "Manpower Requests"
    })


# ===========================================================
# HIRED APPLICANTS
# ===========================================================


# Hired Applicants
@router.get("/hired-applicants", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):
    
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "hired_applicants.html", {
        "request": req,
        "page_title": "Hired Applicants",
        "sub_title": "Hired Applicants to manage new hired employees",
        "active_navlink": "Hired Applicants"
    })


# ===========================================================
# ONBOARDING EMPLOYEES
# ===========================================================


# Onboarding Employees
@router.get("/onboarding-employees", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):

    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "onboarding_employees.html", {
        "request": req,
        "page_title": "Onboarding Employees",
        "sub_title": "Onboarding Employees to manage new employees on board",
        "active_navlink": "Onboarding Employees"
    })


# Add Onboarding Employee Details
@router.get("/onboard-employee/{onboarding_employee_id}", response_class=HTMLResponse)
def render(
    onboarding_employee_id: str, 
    req: Request, 
    db: Session = Depends(get_db), 
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # Chech if onboarding_employee_id is not declared
    if not onboarding_employee_id:
        return errTemplate.page_not_found(req)
    
    # Get user sub department for filtering
    user_sub_department = db.query(SubDepartment).join(Position).filter(
        SubDepartment.sub_department_id == Position.sub_department_id
    ).join(Employee).filter(
        Employee.employee_id == user_data["employee_id"], 
        Employee.position_id == Position.position_id
    ).first()
    
    # Check if onboarding employee is existing in database
    onboarding_employee = db.query(OnboardingEmployee).filter(
        OnboardingEmployee.onboarding_employee_id == onboarding_employee_id
    ).join(Position).filter(
        OnboardingEmployee.position_id == Position.position_id
    ).join(SubDepartment).filter(
        Position.sub_department_id == SubDepartment.sub_department_id, 
        SubDepartment.sub_department_id ==  user_sub_department.sub_department_id
    ).first()
    
    if not onboarding_employee:
        return errTemplate.page_not_found(req)
    
    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "onboard_employee.html", {
        "request": req,
        "page_title": "Onboard new employee",
        "sub_title": "Review details and update tasks to on board new employee",
        "active_navlink": "Onboarding Employees"
    })


# ===========================================================
# GENERAL TASKS
# ===========================================================


# General Tasks
@router.get("/general-tasks", response_class=HTMLResponse)
def render(req: Request, menu: Optional[str] = None, user_data: dict = Depends(get_token)):

    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if menu is not declared, redirect to appropriate page
    if not menu:
        return RedirectResponse(f"{REDIRECT_ROOT}general-tasks?menu=for-new-employees")
    
    # Check if menu is valid
    if menu not in ["for-new-employees", "for-the-team", "my-tasks"]:
        return errTemplate.page_not_found(req)
    
    # If no error return template response
    return template.TemplateResponse(TEMPLATES_PATH + "general_tasks.html", {
        "request": req,
        "page_title": "General Onboarding Tasks",
        "sub_title": "Manage your general onboarding tasks here",
        "active_navlink": "General Tasks",
        'active_menu': menu
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
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Get the user sub department for filtering
    user_sub_department = db.query(SubDepartment).join(Position).filter(
        SubDepartment.sub_department_id == Position.sub_department_id
    ).join(Employee).filter(
        Employee.employee_id == user_data['employee_id'], 
        Employee.position_id == Position.position_id
    ).first()

    # Check if onboarding employee is existing in database
    onboarding_employee = db.query(OnboardingEmployee).filter(
        OnboardingEmployee.onboarding_employee_id == onboarding_employee_id,
        OnboardingEmployee.status == "Onboarding",
    ).join(Position).filter(
        OnboardingEmployee.position_id == Position.position_id
    ).join(SubDepartment).filter(
        Position.sub_department_id == SubDepartment.sub_department_id, 
        SubDepartment.sub_department_id ==  user_sub_department.sub_department_id
    ).first()

    if not onboarding_employee:
        return errTemplate.page_not_found(req)
    
    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "onboarding_employee_tasks.html", {
        "request": req,
        "page_title": "Onboarding Tasks",
        "sub_title": "Manage employee tasks and monitor performance",
        "active_navlink": "Onboarding Employees"
    })