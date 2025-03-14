from django.views.generic.list import ListView
from study.models import Subgroup


class SubgroupListView(ListView):
    http_method_names = ['get']
    template_name = 'mgmt/subgroup/list.html'

    model = Subgroup
    paginate_by = 25
