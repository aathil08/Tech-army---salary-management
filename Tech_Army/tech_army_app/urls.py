from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, ChangePasswordView, EmployeeDetailView, TimeSheetViewSet, ManagerSheetViewSet, TeamleaderSheetViewSet, CalculateSalaryView,TeamLeaderListView,EmployeeListView, UserListView,UserDetailView,TeamLeaderDetailView,LeadListView,EmployeeListView,ManagerListView,MyUserViewSet
from django.urls import path
from . import views


router = DefaultRouter()
router.register(r'timesheet', TimeSheetViewSet)
router.register(r'manager', ManagerSheetViewSet)
router.register(r'teamleader', TeamleaderSheetViewSet)
router.register(r'userss', MyUserViewSet)


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('employee/', EmployeeDetailView.as_view(), name='employee-detail'),
    path('calculate-salary/<str:user_id>/', CalculateSalaryView.as_view(), name='calculate-salary'),
    path('', include(router.urls)),  # This includes the router-generated URLs
     path('leads/', TeamLeaderListView.as_view(), name='team-leader-list'),
     path('emp/', EmployeeListView.as_view(), name='employee-list'),
     path('users/', UserListView.as_view(), name='user-list'),
      path('user/<str:userid>/', UserDetailView.as_view(), name='user-detail'),
       path('api/lead/<int:userid>/', TeamLeaderDetailView.as_view(), name='team_leader_detail'),
       path('leads/', LeadListView.as_view(), name='lead-list'),
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('managers/', ManagerListView.as_view(), name='manager-list'),
     path('roles/', views.get_roles),
    path('users/<str:role>/', views.get_users_by_role),
    path('salary-history/', views.get_salary_history),
    path('update-salary/', views.UpdateSalaryView.as_view()),
]

