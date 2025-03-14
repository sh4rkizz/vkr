from django.http import Http404, JsonResponse

from rest_framework.views import APIView

from attachments.models import SolutionFile
from attachments.serializers import PresignedUrlSerializer, UploadFileSolutionSerializer
from stages.models import Stage, StudentSolution


class UploadSolutionFileView(APIView):
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
