import datetime
from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound,
    HTTPBadRequest,
)
from ..models import Menu, Kategori, Users, Orders, OrderDetails, Keranjang, Roles
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from pyramid.response import Response
import transaction


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


@view_config(route_name='menu_delete', request_method='DELETE', renderer='json')
def menu_delete(request):
    """View untuk menghapus menu"""
    # Add CORS headers
    request.response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE',
        'Access-Control-Allow-Headers': 'Content-Type,Accept'
    })
    
    try:
        menu_id = request.matchdict['id']
        dbsession = request.dbsession
        menu = dbsession.query(Menu).filter_by(menu_id=menu_id).first()
        
        if menu is None:
            return HTTPNotFound(json_body={'error': 'Menu tidak ditemukan'})
        
        dbsession.delete(menu)
        dbsession.flush()  # Pastikan perubahan tersimpan ke database
        
        return {'success': True, 'message': 'Menu berhasil dihapus'}
            
    except Exception as e:
        print("Error deleting menu:", str(e))  # Tambahkan logging
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='menu_delete', request_method='OPTIONS', renderer='json')
def menu_delete_options(request):
    """Handle OPTIONS request for CORS preflight"""
    response = request.response
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE',
        'Access-Control-Allow-Headers': 'Content-Type,Accept',
        'Access-Control-Max-Age': '3600'
    })
    return {}


@view_config(route_name='menu_update', request_method='PUT', renderer='json')
def menu_update(request):
    """View untuk mengupdate menu"""
    # Add CORS headers
    request.response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT',
        'Access-Control-Allow-Headers': 'Content-Type,Accept'
    })
    
    try:
        menu_id = request.matchdict['id']
        json_data = request.json_body
        
        dbsession = request.dbsession
        menu = dbsession.query(Menu).filter_by(menu_id=menu_id).first()
        
        if menu is None:
            return HTTPNotFound(json_body={'error': 'Menu tidak ditemukan'})
        
        # Validasi required fields
        required_fields = ['nama_menu', 'kategori_id', 'harga']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})
        
        # Validasi kategori exists
        kategori = dbsession.query(Kategori).filter_by(kategori_id=json_data['kategori_id']).first()
        if not kategori:
            return HTTPBadRequest(json_body={'error': 'Kategori tidak ditemukan'})
        
        # Validasi harga
        try:
            harga = float(json_data['harga'])
            if harga < 0:
                return HTTPBadRequest(json_body={'error': 'Harga tidak boleh negatif'})
        except (ValueError, TypeError):
            return HTTPBadRequest(json_body={'error': 'Harga harus berupa angka'})
        
        # Update menu
        menu.nama_menu = json_data['nama_menu']
        menu.kategori_id = json_data['kategori_id']
        menu.deskripsi = json_data.get('deskripsi')
        menu.harga = harga
        menu.image = json_data.get('image')
        menu.status = json_data.get('status', menu.status)
        
        dbsession.flush()
        
        return {'success': True, 'menu': menu.to_dict()}
            
    except Exception as e:
        print("Error updating menu:", str(e))  # Tambahkan logging
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='menu_update', request_method='OPTIONS', renderer='json')
def menu_update_options(request):
    """Handle OPTIONS request for CORS preflight"""
    response = request.response
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT',
        'Access-Control-Allow-Headers': 'Content-Type,Accept',
        'Access-Control-Max-Age': '3600'
    })
    return {}


# ===== KATEGORI VIEWS =====
@view_config(route_name='kategori_list', renderer='json')
def kategori_list(request):
    """View untuk menampilkan daftar kategori"""
    # Add CORS headers
    request.response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type,Accept'
    })
    
    try:
        dbsession = request.dbsession
        kategoris = dbsession.query(Kategori).all()
        return {'kategoris': [k.to_dict() for k in kategoris]}
    except Exception as e:
        print("Error fetching categories:", str(e))
        return HTTPBadRequest(json_body={'error': str(e)})


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
        # Add CORS headers
        request.response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type,Accept'
        })

        print("Received registration data:", request.json_body)  # Debug print
        json_data = request.json_body
        
        required_fields = ['nama_lengkap', 'email', 'password']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})
        
        # Validasi email format
        if not '@' in json_data['email']:
            return HTTPBadRequest(json_body={'error': 'Format email tidak valid'})
            
        # Check email exists
        dbsession = request.dbsession
        existing_user = dbsession.query(Users).filter_by(email=json_data['email']).first()
        if existing_user:
            return HTTPBadRequest(json_body={'error': 'Email sudah terdaftar'})
        
        # Validasi password
        if len(json_data['password']) < 6:
            return HTTPBadRequest(json_body={'error': 'Password minimal 6 karakter'})
        
        user = Users(
            nama_lengkap=json_data['nama_lengkap'],
            email=json_data['email'],
            password=json_data['password'],  # Should be hashed in production
            role_id=1,  # Set role_id 1 untuk pembeli
            is_active=True
        )
        
        dbsession.add(user)
        dbsession.flush()
        
        return {
            'success': True,
            'message': 'Registrasi berhasil',
            'user': user.to_dict()
        }
            
    except Exception as e:
        print("Registration error:", str(e))  # Debug print
        import traceback
        traceback.print_exc()
        return HTTPBadRequest(json_body={'error': str(e)})


