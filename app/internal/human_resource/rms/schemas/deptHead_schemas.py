# Import Package
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel
from app.internal.human_resource.rms.schemas.user_schemas import ShowUserInfo
from app.internal.human_resource.rms.schemas.recruiter_schemas import JobPost
from app.internal.human_resource.rms.schemas.deptMngr_schemas \
    import ShowEmploymentType, ShowPositionForManpowerRequest


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


# Sign Manpower Request
class SignManpowerRequest(BaseModel):
    request_status: str
    remarks: Optional[str]


# ShowJobPost
class ShowJobPost(JobPost):
    manpower_request: ShowManpowerRequest

    class Config():
        orm_mode = True


# Show Hired Applicant
class ShowHiredApplicant(BaseModel):
    applicant_id: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    suffix_name: Optional[str]
    contact_number: str
    email: str
    resume: str
    status: str
    evaluation_done_by: Optional[ShowUserInfo]
    evaluated_at: Optional[datetime]
    screening_done_by: Optional[ShowUserInfo]
    screened_at: Optional[datetime]
    hired_at: Optional[datetime]
    hiring_done_by: Optional[ShowUserInfo]
    rejection_done_by: Optional[ShowUserInfo]
    rejected_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    applied_job: ShowJobPost

    class Config():
        orm_mode = True


# Create Onboarding Employee
class CreateOnboardingEmployee(BaseModel):
    applicant_id: str
    employment_contract: str


# OnboardingEmployee
class OnboardingEmployee(BaseModel):
    onboarding_employee_id: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    suffix_name: Optional[str]
    onboarding_employee_position: ShowPositionForManpowerRequest
    contact_number: str
    email: str
    employment_contract: str
    employment_start_date: Optional[date]
    onboarding_employee_signed_by: ShowUserInfo
    created_at: datetime
    updated_at: Optional[datetime]


# Onboarding Task
class OnboardingTask(BaseModel):
    onboarding_task_id: str
    title: str
    description: str
    task_type: str

    class Config():
        orm_mode = True


# Show Onboarding Employee Task
class ShowOnboardingEmployeeTask(BaseModel):
    onboarding_employee_task_id: str
    status: str
    start_at: datetime
    end_at: datetime
    onboarding_task: OnboardingTask
    onboarding_employee_task_assigned_by: ShowUserInfo
    onboarding_employee_task_completed_by: Optional[ShowUserInfo]
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


# Show Onboarding Employee
class ShowOnboardingEmployee(OnboardingEmployee):
    onboarding_employee_tasks: List[ShowOnboardingEmployeeTask]

    class Config():
        orm_mode = True