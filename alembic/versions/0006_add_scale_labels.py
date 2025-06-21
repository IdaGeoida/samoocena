"""add scale label fields to questions

Revision ID: 0006
Revises: 0005
Create Date: 2025-06-23 00:00:00
"""

from alembic import op
import sqlalchemy as sa

revision = '0006'
down_revision = '0005'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('questions', sa.Column('scale_min_text', sa.String(), nullable=True, server_default=''))
    op.add_column('questions', sa.Column('scale_max_text', sa.String(), nullable=True, server_default=''))


def downgrade():
    op.drop_column('questions', 'scale_max_text')
    op.drop_column('questions', 'scale_min_text')
