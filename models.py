# Import Packages
from database import Base
from sqlalchemy import text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import String, Integer, DateTime, Float, Text, Boolean, Date, Time
from sqlalchemy.orm import relationship


#** PUBLIC USER
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


#** INTERNAL USER
class InternalUser(Base):
    __tablename__ = 'internal_users'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    roles = relationship('UserRole', back_populates='user')


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

#** INTERNAL USER PROFILE? di ko alam kung pano ginawa nyo dito, external ako
