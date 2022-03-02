# Import Packages
from typing import Optional
from database import get_db
from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from jwt_token import get_token
from oauth2 import hasAccess
from fastapi.templating import Jinja2Templates


# Import Models
from models import *


# Import Templates
from app.internal.human_resource.recruitment.routers.web import errPages_templates as errTemplate


# Template
template = Jinja2Templates(directory = "app/internal/human_resource/recruitment/views")


# Router
router = APIRouter(prefix = "/h")


# Templates Path
TEMPLATES_PATH = "/pages/hiring_manager/"



# Authorization
AUTHORIZED_SUBSYSTEM = "Recruitment"
AUTHORIZED_ROLE = "Hiring Manager"



# Redirect Root
REDIRECT_ROOT = "/rms/h/"



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
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    return template.TemplateResponse(TEMPLATES_PATH + "dashboard.html", {
        "request": req,
        "page_title": "Dashboard",
        "sub_title": "Hiring Manager manages all selected applicants",
        "active_navlink": "Dashboard"
    })


# ===========================================================
# MANPOWER REQUESTS
# ===========================================================


# Manpower Requests
@router.get("/manpower-requests", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    return template.TemplateResponse(TEMPLATES_PATH + "manpower_requests.html", {
        "request": req,
        "page_title": "Manpower Requests",
        "sub_title": "Manpower Requests to manage requests for employees",
        "active_navlink": "Manpower Requests"
    })


# View Manpower Requests
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
    
    manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id).first()
    if not manpower_request:
        return errTemplate.page_not_found(req)
    else:
        return template.TemplateResponse(TEMPLATES_PATH  + "view_manpower_request.html", {
            "request": req,
            "page_title": "Manpower Request Details",
            "sub_title": "View the details of manpower request here",
            "active_navlink": "Manpower Requests"
        })



# ===========================================================
# JOB POSTS
# ===========================================================


# Job Posts
@router.get("/job-posts", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):
    
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # If error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "job_posts.html", {
        "request": req,
        "page_title": "Job Posts",
        "sub_title": "Manage applicants per job post here",
        "active_navlink": "Job Posts"
    })


# Job Posts Details
@router.get("/job-posts/{job_post_id}", response_class=HTMLResponse)
def render(
    job_post_id: str,
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized 
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # Check if job post is not existing in database
    if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
        return errTemplate.page_not_found(req)
    
    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "view_job_post.html", {
        "request": req,
        "page_title": "Job Posts",
        "sub_title": "Manage applicants per job post here",
        "active_navlink": "Job Posts"
    })


# ===========================================================
# APPLICANTS
# ===========================================================


# Applicants
@router.get("/applicants", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):

    # Check if user is authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "applicants.html", {
        "request": req,
        "page_title": "Applicants",
        "sub_title": "Applicants to manage potential candidates",
        "active_navlink": "Applicants"
    })    


# Applicants Per Job Post
@router.get("/job-posts/{job_post_id}/applicants", response_class=HTMLResponse)
def render(
    job_post_id: str, 
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if job_post_id is not declared
    if not job_post_id:
        return errTemplate.page_not_found(req)

    # Check if job post is not exisiting in database
    if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
        return errTemplate.page_not_found(req)

    return RedirectResponse(f"{REDIRECT_ROOT}job-posts/{job_post_id}/applicants/for-screening")


# Applicants Per Job Post (For Screening)
@router.get("/job-posts/{job_post_id}/applicants/for-screening", response_class=HTMLResponse)
def render(
    job_post_id: str, 
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if job_post_id is not declared
    if not job_post_id:
        return errTemplate.page_not_found(req)

    # Check if job post is not existing in database
    if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "pages/applicants_per_job/for_screening.html", {
        "request": req,
        "page_title": "Applicants - For Screening",
        "sub_title": "Applicants to manage potential candidates",
        "active_navlink": "Applicants",
        "active_menu": "For screening",
        "job_post_id": f"{job_post_id}"
    })


# Applicants Per Job Post (Interviewed)
@router.get("/job-posts/{job_post_id}/applicants/for-interview", response_class=HTMLResponse)
def render(
    job_post_id: str, 
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if the user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)
    
    # Check if job_post_id is not declared
    if not job_post_id:
        return errTemplate.page_not_found(req)

    # Check if job post existing in database
    if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
        return errTemplate.page_not_found(req)

    # If no errors, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "pages/applicants_per_job/for_interview.html", {
        "request": req,
        "page_title": "Applicants - For Interview",
        "sub_title": "Applicants to manage potential candidates",
        "active_navlink": "Applicants",
        "active_menu": "For interview",
        "job_post_id": f"{job_post_id}"
    })


