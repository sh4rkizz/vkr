from django.urls import include, re_path
from django.contrib import admin

urlpatterns = [
    re_path(r'^admin/', admin.site.urls),

    re_path(r'^', include('core.urls', 'core')),
    re_path(r'^management/', include('mgmt.urls', 'management')),

    re_path(r'^study/', include('study.urls', 'study')),
    re_path(r'^cabinet/', include('cabinet.urls', 'cabinet')),

    re_path(r'^attachments/', include('attachments.urls', 'attachments')),
    re_path(r'^stages/', include('stages.urls', 'stages')),
]
