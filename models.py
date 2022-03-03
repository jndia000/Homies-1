# Import Packages
from database import Base
from sqlalchemy import text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import String, Integer, DateTime, Float, Text, Boolean, Date, Time
from sqlalchemy.orm import relationship


# * PUBLIC USER
class PublicUser(Base):
    __tablename__ = 'public_users'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    is_blacklist = Column(Boolean, default=text('0'))

    profile = relationship('PublicProfile', back_populates='public_user', uselist=False)


class PublicProfile(Base):
    __tablename__ = 'public_profiles'

    id = Column(String(36), primary_key=True, nullable=False, default=text('UUID()'))
    user_id = Column(String(36), ForeignKey('public_users.id'), nullable=True)
    first_name = Column(String(255), nullable=False)
    middle_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=False)
    suffix_name = Column(String(255), nullable=True)
    birth_date = Column(Date, nullable=False)
    gender = Column(String(255), nullable=False)
    house_street = Column(String(255), nullable=False)
    barangay = Column(String(255), nullable=False)
    municipality = Column(String(255), nullable=False)
    province = Column(String(255), nullable=False)
    region = Column(String(255), nullable=False)
    contact_number = Column(String(255), nullable=False)
    image = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    full_address = Column(String(255), nullable=False)

    public_user = relationship('PublicUser', back_populates='profile')


# * INTERNAL USER
class InternalUser(Base):
    __tablename__ = 'internal_users'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    roles = relationship('UserRole', back_populates='user')
    employee_info = relationship('Employee', back_populates = 'user_credentials', uselist=False)


class Role(Base):
    __tablename__ = 'roles'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    subsystem = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    redirect_url = Column(String(255), nullable=False)

    users = relationship('UserRole', back_populates='role')


class UserRole(Base):
    __tablename__ = 'user_roles'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    user_id = Column(String(36), ForeignKey('internal_users.id'), default=text('UUID()'))
    role_id = Column(String(36), ForeignKey('roles.id'), default=text('UUID()'))

    user = relationship('InternalUser', back_populates='roles')
    role = relationship('Role', back_populates='users')


# * INTERNAL USER PROFILE
# ? Employees (table) na yung magsisilbing User Profile for Internal Users


# ! CORE HOSPITAL

# FROM PATIENT MANAGEMENT
    # Medical History Model
class MedicalHistory(Base):
    __tablename__ = 'medical_history'

    medical_history_number = Column(String(36), primary_key=True, default=text('UUID()'))
    prev_diagnosis = Column(String(255), nullable=True)
    prev_treatments = Column(String(255), nullable=True)
    prev_surgeries = Column(String(255), nullable=True)
    prev_medications = Column(String(255), nullable=True)
    allergies = Column(String(255), nullable=True)
    health_conditions = Column(String(255), nullable=True)
    special_privillages = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    historyFK               = relationship('PatientRegistration', back_populates="historyrecordFK")

    # Patient Model 
class PatientRegistration(Base):
    __tablename__ = 'patient_registration'


    id = Column(String(36), primary_key=True, default=text('UUID()'))
    first_name = Column(String(255), nullable=False)
    middle_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    sex = Column(String(255), nullable=False)
    birthday = Column(Date, nullable=False)
    weight = Column(String(255), nullable=False)
    height = Column(String(255), nullable=False)
    blood_type = Column(String(255), nullable=False)
    guardian = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)
    contact_number = Column(String(255), nullable=False)
    hospital_employee = Column(String(255), nullable=False)
    medical_history_number = Column(String(36), ForeignKey('medical_history.medical_history_number'), nullable=True)
    # dp_id = Column(String(36), ForeignKey('discount_privillages.dp_id'), nullable=True)
    status = Column(String(255),nullable=True, default="Active")
    patient_type = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    

    patientFK             = relationship('Record', back_populates="patientrecordFK")
    # patientdischargeFK    = relationship('Discharge', back_populates="dischargeFK")

    # patient_profilesFK    = relationship('UserProfile', back_populates='patientProfileFK')
    # patientrequestFK      = relationship('Request', back_populates='requesterFK')

    historyrecordFK         = relationship('MedicalHistory', back_populates="historyFK")

    # Doctor Model
class Doctor(Base):
    __tablename__ = 'doctors'

    id          = Column(String(36), primary_key=True, default=text('UUID()'))
    first_name      = Column(String(255), nullable=False)
    middle_name     = Column(String(255), nullable=True)
    last_name       = Column(String(255), nullable=False)
    department      = Column(String(255), nullable=False)
    contact_number  = Column(String(255), nullable=False)
    region          = Column(String(255), nullable=False)
    street          = Column(String(255), nullable=False)
    barangay        = Column(String(255), nullable=False)
    municipality    = Column(String(255), nullable=False)
    province        = Column(String(255), nullable=False)
    active_status   = Column(String(255), nullable=False, default="Active")
    created_at      = Column(DateTime, default=text('NOW()'))
    updated_at      = Column(DateTime, onupdate=text('NOW()'))

    diagnosisdocFK        = relationship('Diagnosis', back_populates="docdiagnosisFK")
    progressnoteFK        = relationship('ProgressNote', back_populates="docentryFK")
    # doctorprescriptionFK  = relationship('Prescription', back_populates="docprescriptionFK") 

