# Import Packages
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from database import get_db
from datetime import datetime
from sqlalchemy import or_
from dotenv import dotenv_values

# Import models and schemas
from models import *
from app.internal.human_resource.rms.schemas import career_schemas as careers

# For file handling
import shutil, uuid

# From email sending
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# Router Instance
router = APIRouter(prefix = "/api/careers")


# Dotenv
env = dotenv_values(".env")


FETCH_ROW = 10


# ====================================================================
# JOB CATEGORY
# ====================================================================


# Get all job category
@router.get("/job-categories", response_model = List[careers.ShowJobCategory])
def get_all_job_Categories(db: Session = Depends(get_db)):
    try:
        return db.query(JobCategory).filter(JobCategory.is_removed == False).all()
    except Exception as e:
        print(e)


# ====================================================================
# EMPLOYMENT TYPE
# ====================================================================


# Get All Employment Type
@router.get("/employment-types", response_model = List[careers.ShowEmploymentType])
def get_all_employment_types(db: Session = Depends(get_db)):
    try:
        return db.query(EmploymentType).all()
    except Exception as e:
        print(e)



# ====================================================================
# JOB POSTS
# ====================================================================


# Job Post Not Found Response
JOB_POST_NOT_FOUND_RESPONSE = {"message": "Job Post not found"}


# Get All Job Posts
@router.get("/job-posts", response_model=List[careers.ShowJobPost])
def get_all_job_posts(
    searchQuery: Optional[str] = None,
    datePosted: Optional[str] = None,
    jobCategory: Optional[str] = None,
    employmentType: Optional[str] = None,
    page: Optional[int] = 1, 
    db: Session = Depends(get_db)
):
    try:
        query = db.query(JobPost).filter(or_(
            JobPost.expiration_date > datetime.today(), 
            JobPost.expiration_date == None
        )).order_by(JobPost.created_at.desc())

        # With filters
        if searchQuery or employmentType:
            query = query.join(ManpowerRequest)
            if employmentType:
                query = query.filter(ManpowerRequest.employment_type_id == employmentType)
            if searchQuery:
                query = query.join(Position).filter(Position.name.contains(searchQuery))
        if datePosted:
            query = query.filter(JobPost.created_at >= datePosted)
        if jobCategory:
            query = query.filter(JobPost.job_category_id == jobCategory)
        if page:
            query = query.limit(FETCH_ROW).offset(FETCH_ROW * (page - 1))

        return query.all()
    except Exception as e:
        print("Error details:", e)


# Job Post Analytics
@router.get("/job-posts/analytics")
def job_posts_analytics(
    searchQuery: Optional[str] = None,
    datePosted: Optional[str] = None,
    jobCategory: Optional[str] = None,
    employmentType: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(JobPost).filter(or_(
            JobPost.expiration_date > datetime.today(), 
            JobPost.expiration_date == None
        )).order_by(JobPost.created_at.desc())

        # With filters
        if searchQuery or employmentType:
            query = query.join(ManpowerRequest)
            if employmentType:
                query = query.filter(ManpowerRequest.employment_type_id == employmentType)
            if searchQuery:
                query = query.join(Position).filter(Position.name.contains(searchQuery))
        if datePosted:
            query = query.filter(JobPost.created_at >= datePosted)
        if jobCategory:
            query = query.filter(JobPost.job_category_id == jobCategory)

        total = query.count()

        return {"total": total}
    except Exception as e:
        print(e)


# Get One Job Post
@router.get("/job-posts/{job_post_id}", response_model=careers.ShowJobPost)
def get_one_job_post(job_post_id: str, db: Session = Depends(get_db)):
    try:
        job_post = db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first()
        if not job_post:
            return HTTPException(status_code=404, detail=JOB_POST_NOT_FOUND_RESPONSE)
        else:
            return job_post
    except Exception as e:
        print(e)


# Update page view
@router.put("/job-posts/{job_post_id}/increment-views")
def update_page_views(job_post_id: str, db: Session = Depends(get_db)):
    try:
        job_post = db.query(JobPost).filter(JobPost.job_post_id == job_post_id)
        if not job_post.first():
            return HTTPException(status_code=404, detail=JOB_POST_NOT_FOUND_RESPONSE)
        else:
            views = job_post.first().views + 1
            job_post.update({"views": views})
            db.commit()
            return views
    except Exception as e:
        print(e)


# ====================================================================
# APPLICATION
# ====================================================================


# Upload Resume
@router.post("/upload/resume", status_code=202)
def upload_resume(file: UploadFile = File(...)):
    try:
        orig_filename = f"{file.filename}"
        file_extension = orig_filename.split('.')[-1]
        new_filename = uuid.uuid4().hex
        file_location = f"static/src/files/internal/human_resource/rms/resumes/{new_filename}.{file_extension}"
        with open(file_location, "wb") as fileObj:
            shutil.copyfileobj(file.file, fileObj)
        return {
            "original_file": orig_filename,
            "new_file": f"{new_filename}.{file_extension}"
        }
    except Exception as e:
        print(e)
    finally:
        file.file.close()


#  Apply for a job
@router.post("/apply", status_code=202)
async def apply(req: careers.Applicant, db: Session = Depends(get_db)):
    try:
        new_applicant = Applicant(**req.dict())

        # position = db.query(Position).join(ManpowerRequest).filter(
        #         ManpowerRequest.position_id == Position.position_id
        #     ).join(JobPost).filter(
        #         JobPost.manpower_request_id == ManpowerRequest.manpower_request_id,
        #         JobPost.job_post_id == req.job_post_id
        #     ).first()

        db.add(new_applicant)
        db.commit()
        db.refresh(new_applicant)

        # messageBody = f"""
        #     <div style="padding: 3rem; border: solid #ddd 1px; border-radius: 5px">
        #         <h1 style="margin: 0">Job Application Status</h1>
        #         <h3 style="margin: 0">From: HoMIES - Human Resource Department</h3>

        #         <br />
        #         <br />
                
        #         <div>Good day! <b>{new_applicant.first_name}</b>,</div>

        #         <br />

        #         <p>Thank you for applying to the <b>{position.name}</b> position at Homies, Inc.</p>
                
        #         <p>We would like to inform you that we received your application and resume for the <b>{position.name}</b> position. Our hiring team is currently reviewing all applications of applicants. If you are among qualified candidates, you will receive an email from one of our recruiters to schedule you for an interview. </p>
        #         <p>In any case, we will keep you updated on the status of your application. We will keep also all the information you submitted it utmost confidentiality.</p>
        #         <p>Thank you again, {new_applicant.first_name}!</p>

        #         <br />

        #         <p>Best Regards, <br /> HoMIES - Human Resource Department</p>
        #     </div>

        #     <br />

        #     <p style="color: red">This message is auto-generated by the HoMIES - Recruitment Management System. Please, DO NOT REPLY. Thank you!</p>
        # """

        # message = MIMEMultipart()
        # message['From'] = env['MAIL_EMAIL']
        # message['To'] = req.email
        # message['Subject'] = "HoMIES - Job Application Status"

        # message.attach(MIMEText(messageBody, 'html'))

        # SMTP_SERVER = smtplib.SMTP_SSL(env['MAIL_SERVER'], 465)
        # SMTP_SERVER.login(env['MAIL_EMAIL'], env['MAIL_PASSWORD'])
        # SMTP_SERVER.sendmail(env["MAIL_EMAIL"], [req.email], message.as_string())
        # SMTP_SERVER.quit()

        return {"message": "A new applicant has been added"}
    except Exception as e:
        print(e)