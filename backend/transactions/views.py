from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Transaction
from .serializers import TransactionSerializer

# User Registration View
class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create user and link a Token automatically
            user = User.objects.create_user(username=username, email=email, password=password)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# User Logout View
class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Delete user token to log them out
            request.user.auth_token.delete()
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Authenticated Transaction Views
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only fetch transactions belonging to the logged-in user
        queryset = Transaction.objects.filter(user=self.request.user)
        category = self.request.query_params.get('category')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if category:
            queryset = queryset.filter(category__iexact=category)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        return queryset

    def perform_create(self, serializer):
        # Automatically bind the transaction to the logged-in user
        serializer.save(user=self.request.user)

# Authenticated Dashboard Summary View
class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Retrieve user-specific totals
        total_income_query = Transaction.objects.filter(user=request.user, type='INCOME').aggregate(total=Sum('amount'))
        total_expense_query = Transaction.objects.filter(user=request.user, type='EXPENSE').aggregate(total=Sum('amount'))

        total_income = total_income_query['total'] or 0.0
        total_expense = total_expense_query['total'] or 0.0
        net_balance = float(total_income) - float(total_expense)

        # User-specific expense by category (aggregated for charts)
        expense_by_category_query = (
            Transaction.objects.filter(user=request.user, type='EXPENSE')
            .values('category')
            .annotate(total_amount=Sum('amount'))
            .order_by('-total_amount')
        )

        top_spending_category = None
        if expense_by_category_query.exists():
            top_spending_category = expense_by_category_query[0]['category']

        expense_chart_data = [
            {
                'name': item['category'],
                'value': float(item['total_amount'])
            }
            for item in expense_by_category_query
        ]

        # Get unique categories of user's transactions
        categories = list(Transaction.objects.filter(user=request.user).values_list('category', flat=True).distinct())

        return Response({
            'total_income': float(total_income),
            'total_expense': float(total_expense),
            'net_balance': float(net_balance),
            'top_spending_category': top_spending_category if top_spending_category else "N/A",
            'expense_by_category': expense_chart_data,
            'categories': categories
        }, status=status.HTTP_200_OK)
