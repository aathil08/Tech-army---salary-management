
from django import forms

class SalaryUpdateForm(forms.Form):
    updated_salary = forms.DecimalField(max_digits=10, decimal_places=2, label='New Salary')
