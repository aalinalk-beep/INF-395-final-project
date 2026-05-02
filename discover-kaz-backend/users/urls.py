# users/urls.py
from django.urls import path
from .views import RegisterView, UserView, LogoutView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserView.as_view(), name='auth_user'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
]