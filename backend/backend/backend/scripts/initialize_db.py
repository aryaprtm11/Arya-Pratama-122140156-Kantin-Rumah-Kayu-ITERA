import argparse
import sys
from datetime import date

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from .. import models


def setup_models(dbsession):
    """
    Add initial model objects.
    """
    # Tambahkan role admin
    role_admin = models.Roles(
        role_name='admin',
        permissions='all'
    )
    dbsession.add(role_admin)
    dbsession.flush()  # Untuk mendapatkan role_id
    
    # Tambahkan user admin
    admin_user = models.Users(
        role_id=role_admin.role_id,
        nama_lengkap='Administrator',
        email='admin@rumahmakan.com',
        password='admin123',
        is_active=True
    )
    dbsession.add(admin_user)

    # Tambahkan kategori menu
    kategori_makanan = models.Kategori(
        nama_kategori='Makanan',
        icon='🍽️'
    )
    kategori_minuman = models.Kategori(
        nama_kategori='Minuman',
        icon='🥤'
    )
    
    dbsession.add(kategori_makanan)
    dbsession.add(kategori_minuman)
    dbsession.flush()  # Untuk mendapatkan kategori_id
    
    # Tambahkan data awal untuk Menu Makanan
    menu1 = models.Menu(
        nama_menu='Nasi Gudeg',
        kategori_id=kategori_makanan.kategori_id,
        deskripsi='Nasi gudeg khas Jogja',
        harga=25000,
        status='aktif'
    )
    menu2 = models.Menu(
        nama_menu='Ayam Bakar',
        kategori_id=kategori_makanan.kategori_id,
        deskripsi='Ayam bakar bumbu special',
        harga=30000,
        status='aktif'
    )
    menu3 = models.Menu(
        nama_menu='Es Teh Manis',
        kategori_id=kategori_minuman.kategori_id,
        deskripsi='Es teh manis segar',
        harga=8000,
        status='aktif'
    )
    menu4 = models.Menu(
        nama_menu='Soto Ayam',
        kategori_id=kategori_makanan.kategori_id,
        deskripsi='Soto ayam kampung',
        harga=20000,
        status='aktif'
    )
    menu5 = models.Menu(
        nama_menu='Jus Jeruk',
        kategori_id=kategori_minuman.kategori_id,
        deskripsi='Jus jeruk segar',
        harga=12000,
        status='aktif'
    )
    
    dbsession.add(menu1)
    dbsession.add(menu2)
    dbsession.add(menu3)
    dbsession.add(menu4)
    dbsession.add(menu5)


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession
            setup_models(dbsession)
    except OperationalError:
        print('''
Pyramid is having a problem using your SQL database.

Your database should be up and running before you
initialize your project. Make sure your database server
is running and your connection string in development.ini
is correctly configured.
''')


if __name__ == '__main__':
    main()