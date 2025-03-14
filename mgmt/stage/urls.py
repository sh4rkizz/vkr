from django.urls import re_path

from mgmt.stage.views import StageListView, StageCreateView


app_name = 'stage'

urlpatterns = [
    re_path(r'^list/$', StageListView.as_view(), name='list'),
    re_path(r'^create/$', StageCreateView.as_view(), name='create'),
]
