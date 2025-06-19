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


class Subcategory(Base):
    __tablename__ = 'subcategories'
    id = Column(Integer, primary_key=True, autoincrement=False)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)


class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True, autoincrement=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    subcategory_id = Column(Integer, ForeignKey('subcategories.id'), nullable=False)
    description = Column(String, nullable=False)
