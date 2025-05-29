from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from ..models import Users, Roles
from pyramid.response import Response

@view_config(route_name='login', request_method='POST', renderer='json')
def login(request):
    """View untuk login user"""
    try:
        json_data = request.json_body
        
        required_fields = ['email', 'password']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})

        # User authentication logic
        dbsession = request.dbsession
        user = dbsession.query(Users).filter_by(email=json_data['email']).first()
        
        if not user:
            return HTTPBadRequest(json_body={'error': 'Email atau password salah'})
            
        if user.password != json_data['password']:
            return HTTPBadRequest(json_body={'error': 'Email atau password salah'})
            
        if not user.is_active:
            return HTTPBadRequest(json_body={'error': 'Akun tidak aktif'})
            
        # Get user role
        role = dbsession.query(Roles).get(user.role_id)
        
        # Create response with token
        response = {
            'token': 'dummy-token',  # In production, use proper JWT token
            'user': {
                'user_id': user.user_id,
                'nama_lengkap': user.nama_lengkap,
                'email': user.email,
                'role_name': role.role_name if role else None
            }
        }
        
        return response

    except Exception as e:
        print("Error in login:", str(e))
        import traceback
        traceback.print_exc()
        return HTTPBadRequest(json_body={'error': str(e)})

@view_config(route_name='user_delete', request_method='DELETE', renderer='json')
def user_delete(request):
    """View untuk menghapus user"""
    try:
        # Add CORS headers
        request.response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization'
        })

        user_id = request.matchdict['id']
        dbsession = request.dbsession
        
        # Cari user yang akan dihapus
        user = dbsession.query(Users).filter_by(user_id=user_id).first()
        
        if user is None:
            return HTTPNotFound(json_body={'error': 'User tidak ditemukan'})
            
        # Cek apakah user adalah admin
        if user.role.role_name.lower() == 'admin':
            return HTTPBadRequest(json_body={'error': 'Tidak dapat menghapus user admin'})
        
        # Hapus user
        dbsession.delete(user)
        dbsession.flush()
        
        return {'success': True, 'message': 'User berhasil dihapus'}
            
    except Exception as e:
        print("Error deleting user:", str(e))
        return HTTPBadRequest(json_body={'error': str(e)})

@view_config(route_name='user_delete', request_method='OPTIONS', renderer='json')
def user_delete_options(request):
    """Handle OPTIONS request for CORS preflight"""
    response = request.response
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization',
        'Access-Control-Max-Age': '3600'
    })
    return {}
