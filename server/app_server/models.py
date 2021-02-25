from django.db import models


class Location(models.Model):
    lat = models.FloatField()
    lon = models.FloatField()
    time = models.DateTimeField(auto_now = True)
