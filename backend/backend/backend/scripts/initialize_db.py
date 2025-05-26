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
    # Tambahkan data awal untuk Menu Makanan
    menu1 = models.Menu(
        menu='Nasi Gudeg',
        kategori='Makanan',
        harga=25000,
        stok=50
    )
    menu2 = models.Menu(
        menu='Ayam Bakar',
        kategori='Makanan',
        harga=30000,
        stok=35
    )
    menu3 = models.Menu(
        menu='Es Teh Manis',
        kategori='Minuman',
        harga=8000,
        stok=100
    )
    menu4 = models.Menu(
        menu='Soto Ayam',
        kategori='Makanan',
        harga=20000,
        stok=40
    )
    menu5 = models.Menu(
        menu='Jus Jeruk',
        kategori='Minuman',
        harga=12000,
        stok=60
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