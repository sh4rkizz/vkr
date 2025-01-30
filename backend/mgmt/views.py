from django.shortcuts import redirect
from django.views.generic import TemplateView

class IndexView(TemplateView):
    template_name = 'mgmt/index.html'

    def dispatch(self, request, *args, **kwargs):
        # user = request.user

        # if not user.is_authenticated or not user.is_staff:
        #     return redirect('mgmt:login')

        return super().dispatch(request, *args, **kwargs)
