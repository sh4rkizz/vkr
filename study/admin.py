from django.contrib import admin
from study.models import StudentSubgroupStatus, Subgroup, TutorDisciplineStatus


@admin.register(Subgroup, site=admin.site)
class SubgroupAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'is_active')
    list_filter = ('is_active',)

    class StudentsInline(admin.TabularInline):
        # FIXME: куча лишних запросов за пользователями
        model = StudentSubgroupStatus
        fields = ('user', 'status')
        extra = 0

    inlines = [StudentsInline]
