# Import Packages
from sqlalchemy import and_, or_, cast, func, Date
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.exceptions import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from database import get_db
from oauth2 import get_user, isAuthorized, UserData

# Import Models and Schemas
from models import *
from app.internal.human_resource.recruitment.schemas \
    import main_schemas as main, user_schemas as user, deptHead_schemas as deptHead, deptMngr_schemas as deptMngr


# For file handling
import shutil, uuid


# Router Instance
router = APIRouter(prefix = "/api/department-head")


# Authorization
AUTHORIZED_SUBSYSTEM = "Recruitment"
AUTHORIZED_ROLE = "Department Head"


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
                raise HTTPException(status_code = 404, detail = {"message": "Employee does not exist"})
            return user_info
    except Exception as e:
        print(e)

# ====================================================================
# MANPOWER REQUESTS
# ====================================================================


# # Manpower Request Not Found Response
MANPOWER_REQUEST_NOT_FOUND_RESPONSE = {"message": "Manpower request was not found"}


# Get All Manpower Request
@router.get("/manpower-requests", response_model=List[deptMngr.ShowManpowerRequest])
def get_all_manpower_requests(
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            user_department = db.query(Department).join(SubDepartment).filter(
                Department.department_id == SubDepartment.department_id
            ).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Employee.employee_id == user_data.employee_id, 
                Position.position_id == Employee.position_id
            ).first()

            if not user_department:
                raise HTTPException(status_code = 404, detail = {"message": "User department not found"})
            else:
                return db.query(ManpowerRequest).join(Position).filter(
                    Position.position_id == ManpowerRequest.position_id
                ).join(SubDepartment).filter(
                    SubDepartment.sub_department_id == Position.sub_department_id,
                ).join(Department).filter(
                    Department.department_id == user_department.department_id,
                ).all()
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
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            user_department = db.query(Department).join(SubDepartment).filter(
                Department.department_id == SubDepartment.department_id
            ).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Employee.employee_id == user_data.employee_id, 
                Position.position_id == Employee.position_id
            ).first()

            print("Test")
            print(user_department)

            if not user_department:
                return HTTPException(status_code=404, detail={"message": "User department not found"})
            else:
                query = db.query(ManpowerRequest).join(Position).filter(
                    Position.position_id == ManpowerRequest.position_id
                ).join(SubDepartment).filter(
                    SubDepartment.sub_department_id == Position.sub_department_id,
                ).join(Department).filter(
                    Department.department_id == user_department.department_id,
                )

                total_query = query
                
                for_signature_query = query.filter(ManpowerRequest.request_status == "For signature")
                for_approval_query = query.filter(ManpowerRequest.request_status == "For approval")
                approved_query = query.filter(ManpowerRequest.request_status == "Approved")
                completed_query = query.filter(ManpowerRequest.request_status == "Completed")
                rejected_for_signing_query = query.filter(ManpowerRequest.request_status == "Rejected for signing")
                rejected_for_approval_query = query.filter(ManpowerRequest.request_status == "Rejected for approval")
                
                if start and end:
                    date_filter = and_(ManpowerRequest.created_at >= start, ManpowerRequest.created_at <= end)
                    total_query = total_query.filter(date_filter)
                    for_signature_query = for_signature_query.filter(date_filter)
                    for_approval_query = for_approval_query.filter(date_filter)
                    approved_query = approved_query.filter(date_filter)
                    completed_query = completed_query.filter(date_filter)
                    rejected_for_signing_query = rejected_for_signing_query.filter(date_filter)
                    rejected_for_approval_query = rejected_for_approval_query.filter(date_filter)
                
                total_ongoing = for_signature_query.count() + for_approval_query.count() + approved_query.count()
                total_rejected = rejected_for_signing_query.count() + rejected_for_approval_query.count()

                return {
                    "total": total_query.count(),
                    "on_going": {
                        "total": total_ongoing,
                        "for_signature": for_signature_query.count(),
                        "for_approval": for_approval_query.count(),
                        "approved": approved_query.count(),
                    },
                    "completed": completed_query.count(),
                    "rejected": {
                        "total": total_rejected,
                        "for_signing": rejected_for_signing_query.count(),
                        "for_approval": rejected_for_approval_query.count()
                    }
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
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            user_department = db.query(Department).join(SubDepartment).filter(
                    Department.department_id == SubDepartment.department_id
                ).join(Position).filter(
                    SubDepartment.sub_department_id == Position.sub_department_id
                ).join(Employee).filter(
                    Employee.employee_id == user_data.employee_id, 
                    Position.position_id == Employee.position_id
                ).first()
            
            if not user_department:
                return HTTPException(status_code = 404, detail = {"message": "User department not found"})
            else:
                target_column = cast(ManpowerRequest.created_at, Date)

                query = db.query(
                    target_column.label("created_at"), 
                    func.count(ManpowerRequest.manpower_request_id).label("total")
                ).join(Position).filter(
                    Position.position_id == ManpowerRequest.position_id
                ).join(SubDepartment).filter(
                    SubDepartment.sub_department_id == Position.sub_department_id,
                ).join(Department).filter(
                    Department.department_id == user_department.department_id,
                ).group_by(target_column)

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
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            manpower_request = db.query(ManpowerRequest).filter(
                ManpowerRequest.manpower_request_id == manpower_request_id
            ).first()
            if not manpower_request:
                raise HTTPException(status=404, detail=MANPOWER_REQUEST_NOT_FOUND_RESPONSE) 
            else:
                return manpower_request
    except Exception as e:
        print(e)


# Sign Manpower Request
@router.put("/manpower-requests/{manpower_request_id}/sign", status_code=202)
def sign_manpower_request(
    manpower_request_id: str,
    req: deptHead.SignManpowerRequest,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id)
            if not manpower_request.first():
                return HTTPException(status_code=404, detail=MANPOWER_REQUEST_NOT_FOUND_RESPONSE)
            else:
                if req.request_status == "For approval":
                    manpower_request.update({
                        "request_status": req.request_status,
                        "signed_by": user_data.employee_id,
                        "signed_at": text('NOW()')
                    })
                elif req.request_status == "Rejected for signing":
                    manpower_request.update({
                        "request_status": req.request_status,
                        "remarks": req.remarks,
                        "rejected_by": user_data.employee_id,
                        "rejected_at": text('NOW()')
                    })
                db.commit()
                return {"message": "A manpower request has been signed"}
    except Exception as e:
        print(e)


# ====================================================================
# HIRED APPLICANTS
# ====================================================================


# Applicant Not Found Response
APPLICANT_NOT_FOUND_RESPONSE = {"message": "Applicant not found"}


# Get all hired applicants
@router.get("/hired-applicants", response_model=List[deptHead.ShowHiredApplicant])
def get_all_hired_applicants(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):

            # Get the user department
            user_department = db.query(Department).join(SubDepartment).filter(
                Department.department_id == SubDepartment.department_id
            ).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Employee.employee_id == user_data.employee_id, 
            ).first()
            
            return db.query(Applicant).filter(or_(
                Applicant.status == "Hired",
                Applicant.status == "Contract signed",
            )).join(JobPost).filter(
                Applicant.job_post_id == JobPost.job_post_id
            ).join(ManpowerRequest).filter(
                JobPost.manpower_request_id == ManpowerRequest.manpower_request_id
            ).join(Position).filter(
                ManpowerRequest.position_id == Position.position_id
            ).join(SubDepartment).filter(
                Position.sub_department_id == SubDepartment.sub_department_id
            ).join(Department).filter(
                SubDepartment.department_id == Department.department_id, 
                Department.department_id ==  user_department.department_id
            ).all()
    except Exception as e:
        print(e)


