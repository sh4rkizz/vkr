from django.contrib import admin
from core.models import NetInfo, User
from study.models import StudentSubgroupStatus, TutorSubgroupStatus


@admin.register(User, site=admin.site)
class UserAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'username', 'email')
    list_filter = ('is_staff', 'is_superuser')

    class NetInfoInline(admin.TabularInline):
        model = NetInfo
        fields = ('ip_address', 'ip_fqdn', 'created_at')
        readonly_fields = ('ip_address', 'ip_fqdn', 'created_at')
        extra = 0

    class TutorSubgroupsInline(admin.TabularInline):
        model = TutorSubgroupStatus
        fields = ('subgroup', 'role')
        extra = 0

    class StudentSubgroupsInline(admin.TabularInline):
        model = StudentSubgroupStatus
        fields = ('subgroup', 'status')
        extra = 0

    inlines = [NetInfoInline, TutorSubgroupsInline, StudentSubgroupsInline]
