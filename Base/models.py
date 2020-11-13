from django.db import models

# Create your models here.
class Login(models.Model):
    password = models.CharField(max_length=50, default='Nothing')
    email = models.CharField(max_length=50, default='Nothing')
    

    class Meta:
        db_table = 'Login'

    def __int__(self):
        return self.id

class Employee(models.Model):
    emp_name = models.CharField(max_length=300, default='Nothing')
    user_image = models.FileField(blank=True, upload_to="media")
    email = models.CharField(max_length=50, default='Nothing')
    password = models.CharField(max_length=50, default='Nothing')
    phone = models.CharField(max_length=400, default='Nothing')
    address = models.CharField(max_length=300, default='Nothing')

    class Meta:
        db_table = 'employee'

    def __int__(self):
        return self.id       