# ? MEDICAL RECORDS
    # Record Model
class Record(Base):
    __tablename__ = 'patient_records'

    id                      = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_id              = Column(String(36), ForeignKey('patient_registration.id'))
    created_at              = Column(DateTime, default=text('NOW()'))
    updated_at              = Column(DateTime, onupdate=text('NOW()'))

    patientrecordFK         = relationship('PatientRegistration', back_populates="patientFK")
    problemrecordFK         = relationship('Problem', back_populates="problemFK")
    diagnosisrecordFK       = relationship('Diagnosis', back_populates="diagnosisrecFK")
    # labresultrecordFK       = relationship('LabResult', back_populates="labresultFK")
    # surgeryrecordFK         = relationship("Surgery", back_populates="surgeryFK")
    # prescriptionrecordFK    = relationship('Prescription', back_populates="prescriptionsFK")
    progressnoterecordFK    = relationship('ProgressNote', back_populates="progressnoteFK")

    record_allergyFK        = relationship('Allergy', back_populates="allergiesFK")
    record_immunizationFK   = relationship('Immunization', back_populates="immunizationsFK")
    record_medicationFK     = relationship('Medication', back_populates="medicationsFK")
    record_attachmentFK     = relationship('Attachment', back_populates="attachmentsFK")

    call_logrecordFK        = relationship('CallLog', back_populates="call_logFK")


    # Problem Model
class Problem(Base):
    __tablename__ = 'problems'

    id                      = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id       = Column(String(36), ForeignKey('patient_records.id'))
    problem_name            = Column(String(255), nullable=False)
    problem_note            = Column(String(255), nullable=False)
    active_status           = Column(String(255), nullable=False)
    date_occured            = Column(Date, nullable=False)
    date_resolved           = Column(Date, nullable=True)
    created_at              = Column(DateTime, default=text('NOW()'))
    updated_at              = Column(DateTime, onupdate=text('NOW()'))
    
    problemFK               = relationship('Record', back_populates="problemrecordFK")

    # Diagnosis Model
class Diagnosis(Base):
    __tablename__ = 'diagnosis'

    id      = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id = Column(String(36), ForeignKey('patient_records.id'))
    doc_id            = Column(String(36), ForeignKey('doctors.id'))
    diagnosis               = Column(String(255), nullable=False)
    description             = Column(String(255), nullable=False)
    

    docdiagnosisFK     = relationship('Doctor', back_populates="diagnosisdocFK")
    diagnosisrecFK     = relationship('Record', back_populates="diagnosisrecordFK")

    # Progess Notes Model
class ProgressNote(Base):
    __tablename__ = 'progress_notes'

    id        = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id       = Column(String(36), ForeignKey('patient_records.id'))
    # progress_note_id    =  Column(String(36), ForeignKey('progress_notes.progress_note_id'))
    doc_id                  =  Column(String(36), ForeignKey('doctors.id'))
    reason_for_consultation = Column(String(255), nullable=False)
    physical_examination    = Column(String(255), nullable=False)
    impression              = Column(String(255), nullable=False)
    recommendation          = Column(String(255), nullable=False)
    consultation_date        = Column(Date, nullable=True)
    next_appointment        = Column(Date, nullable=True)
    created_at              = Column(DateTime, default=text('NOW()'))
    updated_at              = Column(DateTime, onupdate=text('NOW()'))
    
    progressnoteFK          = relationship('Record', back_populates="progressnoterecordFK")
    docentryFK              = relationship('Doctor',back_populates="progressnoteFK")

    # Call Log Model
class CallLog(Base):
    __tablename__ = 'patient_call_logs'

    id     = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id       = Column(String(36), ForeignKey('patient_records.id'))

    call_logFK              = relationship('Record', back_populates="call_logrecordFK")
    logsFK                  = relationship('CallLogDetail', back_populates="call_logsFK")

    # Call Log Detail Model
class CallLogDetail(Base):
    __tablename__ = 'patient_call_log_details'

    id     = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_call_log_id    = Column(String(36), ForeignKey('patient_call_logs.id'))
    call_log_date          = Column(Date, nullable=False)
    contact_first_name     = Column(String(255), nullable=False)
    contact_last_name      = Column(String(255), nullable=False)
    contact_phone          = Column(String(255), nullable=False)
    call_details           = Column(String(255), nullable=False)
    follow_up_date         = Column(Date, nullable=True)
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    call_logsFK            = relationship('CallLog', back_populates="logsFK")

    # Allergy Model
