

from django.contrib import admin
from django.urls import path, include
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tech_army_app.urls')),
    path('', include('tech_army_app.urls')),

]


