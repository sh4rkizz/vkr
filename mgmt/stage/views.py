from django.views import View
from django.views.generic.list import ListView

from stages.models import Stage


class StageListView(ListView):
    http_method_names = ['get']
    template_name = 'mgmt/stage/list.html'

    model = Stage
    paginate_by = 25


class StageCreateView(View):
    model = Stage
