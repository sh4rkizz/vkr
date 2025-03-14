from django.db import models
from django.utils.translation import gettext_lazy as t

from core.models import DefaultModel


class Semester(DefaultModel):
    class Meta:
        verbose_name = t('семестр')
        verbose_name_plural = t('семестры')

    start_date = models.DateTimeField(t("Дата начала"), auto_now=False, auto_now_add=False)
    end_date = models.DateTimeField(t("Дата завершения"), auto_now=False, auto_now_add=False)

    def as_dict(self):
        return {
            "id": self.pk,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat()
        }


class Discipline(DefaultModel):
    class Meta:
        verbose_name = t('учебная дисциплина')
        verbose_name_plural = t('учебная дисциплина')

    title = models.CharField(verbose_name=t('Название'), max_length=255)
    semester = models.ForeignKey("study.Semester", verbose_name=t("Семестр"), on_delete=models.CASCADE)

    def as_dict(self):
        return {
            "id": self.pk,
            "title": self.title,
            "semester_id": self.semester_id
        }


class Subgroup(DefaultModel):
    class Meta:
        verbose_name = t('учебная группа')
        verbose_name_plural = t('учебные группы')

    title = models.CharField(verbose_name=t('Название'), max_length=255)
    discipline = models.ForeignKey(Discipline, verbose_name=t("Дисциплина"), on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'#{self.pk}: {self.title}'

    def as_dict(self):
        return {
            "id": self.pk,
            "title": self.title,
            "discipline_id": self.discipline_id
        }


class StudentSubgroupStatus(models.Model):
    STATUS_EXPELLED = 'exp'
    STATUS_STUDYING = 'std'
    STATUS_FINISHED = 'fin'

    SUBGROUP_STATUSES = (
        (STATUS_EXPELLED, t('Отчислен')),
        (STATUS_STUDYING, t('Учится')),
        (STATUS_FINISHED, t('Закончил обучение'))
    )

    class Meta:
        verbose_name = t('статус студента в учебной группе')
        verbose_name_plural = t('статусы студентов в учебных группах')
        unique_together = [('student', 'subgroup')]

    status = models.CharField(
        verbose_name=t('Статус обучения'), choices=SUBGROUP_STATUSES,
        default=STATUS_STUDYING, max_length=16
    )

    student = models.ForeignKey(
        'core.User', verbose_name=t('Пользователь'),
        related_name='subgroup_statuses', on_delete=models.CASCADE
    )
    subgroup = models.ForeignKey(
        'study.Subgroup', verbose_name=t('Учебная группа'),
        related_name='student_statuses', on_delete=models.CASCADE
    )


class TutorDisciplineStatus(models.Model):
    STATUS_EXPELLED = 'exp'
    STATUS_MENTOR = 'm'
    STATUS_TEACHER = 't'
    STATUS_HEAD_TEACHER = 'ht'

    TUTOR_STATUSS = (
        (STATUS_EXPELLED, t('Больше не работает')),
        (STATUS_MENTOR, t('Помощник преподавателя')),
        (STATUS_TEACHER, t('Преподаватель')),
        (STATUS_HEAD_TEACHER, t('Старший преподаватель')),
    )

    class Meta:
        verbose_name = t('статус преподавателя в дисциплине')
        verbose_name_plural = t('статусы преподавателя в дисциплине')
        unique_together = [('tutor', 'discipline')]

    status = models.CharField(
        verbose_name=t('Статус преподавания'), choices=TUTOR_STATUSS,
        default=STATUS_TEACHER, max_length=16
    )

    tutor = models.ForeignKey(
        'core.User', verbose_name=t('Пользователь'),
        related_name='tutor_statuses', on_delete=models.CASCADE
    )
    discipline = models.ForeignKey(
        'study.Discipline', verbose_name=t('Дисциплина'),
        related_name='tutor_statuses', on_delete=models.CASCADE
    )
