from django.db import models

class Attachment(models.Model):
    class Meta:
        verbose_name = "файл"
        verbose_name = "файлы"


class StudentAttachment(models.Model):
    class Meta:
        verbose_name = "файл прикрепленный студентом"
        verbose_name = "файлы прикрепленные студентами"

    
