import pytest
import datetime
from pyramid.testing import DummyRequest
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound

from backend.views.kantin import (
    menu_list,
    menu_detail,
    menu_add,
    menu_delete,
    menu_update,
    kategori_list,
    kategori_add,
    user_register,
    order_list,
    order_create,
    order_update,
    keranjang_list,
    keranjang_add
)
from backend.models import Menu, Kategori, Users, Orders, OrderDetails, Keranjang, Roles


@pytest.fixture
def setup_test_data(dbsession):
    """Setup data awal untuk testing"""
    # Add roles
    role_customer = Roles(role_id=1, role_name='customer', permissions='read,order')
    role_admin = Roles(role_id=2, role_name='admin', permissions='all')
    dbsession.add(role_customer)
    dbsession.add(role_admin)
    
    # Add categories
    kategori1 = Kategori(kategori_id=1, nama_kategori='Makanan', icon='🍽️')
    kategori2 = Kategori(kategori_id=2, nama_kategori='Minuman', icon='🥤')
    dbsession.add(kategori1)
    dbsession.add(kategori2)
    
    # Add user
    user = Users(
        user_id=1,
        role_id=1,
        nama_lengkap='Test User',
        email='test@test.com',
        password='password123',
        is_active=True
    )
    dbsession.add(user)
    
    # Add menus
    menu1 = Menu(
        menu_id=1,
        kategori_id=1,
        nama_menu='Nasi Goreng',
        deskripsi='Nasi goreng spesial',
        harga=25000,
        status='tersedia'
    )
    menu2 = Menu(
        menu_id=2,
        kategori_id=2,
        nama_menu='Es Teh',
        deskripsi='Es teh manis',
        harga=8000,
        status='tersedia'
    )
    dbsession.add(menu1)
    dbsession.add(menu2)
    
    dbsession.flush()


# ===== MENU TESTS =====
def test_menu_list_empty(dbsession):
    """Test daftar menu kosong"""
    req = DummyRequest()
    req.dbsession = dbsession
    
    response = menu_list(req)
    
    assert 'menus' in response
    assert isinstance(response['menus'], list)
    assert len(response['menus']) == 0


def test_menu_list_with_data(dbsession, setup_test_data):
    """Test daftar menu dengan data"""
    req = DummyRequest()
    req.dbsession = dbsession
    
    response = menu_list(req)
    
    assert 'menus' in response
    assert len(response['menus']) == 2
    assert response['menus'][0]['nama_menu'] == 'Nasi Goreng'


def test_menu_detail_success(dbsession, setup_test_data):
    """Test detail menu berhasil"""
    req = DummyRequest(matchdict={'id': '1'})
    req.dbsession = dbsession
    
    response = menu_detail(req)
    
    assert 'menu' in response
    assert response['menu']['menu_id'] == 1
    assert response['menu']['nama_menu'] == 'Nasi Goreng'


def test_menu_detail_not_found(dbsession):
    """Test detail menu tidak ditemukan"""
    req = DummyRequest(matchdict={'id': '999'})
    req.dbsession = dbsession
    
    response = menu_detail(req)
    
    assert isinstance(response, HTTPNotFound)
    assert 'Menu tidak ditemukan' in response.json_body['error']


def test_menu_add_success(dbsession, setup_test_data):
    """Test tambah menu berhasil"""
    menu_data = {
        'nama_menu': 'Ayam Bakar',
        'kategori_id': 1,
        'harga': 30000,
        'deskripsi': 'Ayam bakar bumbu kecap',
        'status': 'tersedia'
    }
    
    req = DummyRequest(json_body=menu_data)
    req.dbsession = dbsession
    
    response = menu_add(req)
    
    assert response['success'] is True
    assert response['menu']['nama_menu'] == menu_data['nama_menu']
    assert response['menu']['harga'] == menu_data['harga']