# ===== ORDER VIEWS =====
@view_config(route_name='order_list', renderer='json')
def order_list(request):
    """View untuk menampilkan daftar orders"""
    try:
        # Add CORS headers
        request.response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization'
        })

        dbsession = request.dbsession
        
        # Query orders dengan join ke user untuk mendapatkan informasi pembeli
        orders = dbsession.query(Orders).join(Users, Orders.user_id == Users.user_id).all()
        
        # Format response dengan informasi lengkap
        order_list = []
        for order in orders:
            order_data = order.to_dict()
            
            # Tambahkan informasi user
            order_data['user'] = {
                'user_id': order.user.user_id,
                'nama_lengkap': order.user.nama_lengkap,
                'email': order.user.email
            }
            
            # Tambahkan detail items
            order_details = dbsession.query(OrderDetails).filter_by(order_id=order.order_id).all()
            order_data['items'] = []
            
            for detail in order_details:
                menu = dbsession.query(Menu).filter_by(menu_id=detail.menu_id).first()
                if menu:
                    order_data['items'].append({
                        'menu_id': menu.menu_id,
                        'nama_menu': menu.nama_menu,
                        'jumlah': detail.jumlah,
                        'harga': menu.harga,
                        'subtotal': detail.subtotal
                    })
            
            order_list.append(order_data)
            
        return {
            'success': True,
            'orders': order_list
        }
            
    except Exception as e:
        print("Error fetching orders:", str(e))
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='order_create', request_method='POST', renderer='json')
def order_create(request):
    """View untuk membuat order baru"""
    try:
        # Add CORS headers
        request.response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization'
        })

        print("Received order data:", request.json_body)  # Debug print
        json_data = request.json_body
        
        # Validasi data yang diperlukan
        required_fields = ['user_id', 'items', 'pembayaran']
        for field in required_fields:
            if field not in json_data:
                print(f"Missing required field: {field}")  # Debug print
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})
        
        dbsession = request.dbsession
        
        # Validasi user exists
        user = dbsession.query(Users).filter_by(user_id=json_data['user_id']).first()
        if not user:
            print(f"User not found: {json_data['user_id']}")  # Debug print
            return HTTPBadRequest(json_body={'error': 'User tidak ditemukan'})
        
        # Create order
        try:
            order = Orders(
                user_id=json_data['user_id'],
                status='menunggu',  # Mengubah status default menjadi 'menunggu'
                total_harga=0,
                pembayaran=json_data['pembayaran'],
                create_at=datetime.datetime.now()
            )
            
            dbsession.add(order)
            dbsession.flush()  # Flush untuk mendapatkan order_id
            
            print(f"Order created with ID: {order.order_id}")  # Debug print
            
            total_harga = 0
            
            # Create order details
            for item in json_data['items']:
                menu = dbsession.query(Menu).filter_by(menu_id=item['menu_id']).first()
                if not menu:
                    print(f"Menu not found: {item['menu_id']}")  # Debug print
                    raise Exception(f'Menu dengan ID {item["menu_id"]} tidak ditemukan')
                
                subtotal = menu.harga * item['jumlah']
                total_harga += subtotal
                
                order_detail = OrderDetails(
                    order_id=order.order_id,
                    menu_id=item['menu_id'],
                    jumlah=item['jumlah'],
                    subtotal=subtotal
                )
                
                dbsession.add(order_detail)
                print(f"Added order detail for menu {menu.menu_id}")  # Debug print
            
            # Update total harga
            order.total_harga = total_harga
            
            # Kosongkan keranjang setelah order berhasil dibuat
            dbsession.query(Keranjang).filter_by(user_id=json_data['user_id']).delete()
            
            # Commit transaction
            transaction.commit()
            
            print(f"Order completed with total: {total_harga}")  # Debug print
            
            return {
                'success': True,
                'message': 'Pesanan berhasil dibuat',
                'order': {
                    'order_id': order.order_id,
                    'user_id': order.user_id,
                    'status': order.status,
                    'total_harga': order.total_harga,
                    'pembayaran': order.pembayaran,
                    'create_at': order.create_at.isoformat() if order.create_at else None
                }
            }
            
        except Exception as e:
            print(f"Error creating order: {str(e)}")  # Debug print
            transaction.abort()
            raise
            
    except Exception as e:
        print("Order creation error:", str(e))  # Debug print
        import traceback
        traceback.print_exc()
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='order_update', request_method='PUT', renderer='json')
def order_update(request):
    """View untuk mengupdate status pesanan"""
    try:
        # Add CORS headers
        request.response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization'
        })

        order_id = request.matchdict['id']
        json_data = request.json_body
        
        if 'status' not in json_data:
            return HTTPBadRequest(json_body={'error': 'Status pesanan wajib diisi'})
            
        dbsession = request.dbsession
        order = dbsession.query(Orders).filter_by(order_id=order_id).first()
        
        if order is None:
            return HTTPNotFound(json_body={'error': 'Pesanan tidak ditemukan'})
            
        # Update status
        order.status = json_data['status']
        dbsession.flush()
        
        return {'success': True, 'message': 'Status pesanan berhasil diperbarui', 'order': order.to_dict()}
            
    except Exception as e:
        print("Error updating order:", str(e))
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='order_update', request_method='OPTIONS', renderer='json')
def order_update_options(request):
    """Handle OPTIONS request for CORS preflight"""
    response = request.response
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization',
        'Access-Control-Max-Age': '3600'
    })
    return {}


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