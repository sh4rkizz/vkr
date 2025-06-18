from django.urls import re_path

from mgmt.subgroup.views import SubgroupCreateView, SubgroupDeleteView, SubgroupListView, SubgroupUpdateView


app_name = 'subgroup'

urlpatterns = [
    re_path(r'^list/$', SubgroupListView.as_view(), name='list'),
    re_path(r'^create/$', SubgroupCreateView.as_view(), name='create'),
    re_path(r'^(?P<pk>\d+)/delete/$', SubgroupDeleteView.as_view(), name='delete'),
    re_path(r'^(?P<pk>\d+)/update/$', SubgroupUpdateView.as_view(), name='update'),
]
