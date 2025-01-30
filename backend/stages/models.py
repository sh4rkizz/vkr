import datetime
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as t

from core.models import User


class FAQ(models.Model):
    class Meta:
        verbose_name = t("часто задаваемый вопрос")
        verbose_name_plural = t("часто задаваемые вопросы")

    question = models.CharField(verbose_name=t("Вопрос"), max_length=255)
    answer = models.TextField(verbose_name=t("Ответ"), max_length=2048)
    is_active = models.BooleanField(verbose_name=t("Активно?"), default=True)


class WorkType(models.Model):
    class Meta:
        verbose_name = t("тип работы")
        verbose_name_plural = t("типы работ")

    title = models.CharField(verbose_name=t("Название"), max_length=255)
    description = models.TextField(verbose_name=t("Описание"), max_length=2000, null=True, blank=True)

    tutors = models.ManyToManyField(User, related_name="work")

    is_active = models.BooleanField(verbose_name=t("Активно?"), default=True)
    updated_at = models.DateTimeField(verbose_name=t("Дата изменения"), auto_now=True)


class Stage(models.Model):
    class Meta:
        verbose_name = t("стадия сдачи работы")
        verbose_name_plural = t("стадии сдач работ")

    title = models.CharField(verbose_name=t("Название"), max_length=255)
    description = models.TextField(verbose_name=t("Описание"), max_length=2000, null=True, blank=True)

    work = models.ForeignKey(WorkType, verbose_name=t("Тип работы"), related_name="stages", on_delete=models.PROTECT)

    start_date = models.DateTimeField(verbose_name=t("Дата начала"), default=timezone.now)
    end_date = models.DateTimeField(verbose_name=t("Дата окончания"), default=timezone.now)

    is_active = models.BooleanField(verbose_name=t("Активно?"), default=True)
    updated_at = models.DateTimeField(verbose_name=t("Дата изменения"), auto_now=True)

    steps_count = models.PositiveIntegerField(verbose_name=t("Количество этапов"), help_text="Поле для денормализации")

    def __str__(self) -> str:
        return f'{self.pk}: {self.title}'


class Step(models.Model):
    COYOTE_TIME = 5 * 60  # 5 минут для дозагрузки файла [при плохом соединении]

    class Meta:
        verbose_name = t("этап сдачи работы")
        verbose_name_plural = t("этапы сдач работ")

    title = models.CharField(verbose_name=t("Название"), max_length=255)
    description = models.TextField(verbose_name=t("Описание"), max_length=2000, null=True, blank=True)
    max_possible_value = models.FloatField(verbose_name=t("Максимально возможный результат"), blank=True, null=True)

    stage = models.ForeignKey(
        Stage, verbose_name=t("Стадия сдачи работы"),
        related_name="steps", on_delete=models.PROTECT
    )

    deadline = models.DateTimeField(
        verbose_name=t("Дедлайн по этапу"), default=timezone.now,
        help_text="Работа получает особую пометку, если она сдана после этого срока"
    )

    order = models.PositiveIntegerField(
        default=0, verbose_name=t("Порядковый номер стадии"),
        blank=False, null=False
    )

    is_active = models.BooleanField(verbose_name=t("Активно?"), default=True)
    updated_at = models.DateTimeField(verbose_name=t("Дата изменения"), auto_now=True)

    @property
    def is_before_deadline(self):
        coyote_dt = datetime.timedelta(seconds=self.COYOTE_TIME)
        return datetime.datetime.now() - coyote_dt <= self.deadline

    def __str__(self) -> str:
        return f'{self.pk}: {self.title}'


class UserStepResult(models.Model):
    step = models.ForeignKey('stages.Step', verbose_name=t("Этап"), on_delete=models.CASCADE)
    user = models.ForeignKey(
        'core.User', verbose_name=t("Абитуриент"),
        related_name="student_step_results", on_delete=models.CASCADE
    )

    tutor = models.ForeignKey(
        'core.user', verbose_name=t("Преподаватель"),
        related_name="tutor_step_results", null=True, on_delete=models.SET_NULL
    )

    value = models.FloatField(verbose_name=t("Результат"), blank=True, null=True)
    is_after_deadline = models.BooleanField(verbose_name=t("Работа сдана после дедлайна этапа"), default=False)

    def as_dict(self):
        return {
            "id": self.pk,
            "step_id": self.step_pk,
            "student_id": self.student_pk,
            "tutor_id": self.tutor_pk,
            "value": self.value,
            "is_after_deadline": self.is_after_deadline,
        }
