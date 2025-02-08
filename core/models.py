from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, BaseUserManager, Group
from django.utils.translation import gettext_lazy as t
from django.contrib.auth.models import UserManager

from core.managers import NetInfoManager


class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = t('пользователь')
        verbose_name_plural = t('пользователи')
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['first_name', 'last_name'])
        ]

    email = models.EmailField(verbose_name=t('Email'), unique=True)
    first_name = models.CharField(verbose_name=t('Имя'), null=True, blank=True, max_length=64)
    last_name = models.CharField(verbose_name=t('Фамилия'), null=True, blank=True, max_length=64)
    username = models.CharField(t("Имя пользователя"), max_length=50)
    is_staff = models.BooleanField(verbose_name=t('Персонал?'), default=False)

    def __str__(self) -> str:
        return f'#{self.pk}: {self.email}'


class NetInfo(models.Model):
    objects = NetInfoManager()

    class Meta:
        verbose_name = t('сетевая информация о пользователе')
        verbose_name_plural = t('сетевая информация о пользователях')

    user = models.ForeignKey(User, verbose_name=t('Пользователь'), on_delete=models.CASCADE)

    ip_address = models.GenericIPAddressField(verbose_name=t('IP-адрес'), blank=True, null=True)
    ip_fqdn = models.CharField(verbose_name=t('Домен по IP'), max_length=255, blank=True, null=True)
    user_agent = models.TextField(verbose_name=t('User-Agent'), blank=True, null=True)

    created_at = models.DateTimeField(verbose_name=t('Дата актуальности'), auto_now_add=True)
