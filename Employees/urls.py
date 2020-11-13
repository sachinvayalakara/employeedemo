from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static


from Base import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('index', views.index, name='index'),
    path('login',views.fn_login),
    path('table',views.fn_table),
    path('employeedetails',views.fn_employeedetails),
    path('logout', views.Logout),
    

    
    

    ]+static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)+static(settings.MEDIA_URL,
                                                                         document_root=settings.MEDIA_ROOT)