class Allergy(Base):
    __tablename__ = 'allergies'

    id             = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id      = Column(String(36), ForeignKey('patient_records.id'))
    allergen               = Column(String(255), nullable=True)
    reaction               = Column(String(255), nullable=True)
    severity               = Column(String(255), nullable=True)
    comment                = Column(String(255), nullable=True)
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    allergiesFK            = relationship('Record', back_populates="record_allergyFK")

    # Immunization Model
class Immunization(Base):
    __tablename__ = 'immunizations'

    id        = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id      = Column(String(36), ForeignKey('patient_records.id'))
    vaccine                = Column(String(255), nullable=True)
    type                   = Column(String(255), nullable=True)
    date_given             = Column(Date, nullable=True)
    administered_by        = Column(String(255), nullable=True)
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    immunizationsFK        = relationship('Record', back_populates="record_immunizationFK")

    # Medication Model
class Medication(Base):
    __tablename__ = 'medications'

    id          = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id      = Column(String(36), ForeignKey('patient_records.id'))
    drug_name              = Column(String(255), nullable=True)
    dosage                 = Column(String(255), nullable=True)
    route                  = Column(String(255), nullable=True)
    frequency              = Column(String(255), nullable=True)
    quantity               = Column(String(255), nullable=True)
    refill                 = Column(String(255), nullable=True)
    instructions           = Column(String(255), nullable=True)
    start_date             = Column(Date, nullable=True)
    end_date               = Column(Date, nullable=True)
    medication_status      = Column(String(255), nullable=True, default="Active")
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    medicationsFK          = relationship('Record', back_populates="record_medicationFK")

    # Attachment Model
class Attachment(Base):
    __tablename__ = 'attachments'

    id          = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_record_id      = Column(String(36), ForeignKey('patient_records.id'))
    attachment             = Column(String(255), nullable=True)
    type                   = Column(String(255), nullable=True)
    created_at             = Column(DateTime, default=text('NOW()'))
    updated_at             = Column(DateTime, onupdate=text('NOW()'))

    attachmentsFK          = relationship('Record', back_populates="record_attachmentFK")
    
    # Medical Request Model
class MedicalRequest(Base):
    __tablename__ = 'medical_requests'

    id                      = Column(String(36), primary_key=True, default=text('UUID()'))
    patient_id              = Column(String(36), ForeignKey('patient_registration.id'))
    request_information     = Column(String(255), nullable=True)
    disclosure_reason       = Column(String(255), nullable=True)
    delivery                = Column(String(255), nullable=True)
    email                   = Column(String(255), nullable=True)
    requested_file          = Column(String(255), nullable=True)
    review_reason           = Column(String(255), nullable=True)
    active_status           = Column(String(255), nullable=False, default="Pending")
    created_at              = Column(DateTime, nullable=True, default=text('NOW()'))
    updated_at              = Column(DateTime, nullable=True, onupdate=text('NOW()'))

    # reviewbyFK = relationship('User', back_populates='requestreviewFK')
    # requesterFK = relationship('Patient', back_populates='patientrequestFK')


# ! HUMAN RESOURCE

# ? RECRUITMENT MANAGEMENT

