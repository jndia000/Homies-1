# Import Packages
from typing import List, Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy import cast, func, and_, text, Date
from sqlalchemy.orm import Session
from database import get_db
from oauth2 import get_user, isAuthorized, UserData
from datetime import datetime
from sqlalchemy import or_
from dotenv import dotenv_values

# Import Models and Schemas
from models import *
from app.internal.human_resource.recruitment.schemas \
    import user_schemas as user, recruiter_schemas as recruiter, deptMngr_schemas as deptMngr

# From email sending
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# Dotenv
env = dotenv_values(".env")


# Router Instance
router = APIRouter(prefix = "/api/recruiter")


# Authorization
AUTHORIZED_SUBSYSTEM = "Recruitment"
AUTHORIZED_ROLE = "Talent Recruiter"


# User Information
@router.get("/info", response_model = user.ShowUserInfo)
def get_user_info(
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            user_info = db.query(Employee).filter(Employee.employee_id == user_data.employee_id).first()
            if not user_info:
                raise HTTPException(status_code = 404, detail = {"message": "Employee does not exists"})
            else:
                return user_info
    except Exception as e:
        print(e)


# ====================================================================
# REQUISITIONS/MANPOWER REQUESTS
# ====================================================================


# Requisition Not Found Response
MANPOWER_REQUEST_NOT_FOUND_RESPONSE = {"message": "Requisition not found"}


# Get All Approved Man
@router.get("/manpower-requests", response_model=List[recruiter.ShowManpowerRequest])
def get_all_approved_manpower_requests(
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            return db.query(ManpowerRequest).filter(or_(
                ManpowerRequest.request_status == "Approved",
                ManpowerRequest.request_status == "Completed"
            )).all()
    except Exception as e:
        print(e)


# Requisition Analytics
@router.get("/manpower-requests/analytics")
def manpower_request_analytics(
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            query = db.query(ManpowerRequest)
            
            # Approved Request
            approved_request = query.filter(or_(
                ManpowerRequest.request_status == "Approved",
                ManpowerRequest.request_status == "Completed"
            )).count()
            
            # With Job Post
            with_job_post = query.join(JobPost).filter(or_(
                ManpowerRequest.request_status == "Approved",
                ManpowerRequest.request_status == "Completed"
            )).filter(JobPost.manpower_request_id == ManpowerRequest.manpower_request_id).count()
            
            return {
                "approved_requests": approved_request,
                "with_job_post": with_job_post
            }
    except Exception as e:
        print(e)


# Get One Approved Manpower Request
@router.get("/manpower-requests/{manpower_request_id}", response_model=recruiter.ShowManpowerRequest)
def get_one_approved_manpower_requests(
    manpower_request_id,
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            manpower_request = db.query(ManpowerRequest).filter(
                ManpowerRequest.manpower_request_id == manpower_request_id,
                or_(
                    ManpowerRequest.request_status == "Approved",
                    ManpowerRequest.request_status == "Completed"
                )
            ).first()
            if not manpower_request:
                raise HTTPException(status_code = 404, detail = MANPOWER_REQUEST_NOT_FOUND_RESPONSE)
            else:
                return manpower_request
    except Exception as e:
        print(e)


# ====================================================================
# JOB CATEGORIES
# ====================================================================


# Job Category Not Found Response
JOB_CATEGORY_NOT_FOUND_RESPONSE = {"message": "Job Category not found"}


# Add Job Category
@router.post("/job-categories", status_code = 201)
def add_job_category(
    req: recruiter.CreateJobCategory,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            new_job_category = JobCategory(
                **req.dict(),
                created_by = user_data.employee_id
            )
            db.add(new_job_category)
            db.commit()
            db.refresh(new_job_category)
            return {"message": "A new job category has been added"}
    except Exception as e:
        print(e)


# Get All Job Category
@router.get("/job-categories", response_model = List[recruiter.ShowJobCategory])
def get_all_job_categories(
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            return db.query(JobCategory).filter(JobCategory.is_removed == False).all()
    except Exception as e:
        print(e)


# Get One Job Category
@router.get("/job-categories/{job_category_id}", response_model=recruiter.ShowJobCategory)
def get_one_job_category(
    job_category_id: str,
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            job_category = db.query(JobCategory).filter(
                JobCategory.job_category_id == job_category_id, 
                JobCategory.is_removed == False
            ).first()
            if not job_category:
                raise HTTPException(status_code = 401, detail=JOB_CATEGORY_NOT_FOUND_RESPONSE)
            else:
                return job_category
    except Exception as e:
        print(e)


# Update Job Category
@router.put("/job-categories/{job_category_id}")
def update_job_category(
    job_category_id: str,
    req: recruiter.UpdateJobCategory,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            job_category = db.query(JobCategory).filter(
                JobCategory.job_category_id == job_category_id,
                JobCategory.is_removed == False
            )
            if not job_category.first():
                raise HTTPException(status_code = 404, detail = JOB_POST_NOT_FOUND_RESPONSE)
            else:
                job_category.update(req.dict())
                db.commit()
                return {"message": "A job categroy is successfully updated"}
    except Exception as e:
        print(e)


# Remove Job Category
@router.delete("/job-categories/{job_category_id}")
def remove_job_category(
    job_category_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            job_category = db.query(JobCategory).filter(JobCategory.job_category_id == job_category_id)
            if not job_category.first():
                raise HTTPException(status_code=404, detail=JOB_CATEGORY_NOT_FOUND_RESPONSE)
            else:
                job_posts_count = db.query(JobPost).filter(JobPost.job_category_id == job_category.first().job_category_id).count()
                if job_posts_count > 0:
                    job_category.update({"is_removed": True})
                else:
                    job_category.delete(synchronize_session = False)
                db.commit()
                return "A job category has been removed"
    except Exception as e:
        print(e)


# ====================================================================
# JOB POSTS
# ====================================================================


# Job Post Not Found Response
JOB_POST_NOT_FOUND_RESPONSE = {"message": "Job Post not found"}


# Post Vacant Job
@router.post("/job-posts", status_code=201)
def post_vacant_job(
    req: recruiter.CreateJobPost,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            new_job_post = JobPost(
                **req.dict(),
                posted_by = user_data.employee_id
            )
            db.add(new_job_post)
            db.commit()
            db.refresh(new_job_post)
            return {"message": "A new job post is successfully added"}
    except Exception as e:
        print(e)


# Get All Job Posts
@router.get("/job-posts", response_model=List[recruiter.ShowJobPost])
def get_all_job_posts(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(JobPost).all()
    except Exception as e:
        print(e)


# Job Posts Analytics
@router.get("/job-posts/analytics")
def job_posts_analytics(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            query = db.query(JobPost)

            total_query = query

            # On Going Query
            on_going_query = query.filter(or_(
                JobPost.expiration_date >= datetime.today(), 
                JobPost.expiration_date == None
            ))

            # Ended Query
            ended_query = query.filter(JobPost.expiration_date <= datetime.today())

            # Filters
            if start and end:
                date_filter = and_(JobPost.created_at >= start, JobPost.created_at <= end)
                total_query = query.filter(date_filter)
                on_going_query = on_going_query.filter(date_filter)
                ended_query = ended_query.filter(date_filter)
            
            return {
                "total": total_query.count(),
                "on_going": on_going_query.count(),
                "ended": ended_query.count()
            }
    except Exception as e:
        print(e)   


# Get Job Posts Data
@router.get("/job-posts/data")
def get_job_posts_data(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            target_column = cast(JobPost.created_at, Date)

            query = db.query(
                target_column.label("created_at"), 
                func.count(JobPost.job_post_id).label("total")
            ).group_by(target_column)

            if start and end:
                query = query.filter(and_(
                    JobPost.created_at >= start, 
                    JobPost.created_at <= end
                ))
            
            return query.all()
    except Exception as e:
        print(e)


# Get One Job Posts
@router.get("/job-posts/{job_post_id}", response_model = recruiter.ShowJobPost)
def get_one_job_post(
    job_post_id,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)
        job_post = db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first()
        if not job_post:
            raise HTTPException(status_code = 404, detail = JOB_POST_NOT_FOUND_RESPONSE)
        else:
            return job_post
    except Exception as e:
        print(e)


# Update Job Post
@router.put("/job-posts/{job_post_id}")
def update_job_post(
    job_post_id: str,
    req: recruiter.UpdateJobPost,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            job_post = db.query(JobPost).filter(JobPost.job_post_id == job_post_id)
            if not job_post.first():
                raise HTTPException(status_code = 404, detail = JOB_POST_NOT_FOUND_RESPONSE)
            else:
                job_post.update(req.dict())
                db.commit()
                return {"message": "A job post is successfully updated"}
    except Exception as e:
        print(e)


# End Recruitment
@router.put("/job-posts/{job_post_id}/end-recruiting")
def end_recruiting(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            job_post = db.query(JobPost).filter(JobPost.job_post_id == job_post_id)
            if not job_post.first():
                raise HTTPException(status_code = 404, detail = JOB_POST_NOT_FOUND_RESPONSE)
            else:
                job_post.update({
                    "expiration_date": text('NOW()')
                })
                db.commit()
                return {"message": "A job post has been ended its recruitment"}
    except Exception as e:
        print(e)


# ====================================================================
# APPLICANTS
# ====================================================================


# Applicant Not Found Response
APPLICANT_NOT_FOUND_RESPONSE = {"message": "Applicant not found"}


# Get All Applicants
@router.get("/applicants", response_model = List[recruiter.ShowApplicant])
def get_all_applicants(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(Applicant).all()
    except Exception as e:
        print(e)


# Applicants Analytics
@router.get("/applicants/analytics")
def applicants_analytics(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            query = db.query(Applicant)

            for_evaluation_query = query.filter(Applicant.status == "For evaluation")
            for_screening_query = query.filter(Applicant.status == "For screening")
            for_interview_query = query.filter(Applicant.status == "For interview")
            hired_query = query.filter(Applicant.status == "Hired")
            rejected_from_evaluation_query = query.filter(Applicant.status == "Rejected from evaluation")
            rejected_from_screening_query = query.filter(Applicant.status == "Rejected from screening")
            rejected_from_interview_query = query.filter(Applicant.status == "Rejected from interview")

            if start and end:
                date_filter = and_(Applicant.created_at >= start, Applicant.created_at <= end)
                total_query = query.filter(date_filter)
                for_evaluation_query = for_evaluation_query.filter(date_filter)
                for_screening_query = for_screening_query.filter(date_filter)
                for_interview_query = for_interview_query.filter(date_filter)
                hired_query = hired_query.filter(date_filter)
                rejected_from_evaluation_query = rejected_from_evaluation_query.filter(date_filter)
                rejected_from_screening_query = rejected_from_screening_query.filter(date_filter)
                rejected_from_interview_query = rejected_from_interview_query.filter(date_filter)
            
            # Get All Total
            total_query = query

            # Get total evaluated count
            total_evaluated = \
                for_screening_query.count() + for_interview_query.count() + hired_query.count()
            
            # Get total rejected count
            total_rejected = \
                rejected_from_evaluation_query.count() + rejected_from_screening_query.count() + rejected_from_interview_query.count()

            return {
                "total": total_query.count(),
                "for_evaluation": for_evaluation_query.count(),
                "evaluated": {
                    "total": total_evaluated,
                    "for_screening": for_screening_query.count(),
                    "for_interview": for_interview_query.count(),
                    "hired": hired_query.count(),
                },
                "rejected": {
                    "total": total_rejected,
                    "from_evaluation": rejected_from_evaluation_query.count(),
                    "from_screening": rejected_from_screening_query.count(),
                    "from_interview": rejected_from_screening_query.count()
                }
            }
    except Exception as e:
        print(e)


# Applicants Data
@router.get("/applicants/data")
def get_applicants_data(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):

            target_column = cast(Applicant.created_at, Date)

            query = db.query(
                target_column.label("created_at"), 
                func.count(Applicant.applicant_id).label("total")
            ).group_by(target_column)

            if start and end:
                query = query.filter(and_(
                    Applicant.created_at >= start, 
                    Applicant.created_at <= end
                ))
            
            return query.all()
    except Exception as e:
        print(e)


# Get One Applicant
@router.get("/applicants/{applicant_id}", response_model = recruiter.ShowApplicant)
def get_one_applicant(
    applicant_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            applicant = db.query(Applicant).filter(Applicant.applicant_id == applicant_id).first()
            if not applicant:
                raise HTTPException(status_code = 404, detail = APPLICANT_NOT_FOUND_RESPONSE)
            else:
                return applicant
    except Exception as e:
        print(e)


# Evaluate Applicant Status
@router.put("/applicants/{applicant_id}", status_code = 202)
def evaluate_applicant(
    applicant_id: str,
    req: recruiter.ApplicantEvaluation,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            applicant = db.query(Applicant).filter(Applicant.applicant_id == applicant_id)
            if not applicant.first():
                raise HTTPException(status_code = 404, detail = APPLICANT_NOT_FOUND_RESPONSE)
            else:

                # For Screening
                if req.status == "For screening":
                    applicant.update({
                        "evaluated_by": user_data.employee_id,
                        "evaluated_at": text('NOW()'),
                        "status": req.status
                    })
                    db.commit()
                    return {"message": "An applicant is evaluated and ready for screening"}

                # Rejected from Evaluation
                elif req.status == "Rejected from evaluation":
                    applicant.update({
                        "rejected_by": user_data.employee_id,
                        "rejected_at": text('NOW()'),
                        "status": req.status,
                        "remarks": req.remarks
                    })
                    db.commit()

                    position = db.query(Position).join(ManpowerRequest).filter(
                            ManpowerRequest.position_id == Position.position_id
                        ).join(JobPost).filter(
                            JobPost.manpower_request_id == ManpowerRequest.manpower_request_id,
                            JobPost.job_post_id == applicant.first().job_post_id
                        ).first()

                    # messageBody = f"""
                    #     <div style="padding: 3rem; border: solid #ddd 1px; border-radius: 5px">
                    #         <h1 style="margin: 0">Job Application Status</h1>
                    #         <h3 style="margin: 0">From: HoMIES - Human Resource Department</h3>

                    #         <br />
                    #         <br />

                    #         <div>Good day! <b>{applicant.first().first_name}<b>,</div>

                    #         <br />

                    #         <p>Thank you for your time on the application. Our hiring team reviewed your application but we regret to notify you that you were <b>not chosen</b> for the position of <b>{position.name}</b> for some consideration. Because the competition was fierce, we decided to take a different path. Thank you for your interest in our firm, and we wish you the best of luck in your future endeavors</p>
                    #         <p>We encourage you to apply again in the future if you find an open role at our company that suits you.</p>
                    #         <p>Thank you again for applying to HoMIES, Inc. and we wish you all the best to your next opportunities</p>

                    #         <br />

                    #         <p>Best Regards, <br /> HoMIES - Human Resource Department</p>
                    #     </div>

                    #     <br />
                        
                    #     <p style="color: red">This message is auto-generated by the HoMIES Recruitment Management System. Please, DO NOT REPLY.</p>
                    # """

                    # message = MIMEMultipart()
                    # message['From'] = env['MAIL_EMAIL']
                    # message['To'] = applicant.first().email
                    # message['Subject'] = "HoMIES - Job Application Status"

                    # message.attach(MIMEText(messageBody, 'html'))

                    # SMTP_SERVER = smtplib.SMTP_SSL(env['MAIL_SERVER'], 465)
                    # SMTP_SERVER.login(env['MAIL_EMAIL'], env['MAIL_PASSWORD'])
                    # SMTP_SERVER.sendmail(env["MAIL_EMAIL"], [applicant.first().email], message.as_string())
                    # SMTP_SERVER.quit()

                    return {"message": "An applicant is rejected from evaluation"}
    except Exception as e:
        print(e)



# Get All Applicants Per Job
@router.get("/job-posts/{job_post_id}/applicants", response_model = List[recruiter.ShowApplicant])
def get_all_applicants_per_job(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(Applicant).filter(Applicant.job_post_id == job_post_id).all()
    except Exception as e:
        print(e)


# Applicants Per Job Analytics
@router.get("/job-posts/{job_post_id}/applicants/analytics")
def applicants_per_job_analytics(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            query = db.query(Applicant)
            
            # Total Applicants
            total = query.filter(Applicant.job_post_id == job_post_id).count()

            # For Evaluation
            for_evaluation = query.filter(
                Applicant.status == "For evaluation",
                Applicant.job_post_id == job_post_id
            ).count()

            # For Screening
            for_screening = query.filter(
                Applicant.status == "For screening",
                Applicant.job_post_id == job_post_id
            ).count()

            # For Interview
            for_interview = query.filter(
                Applicant.status == "For interview",
                Applicant.job_post_id == job_post_id
            ).count()
            
            # Hired
            hired = query.filter(
                Applicant.status == "Hired",
                Applicant.job_post_id == job_post_id
            ).count()

            # Contract Signed
            contract_signed = query.filter(
                Applicant.status == "Contract Signed",
                Applicant.job_post_id == job_post_id
            ).count()
            
            # Rejected From Evaluation
            rejected_from_evaluation = query.filter(
                Applicant.status == "Rejected from evaluation",
                Applicant.job_post_id == job_post_id
            ).count()

            # Rejected From Screening
            rejected_from_screening = query.filter(
                Applicant.status == "Rejected from screening",
                Applicant.job_post_id == job_post_id
            ).count()

            # Rejected From Interview
            rejected_from_intreview = query.filter(
                Applicant.status == "Rejected from interview",
                Applicant.job_post_id == job_post_id
            ).count()

            # Total Rejected
            total_rejected = \
                rejected_from_evaluation + rejected_from_screening + rejected_from_intreview
            
            return {
                "total": total,
                "for_evaluation": for_evaluation,
                "for_screening": for_screening,
                "for_interview": for_interview,
                "hired": hired,
                "contract_signed": contract_signed,
                "rejected": {
                    "total": total_rejected,
                    "from_evaluation": rejected_from_evaluation,
                    "from_screening": rejected_from_screening,
                    "from_interview": rejected_from_intreview
                }
            }
    except Exception as e:
        print(e)


# Get All Applicants Per (For evaluation)
@router.get("/job-posts/{job_post_id}/applicants/for-evaluation", response_model = List[recruiter.ShowApplicant])
def for_evaluation_applicants(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(Applicant).filter(
                Applicant.job_post_id == job_post_id,
                Applicant.status == 'For evaluation'
            ).all()
    except Exception as e:
        print(e)


# Get All Applicants Per Job (Evaluated)
@router.get("/job-posts/{job_post_id}/applicants/evaluated", response_model = List[recruiter.ShowApplicant])
def evaluated_applicants(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(Applicant).filter(
                Applicant.job_post_id == job_post_id,
                or_(
                    Applicant.status == 'For screening',
                    Applicant.status == 'Rejected from screening',
                    Applicant.status == 'For interview',
                    Applicant.status == 'Rejected from interview',
                    Applicant.status == 'Hired',
                    Applicant.status == 'Contract Signed'
                )
            ).all()
    except Exception as e:
        print(e)


# Get All Applicants Per Job (Rejected)
@router.get("/job-posts/{job_post_id}/applicants/rejected", response_model = List[recruiter.ShowApplicant])
def rejected_applicants(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(Applicant).filter(
                Applicant.job_post_id == job_post_id,
                Applicant.status == 'Rejected from evaluation'
            ).all()
    except Exception as e:
        print(e)