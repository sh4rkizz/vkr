from django.contrib import admin
from study.models import StudentSubgroupStatus, Subgroup, TutorDisciplineStatus


@admin.register(Subgroup, site=admin.site)
class SubgroupAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'is_active')
    list_filter = ('is_active',)