# Get all hired applicants analytics
@router.get("/hired-applicants/analytics")
def hired_applicants_analytics(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):

            # Get the user department
            user_department = db.query(Department).join(SubDepartment).filter(
                Department.department_id == SubDepartment.department_id
            ).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Employee.employee_id == user_data.employee_id, 
            ).first()
            
            hired_applicants = db.query(Applicant).filter(or_(
                Applicant.status == "Hired",
                Applicant.status == "Contract signed",
            )).join(JobPost).filter(
                Applicant.job_post_id == JobPost.job_post_id
            ).join(ManpowerRequest).filter(
                JobPost.manpower_request_id == ManpowerRequest.manpower_request_id
            ).join(Position).filter(
                ManpowerRequest.position_id == Position.position_id
            ).join(SubDepartment).filter(
                Position.sub_department_id == SubDepartment.sub_department_id
            ).join(Department).filter(
                SubDepartment.department_id == Department.department_id, 
                Department.department_id ==  user_department.department_id
            ).count()

            return {
                "hired_applicants": hired_applicants
            }
    except Exception as e:
        print(e)


# Get one hired applicant
@router.get("/hired-applicants/{applicant_id}", response_model=deptHead.ShowHiredApplicant)
def get_one_hired_applicant(
    applicant_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            
            # Get the user department
            user_department = db.query(Department).join(SubDepartment).filter(
                Department.department_id == SubDepartment.department_id
            ).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Employee.employee_id == user_data.employee_id, 
            ).first()

            # Get the hired applicant
            hired_applicant = db.query(Applicant).filter(
                Applicant.applicant_id == applicant_id,
                or_(
                    Applicant.status == "Hired",
                    Applicant.status == "Contract signed",
                )
            ).join(JobPost).filter(
                Applicant.job_post_id == JobPost.job_post_id
            ).join(ManpowerRequest).filter(
                JobPost.manpower_request_id == ManpowerRequest.manpower_request_id
            ).join(Position).filter(
                ManpowerRequest.position_id == Position.position_id
            ).join(SubDepartment).filter(
                Position.sub_department_id == SubDepartment.sub_department_id, 
            ).join(Department).filter(
                SubDepartment.department_id == Department.department_id,
                Department.department_id ==  user_department.department_id
            ).first()

            # Raise error if hired applicant not exist in database
            if not hired_applicant:
                raise HTTPException(status_code=404, detail=APPLICANT_NOT_FOUND_RESPONSE)
            return hired_applicant
    except Exception as e:
        print(e)


