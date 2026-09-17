"""
Serializers for CR7 Store API
"""

from rest_framework import serializers
from decimal import Decimal


class UserSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    email = serializers.EmailField()
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    is_active = serializers.BooleanField(default=True, read_only=True)


class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(min_length=6, write_only=True)


class ProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=500)
    category = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    image = serializers.URLField(required=False, allow_blank=True)
    tagline = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    in_stock = serializers.BooleanField(default=True)
    stock_quantity = serializers.IntegerField(default=100)
    sizes = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    rating = serializers.FloatField(default=5.0, read_only=True)
    review_count = serializers.IntegerField(default=0, read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class CartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    size = serializers.CharField(required=False, allow_blank=True)
    added_at = serializers.DateTimeField(read_only=True)
    
    # Product details 
    product = ProductSerializer(read_only=True, required=False)


class CartSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True)
    item_count = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    size = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class ShippingAddressSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20)
    postal_code = serializers.CharField(max_length=20, required=False)


class OrderItemSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    name = serializers.CharField()
    price = serializers.CharField()
    quantity = serializers.CharField()
    size = serializers.CharField(required=False, allow_blank=True)
    image = serializers.CharField(required=False)


class OrderSerializer(serializers.Serializer):
    order_id = serializers.UUIDField(read_only=True)
    user_id = serializers.UUIDField(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    shipping = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    tax = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    status = serializers.CharField(read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)
    payment_method = serializers.CharField(required=False)
    payment_status = serializers.CharField(read_only=True)
    tracking_number = serializers.CharField(read_only=True, allow_null=True)
    created_at = serializers.DateTimeField(read_only=True)


class CreateOrderSerializer(serializers.Serializer):
    shipping_address = ShippingAddressSerializer()
    payment_method = serializers.CharField(max_length=50, default='card')
    notes = serializers.CharField(required=False, allow_blank=True)


class NewsletterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    source = serializers.CharField(max_length=50, default='website')


class WishlistSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    added_at = serializers.DateTimeField(read_only=True)
    product = ProductSerializer(read_only=True, required=False)


class ProductReviewSerializer(serializers.Serializer):
    review_id = serializers.UUIDField(read_only=True)
    product_id = serializers.IntegerField(read_only=True)
    user_id = serializers.UUIDField(read_only=True)
    user_name = serializers.CharField(read_only=True)
    rating = serializers.IntegerField(min_value=1, max_value=5)
    title = serializers.CharField(max_length=200, required=False)
    comment = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(read_only=True)


class CR7StatsSerializer(serializers.Serializer):
    """Ronaldo stats serializer"""
    career_goals = serializers.IntegerField()
    international_goals = serializers.IntegerField()
    club_goals = serializers.IntegerField()
    assists = serializers.IntegerField()
    ballon_dor = serializers.IntegerField()
    champions_league = serializers.IntegerField()
    caps = serializers.IntegerField()
    hat_tricks = serializers.IntegerField()
    free_kicks = serializers.IntegerField()
    penalties = serializers.IntegerField()
    headers = serializers.IntegerField()
    current_club = serializers.CharField()
    current_season = serializers.CharField()
    season_goals = serializers.IntegerField()
    season_assists = serializers.IntegerField()
    last_updated = serializers.DateTimeField()