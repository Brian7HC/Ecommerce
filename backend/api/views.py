"""
API Views for CR7 Store
"""

import uuid
from datetime import datetime
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import (
    User, UserByEmail, Product, CartItem, Order,
    NewsletterSubscriber, Wishlist, ProductReview
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    ProductSerializer, CartItemSerializer, CartSerializer, AddToCartSerializer,
    UpdateCartItemSerializer, OrderSerializer, CreateOrderSerializer,
    NewsletterSerializer, WishlistSerializer, ProductReviewSerializer,
    PasswordChangeSerializer
)
from .authentication import (
    hash_password, verify_password, generate_token, 
    login_required, get_user_from_request
)
from .utils import success_response, error_response, CR7_STATS


# ============================================
# HEALTH CHECK
# ============================================
class HealthCheckView(APIView):
    """Health check endpoint"""
    
    def get(self, request):
        return success_response(
            data={
                'service': 'CR7 Store API',
                'status': 'healthy',
                'database': 'cassandra',
                'timestamp': datetime.utcnow().isoformat(),
            },
            message='Service is running'
        )


# ============================================
# CR7 STATS
# ============================================
class CR7StatsView(APIView):
    """Get Ronaldo's career statistics"""
    
    def get(self, request):
        stats = {
            **CR7_STATS,
            'last_updated': datetime.utcnow().isoformat(),
        }
        return success_response(data=stats, message='CR7 stats retrieved')


