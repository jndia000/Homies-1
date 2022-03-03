# Import Package
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class Department(BaseModel):
    department_id: str
    name: str
    description: str
    created_at: datetime
    updated_at: Optional[datetime]


class SubDeparment(BaseModel):
    sub_department_id: str
    name: str
    description: str
    location: str
    created_at: datetime
    updated_at: Optional[datetime]


class Position(BaseModel):
    position_id: str
    name: str
    description: str
    created_at: datetime
    updated_at: Optional[datetime]


class ShowPosition(Position):
    class Config():
        orm_mode = True


class ShowSubDepartment(SubDeparment):
    positions: List[Optional[ShowPosition]]
    
    class Config():
        orm_mode = True


class ShowDepartment(Department):
    sub_departments: List[Optional[ShowSubDepartment]]

    class Config():
        orm_mode = True


class ShowRole(BaseModel):
    role_id: str
    name: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


class ShowEmploymentType(BaseModel):
    employment_type_id: str
    name: str
    description: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


class Employee(BaseModel):
    first_name: str
    middle_name: Optional[str]
    last_name: str
    extension_name: Optional[str]
    contact_number: str
    status: str


class ShowDepartmentForEmployee(Department):
    class Config():
        orm_mode = True


class ShowSubDepartmentForEmployee(SubDeparment):
    main_department: ShowDepartmentForEmployee

    class Config():
        orm_mode = True


class ShowEmployeePosition(ShowPosition):
    sub_department: ShowSubDepartmentForEmployee
    
    class Config():
        orm_mode = True



class ShowEmployee(Employee):
    employee_id: str
    position: ShowEmployeePosition
    employment_type: ShowEmploymentType
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


class User(BaseModel):
    email: str
    password: str


class ShowUser(BaseModel):
    id: str
    email: str
    employee_info: ShowEmployee
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


class ShowUserRole(BaseModel):
    id: str
    user_id: str
    role_id: str
    account_info: ShowUser
    role_info: ShowRole
    created_at: datetime
    updated_at: Optional[datetime]

    class Config():
        orm_mode = True


class UserCredentials(BaseModel):
    id: str
    employee_info: ShowEmployee
    user_roles: List[ShowUserRole]

    class Config():
        orm_mode = True