def test_menu_add_missing_field(dbsession):
    """Test tambah menu gagal karena field tidak lengkap"""
    incomplete_data = {'nama_menu': 'Test Menu'}
    
    req = DummyRequest(json_body=incomplete_data)
    req.dbsession = dbsession
    
    response = menu_add(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Field kategori_id wajib diisi' in response.json_body['error']


def test_menu_add_invalid_kategori(dbsession):
    """Test tambah menu gagal karena kategori tidak valid"""
    menu_data = {
        'nama_menu': 'Test Menu',
        'kategori_id': 999,
        'harga': 10000
    }
    
    req = DummyRequest(json_body=menu_data)
    req.dbsession = dbsession
    
    response = menu_add(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Kategori tidak ditemukan' in response.json_body['error']


def test_menu_add_negative_price(dbsession, setup_test_data):
    """Test tambah menu gagal karena harga negatif"""
    menu_data = {
        'nama_menu': 'Test Menu',
        'kategori_id': 1,
        'harga': -1000
    }
    
    req = DummyRequest(json_body=menu_data)
    req.dbsession = dbsession
    
    response = menu_add(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Harga tidak boleh negatif' in response.json_body['error']


def test_menu_delete_success(dbsession, setup_test_data):
    """Test hapus menu berhasil"""
    req = DummyRequest(matchdict={'id': '1'})
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = menu_delete(req)
    
    assert response['success'] is True
    assert 'Menu berhasil dihapus' in response['message']


def test_menu_delete_not_found(dbsession):
    """Test hapus menu gagal karena tidak ditemukan"""
    req = DummyRequest(matchdict={'id': '999'})
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = menu_delete(req)
    
    assert isinstance(response, HTTPNotFound)
    assert 'Menu tidak ditemukan' in response.json_body['error']


def test_menu_update_success(dbsession, setup_test_data):
    """Test update menu berhasil"""
    update_data = {
        'nama_menu': 'Nasi Goreng Updated',
        'kategori_id': 1,
        'harga': 27000,
        'deskripsi': 'Updated description'
    }
    
    req = DummyRequest(matchdict={'id': '1'}, json_body=update_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = menu_update(req)
    
    assert response['success'] is True
    assert response['menu']['nama_menu'] == update_data['nama_menu']
    assert response['menu']['harga'] == update_data['harga']


# ===== KATEGORI TESTS =====
def test_kategori_list(dbsession, setup_test_data):
    """Test daftar kategori"""
    req = DummyRequest()
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = kategori_list(req)
    
    assert 'kategoris' in response
    assert len(response['kategoris']) == 2


def test_kategori_add_success(dbsession):
    """Test tambah kategori berhasil"""
    kategori_data = {
        'nama_kategori': 'Dessert',
        'icon': '🍰'
    }
    
    req = DummyRequest(json_body=kategori_data)
    req.dbsession = dbsession
    
    response = kategori_add(req)
    
    assert response['success'] is True
    assert response['kategori']['nama_kategori'] == kategori_data['nama_kategori']


def test_kategori_add_missing_field(dbsession):
    """Test tambah kategori gagal karena field tidak lengkap"""
    req = DummyRequest(json_body={})
    req.dbsession = dbsession
    
    response = kategori_add(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Field nama_kategori wajib diisi' in response.json_body['error']


# ===== USER TESTS =====
def test_user_register_success(dbsession, setup_test_data):
    """Test registrasi user berhasil"""
    register_data = {
        'nama_lengkap': 'New User',
        'email': 'newuser@test.com',
        'password': 'password123'
    }
    
    req = DummyRequest(json_body=register_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_register(req)
    
    assert response['success'] is True
    assert 'Registrasi berhasil' in response['message']
    assert response['user']['email'] == register_data['email']


def test_user_register_missing_field(dbsession):
    """Test registrasi gagal karena field tidak lengkap"""
    incomplete_data = {'nama_lengkap': 'Test User'}
    
    req = DummyRequest(json_body=incomplete_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_register(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Field email wajib diisi' in response.json_body['error']


def test_user_register_invalid_email(dbsession):
    """Test registrasi gagal karena email tidak valid"""
    register_data = {
        'nama_lengkap': 'Test User',
        'email': 'invalid-email',
        'password': 'password123'
    }
    
    req = DummyRequest(json_body=register_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_register(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Format email tidak valid' in response.json_body['error']


def test_user_register_duplicate_email(dbsession, setup_test_data):
    """Test registrasi gagal karena email sudah ada"""
    register_data = {
        'nama_lengkap': 'Test User',
        'email': 'test@test.com',  # Email yang sudah ada
        'password': 'password123'
    }
    
    req = DummyRequest(json_body=register_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_register(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Email sudah terdaftar' in response.json_body['error']


def test_user_register_short_password(dbsession):
    """Test registrasi gagal karena password terlalu pendek"""
    register_data = {
        'nama_lengkap': 'Test User',
        'email': 'test@test.com',
        'password': '123'
    }
    
    req = DummyRequest(json_body=register_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_register(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Password minimal 6 karakter' in response.json_body['error']


# ===== ORDER TESTS =====
def test_order_list(dbsession, setup_test_data):
    """Test daftar order"""
    req = DummyRequest()
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = order_list(req)
    
    assert response['success'] is True
    assert 'orders' in response
    assert isinstance(response['orders'], list)


def test_order_create_success(dbsession, setup_test_data):
    """Test buat order berhasil"""
    order_data = {
        'user_id': 1,
        'pembayaran': 'cash',
        'items': [
            {'menu_id': 1, 'jumlah': 2},
            {'menu_id': 2, 'jumlah': 1}
        ]
    }
    
    req = DummyRequest(json_body=order_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    # Mock transaction.commit()
    import backend.views.kantin
    original_commit = backend.views.kantin.transaction.commit
    backend.views.kantin.transaction.commit = lambda: None
    
    response = order_create(req)
    
    backend.views.kantin.transaction.commit = original_commit
    
    assert response['success'] is True
    assert 'Pesanan berhasil dibuat' in response['message']
    assert response['order']['user_id'] == order_data['user_id']


def test_order_create_missing_field(dbsession):
    """Test buat order gagal karena field tidak lengkap"""
    incomplete_data = {'user_id': 1}
    
    req = DummyRequest(json_body=incomplete_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = order_create(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Field items wajib diisi' in response.json_body['error']


def test_order_create_invalid_user(dbsession):
    """Test buat order gagal karena user tidak valid"""
    order_data = {
        'user_id': 999,
        'pembayaran': 'cash',
        'items': [{'menu_id': 1, 'jumlah': 1}]
    }
    
    req = DummyRequest(json_body=order_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = order_create(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'User tidak ditemukan' in response.json_body['error']


# ===== KERANJANG TESTS =====
def test_keranjang_list(dbsession, setup_test_data):
    """Test daftar keranjang"""
    req = DummyRequest(matchdict={'user_id': '1'})
    req.dbsession = dbsession
    
    response = keranjang_list(req)
    
    assert 'keranjang' in response
    assert isinstance(response['keranjang'], list)


def test_keranjang_add_success(dbsession, setup_test_data):
    """Test tambah item ke keranjang berhasil"""
    keranjang_data = {
        'user_id': 1,
        'order_id': 1,
        'menu_id': 1,
        'jumlah': 2
    }
    
    req = DummyRequest(json_body=keranjang_data)
    req.dbsession = dbsession
    
    response = keranjang_add(req)
    
    assert response['success'] is True
    assert response['keranjang']['jumlah'] == keranjang_data['jumlah']


def test_keranjang_add_missing_field(dbsession):
    """Test tambah keranjang gagal karena field tidak lengkap"""
    incomplete_data = {'user_id': 1}
    
    req = DummyRequest(json_body=incomplete_data)
    req.dbsession = dbsession
    
    response = keranjang_add(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Field order_id wajib diisi' in response.json_body['error']