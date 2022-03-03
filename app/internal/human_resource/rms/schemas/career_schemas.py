# Import Package
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.internal.human_resource.rms.schemas.recruiter_schemas import ShowJobCategory
from app.internal.human_resource.rms.schemas.deptMngr_schemas \
    import ShowEmploymentType, ShowPositionForManpowerRequest


# Manpower Request
class ManpowerRequest(BaseModel):
    vacant_position: ShowPositionForManpowerRequest
    employment_type: ShowEmploymentType
    request_nature: str
    staffs_needed: int
    min_monthly_salary: Optional[float]
    max_monthly_salary: Optional[float]

    class Config():
        orm_mode = True


# Show Job Category
class ShowEmploymentType(BaseModel):
    employment_type_id: str
    name: str
    description: str

    class Config():
        orm_mode = True


# Show Job Post For Applicants
class ShowJobPost(BaseModel):
    is_salary_visible: bool
    job_category: ShowJobCategory
    content: str
    expiration_date: Optional[datetime]
    job_post_id: str
    views: int
    manpower_request: ManpowerRequest
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


# Search
class Search(BaseModel):
    query: str


# Applicants Schema
class Applicant(BaseModel):
    job_post_id: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    suffix_name: Optional[str]
    contact_number: str
    email: str
    resume: str