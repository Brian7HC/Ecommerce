"""
JWT Authentication Middleware
"""

from django.utils.deprecation import MiddlewareMixin
from .authentication import decode_token


class JWTAuthenticationMiddleware(MiddlewareMixin):
    """Middleware to authenticate requests using JWT"""
    
    def process_request(self, request):
        request.user_data = None
        
        # Skip authentication for certain paths
        exempt_paths = [
            '/api/auth/login',
            '/api/auth/register',
            '/api/products',
            '/api/health',
            '/api/stats',
            '/api/newsletter',
        ]
        
        # Check if path starts with exempt path
        for path in exempt_paths:
            if request.path.startswith(path) and request.method == 'GET':
                return None
            if path in ['/api/auth/login', '/api/auth/register', '/api/newsletter'] and request.path.startswith(path):
                return None
        
        # Get token from header
        auth_header = request.headers.get('Authorization', '')
        
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
            try:
                payload = decode_token(token)
                request.user_data = {
                    'user_id': payload.get('user_id'),
                    'email': payload.get('email'),
                }
            except Exception as e:
                # Token invalid but don't block - let view handle auth requirement
                pass
        
        return None