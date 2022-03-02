# Import Packages
from typing import List, Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy import text, and_, cast, func, Date
from sqlalchemy.orm import Session
from database import get_db
from oauth2 import get_user, isAuthorized, UserData
from dotenv import dotenv_values
from datetime import datetime
from sqlalchemy import or_

# Import Models and Schemas
from models import *
from app.internal.human_resource.recruitment.schemas \
    import user_schemas as user, hireMngr_schemas as hireMngr, deptMngr_schemas as deptMngr


# From email sending
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# Router Instance
router = APIRouter(prefix = "/api/hiring-manager")


# Authorization
AUTHORIZED_SUBSYSTEM = "Recruitment"
AUTHORIZED_ROLE = "Hiring Manager"


# Dotenv
env = dotenv_values(".env")


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


# Get All Manpower Requests
@router.get("/manpower-requests", response_model = List[deptMngr.ShowManpowerRequest])
def get_all_manpower_requests(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(ManpowerRequest).filter(or_(
                ManpowerRequest.request_status == "For approval",
                ManpowerRequest.request_status == "Approved",
                ManpowerRequest.request_status == "Rejected for approval",
                ManpowerRequest.request_status == "Completed"
            )).all()
    except Exception as e:
        print(e)


# Manpower Request Analytics
@router.get("/manpower-requests/analytics")
def manpower_requests_analytics(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            query = db.query(ManpowerRequest)

            for_approval_query = query.filter(ManpowerRequest.request_status == "For approval")
            approved_query = query.filter(ManpowerRequest.request_status == "Approved")
            completed_query = query.filter(ManpowerRequest.request_status == "Completed")
            rejected_query = query.filter(ManpowerRequest.request_status == "Rejected for approval")
            
            if start and end:
                date_filter = and_(ManpowerRequest.created_at >= start, ManpowerRequest.created_at <= end)
                for_approval_query = for_approval_query.filter(date_filter)
                approved_query = approved_query.filter(date_filter)
                completed_query = completed_query.filter(date_filter)
                rejected_query = rejected_query.filter(date_filter)

            total = \
                for_approval_query.count() + approved_query.count() + completed_query.count() + rejected_query.count()
            
            total_approved = \
                approved_query.count() + completed_query.count()

            return {
                "total": total,
                "for_review": for_approval_query.count(),
                "approved": {
                    "total": total_approved,
                    "approved": approved_query.count(),
                    "completed": completed_query.count()
                },
                "rejected": rejected_query.count()
            }
    except Exception as e:
        print(e)


# Manpower Request Data
@router.get("/manpower-requests/data")
def manpower_requests_data(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):

            target_column = cast(ManpowerRequest.created_at, Date)

            query = db.query(
                target_column.label("created_at"), 
                func.count(ManpowerRequest.manpower_request_id).label("total")
            ).filter(or_(
                ManpowerRequest.request_status == "For approval",
                ManpowerRequest.request_status == "Approved",
                ManpowerRequest.request_status == "Rejected for approval",
                ManpowerRequest.request_status == "Completed"
            )).group_by(target_column)

            if start and end:
                query = query.filter(and_(
                    ManpowerRequest.created_at >= start, 
                    ManpowerRequest.created_at <= end
                ))
            
            return query.all()
    except Exception as e:
        print(e)


# Get One Manpower Request
@router.get("/manpower-requests/{manpower_request_id}", response_model=deptMngr.ShowManpowerRequest)
def get_one_requisition(
    manpower_request_id: str, 
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            requisition = db.query(ManpowerRequest).filter(
                ManpowerRequest.manpower_request_id == manpower_request_id,
                or_(
                    ManpowerRequest.request_status == "For approval",
                    ManpowerRequest.request_status == "Approved",
                    ManpowerRequest.request_status == "Rejected for approval",
                    ManpowerRequest.request_status == "Completed"
                )
            ).first()
            if not requisition:
                raise HTTPException(status_code=404, detail=MANPOWER_REQUEST_NOT_FOUND_RESPONSE)
            else:
                return requisition
    except Exception as e:
        print(e)


# Requisition Approval
@router.put("/manpower-requests/{manpower_request_id}")
def manpower_request_approval(
    manpower_request_id: str, 
    req: hireMngr.ManpowerRequestApproval,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id)
            if not manpower_request.first():
                raise HTTPException(status_code=404, detail=MANPOWER_REQUEST_NOT_FOUND_RESPONSE)
            else:
                if req.request_status == "Approved":
                    manpower_request.update({
                        "request_status": req.request_status,
                        "reviewed_by": user_data.employee_id,
                        "reviewed_at": text('NOW()')
                    })
                elif req.request_status == "Rejected for approval":
                    manpower_request.update({
                        "request_status": req.request_status,
                        "remarks": req.remarks,
                        "rejected_by": user_data.employee_id,
                        "rejected_at": text('NOW()')
                    })
                db.commit()
                return {"message": "A man power request has been updated"}
    except Exception as e:
        print(e)


# ====================================================================
# JOB POSTS
# ====================================================================


# Job Post Not Found Response
JOB_POST_NOT_FOUND_RESPONSE = {"message": "Job Post Not Found"}


# Job Posts
@router.get("/job-posts", response_model=List[hireMngr.ShowJobPost])
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
            on_going_query = query.filter(or_(
                JobPost.expiration_date >= datetime.today(), 
                JobPost.expiration_date == None
            ))
            ended_query = query.filter(JobPost.expiration_date < datetime.today())
            
            if start and end:
                date_filter = and_(JobPost.created_at >= start, JobPost.created_at <= end)
                total_query = total_query.filter(date_filter)
                on_going_query = on_going_query.filter(date_filter)
                ended_query = ended_query.filter(date_filter)

            return {
                "total": total_query.count(),
                "on_going": on_going_query.count(),
                "ended": ended_query.count()
            }
    except Exception as e:
        print(e)   



# Job Posts Data
@router.get("/job-posts/data")
def job_posts_data(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            job_posts_query = db.query(
                cast(JobPost.created_at, Date).label("created_at"), 
                func.count(JobPost.job_post_id).label("total")
            ).group_by(
                cast(JobPost.created_at, Date)
            )

            if start and end:
                date_filter = and_(JobPost.created_at >= start, JobPost.created_at <= end)
                return job_posts_query.filter(date_filter).all()
            else:
                return job_posts_query.all()
    except Exception as e:
        print(e)


# Get One Job Posts
@router.get("/job-posts/{job_post_id}", response_model = hireMngr.ShowJobPost)
def get_one_job_post(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            job_post = db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first()
            if not job_post:
                raise HTTPException(status_code = 404, detail = JOB_POST_NOT_FOUND_RESPONSE)
            else:
                return job_post
    except Exception as e:
        print(e)


# ====================================================================
# APPLICANTS
# ====================================================================


# Applicants Not Found Response
APPLICANT_NOT_FOUND_RESPONSE = {"message": "Applicant Not Found"}


# Get All Applicants Per Job
@router.get("/job-posts/{job_post_id}/applicants", response_model = List[hireMngr.ShowApplicant])
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


# Get All Applicants
@router.get("/applicants", response_model=List[hireMngr.ShowApplicant])
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

            total_query = query
            
            for_evaluation_query = query.filter(Applicant.status == "For evaluation")
            for_screening_query = query.filter(Applicant.status == "For screening")
            for_interview_query = query.filter(Applicant.status == "For interview")
            hired_query = query.filter(Applicant.status == "Hired")
            contract_signed_query = query.filter(Applicant.status == "Contract signed")
            
            rejected_from_evaluation_query = query.filter(Applicant.status == "Rejected from evaluation")
            rejected_from_screening_query = query.filter(Applicant.status == "Rejected from screening")
            rejected_from_interview_query = query.filter(Applicant.status == "Rejected from interview")

            if start and end:
                date_filter = and_(Applicant.created_at >= start, Applicant.created_at <= end)
                total_query = total_query.filter(date_filter)
                for_evaluation_query = for_evaluation_query.filter(date_filter)
                for_screening_query = for_screening_query.filter(date_filter)
                for_interview_query = for_interview_query.filter(date_filter)
                hired_query = hired_query.filter(date_filter)
                contract_signed_query = contract_signed_query.filter(date_filter)
                rejected_from_evaluation_query = rejected_from_evaluation_query.filter(date_filter)
                rejected_from_screening_query = rejected_from_screening_query.filter(date_filter)
                rejected_from_interview_query = rejected_from_interview_query.filter(date_filter)
            
            total_rejected = \
                rejected_from_evaluation_query.count() + rejected_from_screening_query.count() + rejected_from_interview_query.count()
            
            return {
                "total": total_query.count(),
                "for_evaluation": for_evaluation_query.count(),
                "for_screening": for_screening_query.count(),
                "for_interview": for_interview_query.count(),
                "hired": hired_query.count(),
                "contract_signed": contract_signed_query.count(),
                "rejected": {
                    "total": total_rejected,
                    "from_evaluation": rejected_from_evaluation_query.count(),
                    "from_screening": rejected_from_screening_query.count(),
                    "from_interview": rejected_from_interview_query.count()
                }
            }
    except Exception as e:
        print(e)


# Applicants Data
@router.get("/applicants/data")
def applicants_data(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            applicants_query = db.query(
                cast(Applicant.created_at, Date).label("created_at"), 
                func.count(Applicant.applicant_id).label("total")
            ).group_by(
                cast(Applicant.created_at, Date)
            )

            if start and end:
                date_filter = and_(Applicant.created_at >= start, Applicant.created_at <= end)
                return applicants_query.filter(date_filter).all()
            else:
                return applicants_query.all()
    except Exception as e:
        print(e)


# Get One Applicant
@router.get("/applicants/{applicant_id}", response_model=hireMngr.ShowApplicant)
def get_one_applicant(
    applicant_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            applicant = db.query(Applicant).filter(Applicant.applicant_id == applicant_id).first()
            if not applicant:
                raise HTTPException(status_code=404, detail=APPLICANT_NOT_FOUND_RESPONSE)
            else:
                return applicant
    except Exception as e:
        print(e)


# Get One Interviewee
@router.get("/applicants/{applicant_id}/interviewee-info", response_model = hireMngr.ShowIntervieweeInfo)
def get_one_applicant(
    applicant_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            applicant = db.query(Applicant).filter(Applicant.applicant_id == applicant_id).first()
            if not applicant:
                raise HTTPException(status_code=404, detail=APPLICANT_NOT_FOUND_RESPONSE)
            else:
                return applicant
    except Exception as e:
        print(e)


# ====================================================================
# APPLICANTS PER JOB
# ====================================================================


# Applicants Per Job Analytics
@router.get("/job-posts/{job_post_id}/applicants/analytics")
def applicants_per_job_analytics(
    job_post_id,
    start: Optional[str] = None,
    end: Optional[str] = None,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            query = db.query(Applicant)

            total = query.filter(Applicant.job_post_id == job_post_id).count()

            for_evaluation = query.filter(
                Applicant.status == "For evaluation",
                Applicant.job_post_id == job_post_id
            ).count()

            for_screening = query.filter(
                Applicant.status == "For screening",
                Applicant.job_post_id == job_post_id
            ).count()

            for_interview = query.filter(
                Applicant.status == "For interview",
                Applicant.job_post_id == job_post_id
            ).outerjoin(Interviewee).filter(Interviewee.is_interviewed == None).count()

            interviewed = query.filter(
                Applicant.status == "For interview",
                Applicant.job_post_id == job_post_id
            ).join(Interviewee).filter(Interviewee.is_interviewed == True).count()

            rejected_from_evalution = query.filter(
                Applicant.status == "Rejected from evaluation",
                Applicant.job_post_id == job_post_id
            ).count()

            rejected_from_screening = query.filter(
                Applicant.status == "Rejected from screening",
                Applicant.job_post_id == job_post_id
            ).count()

            rejected_from_intreview = query.filter(
                Applicant.status == "Rejected from interview",
                Applicant.job_post_id == job_post_id
            ).count()

            hired = query.filter(
                Applicant.job_post_id == job_post_id,
                or_(
                    Applicant.status == "Hired",
                    Applicant.status == "Contract signed"
                )
            ).count()

            total_rejected = rejected_from_evalution + rejected_from_screening + rejected_from_intreview
            
            return {
                "total": total,
                "for_evaluation": for_evaluation,
                "for_screening": for_screening,
                "for_interview": for_interview,
                "interviewed": interviewed,
                "hired": hired,
                "rejected": {
                    "total": total_rejected,
                    "from_evaluation": rejected_from_evalution,
                    "from_screening": rejected_from_screening,
                    "from_interview": rejected_from_intreview
                }
            }
    except Exception as e:
        print(e)


# Get All Applicants Per Job (For Screening)
@router.get("/job-posts/{job_post_id}/applicants/for-screening", response_model=List[hireMngr.ShowApplicant])
def evaluated_applicants(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(Applicant).filter(
                Applicant.job_post_id == job_post_id,
                Applicant.status == 'For screening'
            ).all()
    except Exception as e:
        print(e)


# Get All Applicants Per Job (For Interview)
@router.get("/job-posts/{job_post_id}/applicants/for-interview", response_model=List[hireMngr.ShowIntervieweeInfo])
def evaluated_applicants(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(Applicant).filter(
                Applicant.job_post_id == job_post_id,
                Applicant.status == 'For interview'
            ).outerjoin(Interviewee).filter(
                # Interviewee.applicant_id == Applicant.applicant_id,
                Interviewee.is_interviewed == None
            ).all()
    except Exception as e:
        print(e)


# Get All Applicants Per Job (Interviewed)
@router.get("/job-posts/{job_post_id}/applicants/interviewed", response_model=List[hireMngr.ShowIntervieweeInfo])
def evaluated_applicants(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(Applicant).filter(
                Applicant.job_post_id == job_post_id,
                Applicant.status == 'For interview'
            ).join(Interviewee).filter(
                Interviewee.applicant_id == Applicant.applicant_id,
                Interviewee.is_interviewed == True
            ).all()
    except Exception as e:
        print(e)


# Get All Applicants Per Job (Hired)
@router.get("/job-posts/{job_post_id}/applicants/hired", response_model=List[hireMngr.ShowApplicant])
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
                    Applicant.status == 'Hired',
                    Applicant.status == 'Contract signed'
                )
            ).all()
    except Exception as e:
        print(e)


# Get All Applicants Per Job (Rejected)
@router.get("/job-posts/{job_post_id}/applicants/rejected", response_model=List[hireMngr.ShowApplicant])
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
                    Applicant.status == 'Rejected from screening',
                    Applicant.status == 'Rejected from interview'
                )
            ).all()
    except Exception as e:
        print(e)


# Screen Applicant
@router.put("/applicants/{applicant_id}/screen", status_code=202)
def update_applicant_status(
    applicant_id: str,
    req: hireMngr.UpdateApplicantStatus,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            applicant = db.query(Applicant).filter(Applicant.applicant_id == applicant_id)
            if not applicant.first():
                raise HTTPException(status_code = 404, detail = APPLICANT_NOT_FOUND_RESPONSE)
            else:

                # Change applicant status to "For Interview"
                if req.status == "For interview":
                    applicant.update({
                        "screened_by": user_data.employee_id,
                        "screened_at": text('NOW()'),
                        "status": req.status
                    })
                    db.commit()
                    return {"message": "An applicant is screened and ready for interiew"}

                # Reject applicant from screening
                elif req.status == "Rejected from screening":
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

                    return {"message": "An applicant is rejected from screening"}
    except Exception as e:
        print(e)


# Hire Applicant
@router.put("/applicants/{applicant_id}/hire", status_code=202)
def update_applicant_status(
    applicant_id: str,
    req: hireMngr.UpdateApplicantStatus,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            applicant = db.query(Applicant).filter(Applicant.applicant_id == applicant_id)
            if not applicant.first():
                raise HTTPException(status_code = 404, detail = APPLICANT_NOT_FOUND_RESPONSE)
            else:

                # Hired Applicant
                if req.status == "Hired":
                    applicant.update({
                        "hired_by": user_data.employee_id,
                        "hired_at": text('NOW()'),
                        "status": req.status
                    })
                    db.commit()
                    return {"message": "An applicant is successfully hired"}

                # Reject Applicant from interview
                elif req.status == "Rejected from interview":
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

                    return {"message": "An applicant is rejected from interview"}
    except Exception as e:
        print(e)



# ====================================================================
# INTERVIEW
# ====================================================================


# Interviewee Not Found Response
INTERVIEWEE_NOT_FOUND_RESPONSE = {"message": "Interviewee not found"}

# Interview Question Not Found Response
INTERVIEW_QUESTION_NOT_FOUND_RESPONSE = {"message": "Interview Question not found"}

# Interview Schedule Not Found Response
INTERVIEW_SCHEDULE_NOT_FOUND_RESPONSE = {"message": "Interview Schedule not found"}


# Interview Schedules Per Job
@router.get("/job-posts/{job_post_id}/interview-schedules", response_model=List[hireMngr.ShowInterviewScheduleInfo])
def get_interview_schedules_per_job_post(
    job_post_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            if not db.query(JobPost).filter(JobPost.job_post_id == job_post_id).first():
                raise HTTPException(status_code=404, detail=JOB_POST_NOT_FOUND_RESPONSE)
            else:
                return db.query(InterviewSchedule).filter(
                    InterviewSchedule.job_post_id == job_post_id,
                    InterviewSchedule.set_by == user_data.employee_id
                ).all()
    except Exception as e:
        print(e)


# Create Interview Question
@router.post("/interview-questions", status_code=201)
def create_interview_question(
    req: hireMngr.CreateInterviewQuestion,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            new_interview_question = InterviewQuestion(
                question = req.question,
                type = req.type,
                added_by = user_data.employee_id,
                updated_by = user_data.employee_id
            )
            db.add(new_interview_question)
            db.commit()
            db.refresh(new_interview_question)
            return {
                "data": new_interview_question,
                "message": "A new interview question has been created"
            }
    except Exception as e:
        print(e)


# Get All General Interview Questions
@router.get("/interview-questions/general", response_model=List[hireMngr.ShowInterviewQuestion])
def get_all_general_interview_questions(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(InterviewQuestion).filter(InterviewQuestion.type == "General").all()
    except Exception as e:
        print(e)


# Get One Interview Question
@router.get("/interview-questions/{interview_question_id}", response_model=hireMngr.ShowInterviewQuestion)
def get_one_interview_question(
    interview_question_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            interview_question = db.query(InterviewQuestion).filter(InterviewQuestion.interview_question_id == interview_question_id).first()
            if not interview_question:
                raise HTTPException(status_code=404, detail=INTERVIEW_QUESTION_NOT_FOUND_RESPONSE)
            else:
                return interview_question
    except Exception as e:
        print(e)


# Update Interview Question
@router.put("/interview-question/{interview_question_id}", status_code=202)
def update_interview_question(
    interview_question_id: str,
    req: hireMngr.UpdateInterviewQuestion,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            interview_question = db.query(InterviewQuestion).filter(InterviewQuestion.interview_question_id == interview_question_id)
            if not interview_question.first():
                raise HTTPException(status_code=404, detail=INTERVIEW_QUESTION_NOT_FOUND_RESPONSE)
            else:
                interview_question.update(req.dict())
                db.commit()
                return {"message": "An interview question is updated successfully"}
    except Exception as e:
        print(e)

# Create Interview Schedule
@router.post("/interview-schedule", status_code=201)
def create_interview_schedule(
    req: hireMngr.CreateInterviewSchedule,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Create Interview Schedule
            new_interview_schedule = InterviewSchedule(
                job_post_id = req.job_post_id,
                scheduled_date = req.scheduled_date,
                start_session = req.start_session,
                end_session = req.end_session,
                set_by = user_data.employee_id
            )
            db.add(new_interview_schedule)
            db.commit()
            db.refresh(new_interview_schedule)
            
            # Create Schedule per interviewee/applicant
            for a in req.interviewees:
                new_interviewee = Interviewee(
                    applicant_id = a.applicant_id,
                    interview_schedule_id = new_interview_schedule.interview_schedule_id
                )
                db.add(new_interviewee)
                db.commit()
                db.refresh(new_interviewee)

                # Send email to interviewees/applicants
                
                applicant = db.query(Applicant).filter(Applicant.applicant_id == a.applicant_id).first()
                scheduled_date = req.scheduled_date.strftime("%B %d, %Y")
                start_session = req.start_session.strftime("%I:%M %p")
                end_session = req.end_session.strftime("%I:%M %p")

                position = db.query(Position).join(ManpowerRequest).filter(
                        ManpowerRequest.position_id == Position.position_id
                    ).join(JobPost).filter(
                        JobPost.manpower_request_id == ManpowerRequest.manpower_request_id,
                    ).join(Applicant).filter(
                        Applicant.applicant_id == applicant.applicant_id
                    ).first()
                    
                # messageBody = f"""
                #     <div style="padding: 3rem; border: solid #ddd 1px; border-radius: 5px">
                #             <h1 style="margin: 0">Job Application Status</h1>
                #             <h3 style="margin: 0">From: HoMIES - Human Resource Department</h3>

                #             <br />
                #             <br />
                    
                #             <div>Good day! <b>{applicant.first_name}</b>,</div>

                #             <br />
                            
                #             <p>We reviewed your application for the <b>{position}</b> position and your resume stood out to us and we would like to invite and schedule you for an interview to get to know you more.</p>
                #             <p>The interview will last about some time and you'll have the chance to discuss and ask questions about the position and learn more about our company.</p>
                #             <p>Would you be available at <b>{scheduled_date}</b> from <b>{start_session}</b> to <b>{end_session}</b>?</p>
                #             <p>We are looking forward to know you more.</b>
                            
                #             <br />

                #             <p>Best Regards, <br /> HoMIES - Human Resource Department</p>
                #     </div>
                    
                #     <br />

                #     <p style="color: red">This message is auto-generated by the HoMIES Recruitment Management System. Please, DO NOT REPLY.</p>
                # """

                # message = MIMEMultipart()
                # message['From'] = env['MAIL_EMAIL']
                # message['To'] = applicant.email
                # message['Subject'] = "HoMIES - Job Application"

                # message.attach(MIMEText(messageBody, 'html'))

                # SMTP_SERVER = smtplib.SMTP_SSL(env['MAIL_SERVER'], 465)
                # SMTP_SERVER.login(env['MAIL_EMAIL'], env['MAIL_PASSWORD'])
                # SMTP_SERVER.sendmail(env["MAIL_EMAIL"], [applicant.email], message.as_string())
                # SMTP_SERVER.quit()

            return {"message": "Interview schedule is successfully created"}
    except Exception as e:
        print(e)


# Get Interview Schedules and Applicants
@router.get("/interview-schedules", response_model=List[hireMngr.ShowInterviewScheduleInfo])
def interview_schedules_and_applicants(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(InterviewSchedule).filter(
                InterviewSchedule.set_by == user_data.employee_id
            ).all()
    except Exception as e:
        print(e)

# Get Interview Schedule and Applicants
@router.get("/interview-schedules/{interview_schedule_id}", response_model=hireMngr.ShowInterviewScheduleInfo)
def interview_schedules_and_applicants(
    interview_schedule_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            interview_schedule = db.query(InterviewSchedule).filter(
                InterviewSchedule.interview_schedule_id == interview_schedule_id
            ).first()

            if not interview_schedule:
                raise HTTPException(status_code=404, detail=INTERVIEW_SCHEDULE_NOT_FOUND_RESPONSE)
            else:
                return interview_schedule
    except Exception as e:
        print(e)


# Get Interviewees per Schedule
@router.get("/interview-schedules/{interview_schedule_id}/interviewees", response_model=List[hireMngr.IntervieweeInfo])
def interviewees_per_schedule(
    interview_schedule_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            if not interview_schedule_id:
                raise HTTPException(status_code=404, detail=INTERVIEW_SCHEDULE_NOT_FOUND_RESPONSE)
            else:
                interview_schedule = db.query(InterviewSchedule).filter(
                    InterviewSchedule.interview_schedule_id == interview_schedule_id
                ).first()
                return interview_schedule.interviewees
    except Exception as e:
        print(e)


# Create General Interview Scores
@router.post("/interview-scores/{interviewee_id}", status_code=201)
def create_general_interviewee_scores(
    interviewee_id: str,
    req: hireMngr.CreateGeneralIntervieweeScore,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            interviewee = db.query(Interviewee).filter(Interviewee.interviewee_id == interviewee_id).first()
            if not interviewee:
                raise HTTPException(status_code=404, detail=INTERVIEWEE_NOT_FOUND_RESPONSE)
            else:
                new_interview_score = InterviewScore(
                    interviewee_id = interviewee_id,
                    interview_question_id = req.interview_question_id,
                    score = req.score,
                    scored_by = user_data.employee_id
                )
                db.add(new_interview_score)
                db.commit()
                db.refresh(new_interview_score)
                return {"message": "General Interview Scores are recorded"}
    except Exception as e:
        print(e)


# Get One Interviewee
@router.get("/interviewee/{interviewee_id}", response_model=hireMngr.IntervieweeInfo)
def get_one_intervieweee(
    interviewee_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            interviewee = db.query(Interviewee).filter(Interviewee.interviewee_id == interviewee_id).first()
            if not interviewee:
                raise HTTPException(status_code=404, detail=INTERVIEWEE_NOT_FOUND_RESPONSE)
            else:
                return interviewee
    except Exception as e:
        print(e)


# Update Interviewee Status
@router.put("/interviewee/{interviewee_id}", status_code=202)
def update_interviewee(
    interviewee_id: str,
    req: hireMngr.UpdateInterviewee,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            interviewee = db.query(Interviewee).filter(Interviewee.interviewee_id == interviewee_id)
            if not interviewee.first():
                raise HTTPException(status_code=404, detail=INTERVIEWEE_NOT_FOUND_RESPONSE)
            else:
                interviewee.update({
                    "is_interviewed": req.is_interviewed,
                    "interviewed_at": req.interviewed_at,
                    "remarks": req.remarks
                })
                db.commit()
                return {"message": "An interviewee record is updated"}
    except Exception as e:
        print(e)