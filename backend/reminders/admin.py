from django.contrib import admin

from reminders.models import Notification

# Register your models here.
@admin.register(Notification, site=admin.site)
class NotificationAdmin(admin.ModelAdmin):
    # list_display = ()
    list_filter = ('is_viewed',)
