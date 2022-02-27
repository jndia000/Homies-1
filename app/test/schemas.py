# Import Package
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class Role(BaseModel):
    subsystem: str
    name: str
    redirect_url: str


class InternalUser(BaseModel):
    email: str
    password: str


class UserRole(BaseModel):
    user_id: str
    role_id: str


class ShowRole(Role):
    id: str

    class Config():
        orm_mode = True


class ShowInternalUser(InternalUser):
    id: str

    class Config():
        orm_mode = True


class ShowUserRole(UserRole):
    id: str
    role: ShowRole

    class Config():
        orm_mode = True


class ShowInternalUserAndRoles(ShowInternalUser):
    roles: List[ShowUserRole]

    class Config():
        orm_mode = True