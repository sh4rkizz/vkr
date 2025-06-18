import datetime
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as t
from django.core.validators import MinValueValidator, MaxValueValidator

from core.models import DefaultModel


class Work(DefaultModel):
    TYPE_VKR = 'vkr'
    TYPE_COURSEWORK = 'coursework'

    WORK_TYPES = (
        (TYPE_VKR, t('ВКР')),
        (TYPE_COURSEWORK, t('Курсовая'))
    )

    class Meta:
        verbose_name = t("тип работы")
        verbose_name_plural = t("типы работ")

    title = models.CharField(verbose_name=t("Название"), max_length=255)
    description = models.TextField(verbose_name=t("Описание"), max_length=2000, null=True, blank=True)
    work_type = models.CharField(verbose_name=t("Тип работы"), max_length=16, choices=WORK_TYPES)
    discipline = models.ForeignKey("study.Discipline", verbose_name=t("Дисциплина"), on_delete=models.CASCADE)


class Stage(DefaultModel):
    COYOTE_TIME = 5 * 60  # 5 минут для дозагрузки файла [при плохом соединении]

    class Meta:
        verbose_name = t("стадия сдачи работы")
        verbose_name_plural = t("стадии сдач работ")

    title = models.CharField(verbose_name=t("Название"), max_length=255)
    description = models.TextField(verbose_name=t("Описание"), max_length=2000, null=True, blank=True)

    deadline = models.DateTimeField(
        verbose_name=t("Дедлайн по этапу"), default=timezone.now,
        help_text="Работа получает особую пометку, если она сдана после этого срока"
    )

    sequence_number = models.IntegerField(verbose_name=t("Порядковый номер"), default=0)
    work_score_percent = models.IntegerField(verbose_name=t("Процент от итогового балла"), default=100)

    work = models.ForeignKey(Work, verbose_name=t("Работа"), related_name="stages", on_delete=models.CASCADE)
    file_settings = models.OneToOneField("attachments.FilesSettings", verbose_name=t("Файловые настройки"), on_delete=models.PROTECT)

    def __str__(self) -> str:
        return f'#{self.pk}: {self.title}'

    @property
    def is_after_deadline(self):
        coyote_dt = datetime.timedelta(seconds=self.COYOTE_TIME)
        return datetime.datetime.now() - coyote_dt >= self.deadline

    def as_dict(self):
        return {
            "id": self.pk, "title": self.title,
            "description": self.description, "deadline": self.deadline.isoformat(),
            "sequence_number": self.sequence_number, "work_score_percent": self.work_score_percent,
        }


class StudentStageResult(models.Model):
    class Meta:
        verbose_name = t('результат студента в стадии студента')
        verbose_name_plural = t('результаты студентов в стадиях')
        unique_together = ('student', 'stage')

    stage = models.ForeignKey('stages.Stage', verbose_name=t("Стадия"), on_delete=models.CASCADE)
    student = models.ForeignKey(
        'core.User', verbose_name=t("Студент"),
        related_name="student_step_results", on_delete=models.CASCADE
    )


class StudentSolution(DefaultModel):
    class Meta:
        verbose_name = t('ответ студента')
        verbose_name_plural = t('ответы студентов')
        unique_together = ('student', 'stage')

    stage = models.ForeignKey('stages.Stage', verbose_name=t("Стадия"), on_delete=models.CASCADE)
    student = models.ForeignKey(
        'core.User', verbose_name=t("Студент"),
        related_name="student_step_results", on_delete=models.CASCADE
    )
    attempt_number = models.IntegerField(verbose_name=t("Номер попытки"), default=0)
    comment = models.TextField(verbose_name=t("Текстовый комментарий к ответу"), blank=True, null=True, max_length=2000)
    is_created_after_deadline = models.BooleanField(
        verbose_name=t("Работа сдана после дедлайна стадии"), default=None,
        help_text='Если NULL, значит работа не сдана', null=True
    )

    def as_dict(self):
        return {
            "id": self.pk, "stage_id": self.stage_id,
            "student_id": self.student_id, "comment": self.comment,
            "attempt_number": self.attempt_number,
            "is_created_after_deadline": self.is_created_after_deadline,
        }


class TutorMark(DefaultModel):
    class Meta:
        verbose_name = t('оценка ответа преподавателем')
        verbose_name_plural = t('оценки ответов преподавателями')

    value = models.IntegerField(verbose_name=t("Оценка"), validators=[MinValueValidator(0), MaxValueValidator(5)])
    comment = models.TextField(verbose_name=t("Текстовый комментарий к оценке"), blank=True, max_length=2000)

    solution = models.ForeignKey("stages.StudentSolution", verbose_name=t("Ответ студента"), on_delete=models.CASCADE, related_name='tutor_marks')
    tutor = models.ForeignKey("core.User", verbose_name=t("Оценивший преподаватель"), null=True, on_delete=models.SET_NULL)

    def as_dict(self):
        return {
            "id": self.pk, "tutor_id": self.tutor_id,
            "value": self.value, "comment": self.comment
        }
