# Import Packages
from typing import List, Optional
from fastapi import APIRouter,Depends,UploadFile,File,Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.exceptions import HTTPException
from jwt_token import get_token
from sqlalchemy.orm import Session
from database import get_db
from datatables import DataTable
from datetime import datetime
from sqlalchemy import or_
from dotenv import dotenv_values
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Template
template = Jinja2Templates(directory = "app/internal/core/mrs/views")

# Router
router = APIRouter(prefix = "/api/patient-records")

# Import models and schemas
from models import *
from app.internal.core.mrs.schemas import record_schemas as record

# For file handling
import shutil, uuid

# From email sending
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText



# <!-- 
# | =================================================================================
# |                               PATIENT RECORD DATATABLE
# | =================================================================================
# -->
@router.get('/all')
def get_all(request: Request, db: Session = Depends(get_db)):
    try:
        
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    PatientRegistration.first_name.like('%' + user_input + '%'),
                    # Patient.middle_name.like('%' + user_input + '%'),
                    # Patient.last_name.like('%' + user_input + '%'),
                    PatientRegistration.sex.like('%' + user_input + '%'),
                    PatientRegistration.contact_number.like('%' + user_input + '%'),
                    PatientRegistration.address.like('%' + user_input + '%')
                )
            )

        table = DataTable(dict(request.query_params), Record, db.query(Record).options(joinedload(Record.patientrecordFK)), [
            ('sex', 'patientrecordFK.sex'),
            ('first_name', 'patientrecordFK.first_name' ),
            ('last_name', 'patientrecordFK.last_name'),
            ('contact_number', 'patientrecordFK.contact_number'),
            ('address', 'patientrecordFK.address'),
            'id'
        ])

        table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return table.json()
    except Exception as e:
        print(e)
