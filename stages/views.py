from typing import Any
from django.http import JsonResponse
from django.views import View
from django.views.generic import TemplateView

from stages.models import Stage
from django.utils.translation import gettext_lazy as t


class StageRetrieveView(TemplateView):
    http_method_names = ['get']
    # permission_classes = [IsAuthenticated]
    template_name = 'stages/stage-page.html'

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context_data = super().get_context_data(**kwargs)
        context_data['stage_id'] = self.kwargs.get('stage_pk')
        return context_data

    # def get(self, request, stage_pk, *args, **kwargs):
    #     stage = Stage.objects.filter(pk=stage_pk, is_active=True).first()

    #     if stage is None:
    #         return JsonResponse({ "detail": t("Не найдено") }, status=404)

    #     if TutorDisciplineStatus.objects.filter(user_pk=self.request.user.pk).exists():
    #         serializer = StageSerializers.StageSerializerForTutor
    #         return JsonResponse({ "stage": serializer(stage).data }, status=200)

    #     if StudentSubgroupStatus.objects.filter(user_pk=self.request.user.pk).exists():
    #         serializer = StageSerializers.StageSerializerForStudent
    #         return JsonResponse({ "stage": serializer(stage).data }, status=200)

    #     return JsonResponse({ "detail": t("Вы не студент и не преподаватель") }, status=404)


class StageCreateView(View):
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        self.request.user.pk
        ...


class StageUpdateView(View):
    http_method_names = ['post']

    def post(self, request, stage_pk, *args, **kwargs):
        stage = Stage.objects.filter(pk=stage_pk, is_active=True).first()

        if stage is None:
            return JsonResponse({ "detail": "Не найдено" }, status=404)


class StageDeleteView(View):
    http_method_names = ['delete']

    def delete(self, request, stage_pk, *args, **kwargs):
        stage = Stage.objects.filter(pk=stage_pk).first()

        if stage is None:
            return JsonResponse({ "detail": "Не найдено" }, status=404)

        if not stage.is_active:
            return JsonResponse({ "detail": "Стадия уже была удалена" }, status=204)

        stage.is_active = False
        stage.save(update_fields=['is_active', 'updated_at'])

        return JsonResponse({ "detail": "Стадия удалена" }, status=204)


class StepRetrieveView(View):
    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        ...


class StepCreateView(View):
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        instance_pk = 99113
        return JsonResponse({ "instance_pk": instance_pk }, status=201)


class StepUpdateView(View):
    http_method_names = ['post']

    def update(self, request, *args, **kwargs):
        instance_pk = 99113
        return JsonResponse({ "instance_pk": instance_pk }, status=200)


class StepDeleteView(View):
    http_method_names = ['delete']

    def delete(self, request, *args, **kwargs):
        instance_pk = 99113
        return JsonResponse({ "instance_pk": instance_pk }, status=204)
