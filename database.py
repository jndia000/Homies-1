# Import Packages
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# Constants
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root@localhost/homies_test"


# Engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_size=25, max_overflow=5)


# Session Local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base
Base = declarative_base()


# Get Database
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        print(e)
        db.close()
    finally:
        db.close()