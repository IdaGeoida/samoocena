"""add assessments table

Revision ID: 0005
Revises: 0004
Create Date: 2025-06-22 00:00:00
"""

from alembic import op
import sqlalchemy as sa

revision = '0005'
down_revision = '0004'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'assessments',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('employees_range', sa.String, nullable=False),
        sa.Column('volunteers_range', sa.String, nullable=False),
        sa.Column('results', sa.JSON, nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now())
    )


def downgrade():
    op.drop_table('assessments')
