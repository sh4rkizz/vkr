from django.http import Http404, JsonResponse

from rest_framework.views import APIView

from attachments.models import SolutionFile
from attachments.serializers import PresignedUrlSerializer, UploadFileSolutionSerializer
from core.models import User
from stages.models import Stage, StudentSolution
from study.models import Discipline


class RateLimitMixin(object):
    limits = {}
    rate_limit_key = None

    rate_limit_codes = [201, 202]
    limits_to_secs = {'minute': 60, 'hour': 3600, 'day': 3600 * 24}

    error_code = 419
    error_msg = 'Превышено количество отправок'

    def get_rate_limit_key(self, request, period):
        user_part = request.user.pk
        view_part = self.rate_limit_key or 'mixin'
        return '{}:{}:{}'.format(view_part, user_part, period)

    def check_rate_limit(self, request):
        is_exceeded = []
        for period, limit in self.limits.items():
            key = self.get_rate_limit_key(request, period)
            attempt_cnt = cache.get(key)
            if attempt_cnt and int(attempt_cnt) >= int(limit):
                is_exceeded.append(period)
        return is_exceeded

    def increment_counters(self, request):
        for period, limit in self.limits.items():
            key = self.get_rate_limit_key(request, period)
            try:
                cache.incr(key)
            except ValueError:
                timeout = self.limits_to_secs.get(period, None)
                cache.add(key, 1, int(timeout))

    def get_rate_limit_error_body(self):
        errors = {'__all__': [self.error_msg]}
        return { 'status': 'ERR', 'errors': errors }

    def get_rate_limit_error_response(self):
        error_body = self.get_rate_limit_error_body()
        return JsonResponse(error_body, status=self.error_code)

    def dispatch(self, request, *args, **kwargs):
        is_post = request.method.lower() == 'post'

        if is_post:
            is_exceeded = self.check_rate_limit(request)
            if is_exceeded:
                return self.get_rate_limit_error_response()

        response = super().dispatch(request, *args, **kwargs)
        if is_post and response.status_code in self.rate_limit_codes:
            self.increment_counters(request)

        return response


class UploadSolutionFileView(APIView, RateLimitMixin):
    http_method_names = ['post']

    def post(self, request, stage_id, *args, **kwargs):
        stage = Stage.objects \
            .filter(id=stage_id, is_active=True) \
            .select_related('file_settings').first()

        if not stage:
            return Http404(f"No active Step found with stage_id={stage_id}")

        is_after_deadline = stage.is_after_deadline

        serializer = UploadFileSolutionSerializer(
            data=request.data,
            context={ 'file_settings': stage.file_settings }
        )

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        solution, _ = StudentSolution.objects.get_or_create(
            stage_id=stage.pk, user_id=self.request.user.pk,
            defaults={ "is_created_after_deadline": is_after_deadline }
        )

        solution_file = SolutionFile(
            author_id=self.request.user.pk, solution_id=solution.pk,
            is_active=False,  # файл еще не выбран
        )

        user_filename = validated_data.get("filename")
        solution_file.file = solution_file.file.field.generate_filename(solution_file, user_filename)
        solution_file.save()

        response = PresignedUrlSerializer(solution_file).data
        return JsonResponse(response, status=200)



class FileAccessMixin:
    def check_upload_permisstion_for_student(self, user, stage):
        student_discipline = Discipline.objects \
            .filter(id=stage.work.discipline_id) \
            .filter(subgroups__id__in=user.get_studying_subgroup_ids())
        return student_discipline.exists()

    def check_upload_permisstion_for_tutor(self, user, solution):
        discipline_id = solution.stage.work.discipline_id
        return discipline_id in user.get_tutoring_discipline_ids()

    def check_download_permission_for_solution_file(self, user, sf):
        if user.is_manager():
            # Пользователь - методист [доступ по умолчанию]
            return True

        if sf.author_id == user.pk:
            # Пользователь - автор загруженного файла
            return True

        discipline_id = sf.solution.stage.work.discipline_id
        if discipline_id in user.get_tutoring_discipline_ids():
            # Пользователь - преподаватель дисциплины текущей стадии
            return True

        return False

    def check_download_permission_for_tutor_file(self, user, tf):
        if user.is_manager():
            # Пользователь - методист [доступ по умолчанию]
            return True

        if tf.author_id == user.pk:
            # Пользователь - автор загруженного файла
            return True

        if tf.tutor_mark.solution.student_id == user.pk:
            # Пользователь - студент, которому оставили файл в подсказку
            return True

        discipline_id = tf.tutor_mark.solution.stage.work.discipline_id
        if discipline_id in user.get_tutoring_discipline_ids():
            # Пользователь - преподаватель дисциплины текущей стадии
            return True

        return False
