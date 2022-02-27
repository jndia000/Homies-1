# Import Packages
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from hashing import Hash

# Import Models
import models

from app.test import schemas

# Router Instance
router = APIRouter(prefix = "/api", tags = ["Test API"])


# Get Internal Users
@router.get("/internal-users", response_model = List[schemas.ShowInternalUserAndRoles])
def get_user_info(db: Session = Depends(get_db)):
    try:
        return db.query(models.InternalUser).all()
    except Exception as e:
        print(e)


# Create User
@router.post("/internal-users")
def get_user_info(req: schemas.InternalUser, db: Session = Depends(get_db)):
    try:
        req.password = Hash.encrypt(req.password)
        new_internal_user = models.InternalUser(**req.dict())
        db.add(new_internal_user)
        db.commit()
        db.refresh(new_internal_user)
        return {
            "data": new_internal_user,
            "msg": "A new internal user has been added"
        }
    except Exception as e:
        print(e)


# Create Role
@router.post("/roles")
def get_user_info(req: schemas.Role, db: Session = Depends(get_db)):
    try:
        new_role = models.Role(**req.dict())
        db.add(new_role)
        db.commit()
        db.refresh(new_role)
        return {
            "data": new_role,
            "msg": "A new role has been added"
        }
    except Exception as e:
        print(e)


# Create UserRole
@router.post("/user-roles")
def get_user_info(req: schemas.UserRole, db: Session = Depends(get_db)):
    try:
        new_user_role = models.UserRole(**req.dict())
        db.add(new_user_role)
        db.commit()
        db.refresh(new_user_role)
        return {
            "data": new_user_role,
            "msg": "A new role has been added"
        }
    except Exception as e:
        print(e)