from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    TransactionListCreateView, 
    DashboardSummaryView,
    UserRegisterView,
    UserLogoutView
)

urlpatterns = [
    # Auth Endpoints
    path('auth/register/', UserRegisterView.as_view(), name='auth-register'),
    path('auth/login/', obtain_auth_token, name='auth-login'),
    path('auth/logout/', UserLogoutView.as_view(), name='auth-logout'),

    # Transaction Endpoints
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
]
