from django.contrib import admin
from stages.models import Stage


@admin.register(Stage, site=admin.site)
class StageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'deadline')
    list_filter = ('is_active',)
