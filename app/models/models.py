from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


class Process(Base):
    __tablename__ = "processes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)


class Subcategory(Base):
    __tablename__ = "subcategories"
    # identifier of subcategory is local to its category so we use a composite
    # primary key
    id = Column(Integer, primary_key=True, autoincrement=False)
    category_id = Column(Integer, ForeignKey("categories.id"), primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)


class Question(Base):
    __tablename__ = "questions"
    # question numbering restarts for each subcategory so we use a composite
    # primary key from category, subcategory and the question id
    id = Column(Integer, primary_key=True, autoincrement=False)
    category_id = Column(Integer, ForeignKey("categories.id"), primary_key=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), primary_key=True)
    description = Column(String, nullable=False)
    details = Column(String, nullable=True)
