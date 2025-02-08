from django.views.generic import TemplateView
from mgmt.mixins import ManagementMixin



class IndexView(ManagementMixin, TemplateView):
    template_name = "mgmt/index.html"
