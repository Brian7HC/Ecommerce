"""
Utility functions for CR7 Store API
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """Custom exception handler for consistent error responses"""
    response = exception_handler(exc, context)
    
    if response is not None:
        response.data = {
            'status': 'error',
            'message': str(exc.detail) if hasattr(exc, 'detail') else str(exc),
            'errors': response.data
        }
    
    return response


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    """Generate a success response"""
    response_data = {
        'status': 'success',
        'message': message,
    }
    if data is not None:
        response_data['data'] = data
    return Response(response_data, status=status_code)


def error_response(message="Error", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    """Generate an error response"""
    response_data = {
        'status': 'error',
        'message': message,
    }
    if errors:
        response_data['errors'] = errors
    return Response(response_data, status=status_code)


# CR7 Stats Data (would typically come from an external API)
CR7_STATS = {
    'career_goals': 925,
    'international_goals': 135,
    'club_goals': 790,
    'assists': 263,
    'ballon_dor': 5,
    'champions_league': 5,
    'caps': 214,
    'hat_tricks': 69,
    'free_kicks': 62,
    'penalties': 160,
    'headers': 145,
    'left_foot': 129,
    'right_foot': 651,
    'current_club': 'Al-Nassr',
    'current_season': '2024/25',
    'season_goals': 14,
    'season_assists': 3,
}