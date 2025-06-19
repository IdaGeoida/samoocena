"""add questions and subcategories

Revision ID: 0002
Revises: 0001
Create Date: 2023-01-02 00:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'subcategories',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=False),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('category_id', sa.Integer, sa.ForeignKey('categories.id'), nullable=False)
    )
    op.create_table(
        'questions',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=False),
        sa.Column('category_id', sa.Integer, sa.ForeignKey('categories.id'), nullable=False),
        sa.Column('subcategory_id', sa.Integer, sa.ForeignKey('subcategories.id'), nullable=False),
        sa.Column('description', sa.String, nullable=False)
    )


def downgrade():
    op.drop_table('questions')
    op.drop_table('subcategories')
