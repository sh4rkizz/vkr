from django.urls import include, re_path
import attachment.views as views

app_name = 'attachment'

urlpatterns = [
    re_path(r'^upload-file/', views.UploadFileView.as_view(), name='upload_file'),
]
