from datetime import date, datetime
from pydantic.types import StrictStr

from models import *

from typing import List, Optional
from pydantic import BaseModel


class patientRecord(BaseModel):
    patient_record_id: str
    patient_id: str