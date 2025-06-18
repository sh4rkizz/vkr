import json

from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
def field_type(field):
    return field.field.__class__.__name__


@register.filter
def is_disabled(field):
    return field.field.disabled


@register.filter
def is_required(field):
    return field.field.required


@register.simple_tag
def ckeditor_config(name):
    """Отдаёт конфигурацию CKEditor для JS"""
    return mark_safe(json.dumps(settings.CKEDITOR_CONFIGS.get(name)))
