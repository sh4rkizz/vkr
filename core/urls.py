
from django.urls import re_path

from core.views import IndexView, LoginView


app_name = 'core'

urlpatterns = [
    re_path(r'^$', IndexView.as_view(), name='index'),
    re_path(r'^login/$', LoginView.as_view(), name='login'),
]
