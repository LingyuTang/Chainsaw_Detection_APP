from django.shortcuts import render
from django.conf import settings
import os
import json
from django.http import JsonResponse,HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from pathlib import Path
from .models import Location
import numpy as np
from datetime import datetime, timedelta
from rest_framework import viewsets
from .serializers import LocationSerializers
import joblib
import math
from sklearn.metrics.pairwise import euclidean_distances

path = os.path.join(Path(__file__).resolve().parent , 'static/clf_linear.joblib')
svm_model = joblib.load(path)
class AppService(View):

    @csrf_exempt
    def predict(request):
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                secs = int(data["secs"])
                i = 1
                result = False
                for i in range(1,secs+1):
                    mfcc_arr = np.array(data["mfcc"])[(i-1)*2249: i*2249].reshape(1, -1)
                    predict_result = svm_model.predict(mfcc_arr)
                    if int(predict_result[0]) == 1:
                        result = True
                    i += 1 
                if result == True:
                    try:
                        location = Location.objects.create(lon = data['lon'],lat = data['lat'])
                        location.save()
                    except:
                        return JsonResponse({'status': 'Error', 'result': result})
                return JsonResponse({'status': 'Success', 'result': result})
            except:
                return JsonResponse({'status': 'Fail'})
        else:
            return JsonResponse({'status': 'Fail'})
            
    @csrf_exempt
    def get_chainsaw_location(request):
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                lon = data['lon']
                lat = data['lat']
                not_before = datetime.now()-timedelta(hours = 2)

                location_list = list(Location.objects.filter(time__gte = not_before).values())
                return JsonResponse({'status': 'Success', 'location_list': location_list})
            except:
                return JsonResponse({'status': 'Fail'})
        else:
            return JsonResponse({'status': 'Fail'})

    def home_page(request):

        template_name = "home.html"
        return render(request, template_name)

    class LocationViewsSet(viewsets.ModelViewSet):
        not_before = datetime.now()-timedelta(hours = 2)
        queryset = Location.objects.all().filter(time__gte = not_before)
        serializer_class = LocationSerializers