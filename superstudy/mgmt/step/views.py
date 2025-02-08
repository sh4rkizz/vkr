from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views.generic import ListView, FormView

from mgmt.mixins import ManagementMixin, SingleObjectMixin
from mgmt.step.forms import StepDeleteForm, StepUpdateFirm
from stages.models import Step


class StepList(ManagementMixin, ListView):
    http_method_names = ['get']
    template_name = "mgmt/step/list.html"

    model = Step
    paginate_by = 25

    def get_queryset(self):
        queryset = super(StepList, self).get_queryset()
        return queryset.filter(is_active=True).order_by('-id')

    def get_context_data(self, **kwargs):
        context = super(StepList, self).get_context_data(**kwargs)
        context['steps'] = context['object_list']
        return context


class StepDelete(ManagementMixin, SingleObjectMixin, FormView):
    http_method_names = ['get', 'post']
    template_name = 'mgmt/step/delete.html'

    model = Step
    form_class = StepDeleteForm
    success_message = "Этап «{}» успешно удалён"

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['instance'] = self.instance
        return context

    def form_valid(self, *args, **kwargs):
        self.instance.is_active = False
        self.instance.save(update_fields=['is_active', 'updated_at'])
        # success_message = self.success_message.format(self.instance.title)
        # messages.success(self.request, success_message)
        return HttpResponseRedirect(reverse('mgmt:step_list'))


class StepUpdate(ManagementMixin, SingleObjectMixin, FormView):
    http_method_names = ['get', 'post']
    template_name = 'mgmt/testings/form.html'
    permission_required = ['testings.view_testing']

    form_class = StepUpdateFirm
    model = Step
    success_message = "Набор «{}» успешно отредактирован"


class StepCreate(ManagementMixin, FormView):
    ...
