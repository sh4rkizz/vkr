from django.contrib import admin
from study.models import Semester, StudentSubgroupStatus, Subgroup, Discipline


@admin.register(Subgroup, site=admin.site)
class SubgroupAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'is_active')
    list_filter = ('is_active',)


@admin.register(Semester, site=admin.site)
class SemeterAdmin(admin.ModelAdmin):
    list_display = ('__str__',)

@admin.register(Discipline, site=admin.site)
class DisciplineAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'is_active')
    list_filter = ('is_active',)

@admin.register(StudentSubgroupStatus, site=admin.site)
class StudentSubgroupStatusAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'student_number')
