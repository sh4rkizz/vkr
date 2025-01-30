from django.urls import re_path
from stages import views as stage_views


app_name = 'stages'

urlpatterns = [
    re_path(r'^(?P<stage_pk>\d+)/$', stage_views.StageRetrieveView.as_view(), name='stage_retrieve'),
    re_path(r'^create/$', stage_views.StageCreateView.as_view(), name='stage_create'),
    re_path(r'^(?P<stage_pk>\d+)/update/$', stage_views.StageUpdateView.as_view(), name='stage_update'),
    re_path(r'^(?P<stage_pk>\d+)/delete/$', stage_views.StageDeleteView.as_view(), name='stage_update'),

    re_path(r'^step/(?P<stage_pk>\d+)/$', stage_views.StepRetrieveView.as_view(), name='step_retrieve'),
    re_path(r'^step/create/$', stage_views.StepCreateView.as_view(), name='step_create'),
    re_path(r'^step/(?P<stage_pk>\d+)/update/$', stage_views.StepUpdateView.as_view(), name='step_update'),
    re_path(r'^step/(?P<stage_pk>\d+)/delete/$', stage_views.StepDeleteView.as_view(), name='step_update'),
]
