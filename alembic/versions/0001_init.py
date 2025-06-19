"""init

Revision ID: 0001
Revises: 
Create Date: 2023-01-01 00:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String, nullable=False)
    )
    op.create_table(
        'processes',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('category_id', sa.Integer, sa.ForeignKey('categories.id'), nullable=False),
        sa.Column('applicability', sa.Enum('MZ','WP','NZ', name='applicability'), nullable=False)
    )

def downgrade():
    op.drop_table('processes')
    op.drop_table('categories')
    sa.Enum(name='applicability').drop(op.get_bind())
