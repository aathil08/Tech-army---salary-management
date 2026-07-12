# models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import User

class MyUserManager(BaseUserManager):
    def create_user(self, email, userid, name, phone_number, password=None):
        if not email:
            raise ValueError('The Email field must be set')
        user = self.model(
            email=self.normalize_email(email),
            userid=userid,
            name=name,
            phone_number=phone_number
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, userid, name, phone_number, password=None):
        user = self.create_user(
            email=email,
            userid=userid,
            name=name,
            phone_number=phone_number,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class MyUser(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    userid = models.CharField(max_length=30, unique=True, primary_key=True)
    name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15)
    timestamp = models.DateTimeField(auto_now_add=True)
    personstatus = models.CharField(max_length=10, choices=[('Employee', 'Employee'),('Lead', 'Lead'),('Manager', 'Manager'),('HR','HR'),('Admin','Admin')])
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['userid', 'name', 'phone_number']

    def __str__(self):
        return self.userid
    
class ManagerSheet(models.Model):
    project_name = models.CharField(max_length=100, primary_key=True)
    dead_line = models.DateField()
    team_leader = models.ForeignKey('MyUser', on_delete=models.CASCADE, related_name='manager_sheets')

    def __str__(self):
        return self.project_name


class TeamleaderSheet(models.Model):
    project_name=models.ForeignKey(ManagerSheet , on_delete=models.CASCADE)
    module_name=models.CharField(max_length=100, unique=True,default='default_module', primary_key=True)
    userid= models.ForeignKey(MyUser, on_delete=models.CASCADE)
    def __str__(self):
        return self.module_name

class EmployeeDetail(models.Model):
    employee = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    team_name = models.CharField(max_length=100)
    project_name =models.ForeignKey(ManagerSheet , on_delete=models.CASCADE)
    module_name= models.ForeignKey(TeamleaderSheet , on_delete=models.CASCADE)
    date = models.DateField()
    comments = models.TextField()
   

class TimeSheet(models.Model):
    employee = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    project_name =models.ForeignKey(ManagerSheet , on_delete=models.CASCADE)
    module_name= models.ForeignKey(TeamleaderSheet , on_delete=models.CASCADE)
    week = models.CharField(max_length=20)
    mon = models.IntegerField()
    tue = models.IntegerField()
    wed = models.IntegerField()
    thu = models.IntegerField()
    fri = models.IntegerField()
    total = models.IntegerField()
    leave_days = models.IntegerField(default=0) 
    lead_approval = models.CharField(max_length=20, choices=[('Approved', 'Approved'), ('Rejected', 'Rejected'), ('Pending', 'Pending')])
    manager_approval = models.CharField(max_length=20, choices=[('Approved', 'Approved'), ('Rejected', 'Rejected'), ('Pending', 'Pending')])
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Salary field
    comments=models.CharField(max_length=20)

    def save(self, *args, **kwargs):
        # Calculate total hours and leave days
        self.total = self.mon + self.tue + self.wed + self.thu + self.fri
        self.leave_days = 5 - sum(1 for day in [self.mon, self.tue, self.wed, self.thu, self.fri] if day > 0)
        super().save(*args, **kwargs)

    def save1(self, *args, **kwargs):
        # Calculate total_hours based on work hours from Monday to Friday
        total_hours = self.mon + self.tue + self.wed + self.thu + self.fri
        # Example hourly rate (can be customized)
        hourly_rate = 20
        # Calculate salary, considering leave days (8 hours per leave day)
        self.salary = (total_hours - (self.leave_days * 8)) * hourly_rate
        # Call the parent class's save method
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Timesheet for {self.employee} - Week {self.week}"


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)
    current_salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.user.get_full_name()

class SalaryHistory(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    previous_salary = models.DecimalField(max_digits=10, decimal_places=2)
    updated_salary = models.DecimalField(max_digits=10, decimal_places=2)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.user.username} - {self.updated_at.date()}"

