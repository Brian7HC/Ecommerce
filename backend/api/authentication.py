"""
JWT Authentication utilities for CR7 Store
"""

import jwt
import bcrypt
from datetime import datetime, timedelta
from django.conf import settings
from functools import wraps
from rest_framework.response import Response
from rest_framework import status


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def generate_token(user_id: str, email: str) -> str:
    """Generate a JWT token"""
    payload = {
        'user_id': str(user_id),
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow(),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token"""
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")


def get_user_from_request(request):
    """Extract user info from request (set by middleware)"""
    return getattr(request, 'user_data', None)


def login_required(view_func):
    """Decorator to require authentication"""
    @wraps(view_func)
    def wrapper(self, request, *args, **kwargs):
        user_data = get_user_from_request(request)
        if not user_data:
            return Response({
                'status': 'error',
                'message': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        return view_func(self, request, *args, **kwargs)
    return wrapper