# Applicants Per Job Post (For Interview)
@router.get("/job-posts/{job_post_id}/applicants/interviewed", response_class=HTMLResponse)
def render(
    job_post_id: str, 
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if job_post_id is not declared
    if not job_post_id:
        return errTemplate.page_not_found(req)

    # Check if job post exist in database
    if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "pages/applicants_per_job/interviewed.html", {
        "request": req,
        "page_title": "Applicants - Inteviewed",
        "sub_title": "Applicants to manage potential candidates",
        "active_navlink": "Applicants",
        "active_menu": "Interviewed applicants",
        "job_post_id": f"{job_post_id}"
    })


# Applicants Per Job Post (Create Interview Schedule)
@router.get("/job-posts/{job_post_id}/create-interview-schedule", response_class=HTMLResponse)
def render(
    job_post_id: str, 
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Chech if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if job_post_id is declared
    if not job_post_id:
        return errTemplate.page_not_found(req)

    # Check if job post exist in database
    if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "create_schedule.html", {
        "request": req,
        "page_title": "Create Interview Schedule",
        "sub_title": "Create interview schedule here for applicants f",
        "active_navlink": "Interview Schedules",
        "job_post_id": f"{job_post_id}"
    })



# Applicants Per Job Post (Hired)
@router.get("/job-posts/{job_post_id}/applicants/hired", response_class=HTMLResponse)
def render(
    job_post_id: str, 
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if job_post_id is declared
    if not job_post_id:
        return errTemplate.page_not_found(req)

    # Check if job post exist in database
    if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "pages/applicants_per_job/hired.html", {
        "request": req,
        "page_title": "Applicants - Hired Applicants",
        "sub_title": "Applicants to manage potential candidates",
        "active_navlink": "Applicants",
        "active_menu": "Hired applicants",
        "job_post_id": f"{job_post_id}"
    })


# Applicants Per Job Post (Rejected)
@router.get("/job-posts/{job_post_id}/applicants/rejected", response_class=HTMLResponse)
def render(
    job_post_id: str, 
    req: Request, 
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if job_post_id is declared
    if not job_post_id:
        return errTemplate.page_not_found(req)

    # Check if job post exist in database
    if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "pages/applicants_per_job/rejected.html", {
        "request": req,
        "page_title": "Applicants - Rejected Applicants",
        "sub_title": "Applicants to manage potential candidates",
        "active_navlink": "Applicants",
        "active_menu": "Rejected applicants",
        "job_post_id": f"{job_post_id}"
    })


# ===========================================================
# INTERVIEW SCHEDULES
# ===========================================================

# Interview Schedules
@router.get("/interview-schedules", response_class=HTMLResponse)
def render(
    req: Request,
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "interview_schedules.html", {
        "request": req,
        "page_title": "Interview Schedules",
        "sub_title": "Manage interview schedules here",
        "active_navlink": "Interview Schedules"
    })


# Interview Schedule
@router.get("/interview-schedules/{interview_schedule_id}", response_class=HTMLResponse)
def render(
    interview_schedule_id: str,
    req: Request,
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if interview schedule is in database
    if not db.query(InterviewSchedule).filter(InterviewSchedule.interview_schedule_id == interview_schedule_id).first():
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "schedule_details.html", {
        "request": req,
        "page_title": "Interview Schedule Details",
        "sub_title": "Manage interviewees per setted schedule here",
        "active_navlink": "Interview Schedules"
    })


# ===========================================================
# INTERVIEW
# ===========================================================


# Interview Schedules
@router.get("/interview/{interviewee_id}", response_class=HTMLResponse)
def render(
    interviewee_id: str,
    req: Request,
    db: Session = Depends(get_db),
    user_data: dict = Depends(get_token)
):
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # Check if interviewee is not existing in database
    if not db.query(Interviewee).filter(Interviewee.interviewee_id == interviewee_id).first():
        return errTemplate.page_not_found(req)

    # Check if interviewee has already interviewed
    if db.query(InterviewScore).filter(InterviewScore.interviewee_id == interviewee_id).count() > 0:
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "interview_scoresheet.html", {
        "request": req,
        "page_title": "Interview Scoresheet",
        "sub_title": "Lorem ipsum dolor sit amet",
        "active_navlink": "Applicants"
    })



# ===========================================================
# INTERVIEW QUESTIONS
# ===========================================================


# Interview Questions
@router.get("/interview-questions", response_class=HTMLResponse)
def render(req: Request, user_data: dict = Depends(get_token)):
    
    # Check if user is not authorized
    if not hasAccess(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
        return errTemplate.page_not_found(req)

    # If no error, return template response
    return template.TemplateResponse(TEMPLATES_PATH + "interview_questions.html", {
        "request": req,
        "page_title": "Interview Questions",
        "sub_title": "Manage general interview questions here for all applicants",
        "active_navlink": "Interview Questions",
    })
