import datetime
from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound,
    HTTPBadRequest,
)
from ..models import Menu, Kategori, Users, Orders, OrderDetails, Keranjang


# ===== MENU VIEWS =====
@view_config(route_name='menu_list', renderer='json')
def menu_list(request):
    """View untuk menampilkan daftar menu"""
    dbsession = request.dbsession
    menus = dbsession.query(Menu).all()
    return {'menus': [m.to_dict() for m in menus]}


@view_config(route_name='menu_detail', renderer='json')
def menu_detail(request):
    """View untuk melihat detail satu menu"""
    dbsession = request.dbsession
    menu_id = request.matchdict['id']
    menu = dbsession.query(Menu).filter_by(menu_id=menu_id).first()
    
    if menu is None:
        return HTTPNotFound(json_body={'error': 'Menu tidak ditemukan'})
    
    return {'menu': menu.to_dict()}


@view_config(route_name='menu_add', request_method='POST', renderer='json')
def menu_add(request):
    """View untuk menambahkan menu baru"""
    try:
        json_data = request.json_body
        
        required_fields = ['nama_menu', 'kategori_id', 'harga']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})
        
        # Validasi kategori exists
        dbsession = request.dbsession
        kategori = dbsession.query(Kategori).filter_by(kategori_id=json_data['kategori_id']).first()
        if not kategori:
            return HTTPBadRequest(json_body={'error': 'Kategori tidak ditemukan'})
        
        try:
            harga = float(json_data['harga'])
            if harga < 0:
                return HTTPBadRequest(json_body={'error': 'Harga tidak boleh negatif'})
        except (ValueError, TypeError):
            return HTTPBadRequest(json_body={'error': 'Harga harus berupa angka'})
        
        menu = Menu(
            nama_menu=json_data['nama_menu'],
            kategori_id=json_data['kategori_id'],
            deskripsi=json_data.get('deskripsi'),
            harga=harga,
            image=json_data.get('image'),
            status=json_data.get('status', 'aktif')
        )
        
        dbsession.add(menu)
        dbsession.flush()
        
        return {'success': True, 'menu': menu.to_dict()}
            
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# ===== KATEGORI VIEWS =====
@view_config(route_name='kategori_list', renderer='json')
def kategori_list(request):
    """View untuk menampilkan daftar kategori"""
    dbsession = request.dbsession
    kategoris = dbsession.query(Kategori).all()
    return {'kategoris': [k.to_dict() for k in kategoris]}


@view_config(route_name='kategori_add', request_method='POST', renderer='json')
def kategori_add(request):
    """View untuk menambahkan kategori baru"""
    try:
        json_data = request.json_body
        
        if 'nama_kategori' not in json_data:
            return HTTPBadRequest(json_body={'error': 'Field nama_kategori wajib diisi'})
        
        kategori = Kategori(
            nama_kategori=json_data['nama_kategori'],
            icon=json_data.get('icon')
        )
        
        dbsession = request.dbsession
        dbsession.add(kategori)
        dbsession.flush()
        
        return {'success': True, 'kategori': kategori.to_dict()}
            
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# ===== USER VIEWS =====
@view_config(route_name='user_list', renderer='json')
def user_list(request):
    """View untuk menampilkan daftar users"""
    dbsession = request.dbsession
    users = dbsession.query(Users).all()
    return {'users': [u.to_dict() for u in users]}


@view_config(route_name='user_register', request_method='POST', renderer='json')
def user_register(request):
    """View untuk registrasi user baru"""
    try:
        json_data = request.json_body
        
        required_fields = ['nama_lengkap', 'email', 'password']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})
        
        # Check email exists
        dbsession = request.dbsession
        existing_user = dbsession.query(Users).filter_by(email=json_data['email']).first()
        if existing_user:
            return HTTPBadRequest(json_body={'error': 'Email sudah terdaftar'})
        
        user = Users(
            nama_lengkap=json_data['nama_lengkap'],
            email=json_data['email'],
            password=json_data['password'],  # Should be hashed in production
            role_id=json_data.get('role_id', 2),  # Default role customer
            is_active=True
        )
        
        dbsession.add(user)
        dbsession.flush()
        
        return {'success': True, 'user': user.to_dict()}
            
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# ===== ORDER VIEWS =====
@view_config(route_name='order_list', renderer='json')
def order_list(request):
    """View untuk menampilkan daftar orders"""
    dbsession = request.dbsession
    orders = dbsession.query(Orders).all()
    return {'orders': [o.to_dict() for o in orders]}


@view_config(route_name='order_create', request_method='POST', renderer='json')
def order_create(request):
    """View untuk membuat order baru"""
    try:
        json_data = request.json_body
        
        required_fields = ['user_id', 'items']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})
        
        dbsession = request.dbsession
        
        # Create order
        order = Orders(
            user_id=json_data['user_id'],
            status='pending',
            total_harga=0,
            pembayaran=json_data.get('pembayaran', 'tunai')
        )
        
        dbsession.add(order)
        dbsession.flush()
        
        total_harga = 0
        
        # Create order details
        for item in json_data['items']:
            menu = dbsession.query(Menu).filter_by(menu_id=item['menu_id']).first()
            if not menu:
                return HTTPBadRequest(json_body={'error': f'Menu dengan ID {item["menu_id"]} tidak ditemukan'})
            
            subtotal = menu.harga * item['jumlah']
            total_harga += subtotal
            
            order_detail = OrderDetails(
                order_id=order.order_id,
                menu_id=item['menu_id'],
                jumlah=item['jumlah'],
                subtotal=subtotal
            )
            
            dbsession.add(order_detail)
        
        # Update total harga
        order.total_harga = total_harga
        
        return {'success': True, 'order': order.to_dict(), 'total_harga': total_harga}
            
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


# ===== KERANJANG VIEWS =====
@view_config(route_name='keranjang_list', renderer='json')
def keranjang_list(request):
    """View untuk menampilkan isi keranjang user"""
    user_id = request.matchdict.get('user_id')
    dbsession = request.dbsession
    
    keranjangs = dbsession.query(Keranjang).filter_by(user_id=user_id).all()
    return {'keranjang': [k.to_dict() for k in keranjangs]}


@view_config(route_name='keranjang_add', request_method='POST', renderer='json')
def keranjang_add(request):
    """View untuk menambah item ke keranjang"""
    try:
        json_data = request.json_body
        
        required_fields = ['user_id', 'order_id', 'menu_id', 'jumlah']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})
        
        dbsession = request.dbsession
        
        # Check if item already exists in cart
        existing_item = dbsession.query(Keranjang).filter_by(
            user_id=json_data['user_id'],
            menu_id=json_data['menu_id']
        ).first()
        
        if existing_item:
            existing_item.jumlah += json_data['jumlah']
            existing_item.subtotal = existing_item.jumlah * existing_item.menu.harga
            return {'success': True, 'keranjang': existing_item.to_dict()}
        
        menu = dbsession.query(Menu).filter_by(menu_id=json_data['menu_id']).first()
        if not menu:
            return HTTPBadRequest(json_body={'error': 'Menu tidak ditemukan'})
        
        keranjang = Keranjang(
            user_id=json_data['user_id'],
            order_id=json_data['order_id'],
            menu_id=json_data['menu_id'],
            jumlah=json_data['jumlah'],
            subtotal=menu.harga * json_data['jumlah']
        )
        
        dbsession.add(keranjang)
        dbsession.flush()
        
        return {'success': True, 'keranjang': keranjang.to_dict()}
            
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})