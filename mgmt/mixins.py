from django.http import Http404, HttpResponseRedirect
from django.urls import reverse


class ManagementMixin:
    permission_required = []

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            login_page = reverse("core:login")
            return HttpResponseRedirect(login_page)

        if request.user.is_superuser:
            return super().dispatch(request, *args, **kwargs)

        if request.user.is_staff and request.user.has_perms(self.permission_required):
            return super().dispatch(request, *args, **kwargs)

        raise Http404()


class SingleObjectMixin:
    model = None
    instance = None
    kwarg_name = 'pk'

    def get_instance(self, request, **kwargs):
        pk = kwargs.get(self.kwarg_name)

        instance = self.model.objects.filter(pk=pk, is_active=True).first()

        if not instance:
            raise Http404()

        return instance

    def dispatch(self, request, *args, **kwargs):
        self.instance = self.get_instance(request, **kwargs)

        if not self.instance:
            raise Http404()

        return super(SingleObjectMixin, self).dispatch(request, *args, **kwargs)
