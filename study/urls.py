
from django.urls import re_path
from study.views import IndexView


app_name = 'study'

urlpatterns = [
    re_path(r'^$', IndexView.as_view(), name='index'),
]
