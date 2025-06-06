"""menu

Revision ID: 67dda2dc3d39
Revises: 
Create Date: 2025-05-23 22:23:06.661996

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '67dda2dc3d39'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('menu_makanan',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('menu', sa.Text(), nullable=False),
    sa.Column('kategori', sa.Text(), nullable=False),
    sa.Column('harga', sa.Integer(), nullable=False),
    sa.Column('stok', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_menu_makanan'))
    )
    op.create_table('models',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Text(), nullable=True),
    sa.Column('value', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_models'))
    )
    op.create_index('my_index', 'models', ['name'], unique=True, mysql_length=255)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('my_index', table_name='models', mysql_length=255)
    op.drop_table('models')
    op.drop_table('menu_makanan')
    # ### end Alembic commands ###
