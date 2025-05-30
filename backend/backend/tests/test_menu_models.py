# Import Schema
from backend.models.menu import Kategori, Menu, Roles, Users, Orders, OrderDetails, Keranjang

# Import Pytest
import pytest
from datetime import datetime

# Contoh data dummy untuk tiap model

@pytest.fixture
def kategori_data():
    return {
        'kategori_id': 1,
        'nama_kategori': 'Makanan Utama',
        'icon': 'icon_makanan.png'
    }

@pytest.fixture
def roles_data():
    return {
        'role_id': 1,
        'role_name': 'customer',
        'permissions': 'read,order'
    }

@pytest.fixture
def users_data(roles_data):
    return {
        'user_id': 1,
        'role_id': roles_data['role_id'],
        'nama_lengkap': 'John Doe',
        'email': 'john.doe@example.com',
        'password': 'hashedpassword123',
        'is_active': True,
        'create_at': datetime(2025, 5, 28, 10, 0, 0)
    }

@pytest.fixture
def menu_data(kategori_data):
    return {
        'menu_id': 1,
        'kategori_id': kategori_data['kategori_id'],
        'nama_menu': 'Nasi Goreng Spesial',
        'deskripsi': 'Nasi goreng dengan telur dan ayam',
        'harga': 25000,
        'image': 'nasigoreng.jpg',
        'status': 'tersedia',
        'create_at': datetime(2025, 5, 28, 10, 0, 0)
    }

@pytest.fixture
def orders_data(users_data):
    return {
        'order_id': 1,
        'user_id': users_data['user_id'],
        'status': 'pending',
        'total_harga': 50000,
        'pembayaran': 'cash',
        'create_at': datetime(2025, 5, 28, 11, 0, 0)
    }

@pytest.fixture
def order_details_data(orders_data, menu_data):
    return {
        'detail_id': 1,
        'order_id': orders_data['order_id'],
        'menu_id': menu_data['menu_id'],
        'jumlah': 2,
        'subtotal': 50000
    }

@pytest.fixture
def keranjang_data(orders_data, menu_data, users_data):
    return {
        'keranjang_id': 1,
        'order_id': orders_data['order_id'],
        'menu_id': menu_data['menu_id'],
        'user_id': users_data['user_id'],
        'jumlah': 1,
        'subtotal': 25000
    }

# Test functions untuk method to_dict()

def test_kategori_to_dict(kategori_data):
    k = Kategori(**kategori_data)
    d = k.to_dict()
    assert d['kategori_id'] == kategori_data['kategori_id']
    assert d['nama_kategori'] == kategori_data['nama_kategori']
    assert d['icon'] == kategori_data['icon']

def test_roles_to_dict(roles_data):
    r = Roles(**roles_data)
    d = r.to_dict()
    assert d['role_id'] == roles_data['role_id']
    assert d['role_name'] == roles_data['role_name']
    assert d['permissions'] == roles_data['permissions']

def test_users_to_dict(users_data):
    u = Users(**users_data)
    d = u.to_dict()
    assert d['user_id'] == users_data['user_id']
    assert d['role_id'] == users_data['role_id']
    assert d['nama_lengkap'] == users_data['nama_lengkap']
    assert d['email'] == users_data['email']
    assert d['is_active'] == users_data['is_active']
    assert d['create_at'] == users_data['create_at'].isoformat()
    # password tidak ada di to_dict untuk keamanan
    assert 'password' not in d

def test_menu_to_dict(menu_data):
    m = Menu(**menu_data)
    d = m.to_dict()
    assert d['menu_id'] == menu_data['menu_id']
    assert d['kategori_id'] == menu_data['kategori_id']
    assert d['nama_menu'] == menu_data['nama_menu']
    assert d['deskripsi'] == menu_data['deskripsi']
    assert d['harga'] == menu_data['harga']
    assert d['image'] == menu_data['image']
    assert d['status'] == menu_data['status']
    assert d['create_at'] == menu_data['create_at'].isoformat()

def test_orders_to_dict(orders_data):
    o = Orders(**orders_data)
    d = o.to_dict()
    assert d['order_id'] == orders_data['order_id']
    assert d['user_id'] == orders_data['user_id']
    assert d['status'] == orders_data['status']
    assert d['total_harga'] == orders_data['total_harga']
    assert d['pembayaran'] == orders_data['pembayaran']
    assert d['create_at'] == orders_data['create_at'].isoformat()

def test_order_details_to_dict(order_details_data):
    od = OrderDetails(**order_details_data)
    d = od.to_dict()
    assert d['detail_id'] == order_details_data['detail_id']
    assert d['order_id'] == order_details_data['order_id']
    assert d['menu_id'] == order_details_data['menu_id']
    assert d['jumlah'] == order_details_data['jumlah']
    assert d['subtotal'] == order_details_data['subtotal']

def test_keranjang_to_dict(keranjang_data):
    k = Keranjang(**keranjang_data)
    d = k.to_dict()
    assert d['keranjang_id'] == keranjang_data['keranjang_id']
    assert d['order_id'] == keranjang_data['order_id']
    assert d['menu_id'] == keranjang_data['menu_id']
    assert d['user_id'] == keranjang_data['user_id']
    assert d['jumlah'] == keranjang_data['jumlah']
    assert d['subtotal'] == keranjang_data['subtotal']