from django.urls import include, re_path
from django.contrib import admin

# re_path(r'^api/', include('core.urls', 'core')),
urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^attachment/', include('attachment.urls', 'attachment')),
    re_path(r'^cabinet/', include('cabinet.urls', 'cabinet')),
    re_path(r'^stages/', include('stages.urls', 'stages')),
    re_path(r'^management/', include('mgmt.urls', 'management')),
]
