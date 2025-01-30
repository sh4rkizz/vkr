import socket
from django.db import models

from core.utils import get_client_ip, get_client_user_agent


class NetInfoManager(models.Manager):
    def create_for(self, user, request):
        ip_address = get_client_ip(request)
        last_net_info = self.filter(user=user).order_by('-actual_date').first()

        if last_net_info and last_net_info.ip_address_cleaned.startswith(ip_address):
            return last_net_info

        kwargs = { 'user': user, 'ip_address': ip_address }
        user_agent = get_client_user_agent(request)
        kwargs['user_agent'] = user_agent if user_agent else None

        try:
            ip_fqdn = socket.gethostbyaddr(ip_address)
            kwargs['ip_fqdn'] = ip_fqdn[0] if ip_fqdn else None
        except Exception:
            pass

        return self.create(**kwargs)
