# Import Packages
from sqlalchemy import func, and_, cast, text, Date
from typing import List, Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from database import get_db
from oauth2 import isAuthorized, get_user, UserData

# Import Models and Schemas
from models import *
from app.internal.human_resource.recruitment.schemas \
    import main_schemas as main, user_schemas as user, deptMngr_schemas as deptMngr


# Router Instance
router = APIRouter(prefix = "/api/department-manager")


# Authorization
AUTHORIZED_SUBSYSTEM = "Recruitment"
AUTHORIZED_ROLE = "Department Manager"


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
            else:
                return user_info
    except Exception as e:
        print(e)


# ====================================================================
# MANPOWER REQUESTS
# ====================================================================


# ManpowerRequest/Manpower Request Not Found Response
MANPOWER_REQUEST_NOT_FOUND_RESPONSE = {"message": "Manpower request was not found"}


# Create Manpower Request
@router.post("/manpower-requests", status_code = 201)
def create_manpower_request(
    req: deptMngr.CreateManpowerRequest,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            new_manpower_request = ManpowerRequest(
                **req.dict(),
                requested_by = user_data.employee_id, 
                request_status = "For signature"
            )
            db.add(new_manpower_request)
            db.commit()
            db.refresh(new_manpower_request)
            return {
                "data": new_manpower_request,
                "message": "A manpower request has been submitted successfully"
            }
    except Exception as e:
        print(e)


# Get All Manpower Requests
@router.get("/manpower-requests", response_model = List[deptMngr.ShowManpowerRequest])
def get_all_requisitions(
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(ManpowerRequest).filter(ManpowerRequest.requested_by == user_data.employee_id).all()
    except Exception as e:
        print(e)


# Manpower Request Analytics
@router.get("/manpower-requests/analytics")
def requisition_analytics(
    db: Session = Depends(get_db), 
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            query = db.query(ManpowerRequest)
            requested_by_filter = ManpowerRequest.requested_by == user_data.employee_id
            
            # Total Query
            total_query = query.filter(requested_by_filter)

            # For signature Query
            for_signature_query = query.filter(
                ManpowerRequest.request_status == "For signature",
                requested_by_filter
            )
            
            # For Review Query
            for_approval_query = query.filter(
                ManpowerRequest.request_status == "For approval",
                requested_by_filter
            )
            
            # Approved Query
            approved_query = query.filter(
                ManpowerRequest.request_status == "Approved",
                requested_by_filter
            )
            
            # Rejected Query
            rejected_for_signing_query = query.filter(
                ManpowerRequest.request_status == "Rejected for signing",
                requested_by_filter
            )

            # Rejected for approval Query
            rejected_for_approval_query = query.filter(
                ManpowerRequest.request_status == "Rejected for approval",
                requested_by_filter
            )

            # Completed Query
            completed_query = query.filter(
                ManpowerRequest.request_status == "Completed",
                requested_by_filter
            )

            if start and end:
                date_filter = and_(ManpowerRequest.created_at >= start, ManpowerRequest.created_at <= end)
                total_query = total_query.filter(date_filter)
                for_signature_query = for_signature_query.filter(date_filter)
                for_approval_query = for_approval_query.filter(date_filter)
                approved_query = approved_query.filter(date_filter)
                rejected_for_signing_query = rejected_for_signing_query.filter(date_filter)
                rejected_for_approval_query = rejected_for_approval_query.filter(date_filter)
                completed_query = completed_query.filter(date_filter)

            total_on_going = for_signature_query.count() + for_approval_query.count() + approved_query.count()
            total_rejected = rejected_for_signing_query.count() + rejected_for_approval_query.count()
            
            return {
                "total": total_query.count(),
                "on_going": {
                    "total": total_on_going,
                    "for_signature": for_signature_query.count(),
                    "for_approval": for_approval_query.count(),
                    "approved": approved_query.count(),
                },
                "rejected": {
                    "total": total_rejected,
                    "for_signing": rejected_for_signing_query.count(),
                    "for_approval": rejected_for_approval_query.count()
                },
                "completed": completed_query.count()
            }
    except Exception as e:
        print(e)


# Manpower Request Data
@router.get("/manpower-requests/data")
def requisition_data(
    db: Session = Depends(get_db),
    start: Optional[str] = None,
    end: Optional[str] = None,
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):

            # Set the target column
            target_column = cast(ManpowerRequest.created_at, Date)

            # Set the query
            requests_query = db.query(
                target_column.label("created_at"), 
                func.count(ManpowerRequest.manpower_request_id).label("total")
            ).filter(ManpowerRequest.requested_by == user_data.employee_id).group_by(target_column)

            if start and end:
                requests_query = requests_query.filter(and_(
                    ManpowerRequest.created_at >= start, 
                    ManpowerRequest.created_at <= end
                ))
            
            return requests_query.all()
    except Exception as e:
        print(e)


# Get One Manpower Request
@router.get("/manpower-requests/{manpower_request_id}", response_model = deptMngr.ShowManpowerRequest)
def get_one_requisition(
    manpower_request_id: str,
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id).first()
            if not manpower_request:
                return MANPOWER_REQUEST_NOT_FOUND_RESPONSE
            return manpower_request
    except Exception as e:
        print(e)


# Update Manpower Request
@router.put("/manpower-requests/{manpower_request_id}", status_code=202)
def update_requisition(
    manpower_request_id: str,
    req: deptMngr.UpdateManpowerRequest,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            manpower_request = db.query(ManpowerRequest).filter(ManpowerRequest.manpower_request_id == manpower_request_id)
            if not manpower_request.first():
                raise HTTPException(status_code=404, detail=MANPOWER_REQUEST_NOT_FOUND_RESPONSE) 
            else:
                manpower_request.update(req.dict())
                db.commit()
                return {"message": "A manpower request has been updated"}
    except Exception as e:
        print(e)


# Delete Manpower Request
@router.delete("/manpower-requests/{manpower_request_id}")
def delete_requisition(
    manpower_request_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            manpower_request = db.query(ManpowerRequest).filter(
                ManpowerRequest.manpower_request_id == manpower_request_id,
                ManpowerRequest.requested_by == user_data.employee_id
            )
            if not manpower_request.first():
                raise HTTPException(status_code=404, detail=MANPOWER_REQUEST_NOT_FOUND_RESPONSE) 
            else:
                manpower_request.delete(synchronize_session = False)
                db.commit()
                return {"message": "A manpower request is successfully deleted"}
    except Exception as e:
        print(e) 


# Mark as completed
@router.put("/manpower-requests/{manpower_request_id}/complete", status_code=202)
def mark_requisition_as_completed(
    manpower_request_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            requisition = db.query(ManpowerRequest).filter(
                ManpowerRequest.manpower_request_id == manpower_request_id,
                ManpowerRequest.requested_by == user_data.employee_id
            )
            if not requisition.first():
                raise HTTPException(status_code=404, detail=MANPOWER_REQUEST_NOT_FOUND_RESPONSE)
            else:
                requisition.update({
                    "request_status": 'Completed',
                    "completed_at": text('NOW()')
                })
                db.commit()
                return {"message": "A manpower request is successfully updated"}
    except Exception as e:
        print(e)


# ====================================================================
# POSITIONS
# ====================================================================


# Department Not Found Response
SUB_DEPARTMENT_NOT_FOUND_RESPONSE = {"message": "Sub-department not found"}


# Department Positions
@router.get("/positions", response_model = List[main.ShowPosition])
def department_positions(
    db: Session = Depends(get_db), 
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                    SubDepartment.sub_department_id == Position.sub_department_id
                ).join(Employee).filter(
                    Employee.employee_id == user_data.employee_id, 
                    Employee.position_id == Position.position_id
                ).first()
            if not user_sub_department:
                raise HTTPException(status_code=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)
            else:
                return db.query(Position).join(SubDepartment).filter(SubDepartment.sub_department_id == user_sub_department.sub_department_id).all()
    except Exception as e:
        print(e)


# ====================================================================
# EMPLOYMENT TYPES
# ====================================================================


# Employment Type Not Found Response
EMPLOYMENT_TYPE_NOT_FOUND_RESPONSE = {"message": "Employment Type not found"}


# Get all employment types
@router.get("/employment-types", response_model = List[deptMngr.ShowEmploymentType])
def get_all_employment_types(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            return db.query(EmploymentType).all()
    except Exception as e:
        print(e)


# ====================================================================
# ONBOARDING TASKS
# ====================================================================


# Onboarding Task Not Found Response
ONBOARDING_TASK_NOT_FOUND = {"message": "Onboarding Task not found"}


# Add Onboarding task
@router.post("/onboarding-tasks")
def add_onboarding_task(
    req: deptMngr.CreateOnboardingTask,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Create Onboarding Task
            new_onboarding_task = OnboardingTask(
                **req.dict(),
                sub_department_id = user_sub_department.sub_department_id,
                added_by = user_data.employee_id,
                updated_by = user_data.employee_id
            )
            db.add(new_onboarding_task)
            db.commit()
            db.refresh(new_onboarding_task)

            # Return Success Message
            return {
                "data": new_onboarding_task,
                "message": "New onboarding task has been added"
            }
    except Exception as e:
        print(e)


# Get All General Onboarding Tasks
@router.get("/onboarding-tasks/general", response_model=List[deptMngr.ShowOnboardingTask])
def get_all_general_onboarding_tasks(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):

            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Check if user sub department is not exist in database
            if not user_sub_department:
                raise HTTPException(status=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)

            # If no error, return all onboarding task for that sub-department
            return db.query(OnboardingTask).filter(
                OnboardingTask.sub_department_id == user_sub_department.sub_department_id,
                OnboardingTask.is_general == True,
                OnboardingTask.is_deleted == False
            ).all()
    except Exception as e:
        print(e)


# Get All General Onboarding Tasks for New Employees
@router.get("/onboarding-tasks/general/for-new-employees", response_model=List[deptMngr.ShowOnboardingTask])
def get_all_general_onboarding_tasks(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Check if user sub department is not exist in database
            if not user_sub_department:
                raise HTTPException(status=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)

            return db.query(OnboardingTask).filter(
                OnboardingTask.sub_department_id == user_sub_department.sub_department_id, 
                OnboardingTask.task_type == "For new employees",
                OnboardingTask.is_general == True,
                OnboardingTask.is_deleted == False
            ).all()
    except Exception as e:
        print(e)


# Get All General Onboarding Tasks for the Team
@router.get("/onboarding-tasks/general/for-the-team", response_model=List[deptMngr.ShowOnboardingTask])
def get_all_general_onboarding_tasks(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Check if user sub department is not exist in database
            if not user_sub_department:
                raise HTTPException(status=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)

            return db.query(OnboardingTask).filter(
                OnboardingTask.sub_department_id == user_sub_department.sub_department_id, 
                OnboardingTask.task_type == "For the team",
                OnboardingTask.is_general == True,
                OnboardingTask.is_deleted == False
            ).all()
    except Exception as e:
        print(e)


# Get All General Onboarding Tasks for Department Manager
@router.get("/onboarding-tasks/general/my-tasks", response_model=List[deptMngr.ShowOnboardingTask])
def get_all_general_onboarding_tasks(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Check if user sub department is not exist in database
            if not user_sub_department:
                raise HTTPException(status=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)

            return db.query(OnboardingTask).filter(
                OnboardingTask.sub_department_id == user_sub_department.sub_department_id,  
                OnboardingTask.task_type == "For department manager",
                OnboardingTask.is_general == True,
                OnboardingTask.is_deleted == False
            ).all()
    except Exception as e:
        print(e)


# Get One General Onboarding Task
@router.get("/onboarding-tasks/{onboarding_task_id}", response_model=deptMngr.ShowOnboardingTask)
def get_one_onboarding_task(
    onboarding_task_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Check if user sub department is not exist in database
            if not user_sub_department:
                raise HTTPException(status=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)

            # Get the onboarding task
            onboarding_task = db.query(OnboardingTask).filter(
                OnboardingTask.sub_department_id == user_sub_department.sub_department_id, 
                OnboardingTask.onboarding_task_id == onboarding_task_id,
                OnboardingTask.is_general == True, 
                OnboardingTask.is_deleted == False
            ).first()

            # Check if onboarding task does not exist in database
            if not onboarding_task:
                raise HTTPException(status_code=404, detail=ONBOARDING_TASK_NOT_FOUND)

            # Else return it
            return onboarding_task
    except Exception as e:
        print(e)


# Remove General Onboarding Task
@router.delete("/onboarding-tasks/{onboarding_task_id}/remove")
def remove_general_onboarding_task(
    onboarding_task_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Check if user sub department is not exist in database
            if not user_sub_department:
                raise HTTPException(status=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)

            # Get the onboarding task
            onboarding_task = db.query(OnboardingTask).filter(
                OnboardingTask.sub_department_id == user_sub_department.sub_department_id, 
                OnboardingTask.onboarding_task_id == onboarding_task_id,
                OnboardingTask.is_general == True, 
                OnboardingTask.is_deleted == False
            )
            
            # If onboarding task not exists in database
            if not onboarding_task.first():
                raise HTTPException(status_code=404, detail=ONBOARDING_TASK_NOT_FOUND)

            # Check if onboarding task is already linked to other tables
            onboarding_tasks_count = db.query(OnboardingEmployeeTask).filter(OnboardingEmployeeTask.onboarding_task_id == onboarding_task_id).count()
            
            # Soft delete if yes, permanently delete if not
            if onboarding_tasks_count > 0:
                onboarding_task.update({"is_deleted": True})
            else:
                onboarding_task.delete(synchronize_session = False)
            
            # Commit changes and return message
            db.commit()
            return "Onboarding Task is successfully removed"
    except Exception as e:
        print(e)


# ====================================================================
# HIRED APPLICANTS
# ====================================================================


# Applicant not found response
APPLICANT_NOT_FOUND_RESPONSE = {"message": "Applicant not found"}


# Get all hired applicants
@router.get("/hired-applicants", response_model=List[deptMngr.ShowHiredApplicant])
def get_all_hired_applicants(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Check if user sub department is not exist in database
            if not user_sub_department:
                raise HTTPException(status=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)

            return db.query(OnboardingEmployee).filter(
                OnboardingEmployee.status == "Pending"
            ).join(Position).filter(
                OnboardingEmployee.position_id == Position.position_id
            ).join(SubDepartment).filter(
                Position.sub_department_id == SubDepartment.sub_department_id, 
                SubDepartment.sub_department_id ==  user_sub_department.sub_department_id
            ).all()
    except Exception as e:
        print(e)


# Hired applicants ccount
@router.get("/hired-applicants/analytics")
def hired_applicants_count(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()
            
            hired_applicants_count = db.query(OnboardingEmployee).filter(
                OnboardingEmployee.status == "Pending"
            ).join(Position).filter(
                OnboardingEmployee.position_id == Position.position_id
            ).join(SubDepartment).filter(
                Position.sub_department_id == SubDepartment.sub_department_id, 
                SubDepartment.sub_department_id ==  user_sub_department.sub_department_id
            ).count()

            return {"hired_applicants": hired_applicants_count}
    except Exception as e:
        print(e)


# Get one hired applicant
@router.get("/hired-applicants/{onboarding_employee_id}", response_model=deptMngr.ShowHiredApplicant)
def get_all_hired_applicants(
    onboarding_employee_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Sub-department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            onboarding_employee = db.query(OnboardingEmployee).filter(
                OnboardingEmployee.onboarding_employee_id == onboarding_employee_id,
                OnboardingEmployee.status == "Pending"
            ).join(Position).filter(
                OnboardingEmployee.position_id == Position.position_id
            ).join(SubDepartment).filter(
                Position.sub_department_id == SubDepartment.sub_department_id, 
                SubDepartment.sub_department_id ==  user_sub_department.sub_department_id
            ).first()
            
            if not onboarding_employee: 
                raise HTTPException(status_code=404, detail=APPLICANT_NOT_FOUND_RESPONSE)
            else:
                return onboarding_employee
    except Exception as e:
        print(e)


# ====================================================================
# ONBOARDING EMPLOYEE
# ====================================================================


# Onboarding employee not found
ONBOARDING_EMPLOYEE_NOT_FOUND = {"message": "Onboarding employee not found"}


# Get All Onboarding Employees
@router.get("/onboarding-employees", response_model=List[deptMngr.ShowOnboardingEmployee])
def get_all_onboarding_employees(
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):

            # Get User Department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            # Check if user is not 
            if not user_sub_department:
                raise HTTPException(status_code=404, detail=SUB_DEPARTMENT_NOT_FOUND_RESPONSE)
            else:
                return db.query(OnboardingEmployee).filter(
                    OnboardingEmployee.status == "Onboarding"
                ).join(Position).filter(
                    Position.position_id == OnboardingEmployee.position_id
                ).join(SubDepartment).filter(
                    SubDepartment.sub_department_id == user_sub_department.sub_department_id
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
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            
            # Get User Department
            user_sub_department = db.query(SubDepartment).join(Position).filter(
                SubDepartment.sub_department_id == Position.sub_department_id
            ).join(Employee).filter(
                Position.position_id == Employee.position_id,
                Employee.employee_id == user_data.employee_id
            ).first()

            if not user_sub_department:
                raise HTTPException(status_code=404, detail="Deparment does not exist")
            else:
                total = db.query(OnboardingEmployee).filter(
                    OnboardingEmployee.status == "Onboarding"
                ).join(Position).filter(
                    Position.position_id == OnboardingEmployee.position_id
                ).join(SubDepartment).filter(
                    SubDepartment.sub_department_id == user_sub_department.sub_department_id
                ).count()
                
                # Return the total number of onboarding employees
                return {"total": total}
    except Exception as e:
        print(e)


# Get One Onboarding Employees
@router.get("/onboarding-employees/{onboarding_employee_id}", response_model=deptMngr.ShowOnboardingEmployee)
def get_one_onboarding_employee(
    onboarding_employee_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            onboarding_employee = db.query(OnboardingEmployee).filter(
                OnboardingEmployee.onboarding_employee_id == onboarding_employee_id
            ).first()

            if not onboarding_employee:
                raise HTTPException(status_code=404, detail=ONBOARDING_EMPLOYEE_NOT_FOUND)
            else:
                return onboarding_employee
    except Exception as e:
        print(e)


# Update Onboarding Employee
@router.put("/onboarding-employees/{onboarding_employee_id}", status_code=202)
def update_onboarding_employee(
    onboarding_employee_id: str,
    req: deptMngr.UpdateOnboardingEmployee,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            onboarding_employee = db.query(OnboardingEmployee).filter(OnboardingEmployee.onboarding_employee_id == onboarding_employee_id)
            if not onboarding_employee.first():
                raise HTTPException(status_code=404, detail=ONBOARDING_EMPLOYEE_NOT_FOUND)
            else:
                onboarding_employee.update(req.dict())
                db.commit()
                return {"An onboarding employee record is succesfully updated"}
    except Exception as e:
        print(e)


# ====================================================================
# ONBOARDING EMPLOYEE TASKS
# ====================================================================


# Onboarding Employee Task not found
ONBOARDING_EMPLOYEE_TASK_NOT_FOUND = {"message": "Onboarding Employee Task not found"}


# Add Onboarding Employee Task
@router.post("/onboarding-employees/{onboarding_employee_id}/onboarding-tasks")
def add_employee_onboarding_task(
    onboarding_employee_id: str,
    req: deptMngr.CreateOnboardingEmployeeTask,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            onboarding_employee = db.query(OnboardingEmployee).filter(
                OnboardingEmployee.onboarding_employee_id == onboarding_employee_id
            ).first()
            
            if not onboarding_employee:
                raise HTTPException(status_code = 404, detail=ONBOARDING_EMPLOYEE_NOT_FOUND)
            else:
                new_onboarding_employee_task = OnboardingEmployeeTask(
                    onboarding_employee_id = onboarding_employee_id,
                    onboarding_task_id = req.onboarding_task_id,
                    start_at = req.start_at,
                    end_at = req.end_at,
                    assigned_by = user_data.employee_id,
                    status = "Pending"
                )
                db.add(new_onboarding_employee_task)
                db.commit()
                db.refresh(new_onboarding_employee_task)
                return {
                    "data": new_onboarding_employee_task,
                    "message": "New onboarding employee task is added"
                }
    except Exception as e:
        print(e)


# Get All Onboarding Employee Task
@router.get("/onboarding-employees/{onboarding_employee_id}/onboarding-tasks", response_model=List[deptMngr.ShowOnboardingEmployeeTask])
def get_all_onboarding_employee_tasks(
    onboarding_employee_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            onboarding_employee = db.query(OnboardingEmployee).filter(
                OnboardingEmployee.onboarding_employee_id == onboarding_employee_id
            ).first()
            
            if not onboarding_employee:
                raise HTTPException(status_code = 404, detail=ONBOARDING_EMPLOYEE_NOT_FOUND)
            else:
                return db.query(OnboardingEmployeeTask).filter(
                    OnboardingEmployeeTask.onboarding_employee_id == onboarding_employee_id
                ).all()
    except Exception as e:
        print(e)


# Get One Onboarding Employee Task
@router.get("/onboarding-employee-tasks/{onboarding_employee_task_id}", response_model=deptMngr.ShowOnboardingEmployeeTask)
def get_one_onboarding_employee_tasks(
    onboarding_employee_task_id: str,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            onboarding_employee_task = db.query(OnboardingEmployeeTask).filter(
                OnboardingEmployeeTask.onboarding_employee_task_id == onboarding_employee_task_id
            ).first()

            if not onboarding_employee_task:
                raise HTTPException(status_code=404, detail=ONBOARDING_EMPLOYEE_TASK_NOT_FOUND)
            else:
                return onboarding_employee_task
    except Exception as e:
        print(e)


# Update Onboarding Employee Task Status
@router.put("/onboarding-employee-tasks/{onboarding_employee_task_id}", status_code=202)
def update_onboarding_employee_task_status(
    onboarding_employee_task_id: str,
    req: deptMngr.UpdatedOnboardingEmployeeTaskStatus,
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            onboarding_task = db.query(OnboardingEmployeeTask).filter(
                OnboardingEmployeeTask.onboarding_employee_task_id == onboarding_employee_task_id
            )
            
            if not onboarding_task.first():
                raise HTTPException(status_code=404, detail=ONBOARDING_EMPLOYEE_TASK_NOT_FOUND)
            else:
                if(req.status == "Completed"):
                    onboarding_task.update({
                        "status": req.status,
                        "completed_at": text('NOW()'),
                        "completed_by": user_data.employee_id
                    })
                else:
                    onboarding_task.update(req.dict())
                db.commit()
                return {"message": "An onboarding employee task has been updated"}
    except Exception as e:
        print(e)


# Delete Onboarding Employee Task
@router.delete("/onboarding-employee-tasks/{onboarding_employee_task_id}")
def delete_onboarding_employee_task(
    onboarding_employee_task_id: str, 
    db: Session = Depends(get_db),
    user_data: UserData = Depends(get_user)
):
    try:
        if(isAuthorized(user_data, AUTHORIZED_SUBSYSTEM, AUTHORIZED_ROLE)):
            onboarding_employee_task = db.query(OnboardingEmployeeTask).filter(
                OnboardingEmployeeTask.onboarding_employee_task_id == onboarding_employee_task_id
            )
            if not onboarding_employee_task.first():
                raise HTTPException(status_code=404, detail=ONBOARDING_EMPLOYEE_TASK_NOT_FOUND)
            else:
                # Get the onboarding task id for deleting it later
                onboarding_task_id = onboarding_employee_task.first().onboarding_task_id

                # Delete the onboarding employee task
                onboarding_employee_task.delete(synchronize_session = False)
                db.commit()

                # Delete the onboarding task if it doesn't have relationship to other tables
                onboarding_employee_tasks_count = db.query(OnboardingEmployeeTask).filter(
                    OnboardingEmployeeTask.onboarding_employee_task_id == onboarding_task_id
                ).count()

                if onboarding_employee_tasks_count == 0:
                    onboarding_task = db.query(OnboardingTask).filter(OnboardingTask.onboarding_task_id == onboarding_task_id)
                    onboarding_task.delete(synchronize_session = False)
                    db.commit()

                return {"message": "An onboarding employee task is successfully deleted"}
    except Exception as e:
        print(e)