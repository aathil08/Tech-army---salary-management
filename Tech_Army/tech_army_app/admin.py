from django.contrib import admin
from .models import MyUser, EmployeeDetail, TimeSheet,ManagerSheet,TeamleaderSheet

admin.site.register(MyUser)
admin.site.register(EmployeeDetail)
admin.site.register(TimeSheet)
admin.site.register(ManagerSheet)
admin.site.register(TeamleaderSheet)
