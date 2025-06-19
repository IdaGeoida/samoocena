"""add description and detail columns

Revision ID: 0003
Revises: 0002
Create Date: 2025-06-19 18:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = '0003'
down_revision = '0002'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('subcategories', sa.Column('description', sa.String(), nullable=True, server_default=''))
    op.add_column('questions', sa.Column('detail', sa.String(), nullable=True, server_default=''))


def downgrade():
    op.drop_column('questions', 'detail')
    op.drop_column('subcategories', 'description')
