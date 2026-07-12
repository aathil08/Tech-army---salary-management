from rest_framework import serializers
from .models import MyUser, EmployeeDetail, TimeSheet, ManagerSheet, TeamleaderSheet

class ManagerSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerSheet
        fields = ['project_name', 'dead_line', 'team_leader']


class TeamleaderSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamleaderSheet
        fields = ['project_name', 'module_name', 'userid']

class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['userid', 'name', 'email', 'phone_number', 'personstatus', 'password']

    def create(self, validated_data):
        user = MyUser(
            email=validated_data['email'],
            userid=validated_data['userid'],
            name=validated_data['name'],
            phone_number=validated_data['phone_number'],
            personstatus=validated_data['personstatus'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class EmployeeDetailSerializer(serializers.ModelSerializer):
    employee = MyUserSerializer()
    project_name = ManagerSheetSerializer()
    module_name = TeamleaderSheetSerializer()

    class Meta:
        model = EmployeeDetail
        fields = ['employee', 'team_name', 'project_name', 'module_name', 'date', 'comments']


# class TimeSheetSerializer(serializers.ModelSerializer):
#     employee = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all())
#     project_name = serializers.PrimaryKeyRelatedField(queryset=ManagerSheet.objects.all())
#     module_name = serializers.PrimaryKeyRelatedField(queryset=TeamleaderSheet.objects.all())

#     class Meta:
#         model = TimeSheet
#         fields = ['id', 'employee', 'project_name', 'module_name', 'week', 'mon', 'tue', 'wed', 'thu', 'fri', 'total', 'lead_approval', 'manager_approval']
#         # print("\n\n\n",fields)


class TimeSheetSerializer(serializers.ModelSerializer):
    project_name = serializers.PrimaryKeyRelatedField(queryset=ManagerSheet.objects.all())
    module_name = serializers.PrimaryKeyRelatedField(queryset=TeamleaderSheet.objects.all())
    employee = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all())

    class Meta:
        model = TimeSheet
        fields = '__all__'


        

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['userid', 'name', 'email', 'phone_number', 'personstatus', 'password']

    def create(self, validated_data):
        user = MyUser(
            email=validated_data['email'],
            userid=validated_data['userid'],
            name=validated_data['name'],
            phone_number=validated_data['phone_number'],
            personstatus=validated_data['personstatus'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    userid = serializers.CharField()
    password = serializers.CharField()
