from django.urls import re_path
import attachments.views as views

app_name = 'attachments'

urlpatterns = [
    re_path(r'^(?P<step_id>\d+)/presigned-url/', views.UploadSolutionFileView.as_view(), name='get_upload_solution_file_url'),
]
