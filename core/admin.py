from django.contrib import admin
from django.utils.translation import gettext_lazy as t

from core.models import NetInfo, User


@admin.register(User, site=admin.site)
class UserAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'email', 'username')
    list_filter = ('is_staff', 'is_superuser')

    fieldsets = (
        (None, { 'fields': ('email', 'username', 'first_name', 'last_name', 'patronymic') }),
        (t("Права пользователя"), { 'fields': ('is_superuser', 'is_staff') }),
    )

    class NetInfoInline(admin.TabularInline):
        model = NetInfo
        fields = ('ip_addr', 'ip_fqdn', 'created_at')
        readonly_fields = ('ip_addr', 'ip_fqdn', 'created_at')
        extra = 0

    inlines = [NetInfoInline]
