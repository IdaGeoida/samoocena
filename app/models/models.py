from enum import Enum
from sqlalchemy import Column, Integer, String, Enum as PgEnum, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Applicability(str, Enum):
    MZ = 'MZ'
    WP = 'WP'
    NZ = 'NZ'

class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Process(Base):
    __tablename__ = 'processes'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    applicability = Column(PgEnum(Applicability), nullable=False)
