from django.urls import include, re_path
from mgmt.views import IndexView


app_name = 'mgmt'

urlpatterns = [
    re_path(r'^$', IndexView.as_view(), name='index'),

    re_path(r'^analyitics/', include('mgmt.analytics.urls', 'analyitics')),
    re_path(r'^stage/', include('mgmt.stage.urls', 'stage')),
    re_path(r'^subgroup/', include('mgmt.subgroup.urls', 'subgroup')),
]
