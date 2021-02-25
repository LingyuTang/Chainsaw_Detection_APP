"""chainsaw_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app_server.views import AppService
from rest_framework import routers
from django.conf.urls import url,include

router = routers.DefaultRouter()
router.register(r'chainsaw-api', AppService.LocationViewsSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/perdict',  AppService.predict),
    path('app/get-location',  AppService.get_chainsaw_location),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('',AppService.home_page)
]