# Applicant Model
class Applicant(Base):
    __tablename__ = "applicants"

    # ==================================================================================
    # Columns
    # ==================================================================================

    applicant_id = Column(
        String(36), 
        primary_key = True, 
        default = text('UUID()')
    )
    job_post_id = Column(
        String(36), 
        ForeignKey("job_posts.job_post_id"), 
        nullable = False
    )
    first_name = Column(
        String(255), 
        nullable = False
    )
    middle_name = Column(
        String(255), 
        nullable = True
    )
    last_name = Column(
        String(255), 
        nullable = False
    )
    suffix_name = Column(
        String(255), 
        nullable = True
    )
    resume = Column(
        String(255), 
        nullable = False,unique = True
    )
    contact_number = Column(
        String(255), 
        nullable = False
    )
    email = Column(
        String(255), 
        nullable = False
    )
    status = Column(
        String(255), 
        nullable = False,
        default = "For evaluation"
    )
    evaluated_by = Column(
        String(36), 
        ForeignKey("employees.employee_id"), 
        nullable = True
    )
    evaluated_at = Column(
        DateTime, 
        nullable = True
    )
    screened_by = Column(
        String(36), 
        ForeignKey("employees.employee_id"), 
        nullable = True
    )
    screened_at = Column(
        DateTime, 
        nullable = True
    )
    hired_by = Column(
        String(36), 
        ForeignKey("employees.employee_id"), 
        nullable = True
    )
    hired_at = Column(
        String(36), 
        nullable = True
    )
    rejected_by = Column(
        String(36), 
        ForeignKey("employees.employee_id"), 
        nullable = True
    )
    rejected_at = Column(
        DateTime, 
        nullable = True
    )
    remarks = Column(
        Text, 
        nullable = True
    )
    created_at = Column(
        DateTime, 
        default = text('NOW()'), 
        nullable = False
    )
    updated_at = Column(
        DateTime, 
        default = text('NOW()'), 
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationships (From other tables/models)
    # ==================================================================================

    # From JobPost
    applied_job = relationship("JobPost", back_populates = "applicants")
    
    # From Employee
    applicant_evaluated_by = relationship(
        "Employee",
        back_populates = "evaluated_applicants",
        foreign_keys = "Applicant.evaluated_by"
    )
    applicant_screened_by = relationship(
        "Employee",
        back_populates = "screened_applicants",
        foreign_keys = "Applicant.screened_by"
    )
    applicant_hired_by = relationship(
        "Employee",
        back_populates = "hired_applicants",
        foreign_keys = "Applicant.hired_by"
    )
    applicant_rejected_by = relationship(
        "Employee",
        back_populates = "rejected_applicants",
        foreign_keys = "Applicant.rejected_by"
    )

    # ==================================================================================
    # Relationships (To other tables/models)
    # ==================================================================================

    # To Interviewee
    interviewee_info = relationship(
        "Interviewee",
        back_populates = "applicant_info",
        uselist = False
    )


# Department Model
# Hiram namin sa core human capital
class Department(Base):
    __tablename__ = "departments"

    # ==================================================================================
    # Columns
    # ==================================================================================

    department_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    name = Column(
        String(255),
        nullable = False
    )
    description = Column(
        String(255),
        nullable = False
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationships (To other tables)
    # ==================================================================================

    # To SubDepartment
    sub_departments = relationship(
        "SubDepartment",
        back_populates = "main_department"
    )


# Employee Model
# Hiram namin sa core human capital
class Employee(Base):
    __tablename__ = "employees"

    # ==================================================================================
    # Columns
    # ==================================================================================

    employee_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    user_id = Column(
        String(36), 
        ForeignKey('internal_users.id'), 
        nullable=False
    )
    first_name = Column(
        String(255),
        nullable = False
    )
    middle_name = Column(
        String(255),
        nullable =  True
    )
    last_name = Column(
        String(255),
        nullable = False
    )
    extension_name = Column(
        String(255),
        nullable = True
    )
    contact_number = Column(
        String(255),
        nullable = False
    )
    position_id = Column(
        String(36),
        ForeignKey("positions.position_id"),
        nullable = False
    )
    employment_type_id = Column(
        String(255),
        ForeignKey("employment_types.employment_type_id"),
        nullable = False
    )
    status = Column(
        String(255),
        nullable = True
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )


    # ==================================================================================
    # Relationships (From other tables)
    # ==================================================================================
    
    # From Position
    position = relationship(
        "Position",
        back_populates = "employees"
    )

    # From EmploymentType
    employment_type = relationship(
        "EmploymentType",
        back_populates = "employees"
    )


    # ==================================================================================
    # Relationships (To other tables)
    # ==================================================================================
    
    # To User
    user_credentials = relationship(
        "InternalUser",
        back_populates = "employee_info"
    )
    
    # To ManpowerRequst
    requested_manpower_requests = relationship(
        "ManpowerRequest", 
        back_populates = "manpower_request_requested_by",
        foreign_keys = "ManpowerRequest.requested_by"
    )
    signed_manpower_requests = relationship(
        "ManpowerRequest",
        back_populates = "manpower_request_signed_by",
        foreign_keys = "ManpowerRequest.signed_by"
    )
    reviewed_manpower_requests = relationship(
        "ManpowerRequest",
        back_populates = "manpower_request_reviewed_by",
        foreign_keys = "ManpowerRequest.reviewed_by"
    )
    rejected_manpower_requests = relationship(
        "ManpowerRequest",
        back_populates = "manpower_request_rejected_by",
        foreign_keys = "ManpowerRequest.rejected_by"
    )

    # To JobPost
    created_job_posts = relationship(
        "JobPost",
        back_populates = "job_post_posted_by"
    )

    # To JobCategory
    created_job_categories = relationship(
        "JobCategory",
        back_populates = "job_category_created_by"
    )

    # To Applicant
    evaluated_applicants = relationship(
        "Applicant",
        back_populates = "applicant_evaluated_by",
        foreign_keys = "Applicant.evaluated_by"
    )
    screened_applicants = relationship(
        "Applicant",
        back_populates = "applicant_screened_by",
        foreign_keys = "Applicant.screened_by"
    )
    hired_applicants = relationship(
        "Applicant",
        back_populates = "applicant_hired_by",
        foreign_keys = "Applicant.hired_by"
    )
    rejected_applicants = relationship(
        "Applicant",
        back_populates = "applicant_rejected_by",
        foreign_keys = "Applicant.rejected_by"
    )

    # To InterviewSchedule
    set_interview_schedules = relationship(
        "InterviewSchedule",
        back_populates = "interview_schedule_set_by" 
    )

    # To Interview Score
    set_interview_scores = relationship(
        "InterviewScore",
        back_populates = "interview_scored_by"
    )

    # To InterviewQuestion
    added_interview_questions = relationship(
        "InterviewQuestion",
        back_populates = "interview_question_added_by",
        foreign_keys = "InterviewQuestion.added_by"
    )
    updated_interview_questions = relationship(
        "InterviewQuestion",
        back_populates = "interview_question_updated_by",
        foreign_keys = "InterviewQuestion.updated_by"
    )

    # To OnboardingEmployee
    signed_onboarding_employees = relationship(
        "OnboardingEmployee",
        back_populates = "onboarding_employee_signed_by",
        foreign_keys = "OnboardingEmployee.signed_by"
    )
    updated_onboarding_employees = relationship(
        "OnboardingEmployee",
        back_populates = "onboarding_employee_updated_by",
        foreign_keys = "OnboardingEmployee.updated_by"
    )

    # To OnboardingTask
    added_onboarding_tasks = relationship(
        "OnboardingTask",
        back_populates = "onboarding_task_added_by",
        foreign_keys = "OnboardingTask.added_by"
    )
    updated_onboarding_tasks = relationship(
        "OnboardingTask",
        back_populates = "onboarding_task_updated_by",
        foreign_keys = "OnboardingTask.updated_by"
    )

    # To OnboardingEmployeeTask
    assigned_onboarding_employee_tasks = relationship(
        "OnboardingEmployeeTask",
        back_populates = "onboarding_employee_task_assigned_by",
        foreign_keys = "OnboardingEmployeeTask.assigned_by"
    )
    completed_onboarding_employee_tasks = relationship(
        "OnboardingEmployeeTask",
        back_populates = "onboarding_employee_task_completed_by",
        foreign_keys = "OnboardingEmployeeTask.completed_by"
    )


# Employment Type Model
# Hiram namin sa core human capital
class EmploymentType(Base):
    __tablename__ = "employment_types"

    # ==================================================================================
    # Column
    # ==================================================================================

    employment_type_id = Column(
        String(36),
        primary_key=True,
        default=text('UUID()')
    )
    name = Column(
        String(255),
        nullable = False
    )
    description = Column(
        Text,
        nullable = False,
    )
    is_active = Column(
        Boolean,
        default = True,
        nullable = False
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationship (To other tables/models)
    # ==================================================================================

    # To ManpoweRequest
    manpower_requests = relationship(
        "ManpowerRequest",
        back_populates = "employment_type"
    )

    # To Employee
    employees = relationship(
        "Employee",
        back_populates = "employment_type"
    )


# Interviewee Model
class Interviewee(Base):
    __tablename__ = "interviewees"

    # ==================================================================================
    # Columns
    # ==================================================================================

    interviewee_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    applicant_id = Column(
        String(36),
        ForeignKey("applicants.applicant_id"),
        nullable = False
    )
    interview_schedule_id = Column(
        String(36),
        ForeignKey("interview_schedules.interview_schedule_id"),
        nullable = True
    )
    is_interviewed = Column(
        Boolean,
        nullable = True
    )
    interviewed_at = Column(
        DateTime,
        nullable = True
    )
    remarks = Column(
        Text,
        nullable = True
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationships (From other tables/models)
    # ==================================================================================

    # From Applicant
    applicant_info = relationship(
        "Applicant",
        back_populates = "interviewee_info",
        uselist = False
    )

    # From InterviewSchedule
    interview_schedule = relationship(
        "InterviewSchedule",
        back_populates = "interviewees"
    )
    
    # ==================================================================================
    # Relationships (To other tables/models)
    # ==================================================================================

    # To InterviewScore
    interview_scores = relationship(
        "InterviewScore",
        back_populates = "score_for"
    )


# Interview Question Model
class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    # ==================================================================================
    # Columns
    # ==================================================================================

    interview_question_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    question = Column(
        String(255),
        nullable = False
    )
    type = Column(
        String(255),
        nullable = False
    )
    added_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = False
    )
    updated_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationships (From other tables/columns)
    # ==================================================================================

    # From Employee
    interview_question_added_by = relationship(
        "Employee",
        back_populates = "added_interview_questions",
        foreign_keys = "InterviewQuestion.added_by"
    )
    interview_question_updated_by = relationship(
        "Employee",
        back_populates = "updated_interview_questions",
        foreign_keys = "InterviewQuestion.updated_by"
    )

    # ==================================================================================
    # Relationships (To other tables/columns)
    # ==================================================================================
    
    # To InterviewScore
    interview_scores = relationship(
        "InterviewScore",
        back_populates = "interview_question"
    )


# Inteview Schedule Model
class InterviewSchedule(Base):
    __tablename__ = "interview_schedules"

    # ==================================================================================
    # Columns
    # ==================================================================================

    interview_schedule_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    job_post_id = Column(
        String(36),
        ForeignKey("job_posts.job_post_id"),
        nullable = False
    )
    scheduled_date = Column(
        Date,
        nullable = False
    )
    start_session = Column(
        Time,
        nullable = False
    )
    end_session = Column(
        Time,
        nullable = False
    )
    set_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationships (From other tables/columns)
    # ==================================================================================

    # From JobPost
    schedule_for = relationship(
        "JobPost",
        back_populates = "interview_schedules"
    )

    # From Employee
    interview_schedule_set_by = relationship(
        "Employee",
        back_populates = "set_interview_schedules"
    )

    # ==================================================================================
    # Relationships (To other tables/columns)
    # ==================================================================================

    # To Interviewees
    interviewees = relationship(
        "Interviewee",
        back_populates = "interview_schedule"
    )


# Interview Score Model
class InterviewScore(Base):
    __tablename__ = "interview_scores"

    # ==================================================================================
    # Columns
    # ==================================================================================

    interview_score_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    interviewee_id = Column(
        String(36),
        ForeignKey("interviewees.interviewee_id"),
        nullable = False
    )
    interview_question_id = Column(
        String(36),
        ForeignKey("interview_questions.interview_question_id")
    )
    score = Column(
        Float,
        nullable = True
    )
    scored_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationships (From other tables/columns)
    # ==================================================================================

    # From InterviewQuestion
    interview_question = relationship(
        "InterviewQuestion",
        back_populates = "interview_scores"
    )

    # From Employee
    interview_scored_by = relationship(
        "Employee",
        back_populates = "set_interview_scores"
    )

    # From Interviewee
    score_for = relationship(
        "Interviewee",
        back_populates = "interview_scores"
    )


# Job Category Model
class JobCategory(Base):
    __tablename__ = "job_categories"

    # ==================================================================================
    # Columns
    # ==================================================================================

    job_category_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    name = Column(
        String(36),
        nullable = False
    )
    description = Column(
        Text,
        nullable = False
    )
    is_removed = Column(
        Boolean,
        nullable = False,
        default = False
    )
    created_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = False
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationships (From other tables/models)
    # ==================================================================================

    # From Employee
    job_category_created_by = relationship(
        "Employee",
        back_populates = "created_job_categories",
    )

    # ==================================================================================
    # Relationships (To other tables/models)
    # ==================================================================================

    job_posts = relationship(
        "JobPost",
        back_populates = "job_category"
    )


# Job Post Model
class JobPost(Base):
    __tablename__ = "job_posts"

    # ==================================================================================
    # Columns
    # ==================================================================================

    job_post_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    manpower_request_id = Column(
        String(36),
        ForeignKey("manpower_requests.manpower_request_id"),
        nullable = False
    )
    is_salary_visible = Column(
        Boolean,
        nullable = False,
        default = False
    )
    content = Column(
        Text,
        nullable = False
    )
    expiration_date = Column(
        DateTime,
        nullable = True
    )
    job_category_id = Column(
        String(36),
        ForeignKey("job_categories.job_category_id"),
        nullable = False
    )
    posted_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = False
    )
    views = Column(
        Integer,
        nullable = False,
        default = 0
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationship (From other tables/models)
    # ==================================================================================

    # From ManpowerRequest
    manpower_request = relationship(
        "ManpowerRequest",
        back_populates = "job_post"
    )

    # From Employee
    job_post_posted_by = relationship(
        "Employee",
        back_populates = "created_job_posts"
    )

    # From JobCategory
    job_category = relationship(
        "JobCategory",
        back_populates = "job_posts",
    )

    # ==================================================================================
    # Relationship (To other tables/models)
    # ==================================================================================

    # To Applicants
    applicants = relationship(
        "Applicant",
        back_populates = "applied_job"
    )

    # To Interview Schedule
    interview_schedules = relationship(
        "InterviewSchedule",
        back_populates = "schedule_for"
    )


# Manpower Request Model
class ManpowerRequest(Base):
    __tablename__ = "manpower_requests"

    # ==================================================================================
    # Columns
    # ==================================================================================

    manpower_request_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    requisition_no = Column(
        String(255),
        unique = True,
        nullable = False
    )
    requested_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = False
    )
    position_id = Column(
        String(36),
        ForeignKey("positions.position_id"),
        nullable = False
    )
    employment_type_id = Column(
        String(255),
        ForeignKey("employment_types.employment_type_id"),
        nullable = False
    )
    request_nature = Column(
        String(255),
        default = "For Review",
        nullable = False
    )
    staffs_needed = Column(
        Integer,
        nullable = False
    )
    min_monthly_salary = Column(
        Float,
        nullable = True
    )
    max_monthly_salary = Column(
        Float,
        nullable = True
    )
    content = Column(
        Text,
        nullable = False
    )
    request_status = Column(
        String(255),
        nullable = False
    )
    deadline = Column(
        DateTime,
        nullable = True
    )
    signed_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    signed_at = Column(
        DateTime,
        nullable = True
    )
    reviewed_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    reviewed_at = Column(
        DateTime,
        nullable = True
    )
    completed_at = Column(
        DateTime,
        nullable = True
    )
    rejected_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    rejected_at = Column(
        DateTime,
        nullable = True
    )
    remarks = Column(
        Text,
        nullable = True
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationship (From other tables/models)
    # ==================================================================================

    # From Employee
    manpower_request_requested_by = relationship(
        "Employee",
        back_populates = "requested_manpower_requests",
        foreign_keys = "ManpowerRequest.requested_by"
    )
    manpower_request_reviewed_by = relationship(
        "Employee",
        back_populates = "reviewed_manpower_requests",
        foreign_keys = "ManpowerRequest.reviewed_by"
    )
    manpower_request_signed_by = relationship(
        "Employee",
        back_populates = "signed_manpower_requests",
        foreign_keys = "ManpowerRequest.signed_by"
    )
    manpower_request_rejected_by = relationship(
        "Employee",
        back_populates = "rejected_manpower_requests",
        foreign_keys = "ManpowerRequest.rejected_by"
    )

    # From Employment Type
    employment_type = relationship(
        "EmployeeType",
        back_populates="manpower_requests",
    )

    # From EmploymentType
    employment_type = relationship(
        "EmploymentType",
        back_populates = "manpower_requests"
    )

    # From Position
    vacant_position = relationship(
        "Position",
        back_populates = "manpower_requests"
    )

    # ==================================================================================
    # Relationship (To other tables/models)
    # ==================================================================================

    # To JobPost
    job_post = relationship(
        "JobPost",
        back_populates = "manpower_request",
        uselist = False
    )


# Onboarding Employee Model
class OnboardingEmployee(Base):
    __tablename__ = "onboarding_employees"

    # ==================================================================================
    # Columns
    # ==================================================================================

    onboarding_employee_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    first_name = Column(
        String(255),
        nullable = False
    )
    middle_name = Column(
        String(255),
        nullable = True
    )
    last_name = Column(
        String(255),
        nullable = False
    )
    suffix_name = Column(
        String(255),
        nullable = True
    )
    contact_number = Column(
        String(255),
        nullable = False
    )
    email = Column(
        String(255),
        nullable = False
    )
    position_id = Column(
        String(36),
        ForeignKey("positions.position_id"),
        nullable = False
    )
    employment_start_date = Column(
        Date,
        nullable = True
    )
    employment_contract = Column(
        String(255),
        unique = True,
        nullable = False
    )
    status = Column(
        String(255),
        nullable = False
    )
    signed_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = False
    )
    updated_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationship (From other tables/models)
    # ==================================================================================

    # From Position
    onboarding_employee_position = relationship(
        "Position",
        back_populates = "onboarding_employees"
    )

    # From Employee
    onboarding_employee_signed_by = relationship(
        "Employee",
        back_populates = "signed_onboarding_employees",
        foreign_keys = "OnboardingEmployee.signed_by"
    )
    onboarding_employee_updated_by = relationship(
        "Employee",
        back_populates = "updated_onboarding_employees",
        foreign_keys = "OnboardingEmployee.updated_by"
    )

    # ==================================================================================
    # Relationship (To other tables/models)
    # ==================================================================================

    # To OnboardingEmployeeTask
    onboarding_employee_tasks = relationship(
        "OnboardingEmployeeTask",
        back_populates = "onboarding_employee"
    )


# Onboarding Employye Task Model
class OnboardingEmployeeTask(Base):
    __tablename__ = "onboarding_employee_task"
    
    # ==================================================================================
    # Columns
    # ==================================================================================

    onboarding_employee_task_id = Column(
        String(36),
        primary_key = True,
        default = text("UUID()")
    )
    onboarding_employee_id = Column(
        String(36),
        ForeignKey("onboarding_employees.onboarding_employee_id"),
        nullable = False
    )
    onboarding_task_id = Column(
        String(36),
        ForeignKey("onboarding_tasks.onboarding_task_id"),
        nullable = False
    )
    start_at = Column(
        DateTime,
        nullable = False
    )
    end_at = Column(
        DateTime,
        nullable = False
    )
    assigned_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = False
    )
    status = Column(
        String(255),
        nullable = False
    )
    completed_at = Column(
        DateTime,
        nullable = True
    )
    completed_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationships (From other tables/models)
    # ==================================================================================

    # From OnboardingEmployee
    onboarding_employee = relationship(
        "OnboardingEmployee",
        back_populates = "onboarding_employee_tasks"
    )

    # From OnboardingTask
    onboarding_task = relationship(
        "OnboardingTask",
        back_populates = "assigned_tasks"
    )
    
    # From Employee
    onboarding_employee_task_assigned_by = relationship(
        "Employee",
        back_populates = "assigned_onboarding_employee_tasks",
        foreign_keys = "OnboardingEmployeeTask.assigned_by"
    )
    onboarding_employee_task_completed_by = relationship(
        "Employee",
        back_populates = "completed_onboarding_employee_tasks",
        foreign_keys = "OnboardingEmployeeTask.completed_by"
    )


# Onboarding Tasks Model
class OnboardingTask(Base):
    __tablename__ = "onboarding_tasks"

    # ==================================================================================
    # Columns
    # ==================================================================================

    onboarding_task_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    title = Column(
        String(255),
        nullable = False
    )
    description = Column(
        Text,
        nullable = False
    )
    task_type = Column(
        String(255),
        nullable = False
    )
    is_general = Column(
        Boolean,
        nullable = False,
        default = False
    )
    sub_department_id = Column(
        String(36),
        ForeignKey("sub_departments.sub_department_id"),
        nullable = False
    )
    added_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = False
    )
    updated_by = Column(
        String(36),
        ForeignKey("employees.employee_id"),
        nullable = True
    )
    is_deleted = Column(
        Boolean,
        nullable = False,
        default = False
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationship (From other tables/column)
    # ==================================================================================

    # From SubDepartment
    for_sub_department = relationship(
        "SubDepartment",
        back_populates = "onboarding_tasks"
    )

    # Employee
    onboarding_task_added_by = relationship(
        "Employee",
        back_populates = "added_onboarding_tasks",
        foreign_keys = "OnboardingTask.added_by"
    )
    onboarding_task_updated_by = relationship(
        "Employee",
        back_populates = "updated_onboarding_tasks",
        foreign_keys = "OnboardingTask.updated_by"
    )

    # ==================================================================================
    # Relationship (To other tables/column)
    # ==================================================================================

    # To OnboardingEmployeeTask
    assigned_tasks = relationship(
        "OnboardingEmployeeTask",
        back_populates = "onboarding_task"
    )


# Position Model
# Hiram namin sa core human capital
class Position(Base):
    __tablename__ = "positions"

    # ==================================================================================
    # Columns
    # ==================================================================================

    position_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()'),
    )
    sub_department_id = Column(
        String(36),
        ForeignKey("sub_departments.sub_department_id"),
        nullable = False
    )
    name = Column(
        String(255),
        nullable = False
    )
    description = Column(
        String(255),
        nullable = False
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationship (From other tables/models)
    # ==================================================================================

    # From SubDepartment
    sub_department = relationship(
        "SubDepartment",
        back_populates = "positions"
    )

    # ==================================================================================
    # Relationship (To other tables/models)
    # ==================================================================================

    # To Employee
    employees = relationship(
        "Employee",
        back_populates = "position"
    )

    # To ManpowerRequest
    manpower_requests = relationship(
        "ManpowerRequest",
        back_populates = "vacant_position"
    )

    # To OnboardingEmployee
    onboarding_employees = relationship(
        "OnboardingEmployee",
        back_populates = "onboarding_employee_position"
    )


# Sub Department Model
# Hiram namin sa core human capital
class SubDepartment(Base):
    __tablename__ = "sub_departments"

    # ==================================================================================
    # Columns
    # ==================================================================================

    sub_department_id = Column(
        String(36),
        primary_key = True,
        default = text('UUID()')
    )
    department_id = Column(
        String(36),
        ForeignKey("departments.department_id"),
        nullable = False
    )
    name = Column(
        String(255),
        nullable = False
    )
    description = Column(
        Text,
        nullable = False
    )
    location = Column(
        String(255),
        nullable = False
    )
    created_at = Column(
        DateTime,
        default = text('NOW()'),
        nullable = False
    )
    updated_at = Column(
        DateTime,
        default = text('NOW()'),
        onupdate = text('NOW()')
    )

    # ==================================================================================
    # Relationship (From other tables/models)
    # ==================================================================================

    # From department
    main_department = relationship(
        "Department",
        back_populates = "sub_departments"
    )

    # ==================================================================================
    # Relationship (From other tables/models)
    # ==================================================================================

    # To Position
    positions = relationship(
        "Position", 
        back_populates = "sub_department"
    )

    # To OnboardingTask
    onboarding_tasks = relationship(
        "OnboardingTask",
        back_populates = "for_sub_department"
    )