from django.contrib import admin
from app_server.models import Location
class LocationAdmin(admin.ModelAdmin):
    list_display = ("lon", "lat", "time")
    date_hierarchy = "time"
admin.site.register(Location, LocationAdmin)
