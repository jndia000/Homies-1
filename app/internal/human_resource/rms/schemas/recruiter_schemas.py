# Import Package
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.internal.human_resource.rms.schemas.user_schemas import ShowUserInfo
from app.internal.human_resource.rms.schemas.deptMngr_schemas \
    import ShowEmploymentType, ShowPositionForManpowerRequest


# Manpower Request
class ManpowerRequest(BaseModel):
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


# Create Job Category
class CreateJobCategory(BaseModel):
    name: str
    description: str


# Job Category
class JobCategory(BaseModel):
    job_category_id: str
    name: str
    description: str
    is_removed: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


# Update Job Category
class UpdateJobCategory(BaseModel):
    name: str
    description: str


# Show Job Category
class ShowJobCategory(JobCategory):
    job_category_created_by: ShowUserInfo

    class Config():
        orm_mode = True


# Job Post
class JobPost(BaseModel):
    job_post_id: str
    job_post_posted_by: ShowUserInfo
    content: str
    is_salary_visible: bool
    expiration_date: Optional[datetime]
    views: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


# Applicant
class Applicant(BaseModel):
    first_name: str
    middle_name: Optional[str]
    last_name: str
    suffix_name: Optional[str]
    contact_number: str
    email: str
    resume: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


# Show Job Post
class ShowJobPost(JobPost):
    job_category: JobCategory
    manpower_request: ManpowerRequest
    applicants: List[Optional[Applicant]]

    class Config():
        orm_mode = True


# Show Manpower Request
class ShowManpowerRequest(ManpowerRequest):
    job_post: Optional[JobPost]

    class Config():
        orm_mode = True


# Create Job Post
class CreateJobPost(BaseModel):
    manpower_request_id: str
    is_salary_visible: bool
    job_category_id: str
    content: str
    expiration_date: Optional[datetime]


# Update Job Post(BaseModel):
class UpdateJobPost(BaseModel):
    is_salary_visible: bool
    job_category_id: str
    content: str
    expiration_date: Optional[datetime]


# Show Applicant
class ShowApplicant(Applicant):
    applicant_id: str
    applied_job: ShowJobPost
    status: str
    applicant_evaluated_by: Optional[ShowUserInfo]
    applicant_screened_by: Optional[ShowUserInfo]
    applicant_hired_by: Optional[ShowUserInfo]
    applicant_rejected_by: Optional[ShowUserInfo]
    evaluated_at: Optional[datetime]
    screened_at: Optional[datetime]
    hired_at: Optional[datetime]
    rejected_at: Optional[datetime]
    remarks: Optional[str]

    class Config():
        orm_mode = True


# Applicant Evaluation
class ApplicantEvaluation(BaseModel):
    status: str
    remarks: Optional[str]