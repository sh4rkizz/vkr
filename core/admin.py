from django.contrib import admin
from core.models import NetInfo, User
from study.models import StudentSubgroupStatus, TutorDisciplineStatus


@admin.register(User, site=admin.site)
class UserAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'username', 'email')
    list_filter = ('is_staff', 'is_superuser')

    class NetInfoInline(admin.TabularInline):
        model = NetInfo
        fields = ('ip_addr', 'ip_fqdn', 'created_at')
        readonly_fields = ('ip_addr', 'ip_fqdn', 'created_at')
        extra = 0

    class TutorDisciplinesInline(admin.TabularInline):
        model = TutorDisciplineStatus
        fields = ('subgroup', 'role')
        extra = 0

    class StudentSubgroupsInline(admin.TabularInline):
        model = StudentSubgroupStatus
        fields = ('subgroup', 'status')
        extra = 0

    inlines = [NetInfoInline, TutorDisciplinesInline, StudentSubgroupsInline]
