from django.views.generic import TemplateView

from stages.models import Stage, Step, UserStepResult, Work
from study.models import Discipline, Subgroup


class IndexView(TemplateView):
    template_name = "study/index.html"

    def get_student_context(self, subgroup_ids: list):
        student_subgroups = Subgroup.objects \
            .filter(id__in=subgroup_ids) \
            .select_related('discipline')

        step_results = UserStepResult.objects \
            .filter(user_id=self.request.user.pk) \
            .select_related('tutor')

        return {}

    def get_tutor_context(self, subgroup_ids: list):
        tutor_subgroups = Subgroup.objects \
            .filter(id__in=subgroup_ids) \
            .select_related('discipline')

        step_results = UserStepResult.objects \
            .filter(tutor_id=self.request.user.pk) \
            .select_related('user')

        return {}

    def get_context_data(self, **kwargs):
        context_data = super(IndexView, self).get_context_data(**kwargs)

        # student_subgroup_ids = StudentSubgroupStatus.cache

        student_subgroup_ids = [1, 2, 3]

        if len(student_subgroup_ids) > 0:
            student_context = self.get_student_context(student_subgroup_ids)
            context_data['student_context'] = student_context

        # tutor_subgroup_ids = TutorSubgroupStatus.cache
        tutor_subgroup_ids = [1, 2, 3]

        if len(tutor_subgroup_ids) > 0:
            tutor_context = self.get_tutor_context(tutor_subgroup_ids)
            context_data['tutor_context'] = tutor_context

        return context_data
