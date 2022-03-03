# Import Package
from datetime import datetime, date, time
from typing import List, Optional
from pydantic import BaseModel
from app.internal.human_resource.rms.schemas.user_schemas import ShowUserInfo
from app.internal.human_resource.rms.schemas.recruiter_schemas import ShowJobCategory, ShowApplicant
from app.internal.human_resource.rms.schemas.deptMngr_schemas import ShowEmploymentType, ShowPositionForManpowerRequest


# Show Manpower Request
class ShowManpowerRequest(BaseModel):
    manpower_request_id: str
    requisition_no: str
    vacant_position: ShowPositionForManpowerRequest
    employment_type: ShowEmploymentType
    request_nature: str
    staffs_needed: int
    min_monthly_salary: Optional[float]
    max_monthly_salary: Optional[float]
    content: str
    request_status: str
    deadline: Optional[datetime]
    manpower_request_requested_by: ShowUserInfo
    manpower_request_signed_by: Optional[ShowUserInfo]
    manpower_request_reviewed_by: Optional[ShowUserInfo]
    manpower_request_rejected_by: Optional[ShowUserInfo]
    signed_at: Optional[datetime]
    reviewed_at: Optional[datetime]
    completed_at: Optional[datetime]
    rejected_at: Optional[datetime]
    remarks: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


# Manpower Request Approval
class ManpowerRequestApproval(BaseModel):
    request_status: str
    remarks: Optional[str]


# Show Job Post
class ShowJobPost(BaseModel):
    job_post_id: str
    manpower_request: ShowManpowerRequest
    is_salary_visible: bool
    content: str
    job_category: ShowJobCategory
    expiration_date: Optional[datetime]
    applicants: Optional[List[ShowApplicant]]
    job_post_posted_by: ShowUserInfo
    views: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


# Interviewee
class Interviewee(BaseModel):
    applicant_id: str



# Interview Schedule
class InterviewSchedule(BaseModel):
    scheduled_date: date
    start_session: time
    end_session: time


# Create Interview Schedule
class CreateInterviewSchedule(InterviewSchedule):
    job_post_id: str
    interviewees: List[Interviewee]


# Interview Schedule Info
class InterviewScheduleInfo(InterviewSchedule):
    schedule_for: ShowJobPost

    class Config():
        orm_mode = True


# Interview Question
class InterviewQuestion(BaseModel):
    question: str
    type: str

    class Config():
        orm_mode = True


# Interviewee Score
class IntervieweeScore(BaseModel):
    interview_question: InterviewQuestion
    score: float
    interview_scored_by: ShowUserInfo

    class Config():
        orm_mode = True


# Create General Interviewee Score
class CreateGeneralIntervieweeScore(BaseModel):
    interview_question_id: str
    score: float


# Interviewee Info
class IntervieweeInfo(BaseModel):
    interviewee_id: str
    applicant_info: ShowApplicant
    interviewee_schedule: Optional[InterviewScheduleInfo]
    interview_scores: List[Optional[IntervieweeScore]]
    is_interviewed: Optional[bool]
    interviewed_at: Optional[datetime]
    remarks: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config():
        orm_mode = True


# Show Interviewee Info
class ShowIntervieweeInfo(ShowApplicant):
    interviewee_info: Optional[IntervieweeInfo]

    class Config():
        orm_mod =  True


# Show Interview Schedule Info
class ShowInterviewScheduleInfo(InterviewScheduleInfo):
    interview_schedule_id: str
    interviewees: List[IntervieweeInfo]
    
    class Config():
        orm_mode = True


# Show Interview Question
class ShowInterviewQuestion(BaseModel):
    interview_question_id: str
    question: str
    type: str
    interview_question_added_by: ShowUserInfo
    interview_question_updated_by: ShowUserInfo
    created_at: datetime
    updated_at: datetime

    class Config():
        orm_mode = True


# Update Interview Question
class UpdateInterviewQuestion(BaseModel):
    question: str


# Create Interview Question
class CreateInterviewQuestion(BaseModel):
    question: str
    type: str


# Update Interviewee
class UpdateInterviewee(BaseModel):
    is_interviewed: Optional[bool]
    interviewed_at: Optional[datetime]
    remarks: Optional[str]


# Update Applicant Status
class UpdateApplicantStatus(BaseModel):
    status: str
    remarks: Optional[str]