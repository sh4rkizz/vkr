from django.urls import re_path

from mgmt.subgroup.views import SubgroupListView


app_name = 'subgroup'

urlpatterns = [
    re_path(r'^list/$', SubgroupListView.as_view(), name='list'),
    re_path(r'^list/$', SubgroupListView.as_view(), name='create'),
]
