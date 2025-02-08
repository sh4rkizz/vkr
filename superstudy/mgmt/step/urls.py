from django.urls import include, re_path

from mgmt.step.views import StepDelete, StepList, StepCreate, StepUpdate

app_name = 'mgmt_step'

urlpatterns = [
    re_path(r'^list/$', StepList.as_view(), name='list'),
    re_path(r'^create/$', StepCreate.as_view(), name='create'),
    re_path(r'^(?P<pk>\d+)/update/$', StepUpdate.as_view(), name='update'),
    re_path(r'^(?P<pk>\d+)/delete/$', StepDelete.as_view(), name='delete'),
]