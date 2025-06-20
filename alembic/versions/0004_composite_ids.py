"""use composite IDs for subcategories and questions

Revision ID: 0004
Revises: 0003
Create Date: 2025-06-21 00:00:00
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.drop_table('questions')
    op.drop_table('subcategories')
    op.create_table(
        'subcategories',
        sa.Column('category_id', sa.Integer, sa.ForeignKey('categories.id'), primary_key=True),
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=False),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('description', sa.String, nullable=True, server_default='')
    )
    op.create_table(
        'questions',
        sa.Column('category_id', sa.Integer, primary_key=True),
        sa.Column('subcategory_id', sa.Integer, primary_key=True),
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=False),
        sa.Column('description', sa.String, nullable=False),
        sa.Column('detail', sa.String, nullable=True, server_default=''),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id']),
        sa.ForeignKeyConstraint(['category_id', 'subcategory_id'], ['subcategories.category_id', 'subcategories.id'])
    )

def downgrade():
    op.drop_table('questions')
    op.drop_table('subcategories')
    op.create_table(
        'subcategories',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=False),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('category_id', sa.Integer, sa.ForeignKey('categories.id'), nullable=False),
        sa.Column('description', sa.String, nullable=True, server_default='')
    )
    op.create_table(
        'questions',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=False),
        sa.Column('category_id', sa.Integer, sa.ForeignKey('categories.id'), nullable=False),
        sa.Column('subcategory_id', sa.Integer, sa.ForeignKey('subcategories.id'), nullable=False),
        sa.Column('description', sa.String, nullable=False),
        sa.Column('detail', sa.String, nullable=True, server_default='')
    )
