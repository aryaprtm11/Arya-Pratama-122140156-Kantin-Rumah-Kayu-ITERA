import pytest
from unittest.mock import MagicMock, patch
import sys

from backend.scripts import initialize_db as setup_db


def test_parse_args_valid():
    """Test parsing argument yang valid"""
    argv = ['progname', 'development.ini']
    args = setup_db.parse_args(argv)
    assert args.config_uri == 'development.ini'


def test_parse_args_missing_arg():
    """Test parsing argument yang tidak lengkap"""
    argv = ['progname']
    with pytest.raises(SystemExit):
        setup_db.parse_args(argv)


def test_setup_models_adds_initial_data():
    """Test setup_models menambahkan data awal dengan benar"""
    mock_session = MagicMock()
    
    # Mock models
    with patch.object(setup_db.models, 'Roles') as mock_roles, \
         patch.object(setup_db.models, 'Users') as mock_users, \
         patch.object(setup_db.models, 'Kategori') as mock_kategori, \
         patch.object(setup_db.models, 'Menu') as mock_menu:
        
        # Setup mock return values untuk flush() operation
        mock_role_instance = MagicMock()
        mock_role_instance.role_id = 1
        mock_roles.return_value = mock_role_instance
        
        mock_kategori_makanan = MagicMock()
        mock_kategori_makanan.kategori_id = 1
        mock_kategori_minuman = MagicMock()
        mock_kategori_minuman.kategori_id = 2
        
        # Setup side effects untuk Kategori constructor
        kategori_instances = [mock_kategori_makanan, mock_kategori_minuman]
        mock_kategori.side_effect = kategori_instances
        
        setup_db.setup_models(mock_session)
        
        # Verify role admin dibuat
        mock_roles.assert_called_with(
            role_name='admin',
            permissions='all'
        )
        
        # Verify user admin dibuat
        mock_users.assert_called_with(
            role_id=1,
            nama_lengkap='Administrator',
            email='admin@rumahmakan.com',
            password='admin123',
            is_active=True
        )
        
        # Verify kategori dibuat (2 kali)
        assert mock_kategori.call_count == 2
        
        # Verify menu dibuat (5 kali)
        assert mock_menu.call_count == 5
        
        # Verify session.add dipanggil untuk semua objects
        # 1 role + 1 user + 2 kategori + 5 menu = 9 kali
        assert mock_session.add.call_count == 9
        
        # Verify flush dipanggil 2 kali (setelah role dan setelah kategori)
        assert mock_session.flush.call_count == 2


def test_setup_models_menu_details():
    """Test detail menu yang ditambahkan"""
    mock_session = MagicMock()
    
    with patch.object(setup_db.models, 'Roles') as mock_roles, \
         patch.object(setup_db.models, 'Users') as mock_users, \
         patch.object(setup_db.models, 'Kategori') as mock_kategori, \
         patch.object(setup_db.models, 'Menu') as mock_menu:
        
        # Setup mocks
        mock_role_instance = MagicMock()
        mock_role_instance.role_id = 1
        mock_roles.return_value = mock_role_instance
        
        mock_kategori_makanan = MagicMock()
        mock_kategori_makanan.kategori_id = 1
        mock_kategori_minuman = MagicMock()
        mock_kategori_minuman.kategori_id = 2
        
        kategori_instances = [mock_kategori_makanan, mock_kategori_minuman]
        mock_kategori.side_effect = kategori_instances
        
        setup_db.setup_models(mock_session)
        
        # Verify menu calls dengan detail yang benar
        expected_menu_calls = [
            {
                'nama_menu': 'Nasi Gudeg',
                'kategori_id': 1,
                'deskripsi': 'Nasi gudeg khas Jogja',
                'harga': 25000,
                'status': 'aktif'
            },
            {
                'nama_menu': 'Ayam Bakar',
                'kategori_id': 1,
                'deskripsi': 'Ayam bakar bumbu special',
                'harga': 30000,
                'status': 'aktif'
            },
            {
                'nama_menu': 'Es Teh Manis',
                'kategori_id': 2,
                'deskripsi': 'Es teh manis segar',
                'harga': 8000,
                'status': 'aktif'
            },
            {
                'nama_menu': 'Soto Ayam',
                'kategori_id': 1,
                'deskripsi': 'Soto ayam kampung',
                'harga': 20000,
                'status': 'aktif'
            },
            {
                'nama_menu': 'Jus Jeruk',
                'kategori_id': 2,
                'deskripsi': 'Jus jeruk segar',
                'harga': 12000,
                'status': 'aktif'
            }
        ]
        
        # Verify setiap menu call
        for i, expected_call in enumerate(expected_menu_calls):
            actual_call = mock_menu.call_args_list[i]
            for key, expected_value in expected_call.items():
                assert actual_call.kwargs[key] == expected_value


