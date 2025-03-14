import mimetypes
import os
from rest_framework import serializers

from django.core.exceptions import ValidationError
from django.utils.encoding import smart_str

from attachments.models import SolutionFile


class UploadFileSolutionSerializer(serializers.Serializer):
    BASE_ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'docx', 'doc']
    BASE_MAX_FILE_SIZE = 20  # 20 МБ

    filename = serializers.CharField(max_length=255)

    def validate_filename(self, filename):
        filename, extension = os.path.splitext(filename)
        file_settings = self.context.get('file_settings')

        allowed_extensions = self.BASE_ALLOWED_EXTENSIONS
        if file_settings is not None:
            allowed_extensions = file_settings.extensions.split(',')

        if extension and extension.startswith("."):
            return extension[1:]

        if extension not in allowed_extensions:
            error_message = f"Расширение файла '{extension}' недопустимо. Разрешены только {allowed_extensions}"
            raise ValidationError(error_message)

        return filename


class PresignedUrlSerializer(serializers.ModelSerializer):
    UPLOAD_EXPIRES_IN = 5 * 60  # 5 минут

    upload_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField()

    class Meta:
        model = SolutionFile
        fields = ['id', 'solution_id', 'upload_url', 'download_url', 'filename', 'extension', 'content_type']

    def get_upload_url(self, solution_file):
        storage = solution_file.file.storage

        key = smart_str(solution_file.file.name, encoding=storage.file_name_charset)
        # key = "1"
        content_type = self.get_content_type(solution_file)

        return storage.bucket.meta.client.generate_presigned_url(
            'put_object', ExpiresIn=self.UPLOAD_EXPIRES_IN,
            Params={
                'Bucket': storage.bucket.name,
                'Key': key,
                'ContentType': content_type,
            },
        )

    def get_content_type(self, solution_file):
        t, _ = mimetypes.guess_type(solution_file.filename)
        return t or "application/octet-stream"

    def get_download_url(self, solution_file):
        return solution_file.file.url

    def get_extension(self, solution_file):
        extension = os.path.splitext(solution_file.filename)[-1]

        if not extension:
            return None

        extension = extension.lower()

        if extension.startswith("."):
            return extension[1:]

        return extension
