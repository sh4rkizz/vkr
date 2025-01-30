from django.contrib import admin

from stages.models import Stage, Step

@admin.register(Stage, site=admin.site)
class StageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'start_date', 'end_date')
    list_filter = ('is_active',)

    class StepsInline(admin.TabularInline):
        # FIXME: куча лишних запросов за этапами
        model = Step
        fields = ('order', 'deadline', 'max_possible_value')
        ordering = ('order',)
        extra = 0

    inlines = [StepsInline]

@admin.register(Step, site=admin.site)
class StepAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'deadline', 'max_possible_value')
    list_filter = ('is_active',)
