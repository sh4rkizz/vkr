from django.contrib import admin
from stages.models import Stage


@admin.register(Stage, site=admin.site)
class StageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'sequence_number', 'work_score_percent', 'deadline')
    raw_id_fields = ('file_settings', 'work')
    list_filter = ('is_active',)
