import json
from django import template
register = template.Library()


@register.filter
def dumps(obj):
    return json.dumps(obj)
