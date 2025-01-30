from django.db import models
from django.utils.translation import gettext_lazy as t


class Discipline(models.Model):
    class Meta:
        verbose_name = t('учебная дисциплина')
        verbose_name_plural = t('учебная дисциплина')

    title = models.CharField(verbose_name=t('Название'), max_length=255)
    is_active = models.BooleanField(verbose_name=t('Активно?'), default=True)


class Subgroup(models.Model):
    class Meta:
        verbose_name = t('учебная группа')
        verbose_name_plural = t('учебные группы')

    title = models.CharField(verbose_name=t('Название'), max_length=255)
    is_active = models.BooleanField(verbose_name=t('Активно?'), default=True)

    def __str__(self) -> str:
        return f'#{self.pk}: {self.title}'


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
        unique_together = [('user', 'subgroup')]

    status = models.CharField(
        verbose_name=t('Статус обучения'), choices=SUBGROUP_STATUSES,
        default=STATUS_STUDYING, max_length=16
    )

    user = models.ForeignKey(
        'core.User', verbose_name=t('Пользователь'),
        related_name='subgroup_statuses', on_delete=models.CASCADE
    )
    subgroup = models.ForeignKey(
        'study.Subgroup', verbose_name=t('Учебная группа'),
        related_name='student_statuses', on_delete=models.CASCADE
    )


class TutorSubgroupStatus(models.Model):
    ROLE_EXPELLED = 'exp'
    ROLE_MENTOR = 'm'
    ROLE_TEACHER = 't'
    ROLE_HEAD_TEACHER = 'ht'

    TUTOR_ROLES = (
        (ROLE_EXPELLED, t('Больше не работает')),
        (ROLE_MENTOR, t('Помощник преподавателя')),
        (ROLE_TEACHER, t('Преподаватель')),
        (ROLE_HEAD_TEACHER, t('Старший преподаватель')),
    )

    class Meta:
        verbose_name = t('статус преподавателя в учебной группе')
        verbose_name_plural = t('статусы преподавателя в учебных группах')
        unique_together = [('user', 'subgroup')]

    role = models.CharField(
        verbose_name=t('Статус обучения'), choices=TUTOR_ROLES,
        default=ROLE_TEACHER, max_length=16
    )

    user = models.ForeignKey(
        'core.User', verbose_name=t('Пользователь'),
        related_name='tutor_statuses', on_delete=models.CASCADE
    )
    subgroup = models.ForeignKey(
        'study.Subgroup', verbose_name=t('Учебная группа'),
        related_name='tutor_statuses', on_delete=models.CASCADE
    )
