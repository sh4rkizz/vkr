
from django.urls import re_path
from study.views import ApiCreateStudentSolution, IndexView, TutorView


app_name = 'study'

urlpatterns = [
    re_path(r'^$', IndexView.as_view(), name='index'),
    re_path(r'^tutor/$', TutorView.as_view(), name='tutor'),

    re_path(r'^api/create_solution/(?P<stage_id>\d+)/$', ApiCreateStudentSolution.as_view(), name='create_solution_api'),
]
