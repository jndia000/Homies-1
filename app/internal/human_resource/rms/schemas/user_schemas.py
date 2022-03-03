# Import Package
from typing import Optional
from pydantic import BaseModel
from app.internal.human_resource.rms.schemas.main_schemas import ShowEmployee


# Show User Info Schema
class ShowUserInfo(ShowEmployee):
    class Config():
        orm_mode = True


# Create Department Schema
class CreateDepartment(BaseModel):
    name: str
    description: str


# Show Department Schema
class ShowDepartment(BaseModel):
    department_id: str
    name: str
    description: str

    class Config():
        orm_mode = True


# Create Position Schema
class CreatePosition(BaseModel):
    name: str
    description: str


# Show Position Schema
class ShowPosition(BaseModel):
    position_id: str
    name: str
    description: str
    department: ShowDepartment

    class Config():
        orm_mode = True


# Create User Schema
class CreateUser(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    suffix_name: Optional[str] = None
    position_id: str
    email: str
    password: str
    user_type: str


# Show User Schema
class ShowUser(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    suffix_name: Optional[str] = None
    email: str
    position: ShowPosition

    class Config():
        orm_mode = True
