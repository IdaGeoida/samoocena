from sqlalchemy import Column, Integer, String, ForeignKey, ForeignKeyConstraint
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Process(Base):
    __tablename__ = 'processes'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)


class Subcategory(Base):
    __tablename__ = 'subcategories'
    category_id = Column(Integer, ForeignKey('categories.id'), primary_key=True)
    id = Column(Integer, primary_key=True, autoincrement=False)
    name = Column(String, nullable=False)
    description = Column(String, default="", nullable=True)


class Question(Base):
    __tablename__ = 'questions'
    category_id = Column(Integer, primary_key=True)
    subcategory_id = Column(Integer, primary_key=True)
    id = Column(Integer, primary_key=True, autoincrement=False)
    description = Column(String, nullable=False)
    detail = Column(String, default="", nullable=True)
    __table_args__ = (
        ForeignKeyConstraint(['category_id'], ['categories.id']),
        ForeignKeyConstraint(['category_id', 'subcategory_id'], ['subcategories.category_id', 'subcategories.id']),
    )
