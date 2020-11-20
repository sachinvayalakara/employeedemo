from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import JsonResponse
from django.db.models import Q
from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
import smtplib
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
import re
import datetime
from datetime import date
import os


from datetime import datetime
from datetime import timedelta

from Base.models import *



import requests
from django.http.response import HttpResponseForbidden

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))



def index(request):
    if 'user_id' not in request.session:
        return HttpResponseRedirect('/login')
    else:
        if request.session['user_id'] == 'abc@gmail.com':
            emp_obj = Employee.objects.all()
            return render(request, "index.html", {'emp_obj': emp_obj, 'permission': True})
        else:
            emp_obj = Employee.objects.filter(email=request.session['user_id']).values('pk', 'emp_name', 'user_image', 'password', 'email', 'phone', 'address')
            return render(request, "index.html", {'emp_obj': emp_obj, 'permission': False})


def fn_login(request):
    try:
        if request.method == 'POST':
            username = request.POST['username']
            password = request.POST['password']
            check_exist = Login.objects.filter(email=username).exists()
            if check_exist == False:
                messages.success(request, 'User not Exist')
                return HttpResponseRedirect('/login')
            login_obj = Login.objects.filter(email=username).values('pk','email','password')
            request.session['user_id'] = login_obj[0]['email']
            if login_obj[0]['password'] == password:
                return HttpResponseRedirect('/index')
            else:
                return redirect('/login')
                return HttpResponseRedirect('/index')
            messages.success(request, 'Wrong password')
        else:
            return render(request, "login.html")
    except Exception as e:
        print(e)


def fn_table(request):
    return render(request, "index.html")

def Logout(request):

    try:
        if request.session.has_key('user_id'):
            # del request.session['user_id']
            request.session.flush()
            return HttpResponseRedirect('/login')
        else:
            return HttpResponseRedirect('/login')
    except Exception as e:
        return HttpResponse(e)



def fn_employeedetails(request):
    try:
        if request.method == 'POST':
            empname = request.POST['empname']
            propic = request.FILES['propic']
            email = request.POST['email']
            mobile = request.POST['mobile']
            address = request.POST['address']
            password = request.POST['password']

            fs = FileSystemStorage()
            name = fs.save(propic.name, propic)
            name = 'media/' + name
            path = os.path.join(BASE_DIR, name)

            if email == '' or password == '' :
                messages.success(request, 'All Fileds Are Mandatory')

            else:
                check_exist = Employee.objects.filter(email=email).exists()
                if check_exist == False:
                    user = Employee(emp_name=empname, user_image=propic, email=email, phone=mobile,address=address,password=password)
                    user.save()

                login_exit = Login.objects.filter(email=email).exists()
                if login_exit == False:
                    log = Login(email=email, password=password)
                    log.save()

        return redirect('/index')
    except Exception as e:
        print(e)
        return HttpResponse(e)

def Delete_data(request):
    try:
        if request.method == "POST":
            idd= request.POST['id']
            emp_mail=Employee.objects.filter(id=idd).values('email')
            log_mail=Login.objects.filter(email=emp_mail[0]['email'])
            log_mail.delete()
            Employee.objects.filter(id=idd).delete()

        return JsonResponse({'data':'deleted'})
    
    except Exception as e:
        print(e)   

