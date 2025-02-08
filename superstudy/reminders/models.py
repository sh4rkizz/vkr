from django.db import models
from django.utils.translation import gettext_lazy as t


class Redline(models.Model):
    class Meta:
        verbose_name = t("Редлайн")
        verbose_name_plural = t("Редлайны")

    date = models.DateTimeField(verbose_name=t("Дата"), auto_now=False, auto_now_add=False)
    penalty = models.FloatField(verbose_name=t("Штраф за пропуск в процентах"), default=0)


class Deadline(models.Model):
    class Meta:
        verbose_name = t("Дедлайн")
        verbose_name_plural = t("Дедлайны")

    date = models.DateTimeField(verbose_name=t("Дата"), auto_now=False, auto_now_add=False)
    penalty = models.FloatField(verbose_name=t("Штраф за пропуск в процентах"), default=0)


class Notification(models.Model):
    class Meta:
        verbose_name = t("Уведомление")
        verbose_name_plural = t("Уведомления")

    created_at = models.DateTimeField(verbose_name=t("Дата создания"), auto_now_add=False)
    text = models.TextField(t("Текст уведомления"), max_length=2048)
    is_viewed = models.BooleanField(t("Прочитано?"), default=False)
