from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from django.views.decorators.http import require_GET
from .models import MyUser, EmployeeDetail, TimeSheet, ManagerSheet, TeamleaderSheet
from .serializers import *
from rest_framework.permissions import AllowAny
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import MyUser, Employee, SalaryHistory


# Register view for new user registration
class RegisterView(CreateAPIView):
    queryset = MyUser.objects.all()
    
    serializer_class = RegisterSerializer

class MyUserViewSet(viewsets.ModelViewSet):
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer

# Login view for user authentication
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        userid = serializer.validated_data['userid']
        password = serializer.validated_data['password']
        print("Test: ", userid, password)

        user = MyUser.objects.filter(userid=userid, password=password).first()
        print(user)

        if user is not None:
            personstatus = getattr(user, 'personstatus', None)
            print(personstatus)
            response_data = {
                'userid': userid,
                'personstatus': personstatus
            }
            if personstatus == 'Employee':
                response_data['redirect_url'] = '/front/'
            elif personstatus == 'Lead':
                response_data['redirect_url'] = '/lead-dashboard/'
            elif personstatus == 'Manager':
                response_data['redirect_url'] = '/manager-dashboard/'
            elif personstatus == 'HR':
                response_data['redirect_url'] = '/detail/'
            elif personstatus == 'Admin':
                response_data['redirect_url'] = '/front/'
            else:
                return Response({'error': 'Unknown person status'}, status=status.HTTP_400_BAD_REQUEST)

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Change password view
class ChangePasswordView(APIView):
    def post(self, request):
        userid = request.data.get('userid')
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        user = MyUser.objects.filter(userid=userid).first()
        if user and user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return Response({'status': 'password changed'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# Employee detail view
class EmployeeDetailView(APIView):
    def get(self, request):
        print('pass')
        employee_id = request.query_params.get('employee_id')
        print(employee_id)
        if employee_id:
            try:
                employee = MyUser.objects.get(userid=employee_id)
                employee_details = EmployeeDetail.objects.filter(employee=employee).first()
                if employee_details:
                    serializer = EmployeeDetailSerializer(employee_details)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({'error': 'Employee detail not found'}, status=status.HTTP_404_NOT_FOUND)
            except MyUser.DoesNotExist:
                return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            employees = MyUser.objects.all()
            serializer = MyUserSerializer(employees, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print('here')
        serializer = EmployeeDetailSerializer(data=request.data)
        print(request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            try:
                employee = MyUser.objects.get(userid=request.data['employee'])
                project_name = ManagerSheet.objects.get(project_name=request.data['project_name'])
                module_name = TeamleaderSheet.objects.get(module_name=request.data['module_name'])
                serializer.save(employee=employee, project_name=project_name, module_name=module_name)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except (MyUser.DoesNotExist, ManagerSheet.DoesNotExist, TeamleaderSheet.DoesNotExist):
                return Response({'error': 'Data not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Timesheet viewset
class TimeSheetViewSet(viewsets.ModelViewSet):
    queryset = TimeSheet.objects.all()
    serializer_class = TimeSheetSerializer

    @action(detail=False, methods=['post'])
    def add(self, request):
        data = request.data
        print("Received data:", data)
        
        employee_id = data.get('id')
        project_name_id = data.get('project_name')  # Expecting primary key
        module_name_id = data.get('module_name')    # Expecting primary key
        print(module_name_id)
        
        try:
            print('pass1')
            employee = MyUser.objects.get(userid=employee_id)
            print('pass2')
            project = ManagerSheet.objects.get(project_name=project_name_id)
            print('pass3')
            module = TeamleaderSheet.objects.get(module_name=module_name_id)
            print(module)
        except (MyUser.DoesNotExist, ManagerSheet.DoesNotExist, TeamleaderSheet.DoesNotExist):
            return Response({'error': 'Data not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        # data['employee'] = int(employee.userid)
        # data['id'] = int(data['id'])
        # # data['id'] = int(data['id'])  # Ensure ID is an integer
        # data['week'] = data.get('week') # Convert week to integer
        # data['total'] = int(data.get('total'))  # Convert total to integer
        # data['tue'] = int(data.get('tue') ) # Convert to integer
        # data['wed'] = int(data.get('wed'))  # Convert to integer
        # data['thu'] = int(data.get('thu') ) # Convert to integer
        # data['fri'] = int(data.get('fri') ) # Convert to integer
        # data['mon'] = int(data.get('mon') ) # Convert to integer
        # data['manager_approval'] = 'Pending'
        # data['project_name'] = project.project_name
        # data['module_name'] = module.module_name
        # data['leave_days'] = 0
        # data.pop('id')
        # data.pop('team_name')
        print(employee.userid)

        data1 = {
            "project_name": project.project_name,
            "module_name": module.module_name,
            "employee": employee.userid,
            "week": data.get('week'),
            "mon": int(data.get('mon') ),
            "tue": int(data.get('tue') ),
            "wed": int(data.get('wed') ),
            "thu": int(data.get('thu') ),
            "fri": int(data.get('fri') ),
            "total": int(data.get('total') ),
            "leave_days": 0,
            "lead_approval": 'Pending',
            "manager_approval": 'Pending',
            "salary": 0.0,
            "comments":'comments'
        }
        print('updated',data1,'\n\n\n')
        serializer = self.get_serializer(data=data1)
        print(serializer.is_valid)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.lead_approval = 'Approved'
        timesheet.save()
        return Response({'status': 'Timesheet approved by Lead'}, status=status.HTTP_200_OK)
   
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.lead_approval = 'Rejected'
        timesheet.save()
        return Response({'status': 'Timesheet rejected by Lead'}, status=status.HTTP_200_OK)
    @action(detail=True, methods=['post'])
    def manager_approve(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.manager_approval = 'Approved'
        timesheet.save()
        return Response({'status': 'Timesheet approved by Manager'}, status=status.HTTP_200_OK)
    
    
    @action(detail=True, methods=['post'])
    def manager_reject(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.manager_approval = 'Rejected'
        timesheet.save()
        return Response({'status': 'Timesheet rejected by Manager'}, status=status.HTTP_200_OK)
    

    def perform_create(self, serializer):
        timesheet = serializer.save()
        self.calculate_leave_days(timesheet)

    def perform_update(self, serializer):
        timesheet = serializer.save()
        self.calculate_leave_days(timesheet)

    def calculate_leave_days(self, timesheet):
        leave_days = 0
        days = [timesheet.mon, timesheet.tue, timesheet.wed, timesheet.thu, timesheet.fri]
        for day in days:
            if day == 0:
                leave_days += 1
        timesheet.total = sum(days)
        timesheet.save()
    
    @action(detail=False, methods=['get'])
    def user_timesheets(self, request):
        print(request.data)
        user_id = request.query_params.get('user_id')
        print('User ID:', user_id)
        
        if user_id:
            timesheets = TimeSheet.objects.filter(employee__userid=user_id)
        else:
            timesheets = TimeSheet.objects.all()

        serializer = self.get_serializer(timesheets, many=True)
        return Response(serializer.data)
    
    def get_queryset(self):
        employee_id = self.request.query_params.get('employee')
        if employee_id:
            return TimeSheet.objects.filter(employee_id=employee_id)
        return super().get_queryset()

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        timesheet = self.get_object()
        comment = request.data.get('comment')
        if comment:
            timesheet.comments = comment
            timesheet.save()
            return Response({'status': 'Comment added'}, status=status.HTTP_200_OK)
        return Response({'error': 'No comment provided'}, status=status.HTTP_400_BAD_REQUEST)


# Manager sheet viewset
class ManagerSheetViewSet(viewsets.ModelViewSet):
    queryset = ManagerSheet.objects.all()
    serializer_class = ManagerSheetSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print('Request data:', request.data)
        employee_id = request.data.get('team_leader')
        print('Employee ID:', employee_id)

        if not employee_id:
            return Response({"error": "Employee field is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            team_leader = MyUser.objects.get(userid=employee_id, personstatus='Lead')
        except MyUser.DoesNotExist:
            return Response({"error": "Team leader not found."}, status=status.HTTP_404_NOT_FOUND)

        if ManagerSheet.objects.filter(team_leader=team_leader).exists():
            return Response({"error": "This team leader already has an assigned project."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(team_leader=team_leader)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class TeamleaderSheetViewSet(viewsets.ModelViewSet):
    queryset = TeamleaderSheet.objects.all()
    serializer_class = TeamleaderSheetSerializer

    def create(self, request, *args, **kwargs):
        module_name = request.data.get('module_name')
        userid = request.data.get('userid')

        # Check if the module_name is already assigned to another user
        if TeamleaderSheet.objects.filter(module_name=module_name).exists():
            return Response(
                {'error': 'This module is already assigned to another user.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if the userid is already assigned to another module
        if TeamleaderSheet.objects.filter(userid=userid).exists():
            return Response(
                {'error': 'This user is already assigned to another module.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({'message': 'Teamleader sheet added successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Calculate salary view
class CalculateSalaryView(APIView):
        def get(self, request, user_id):
            try:
                user = MyUser.objects.get(userid=user_id)
            except MyUser.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Fetch the user's timesheets
            timesheets = TimeSheet.objects.filter(employee=user)
            total_salary = 0
            leave_days=0
            for timesheet in timesheets:
            # Calculate the salary based on the working hours and leave days
                total_hours = timesheet.mon + timesheet.tue + timesheet.wed + timesheet.thu + timesheet.fri
                hourly_rate = 250  # Example hourly rate
                salary = (total_hours - (timesheet.leave_days * 8)) * hourly_rate
            
            # Update the salary field in the timesheet
                timesheet.salary = salary
                timesheet.save()
            
            # Add to the total salary for the user
                total_salary += salary
            return Response({'user_id': user_id, 'total_salary': total_salary , 'total_working_hours':total_hours ,'Leave_days':leave_days}, status=status.HTTP_200_OK)
class TeamLeaderListView(APIView):
    def get(self, request):
        # Filter users who are team leaders
        team_leaders = MyUser.objects.filter(personstatus='Lead')
        serializer = MyUserSerializer(team_leaders, many=True)
        return Response(serializer.data, status=200)
class EmployeeListView(APIView):
    def get(self, request):
        # Filter users who are employees (personstatus is not Lead)
        employees = MyUser.objects.filter(personstatus='Employee')
        serializer = MyUserSerializer(employees, many=True)
        return Response(serializer.data, status=200)
class UserListView(APIView):
    def get(self, request):
        users = MyUser.objects.all()
        serializer = MyUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDetailView(generics.RetrieveAPIView):
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer
    lookup_field = 'userid'

    def get(self, request, *args, **kwargs):
        print(f"Fetching user with userid: {kwargs.get('userid')}")
        return super().get(request, *args, **kwargs)

class TeamLeaderDetailView(generics.RetrieveAPIView):
    queryset = MyUser.objects.filter(personstatus='Lead')  # Adjust if needed
    serializer_class = MyUserSerializer
    lookup_field = 'userid'  # This should match the URL pattern
class LeadListView(generics.ListCreateAPIView):
    queryset = MyUser.objects.filter(personstatus='Lead') 
    serializer_class = MyUserSerializer
    lookup_field = 'userid'

class EmployeeListView(generics.ListCreateAPIView):
    queryset = MyUser.objects.filter(personstatus='Employee') 
    serializer_class = MyUserSerializer
    lookup_field = 'userid'

class ManagerListView(generics.ListCreateAPIView):
    queryset = MyUser.objects.filter(personstatus='Manager') 
    serializer_class = MyUserSerializer
    lookup_field = 'userid'


# ✅ Get all distinct roles
def get_roles(request):
    roles = MyUser.objects.values_list('personstatus', flat=True).distinct()
    return JsonResponse({"roles": list(roles)})


# ✅ Get all users for a given role
def get_users_by_role(request, role):
    users = MyUser.objects.filter(personstatus=role).values("userid", "name")
    return JsonResponse({"users": list(users)})


# ✅ Get salary history
def get_salary_history(request):
    history = SalaryHistory.objects.select_related('employee__user').all().order_by('-updated_at')
    history_list = [
        {
            "id": h.id,
            "employee_name": h.employee.user.get_full_name(),
            "role": h.employee.role,
            "previous_salary": str(h.previous_salary),
            "updated_salary": str(h.updated_salary),
            "updated_at": h.updated_at
        }
        for h in history
    ]
    return JsonResponse({"history": history_list})


# ✅ Update salary for a specific user
@method_decorator(csrf_exempt, name='dispatch')
class UpdateSalaryView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            userid = data.get("userid")
            increment_amount = data.get("updated_salary")

            if not userid or increment_amount is None:
                return JsonResponse({"error": "User ID and updated_salary are required"}, status=400)

            # Get MyUser object
            myuser = get_object_or_404(MyUser, userid=userid)

            # Get Employee object (or create if missing)
            employee, created = Employee.objects.get_or_create(
                user=myuser, 
                defaults={"role": myuser.personstatus, "current_salary": 0}
            )

            previous_salary = employee.current_salary
            new_total_salary = previous_salary + float(increment_amount)

            # Save updated salary
            employee.current_salary = new_total_salary
            employee.save()

            # Log into SalaryHistory
            SalaryHistory.objects.create(
                employee=employee,
                previous_salary=previous_salary,
                updated_salary=increment_amount
            )

            return JsonResponse({
                "message": "Salary updated successfully",
                "employee": myuser.name,
                "previous_salary": previous_salary,
                "updated_salary": increment_amount,
                "total_salary": new_total_salary
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
