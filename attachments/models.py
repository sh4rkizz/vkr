from django.db import models
from django.utils.translation import gettext_lazy as t
from storages.backends.s3boto3 import S3Boto3Storage

from application.minio import get_step_colution_file_path
from core.models import DefaultModel


class FilesSettings(models.Model):
    class Meta:
        verbose_name = t('параметры файлового решения')
        verbose_name_plural = t('параметры файловых решений')

    max_files_amount = models.PositiveIntegerField(
        verbose_name=t('Максимальное количество файлов'), default=1,
        help_text=t('Максимальное допустимое количество - 10')
    )
    max_file_size = models.PositiveIntegerField(
        verbose_name=t('Максимальный размер одного файла в MB'), default=5,
        help_text=t('Максимальный допустимый размер - 20 MB')
    )
    extensions = models.TextField(
        verbose_name=t('Допустимые расширения файлов'), blank=True, null=True,
        help_text=t("Введите через запятую, указывая точки. БЕЗ символов '*', '.'!")
    )


class SolutionFile(DefaultModel):
    class Meta:
        verbose_name = t("файл прикрепленный студентом")
        verbose_name = t("файлы прикрепленные студентами")

    author = models.ForeignKey(
        'core.User', verbose_name=t('Студент'),
        related_name="solution_files", on_delete=models.CASCADE
    )
    solution = models.ForeignKey(
        'stages.StudentSolution', verbose_name=t('Решение'),
        related_name="solution_files", on_delete=models.CASCADE
    )

    file = models.FileField(verbose_name=t('Файл'), upload_to=get_step_colution_file_path, storage=S3Boto3Storage(), max_length=255)
    filename = models.CharField(verbose_name=t('Оригинальное имя файла'), max_length=255, blank=True, null=True)
    file_size = models.PositiveIntegerField(verbose_name=t('Размер файла'), help_text=t('Если 0, значит файл еще не был загружен'), default=0)
