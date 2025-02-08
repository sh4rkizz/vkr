from django.urls import re_path

from mgmt.stage.views import StageListView


app_name = 'mgmt_stage'
urlpatterns = [
    re_path(r'^list/$', StageListView.as_view(), name='stage_list'),
]
