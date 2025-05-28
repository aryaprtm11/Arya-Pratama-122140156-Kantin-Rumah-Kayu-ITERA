from pyramid.config import Configurator
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.security import ALL_PERMISSIONS, Allow, Authenticated
from pyramid.events import NewRequest
from pyramid.response import Response

def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        if isinstance(response, Response):
            response.headers.update({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '1728000',
            })
    event.request.add_response_callback(cors_headers)

def handle_options_request(request):
    response = Response()
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '1728000',
    })
    return response

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with Configurator(settings=settings) as config:
        # CORS
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)
        
        # Handle OPTIONS request
        config.add_route('cors_preflight', '/{catch_all:.*}', request_method='OPTIONS')
        config.add_view(handle_options_request, route_name='cors_preflight')
        
        config.include('.models')
        config.include('pyramid_jinja2')
        config.include('.routes')
        config.include('pyramid_jwt')
        config.include('pyramid_debugtoolbar')
        config.add_static_view('static', 'static', cache_max_age=3600)
        
        # Add CORS configuration
        config.add_tween('backend.cors.cors_tween_factory')
        
        config.scan()
        return config.make_wsgi_app()
