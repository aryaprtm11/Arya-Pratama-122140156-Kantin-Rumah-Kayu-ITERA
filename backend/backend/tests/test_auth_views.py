import pytest
from pyramid.testing import DummyRequest
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from unittest.mock import patch

from backend.views.auth import (
    login,
    user_delete,
    user_update
)
from backend.models import Users, Roles


@pytest.fixture
def roles_data():
    return [
        {'role_id': 1, 'role_name': 'customer', 'permissions': 'read,order'},
        {'role_id': 2, 'role_name': 'admin', 'permissions': 'all'}
    ]


@pytest.fixture
def users_data():
    return [
        {
            'user_id': 1,
            'role_id': 1,
            'nama_lengkap': 'Customer User',
            'email': 'customer@test.com',
            'password': 'password123',
            'is_active': True
        },
        {
            'user_id': 2,
            'role_id': 2,
            'nama_lengkap': 'Admin User',
            'email': 'admin@test.com',
            'password': 'admin123',
            'is_active': True
        }
    ]


@pytest.fixture
def setup_users(dbsession, roles_data, users_data):
    """Setup roles and users in database"""
    # Add roles
    for role_data in roles_data:
        role = Roles(**role_data)
        dbsession.add(role)
    
    # Add users
    for user_data in users_data:
        user = Users(**user_data)
        dbsession.add(user)
    
    dbsession.flush()
    return dbsession.query(Users).all()


def test_login_success(dbsession, setup_users):
    """Test login berhasil dengan kredensial yang benar"""
    login_data = {
        'email': 'customer@test.com',
        'password': 'password123'
    }
    
    req = DummyRequest(json_body=login_data)
    req.dbsession = dbsession
    
    # Mock uuid.uuid4() untuk mendapatkan token yang predictable
    with patch('backend.views.auth.uuid.uuid4') as mock_uuid:
        mock_uuid.return_value = 'dummy-token'
        response = login(req)
    
    assert 'token' in response
    assert response['token'] == 'dummy-token'
    assert response['user']['email'] == login_data['email']
    assert response['user']['nama_lengkap'] == 'Customer User'
    assert response['user']['role_name'] == 'customer'


def test_login_missing_field(dbsession):
    """Test login gagal karena field tidak lengkap"""
    incomplete_data = {'email': 'test@test.com'}
    
    req = DummyRequest(json_body=incomplete_data)
    req.dbsession = dbsession
    
    response = login(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Field password wajib diisi' in response.json_body['error']


def test_login_user_not_found(dbsession):
    """Test login gagal karena user tidak ditemukan"""
    login_data = {
        'email': 'notfound@test.com',
        'password': 'password123'
    }
    
    req = DummyRequest(json_body=login_data)
    req.dbsession = dbsession
    
    response = login(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Email atau password salah' in response.json_body['error']


def test_login_wrong_password(dbsession, setup_users):
    """Test login gagal karena password salah"""
    login_data = {
        'email': 'customer@test.com',
        'password': 'wrongpassword'
    }
    
    req = DummyRequest(json_body=login_data)
    req.dbsession = dbsession
    
    response = login(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Email atau password salah' in response.json_body['error']


def test_login_inactive_user(dbsession, setup_users):
    """Test login gagal karena user tidak aktif"""
    # Set user menjadi tidak aktif
    user = dbsession.query(Users).filter_by(email='customer@test.com').first()
    user.is_active = False
    dbsession.flush()
    
    login_data = {
        'email': 'customer@test.com',
        'password': 'password123'
    }
    
    req = DummyRequest(json_body=login_data)
    req.dbsession = dbsession
    
    response = login(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Akun tidak aktif' in response.json_body['error']


def test_user_delete_success(dbsession, setup_users):
    """Test hapus user berhasil"""
    req = DummyRequest(matchdict={'id': '1'})
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_delete(req)
    
    assert response['success'] is True
    assert 'User berhasil dihapus' in response['message']
    
    # Pastikan user sudah terhapus
    deleted_user = dbsession.query(Users).filter_by(user_id=1).first()
    assert deleted_user is None


def test_user_delete_not_found(dbsession):
    """Test hapus user gagal karena user tidak ditemukan"""
    req = DummyRequest(matchdict={'id': '999'})
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_delete(req)
    
    assert isinstance(response, HTTPNotFound)
    assert 'User tidak ditemukan' in response.json_body['error']


def test_user_delete_admin_protection(dbsession, setup_users):
    """Test tidak bisa menghapus user admin"""
    req = DummyRequest(matchdict={'id': '2'})  # Admin user
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_delete(req)
    
    assert isinstance(response, HTTPBadRequest)
    assert 'Tidak dapat menghapus user admin' in response.json_body['error']


def test_user_update_success(dbsession, setup_users):
    """Test update user berhasil"""
    update_data = {
        'nama_lengkap': 'Updated Name',
        'email': 'updated@test.com'
    }
    
    req = DummyRequest(matchdict={'id': '1'}, json_body=update_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_update(req)
    
    assert response['success'] is True
    assert 'User berhasil diupdate' in response['message']
    assert response['data']['nama_lengkap'] == update_data['nama_lengkap']
    assert response['data']['email'] == update_data['email']


def test_user_update_not_found(dbsession):
    """Test update user gagal karena user tidak ditemukan"""
    update_data = {'nama_lengkap': 'Updated Name'}
    
    req = DummyRequest(matchdict={'id': '999'}, json_body=update_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_update(req)
    
    assert isinstance(response, HTTPNotFound)
    assert 'User tidak ditemukan' in response.json_body['error']


def test_user_update_partial(dbsession, setup_users):
    """Test update partial data user"""
    update_data = {'nama_lengkap': 'Partial Update'}
    
    req = DummyRequest(matchdict={'id': '1'}, json_body=update_data)
    req.dbsession = dbsession
    req.response = DummyRequest()
    req.response.headers = {}
    
    response = user_update(req)
    
    assert response['success'] is True
    assert response['data']['nama_lengkap'] == update_data['nama_lengkap']
    # Email harus tetap sama
    assert response['data']['email'] == 'customer@test.com'