"""
URL Configuration for CR7 Store API
"""

from django.urls import path
from .views import (
    # Health & Stats
    HealthCheckView,
    CR7StatsView,
    
    # Auth
    RegisterView,
    LoginView,
    ProfileView,
    ChangePasswordView,
    
    # Products
    ProductListView,
    ProductDetailView,
    ProductCategoriesView,
    
    # Cart
    CartView,
    AddToCartView,
    UpdateCartItemView,
    ClearCartView,
    
    # Orders
    OrderListView,
    CreateOrderView,
    OrderDetailView,
    
    # Newsletter
    NewsletterView,
    
    # Wishlist
    WishlistView,
    WishlistItemView,
    
    # Reviews
    ProductReviewsView,
)

urlpatterns = [
    # Health check
    path('health/', HealthCheckView.as_view(), name='health-check'),
    
    # CR7 Stats
    path('stats/', CR7StatsView.as_view(), name='cr7-stats'),
    
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Products
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/categories/', ProductCategoriesView.as_view(), name='product-categories'),
    path('products/<int:product_id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', ProductReviewsView.as_view(), name='product-reviews'),
    
    # Cart
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('cart/items/<int:product_id>/', UpdateCartItemView.as_view(), name='cart-item'),
    path('cart/clear/', ClearCartView.as_view(), name='cart-clear'),
    
    # Orders
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', CreateOrderView.as_view(), name='order-create'),
    path('orders/<str:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    
    # Newsletter
    path('newsletter/', NewsletterView.as_view(), name='newsletter'),
    
    # Wishlist
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/', WishlistItemView.as_view(), name='wishlist-item'),
]