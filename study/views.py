from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from django.db.models import Max

from rest_framework.views import APIView

from attachments.models import SolutionFile
from stages.models import Stage, StudentSolution, StudentStageResult


class IndexView(LoginRequiredMixin, TemplateView):
    template_name = "core/page__main.html"

    def get_context_data(self, **kwargs):
        context_data = super(IndexView, self).get_context_data(**kwargs)
        return context_data


class TutorView(LoginRequiredMixin, TemplateView):
    template_name = "core/page__tutor.html"

    def get_context_data(self, **kwargs):
        context_data = super(TutorView, self).get_context_data(**kwargs)
        return context_data


class ApiCreateStudentSolution(APIView):
    http_method_names = ['post']

    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_anonymous:
            raise Http404()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, stage_id, *args, **kwargs):
        stage = get_object_or_404(Stage, id=stage_id, is_active=True)

        stage_result, is_result_created = StudentStageResult.objects \
            .get_or_create(stage_id=stage.pk, student_id=self.request.user.pk)

        latest_attempt = StudentSolution.objects.filter(
            stage_id=stage.pk,
            student_id=self.request.user.pk,
            stage_result_id=stage_result.pk
        ).aggregate(max_attempt=Max('attempt_number'))['max_attempt'] or 0

        solution = StudentSolution.objects.create(
            stage_id=stage.pk,
            student_id=self.request.user.pk,
            stage_result_id=stage_result.pk,
            attempt_number=latest_attempt + 1,
        )

        file_ids = request.data.get('files', [])
        updated_count = 0
        if file_ids:
            existing_files = SolutionFile.objects \
                .filter(id__in=file_ids, student_id=self.request.user.pk) \
                .filter(solution__isnull=True)
            updated_count = existing_files.update(solution_id=solution.pk)

        return JsonResponse({
            'solution_id': solution.pk,
            'attempt_number': solution.attempt_number,
            'files_processed': updated_count
        }, status=201)