def test_main_runs_success(monkeypatch):
    """Test main function berjalan sukses"""
    # Mock bootstrap dan setup_logging
    mock_request = MagicMock()
    mock_request.dbsession = MagicMock()
    mock_request.tm = MagicMock()
    
    def fake_bootstrap(config_uri):
        return {'request': mock_request}
    
    monkeypatch.setattr(setup_db, 'bootstrap', fake_bootstrap)
    monkeypatch.setattr(setup_db, 'setup_logging', lambda x: None)
    
    # Mock setup_models
    with patch.object(setup_db, 'setup_models') as mock_setup_models:
        argv = ['progname', 'config.ini']
        setup_db.main(argv)
        
        # Verify setup_models dipanggil dengan dbsession
        mock_setup_models.assert_called_once_with(mock_request.dbsession)


def test_main_operational_error(monkeypatch, capsys):
    """Test main function menangani OperationalError"""
    # Simulasi OperationalError saat commit
    class DummyTM:
        def __enter__(self):
            return self
        
        def __exit__(self, exc_type, exc_val, exc_tb):
            # Raise OperationalError saat keluar dari context manager
            if exc_type is None:
                raise setup_db.OperationalError("db error", None, None)
            return False
    
    def fake_bootstrap(config_uri):
        dummy_request = MagicMock()
        dummy_request.dbsession = MagicMock()
        dummy_request.tm = DummyTM()
        return {'request': dummy_request}
    
    monkeypatch.setattr(setup_db, 'bootstrap', fake_bootstrap)
    monkeypatch.setattr(setup_db, 'setup_logging', lambda x: None)
    
    # Mock setup_models agar tidak error
    with patch.object(setup_db, 'setup_models'):
        argv = ['progname', 'config.ini']
        setup_db.main(argv)
        
        captured = capsys.readouterr()
        assert "Pyramid is having a problem using your SQL database" in captured.out


def test_main_with_real_argv(monkeypatch):
    """Test main dengan sys.argv default"""
    # Mock sys.argv untuk test ini saja
    monkeypatch.setattr(sys, 'argv', ['progname', 'test.ini'])
    
    with patch.object(setup_db, 'bootstrap') as mock_bootstrap, \
         patch.object(setup_db, 'setup_logging') as mock_setup_logging, \
         patch.object(setup_db, 'setup_models') as mock_setup_models:
        
        mock_request = MagicMock()
        mock_bootstrap.return_value = {'request': mock_request}
        
        # Panggil main dengan argumen eksplisit bukan sys.argv yang di-mock
        setup_db.main(['progname', 'test.ini'])
        
        mock_setup_logging.assert_called_once_with('test.ini')
        mock_bootstrap.assert_called_once_with('test.ini')
        mock_setup_models.assert_called_once_with(mock_request.dbsession)


def test_kategori_creation_details():
    """Test detail pembuatan kategori"""
    mock_session = MagicMock()
    
    with patch.object(setup_db.models, 'Roles') as mock_roles, \
         patch.object(setup_db.models, 'Users'), \
         patch.object(setup_db.models, 'Kategori') as mock_kategori, \
         patch.object(setup_db.models, 'Menu'):
        
        # Setup mock role
        mock_role_instance = MagicMock()
        mock_role_instance.role_id = 1
        mock_roles.return_value = mock_role_instance
        
        # Setup mock kategori instances
        mock_kategori_makanan = MagicMock()
        mock_kategori_makanan.kategori_id = 1
        mock_kategori_minuman = MagicMock()
        mock_kategori_minuman.kategori_id = 2
        
        kategori_instances = [mock_kategori_makanan, mock_kategori_minuman]
        mock_kategori.side_effect = kategori_instances
        
        setup_db.setup_models(mock_session)
        
        # Verify kategori makanan
        first_kategori_call = mock_kategori.call_args_list[0]
        assert first_kategori_call.kwargs['nama_kategori'] == 'Makanan'
        assert first_kategori_call.kwargs['icon'] == '🍽️'
        
        # Verify kategori minuman
        second_kategori_call = mock_kategori.call_args_list[1]
        assert second_kategori_call.kwargs['nama_kategori'] == 'Minuman'
        assert second_kategori_call.kwargs['icon'] == '🥤'