# Upload Signed Contract
@router.post("/upload/employment-contract", status_code=202)
def upload_employment_contract(
    file: UploadFile = File(...), 
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            orig_filename = f"{file.filename}"
            file_extension = orig_filename.split('.')[-1]
            new_filename = uuid.uuid4().hex
            file_location = f"static/src/files/internal/human_resource/recruitment/employment_contracts/{new_filename}.{file_extension}"
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


# ====================================================================
# ONBOARDING EMPLOYEES
# ====================================================================

# Onboarding Employee Not Found Response
ONBOARDING_EMPLOYEE_NOT_FOUND = {"message": "Onboarding Employee not found"}

# Department Not Found Response
DEPARTMENT_NOT_FOUND_RESPONSE = {"message": "Department not found"}

# Add onboarding employee
@router.post("/onboarding-employees", status_code=202)
def add_onboarding_employee(
    req: deptHead.CreateOnboardingEmployee,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            
            # Set applicant query
            applicantQuery = db.query(Applicant).filter(
                Applicant.applicant_id == req.applicant_id,
                Applicant.status == "Hired"
            )
            
            # Check if applicant is existing in datavase
            applicant = applicantQuery.first()
            
            if not applicant:
                raise HTTPException(status_code=404, detail = APPLICANT_NOT_FOUND_RESPONSE)
            else:

                # Trace and get position
                job_post = db.query(JobPost).filter(JobPost.job_post_id == applicant.job_post_id).first()
                manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == job_post.manpower_request_id).first()
                position = db.query(Position).filter(Position.position_id == manpower_request.position_id).first()

                # New onboarding employee
                new_onboarding_employee = OnboardingEmployee(
                    first_name = applicant.first_name,
                    middle_name = applicant.middle_name,
                    last_name = applicant.last_name,
                    suffix_name = applicant.suffix_name,
                    contact_number = applicant.contact_number,
                    email = applicant.email,
                    position_id = position.position_id,
                    employment_contract = req.employment_contract,
                    status = "Pending",
                    signed_by = user_data.employee_id
                )

                # Update Applicant Status
                applicantQuery.update({"status": "Contract signed"})

                # Add new onboarding employee to database
                db.add(new_onboarding_employee)
                db.commit()
                db.refresh(new_onboarding_employee)
                return new_onboarding_employee
    except Exception as e:
        print(e)


# Get All Onboarding Employees
@router.get("/onboarding-employees", response_model=List[deptHead.ShowOnboardingEmployee])
def get_all_onboarding_employees(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            
            # Get the user department
            user_department = db.query(Department).join(SubDepartment).filter(
                Department.department_id == SubDepartment.department_id
            ).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Employee.employee_id == user_data.employee_id, 
            ).first()
            
            # If user department exist in database
            if not user_department:
                raise HTTPException(status=404, detail=DEPARTMENT_NOT_FOUND_RESPONSE)
            else:
                return db.query(OnboardingEmployee).filter(
                    OnboardingEmployee.status == "Onboarding"
                ).join(Position).filter(
                    Position.position_id == OnboardingEmployee.position_id
                ).join(SubDepartment).filter(
                    SubDepartment.sub_department_id == Position.sub_department_id
                ).join(Department).filter(
                    Department.department_id == SubDepartment.department_id,
                    Department.department_id == user_department.department_id
                ).all()
    except Exception as e:
        print(e)


# Onboarding Employees Analytics
@router.get("/onboarding-employees/analytics")
def onboarding_employees_analytics(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            
            # Get the user department
            user_department = db.query(Department).join(SubDepartment).filter(
                Department.department_id == SubDepartment.department_id
            ).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Employee.employee_id == user_data.employee_id, 
            ).first()
            
            # If user department exist in database
            if not user_department:
                raise HTTPException(status=404, detail=DEPARTMENT_NOT_FOUND_RESPONSE)
            else:
                total = db.query(OnboardingEmployee).filter(
                    OnboardingEmployee.status == "Onboarding"
                ).join(Position).filter(
                    Position.position_id == OnboardingEmployee.position_id
                ).join(SubDepartment).filter(
                    SubDepartment.sub_department_id == Position.sub_department_id
                ).join(Department).filter(
                    Department.department_id == SubDepartment.department_id,
                    Department.department_id == user_department.department_id
                ).count()
                
                return {"total": total}
    except Exception as e:
        print(e)


# Get One Onboarding Employees
@router.get("/onboarding-employees/{onboarding_employee_id}", response_model=deptHead.ShowOnboardingEmployee)
def get_one_onboarding_employee(
    onboarding_employee_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            onboarding_employee = db.query(OnboardingEmployee).filter(
                OnboardingEmployee.onboarding_employee_id == onboarding_employee_id
            ).first()

            if not onboarding_employee:
                raise HTTPException(status_code=404, detail=ONBOARDING_EMPLOYEE_NOT_FOUND)
            else:
                return onboarding_employee
    except Exception as e:
        print(e)


# ====================================================================
# ONBOARDING EMPLOYEE TASKS
# ====================================================================


# Onboarding Employee Task Not Found
ONBOARDING_EMPLOYEE_TASK_NOT_FOUND = {"message": "Onboarding Employee Task Not Found"}


# Get All Onboarding Employee Task
@router.get("/onboarding-employees/{onboarding_employee_id}/onboarding-tasks", response_model=List[deptHead.ShowOnboardingEmployeeTask])
def get_all_onboarding_employee_tasks(
    onboarding_employee_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            onboarding_employee = db.query(OnboardingEmployee).filter(
                OnboardingEmployee.onboarding_employee_id == onboarding_employee_id
            ).first()
            
            if not onboarding_employee:
                raise HTTPException(status_code = 404, detail=ONBOARDING_EMPLOYEE_NOT_FOUND)
            else:
                return db.query(OnboardingEmployeeTask).filter(OnboardingEmployeeTask.onboarding_employee_id == onboarding_employee_id).all()
    except Exception as e:
        print(e)


# Get One Onboarding Employee Task
@router.get("/onboarding-employee-tasks/{onboarding_employee_task_id}", response_model=deptHead.ShowOnboardingEmployeeTask)
def get_one_onboarding_employee_tasks(
    onboarding_employee_task_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE):
            onboarding_employee_task = db.query(OnboardingEmployeeTask).filter(
                OnboardingEmployeeTask.onboarding_employee_task_id == onboarding_employee_task_id
            ).first()

            if not onboarding_employee_task:
                raise HTTPException(status_code=404, detail=ONBOARDING_EMPLOYEE_TASK_NOT_FOUND)
            else:
                return onboarding_employee_task
    except Exception as e:
        print(e)