from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

from rest_framework.views import APIView


class IndexView(LoginRequiredMixin, TemplateView):
    template_name = "study/index.html"

    def get_context_data(self, **kwargs):
        context_data = super(IndexView, self).get_context_data(**kwargs)

        tutoring_discipline_ids = self.request.user.tutoring_discipline_ids
        studying_subgroup_ids = self.request.user.studying_subgroup_ids

        context_data['student_context'] = [tutoring_discipline_ids]
        context_data['tutor_context'] = [studying_subgroup_ids]

        return context_data


class ApiCreateStudentSolution(APIView):
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        ...
