def includeme(config):
    """Add routes to the config."""
    config.add_static_view('static', 'static', cache_max_age=3600)
    
    # Default route
    config.add_route('home', '/')
    
    # API Routes
    # Auth routes
    config.add_route('login', '/api/login', request_method='POST')
    config.add_route('user_register', '/api/register')
    
    # Menu routes
    config.add_route('menu_list', '/api/menu', request_method='GET')
    config.add_route('menu_detail', '/api/menu/{id}', request_method='GET')
    config.add_route('menu_add', '/api/menu', request_method='POST')
    config.add_route('menu_update', '/api/menu/{id}', request_method='PUT')
    config.add_route('menu_delete', '/api/menu/{id}', request_method='DELETE')
    
    # Kategori routes
    config.add_route('kategori_list', '/api/kategori', request_method='GET')
    config.add_route('kategori_detail', '/api/kategori/{id}', request_method='GET')
    config.add_route('kategori_add', '/api/kategori', request_method='POST')
    config.add_route('kategori_update', '/api/kategori/{id}', request_method='PUT')
    config.add_route('kategori_delete', '/api/kategori/{id}', request_method='DELETE')
    
    # User routes
    config.add_route('user_list', '/api/users', request_method='GET')
    config.add_route('user_detail', '/api/users/{id}', request_method='GET')
    config.add_route('user_update', '/api/users/{id}', request_method='PUT')
    config.add_route('user_delete', '/api/users/{id}', request_method='DELETE')
    
    # Order routes
    config.add_route('order_list', '/api/orders', request_method='GET')
    config.add_route('order_detail', '/api/orders/{id}', request_method='GET')
    config.add_route('order_create', '/api/orders', request_method='POST')
    config.add_route('order_update', '/api/orders/{id}', request_method='PUT')
    config.add_route('order_delete', '/api/orders/{id}', request_method='DELETE')
    
    # Order Details routes
    config.add_route('order_details', '/api/orders/{order_id}/details', request_method='GET')
    config.add_route('order_detail_add', '/api/orders/{order_id}/details', request_method='POST')
    
    # Keranjang routes
    config.add_route('keranjang_list', '/api/keranjang/{user_id}', request_method='GET')
    config.add_route('keranjang_add', '/api/keranjang', request_method='POST')
    config.add_route('keranjang_update', '/api/keranjang/{id}', request_method='PUT')
    config.add_route('keranjang_delete', '/api/keranjang/{id}', request_method='DELETE')
    config.add_route('keranjang_clear', '/api/keranjang/{user_id}/clear', request_method='DELETE')
    
    # Role routes
    config.add_route('role_list', '/api/roles', request_method='GET')
    
    # Special routes
    config.add_route('menu_by_kategori', '/api/menu/kategori/{kategori_id}', request_method='GET')
    config.add_route('user_orders', '/api/users/{user_id}/orders', request_method='GET')
    config.add_route('order_history', '/api/orders/history/{user_id}', request_method='GET')