from collections import defaultdict
from typing import Any
from django.db.models.query import QuerySet
from django.db.models import Prefetch
from django.views.generic.list import ListView
from django.views.generic.edit import FormView
from mgmt.mixins import SingleObjectMixin
from mgmt.subgroup.forms import SubgroupDeleteForm, SubgroupUpdateForm
from stages.models import StudentSolution, TutorMark
from study.models import StudentSubgroupStatus, Subgroup


class SubgroupListView(ListView):
    http_method_names = ['get']
    template_name = 'mgmt/subgroup/list.html'
    paginate_by = 6

    def get_queryset(self) -> QuerySet[Any]:
        return Subgroup.objects.order_by('-id')


class SubgroupCreateView(FormView):
    http_method_names = ['get', 'post']
    template_name = 'mgmt/subgroup/create.html'
    model = Subgroup


class SubgroupDeleteView(SingleObjectMixin, FormView):
    http_method_names = ['get', 'post']
    template_name = 'mgmt/subgroup/delete.html'
    model = Subgroup
    form_class = SubgroupDeleteForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['instance'] = self.instance
        return context


class SubgroupUpdateView(SingleObjectMixin, FormView):
    http_method_names = ['get', 'post']
    template_name = 'mgmt/subgroup/update.html'
    model = Subgroup
    form_class = SubgroupUpdateForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['instance'] = self.instance
        context['students'] = StudentSubgroupStatus.objects \
            .filter(subgroup_id=self.instance.id).select_related('student') \
            .order_by('-status')
        return context
