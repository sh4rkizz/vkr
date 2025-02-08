from django.contrib import admin
from study.models import StudentSubgroupStatus, Subgroup, TutorSubgroupStatus


@admin.register(Subgroup, site=admin.site)
class SubgroupAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'is_active')
    list_filter = ('is_active',)

    class TutorsInline(admin.TabularInline):
        # FIXME: куча лишних запросов за пользователями
        model = TutorSubgroupStatus
        fields = ('user', 'role')
        extra = 0

    class StudentsInline(admin.TabularInline):
        # FIXME: куча лишних запросов за пользователями
        model = StudentSubgroupStatus
        fields = ('user', 'status')
        extra = 0

    inlines = [TutorsInline, StudentsInline]
