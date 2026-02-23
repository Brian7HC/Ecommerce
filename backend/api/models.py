"""
Cassandra Models for CR7 Store
"""

import uuid
from datetime import datetime
from cassandra.cqlengine import columns
from django_cassandra_engine.models import DjangoCassandraModel


class User(DjangoCassandraModel):
    """User model for authentication"""
    __keyspace__ = 'cr7_store'
    
    id = columns.UUID(primary_key=True, default=uuid.uuid4)
    email = columns.Text(required=True, index=True)
    password_hash = columns.Text(required=True)
    name = columns.Text(required=True)
    phone = columns.Text()
    address = columns.Text()
    city = columns.Text()
    country = columns.Text()
    created_at = columns.DateTime(default=datetime.utcnow)
    updated_at = columns.DateTime(default=datetime.utcnow)
    is_active = columns.Boolean(default=True)
    
    class Meta:
        get_pk_field = 'id'

    def __str__(self):
        return f"{self.name} ({self.email})"


class UserByEmail(DjangoCassandraModel):
    """Secondary table for user lookup by email"""
    __keyspace__ = 'cr7_store'
    
    email = columns.Text(primary_key=True)
    user_id = columns.UUID(required=True)
    
    class Meta:
        get_pk_field = 'email'


class Product(DjangoCassandraModel):
    """Product model"""
    __keyspace__ = 'cr7_store'
    
    id = columns.Integer(primary_key=True)
    name = columns.Text(required=True)
    category = columns.Text(required=True, index=True)
    price = columns.Decimal(required=True)
    image = columns.Text()
    tagline = columns.Text()
    description = columns.Text()
    in_stock = columns.Boolean(default=True)
    stock_quantity = columns.Integer(default=100)
    sizes = columns.List(columns.Text)  # ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    rating = columns.Float(default=5.0)
    review_count = columns.Integer(default=0)
    created_at = columns.DateTime(default=datetime.utcnow)
    updated_at = columns.DateTime(default=datetime.utcnow)
    
    class Meta:
        get_pk_field = 'id'

    def __str__(self):
        return self.name


class CartItem(DjangoCassandraModel):
    """Cart items - partitioned by user_id"""
    __keyspace__ = 'cr7_store'
    
    user_id = columns.UUID(primary_key=True, partition_key=True)
    product_id = columns.Integer(primary_key=True, clustering_order='ASC')
    quantity = columns.Integer(default=1)
    size = columns.Text()
    added_at = columns.DateTime(default=datetime.utcnow)
    
    class Meta:
        get_pk_field = 'user_id'


class Order(DjangoCassandraModel):
    """Orders - partitioned by user_id for efficient user order queries"""
    __keyspace__ = 'cr7_store'
    
    user_id = columns.UUID(primary_key=True, partition_key=True)
    order_id = columns.UUID(primary_key=True, clustering_order='DESC', default=uuid.uuid4)
    order_items = columns.List(columns.Map(columns.Text, columns.Text))  # List of order items
    subtotal = columns.Decimal()
    shipping = columns.Decimal(default=0)
    tax = columns.Decimal(default=0)
    total = columns.Decimal()
    status = columns.Text(default='pending')  # pending, confirmed, shipped, delivered, cancelled
    shipping_address = columns.Map(columns.Text, columns.Text)  # {name, address, city, country, phone}
    payment_method = columns.Text()
    payment_status = columns.Text(default='pending')  # pending, paid, failed, refunded
    tracking_number = columns.Text()
    notes = columns.Text()
    created_at = columns.DateTime(default=datetime.utcnow)
    updated_at = columns.DateTime(default=datetime.utcnow)
    
    class Meta:
        get_pk_field = 'user_id'


class NewsletterSubscriber(DjangoCassandraModel):
    """Newsletter subscribers"""
    __keyspace__ = 'cr7_store'
    
    email = columns.Text(primary_key=True)
    subscribed_at = columns.DateTime(default=datetime.utcnow)
    is_active = columns.Boolean(default=True)
    source = columns.Text(default='website')
    
    class Meta:
        get_pk_field = 'email'


class Wishlist(DjangoCassandraModel):
    """User wishlist items"""
    __keyspace__ = 'cr7_store'
    
    user_id = columns.UUID(primary_key=True, partition_key=True)
    product_id = columns.Integer(primary_key=True, clustering_order='ASC')
    added_at = columns.DateTime(default=datetime.utcnow)
    
    class Meta:
        get_pk_field = 'user_id'


class ProductReview(DjangoCassandraModel):
    """Product reviews - partitioned by product_id"""
    __keyspace__ = 'cr7_store'
    
    product_id = columns.Integer(primary_key=True, partition_key=True)
    review_id = columns.UUID(primary_key=True, clustering_order='DESC', default=uuid.uuid4)
    user_id = columns.UUID(required=True)
    user_name = columns.Text()
    rating = columns.Integer(required=True)  # 1-5
    title = columns.Text()
    comment = columns.Text()
    created_at = columns.DateTime(default=datetime.utcnow)
    
    class Meta:
        get_pk_field = 'product_id'