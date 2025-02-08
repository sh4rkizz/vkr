from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views import View


class IndexView(View):
    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            return HttpResponseRedirect(reverse('study:index'))

        return HttpResponseRedirect(reverse('core:login'))