# ============================================
# AUTHENTICATION VIEWS
# ============================================
class RegisterView(APIView):
    """User registration"""
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                message='Validation failed',
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        email = serializer.validated_data['email'].lower()
        
        # Check if email already exists
        try:
            existing = UserByEmail.objects.filter(email=email).first()
            if existing:
                return error_response(
                    message='Email already registered',
                    status_code=status.HTTP_409_CONFLICT
                )
        except Exception:
            pass
        
        try:
            # Create user
            user_id = uuid.uuid4()
            password_hash = hash_password(serializer.validated_data['password'])
            
            user = User.create(
                id=user_id,
                email=email,
                password_hash=password_hash,
                name=serializer.validated_data['name'],
                phone=serializer.validated_data.get('phone', ''),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            
            # Create email lookup entry
            UserByEmail.create(email=email, user_id=user_id)
            
            # Generate token
            token = generate_token(str(user_id), email)
            
            user_data = UserSerializer(user).data
            
            return success_response(
                data={
                    'user': user_data,
                    'token': token,
                },
                message='Registration successful',
                status_code=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return error_response(
                message=f'Registration failed: {str(e)}',
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginView(APIView):
    """User login"""
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                message='Validation failed',
                errors=serializer.errors
            )
        
        email = serializer.validated_data['email'].lower()
        password = serializer.validated_data['password']
        
        try:
            # Find user by email
            email_lookup = UserByEmail.objects.filter(email=email).first()
            
            if not email_lookup:
                return error_response(
                    message='Invalid email or password',
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            
            user = User.objects.filter(id=email_lookup.user_id).first()
            
            if not user:
                return error_response(
                    message='Invalid email or password',
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            
            # Verify password
            if not verify_password(password, user.password_hash):
                return error_response(
                    message='Invalid email or password',
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            
            if not user.is_active:
                return error_response(
                    message='Account is deactivated',
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            # Generate token
            token = generate_token(str(user.id), email)
            user_data = UserSerializer(user).data
            
            return success_response(
                data={
                    'user': user_data,
                    'token': token,
                },
                message='Login successful'
            )
            
        except Exception as e:
            return error_response(
                message=f'Login failed: {str(e)}',
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProfileView(APIView):
    """Get and update user profile"""
    
    @login_required
    def get(self, request):
        user_data = get_user_from_request(request)
        
        try:
            user = User.objects.filter(id=uuid.UUID(user_data['user_id'])).first()
            
            if not user:
                return error_response(
                    message='User not found',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            return success_response(
                data=UserSerializer(user).data,
                message='Profile retrieved'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @login_required
    def put(self, request):
        user_data = get_user_from_request(request)
        
        try:
            user = User.objects.filter(id=uuid.UUID(user_data['user_id'])).first()
            
            if not user:
                return error_response(
                    message='User not found',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            # Update fields
            allowed_fields = ['name', 'phone', 'address', 'city', 'country']
            for field in allowed_fields:
                if field in request.data:
                    setattr(user, field, request.data[field])
            
            user.updated_at = datetime.utcnow()
            user.save()
            
            return success_response(
                data=UserSerializer(user).data,
                message='Profile updated'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ChangePasswordView(APIView):
    """Change user password"""
    
    @login_required
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                message='Validation failed',
                errors=serializer.errors
            )
        
        user_data = get_user_from_request(request)
        
        try:
            user = User.objects.filter(id=uuid.UUID(user_data['user_id'])).first()
            
            if not user:
                return error_response(
                    message='User not found',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            # Verify old password
            if not verify_password(serializer.validated_data['old_password'], user.password_hash):
                return error_response(
                    message='Current password is incorrect',
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Update password
            user.password_hash = hash_password(serializer.validated_data['new_password'])
            user.updated_at = datetime.utcnow()
            user.save()
            
            return success_response(message='Password changed successfully')
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================
# PRODUCT VIEWS
# ============================================
class ProductListView(APIView):
    """List all products with optional filtering"""
    
    def get(self, request):
        try:
            category = request.query_params.get('category')
            search = request.query_params.get('search', '').lower()
            
            if category:
                products = Product.objects.filter(category=category)
            else:
                products = Product.objects.all()
            
            # Convert to list for filtering
            products_list = list(products)
            
            # Apply search filter
            if search:
                products_list = [
                    p for p in products_list 
                    if search in p.name.lower() or search in (p.tagline or '').lower()
                ]
            
            serializer = ProductSerializer(products_list, many=True)
            
            return success_response(
                data={
                    'products': serializer.data,
                    'count': len(serializer.data),
                },
                message='Products retrieved'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProductDetailView(APIView):
    """Get single product details"""
    
    def get(self, request, product_id):
        try:
            product = Product.objects.filter(id=product_id).first()
            
            if not product:
                return error_response(
                    message='Product not found',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            # Get reviews
            reviews = list(ProductReview.objects.filter(product_id=product_id))
            reviews_data = ProductReviewSerializer(reviews, many=True).data
            
            product_data = ProductSerializer(product).data
            product_data['reviews'] = reviews_data
            
            return success_response(
                data=product_data,
                message='Product retrieved'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProductCategoriesView(APIView):
    """Get all product categories"""
    
    def get(self, request):
        categories = [
            {"name": "Fragrances", "icon": "🧴"},
            {"name": "Kits & Apparel", "icon": "👕"},
            {"name": "Collectibles", "icon": "🏆"},
            {"name": "Eyewear", "icon": "🕶️"},
            {"name": "Footwear", "icon": "👟"},
            {"name": "Hoodies", "icon": "🧥"},
            {"name": "Accessories", "icon": "⌚"},
        ]
        
        return success_response(
            data=categories,
            message='Categories retrieved'
        )


# ============================================
# CART VIEWS
# ============================================
class CartView(APIView):
    """Get user's cart"""
    
    @login_required
    def get(self, request):
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            cart_items = list(CartItem.objects.filter(user_id=user_id))
            
            # Enrich with product data
            items_with_products = []
            subtotal = Decimal('0')
            
            for item in cart_items:
                product = Product.objects.filter(id=item.product_id).first()
                if product:
                    item_data = {
                        'product_id': item.product_id,
                        'quantity': item.quantity,
                        'size': item.size,
                        'added_at': item.added_at.isoformat() if item.added_at else None,
                        'product': ProductSerializer(product).data,
                    }
                    items_with_products.append(item_data)
                    subtotal += product.price * item.quantity
            
            return success_response(
                data={
                    'items': items_with_products,
                    'item_count': sum(i['quantity'] for i in items_with_products),
                    'subtotal': str(subtotal),
                },
                message='Cart retrieved'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AddToCartView(APIView):
    """Add item to cart"""
    
    @login_required
    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                message='Validation failed',
                errors=serializer.errors
            )
        
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data.get('quantity', 1)
            size = serializer.validated_data.get('size', '')
            
            # Verify product exists
            product = Product.objects.filter(id=product_id).first()
            if not product:
                return error_response(
                    message='Product not found',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            # Check if item already in cart
            existing = CartItem.objects.filter(
                user_id=user_id, 
                product_id=product_id
            ).first()
            
            if existing:
                existing.quantity += quantity
                if size:
                    existing.size = size
                existing.save()
            else:
                CartItem.create(
                    user_id=user_id,
                    product_id=product_id,
                    quantity=quantity,
                    size=size or '',
                    added_at=datetime.utcnow(),
                )
            
            return success_response(
                message='Item added to cart',
                status_code=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateCartItemView(APIView):
    """Update cart item quantity"""
    
    @login_required
    def put(self, request, product_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                message='Validation failed',
                errors=serializer.errors
            )
        
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            
            cart_item = CartItem.objects.filter(
                user_id=user_id,
                product_id=product_id
            ).first()
            
            if not cart_item:
                return error_response(
                    message='Item not found in cart',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            cart_item.quantity = serializer.validated_data['quantity']
            cart_item.save()
            
            return success_response(message='Cart item updated')
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @login_required
    def delete(self, request, product_id):
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            
            cart_item = CartItem.objects.filter(
                user_id=user_id,
                product_id=product_id
            ).first()
            
            if not cart_item:
                return error_response(
                    message='Item not found in cart',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            cart_item.delete()
            
            return success_response(
                message='Item removed from cart',
                status_code=status.HTTP_200_OK
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ClearCartView(APIView):
    """Clear all items from cart"""
    
    @login_required
    def delete(self, request):
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            cart_items = CartItem.objects.filter(user_id=user_id)
            
            for item in cart_items:
                item.delete()
            
            return success_response(message='Cart cleared')
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================
# ORDER VIEWS
# ============================================
class OrderListView(APIView):
    """Get user's orders"""
    
    @login_required
    def get(self, request):
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            orders = list(Order.objects.filter(user_id=user_id))
            
            orders_data = []
            for order in orders:
                order_dict = {
                    'order_id': str(order.order_id),
                    'items': order.order_items or [],
                    'subtotal': str(order.subtotal) if order.subtotal else '0',
                    'shipping': str(order.shipping) if order.shipping else '0',
                    'tax': str(order.tax) if order.tax else '0',
                    'total': str(order.total) if order.total else '0',
                    'status': order.status,
                    'shipping_address': order.shipping_address or {},
                    'payment_method': order.payment_method,
                    'payment_status': order.payment_status,
                    'tracking_number': order.tracking_number,
                    'created_at': order.created_at.isoformat() if order.created_at else None,
                }
                orders_data.append(order_dict)
            
            return success_response(
                data={
                    'orders': orders_data,
                    'count': len(orders_data),
                },
                message='Orders retrieved'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateOrderView(APIView):
    """Create a new order from cart"""
    
    @login_required
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                message='Validation failed',
                errors=serializer.errors
            )
        
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            
            # Get cart items
            cart_items = list(CartItem.objects.filter(user_id=user_id))
            
            if not cart_items:
                return error_response(
                    message='Cart is empty',
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Build order items and calculate totals
            order_items = []
            subtotal = Decimal('0')
            
            for cart_item in cart_items:
                product = Product.objects.filter(id=cart_item.product_id).first()
                if product:
                    item_total = product.price * cart_item.quantity
                    subtotal += item_total
                    
                    order_items.append({
                        'product_id': str(cart_item.product_id),
                        'name': product.name,
                        'price': str(product.price),
                        'quantity': str(cart_item.quantity),
                        'size': cart_item.size or '',
                        'image': product.image or '',
                    })
            
            # Calculate shipping and tax
            shipping = Decimal('500') if subtotal < Decimal('10000') else Decimal('0')
            tax = subtotal * Decimal('0.16')  # 16% VAT
            total = subtotal + shipping + tax
            
            # Convert shipping address to dict
            shipping_address = {
                'name': serializer.validated_data['shipping_address']['name'],
                'address': serializer.validated_data['shipping_address']['address'],
                'city': serializer.validated_data['shipping_address']['city'],
                'country': serializer.validated_data['shipping_address']['country'],
                'phone': serializer.validated_data['shipping_address']['phone'],
            }
            
            # Create order
            order = Order.create(
                user_id=user_id,
                order_id=uuid.uuid4(),
                order_items=order_items,
                subtotal=subtotal,
                shipping=shipping,
                tax=tax,
                total=total,
                status='pending',
                shipping_address=shipping_address,
                payment_method=serializer.validated_data.get('payment_method', 'card'),
                payment_status='pending',
                notes=serializer.validated_data.get('notes', ''),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            
            # Clear cart
            for item in cart_items:
                item.delete()
            
            return success_response(
                data={
                    'order_id': str(order.order_id),
                    'total': str(total),
                    'status': 'pending',
                },
                message='Order created successfully',
                status_code=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OrderDetailView(APIView):
    """Get single order details"""
    
    @login_required
    def get(self, request, order_id):
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            order_uuid = uuid.UUID(order_id)
            
            order = Order.objects.filter(
                user_id=user_id,
                order_id=order_uuid
            ).first()
            
            if not order:
                return error_response(
                    message='Order not found',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            order_data = {
                'order_id': str(order.order_id),
                'items': order.order_items or [],
                'subtotal': str(order.subtotal) if order.subtotal else '0',
                'shipping': str(order.shipping) if order.shipping else '0',
                'tax': str(order.tax) if order.tax else '0',
                'total': str(order.total) if order.total else '0',
                'status': order.status,
                'shipping_address': order.shipping_address or {},
                'payment_method': order.payment_method,
                'payment_status': order.payment_status,
                'tracking_number': order.tracking_number,
                'created_at': order.created_at.isoformat() if order.created_at else None,
            }
            
            return success_response(
                data=order_data,
                message='Order retrieved'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================
# NEWSLETTER
# ============================================
class NewsletterView(APIView):
    """Subscribe to newsletter"""
    
    def post(self, request):
        serializer = NewsletterSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                message='Validation failed',
                errors=serializer.errors
            )
        
        email = serializer.validated_data['email'].lower()
        
        try:
            # Check if already subscribed
            existing = NewsletterSubscriber.objects.filter(email=email).first()
            
            if existing:
                if existing.is_active:
                    return success_response(
                        message='Email already subscribed'
                    )
                else:
                    existing.is_active = True
                    existing.save()
                    return success_response(
                        message='Subscription reactivated'
                    )
            
            # Create new subscriber
            NewsletterSubscriber.create(
                email=email,
                source=serializer.validated_data.get('source', 'website'),
                subscribed_at=datetime.utcnow(),
                is_active=True,
            )
            
            return success_response(
                message='Successfully subscribed to newsletter',
                status_code=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================
# WISHLIST
# ============================================
class WishlistView(APIView):
    """Get user's wishlist"""
    
    @login_required
    def get(self, request):
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            wishlist_items = list(Wishlist.objects.filter(user_id=user_id))
            
            # Enrich with product data
            items_with_products = []
            
            for item in wishlist_items:
                product = Product.objects.filter(id=item.product_id).first()
                if product:
                    item_data = {
                        'product_id': item.product_id,
                        'added_at': item.added_at.isoformat() if item.added_at else None,
                        'product': ProductSerializer(product).data,
                    }
                    items_with_products.append(item_data)
            
            return success_response(
                data={
                    'items': items_with_products,
                    'count': len(items_with_products),
                },
                message='Wishlist retrieved'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @login_required
    def post(self, request):
        product_id = request.data.get('product_id')
        
        if not product_id:
            return error_response(message='product_id is required')
        
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            
            # Verify product exists
            product = Product.objects.filter(id=product_id).first()
            if not product:
                return error_response(
                    message='Product not found',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            # Check if already in wishlist
            existing = Wishlist.objects.filter(
                user_id=user_id,
                product_id=product_id
            ).first()
            
            if existing:
                return success_response(message='Already in wishlist')
            
            Wishlist.create(
                user_id=user_id,
                product_id=product_id,
                added_at=datetime.utcnow(),
            )
            
            return success_response(
                message='Added to wishlist',
                status_code=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WishlistItemView(APIView):
    """Remove item from wishlist"""
    
    @login_required
    def delete(self, request, product_id):
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            
            wishlist_item = Wishlist.objects.filter(
                user_id=user_id,
                product_id=product_id
            ).first()
            
            if not wishlist_item:
                return error_response(
                    message='Item not found in wishlist',
                    status_code=status.HTTP_404_NOT_FOUND
                )
            
            wishlist_item.delete()
            
            return success_response(message='Removed from wishlist')
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ============================================
# REVIEWS
# ============================================
class ProductReviewsView(APIView):
    """Get and create product reviews"""
    
    def get(self, request, product_id):
        try:
            reviews = list(ProductReview.objects.filter(product_id=product_id))
            serializer = ProductReviewSerializer(reviews, many=True)
            
            return success_response(
                data={
                    'reviews': serializer.data,
                    'count': len(serializer.data),
                },
                message='Reviews retrieved'
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @login_required
    def post(self, request, product_id):
        serializer = ProductReviewSerializer(data=request.data)
        
        if not serializer.is_valid():
            return error_response(
                message='Validation failed',
                errors=serializer.errors
            )
        
        user_data = get_user_from_request(request)
        
        try:
            user_id = uuid.UUID(user_data['user_id'])
            
            # Get user for name
            user = User.objects.filter(id=user_id).first()
            
            # Create review
            review = ProductReview.create(
                product_id=product_id,
                review_id=uuid.uuid4(),
                user_id=user_id,
                user_name=user.name if user else 'Anonymous',
                rating=serializer.validated_data['rating'],
                title=serializer.validated_data.get('title', ''),
                comment=serializer.validated_data.get('comment', ''),
                created_at=datetime.utcnow(),
            )
            
            # Update product rating (simplified - in production, calculate average)
            product = Product.objects.filter(id=product_id).first()
            if product:
                product.review_count = (product.review_count or 0) + 1
                product.save()
            
            return success_response(
                data=ProductReviewSerializer(review).data,
                message='Review submitted',
                status_code=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return error_response(
                message=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )