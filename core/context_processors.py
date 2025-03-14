import jwt
import time
from urllib.parse import urljoin
from django.conf import settings


def centrifuge_processor(request):
    def get_auth_token(user=None):
        user_id = str(user.pk) if user else ''
        secret = settings.CENTRIFUGE_SECRET_KEY
        expire = int(time.time()) + settings.CENTRIFUGE_TOKEN_EXPIRE
        return jwt.encode({"sub": user_id, "exp": expire}, secret, algorithm="HS256")

    if not request.user.is_authenticated:
        return {}

    if not settings.CENTRIFUGE_ENABLED or not settings.CENTRIFUGE_URL:
        return { 'CENTRIFUGE_ENABLED': False }

    base_url = urljoin(settings.SITE_URL, settings.CENTRIFUGE_URL)

    return {
        'CENTRIFUGE_URL': urljoin(base_url, 'connection/sockjs'),
        'CENTRIFUGE_TOKEN': get_auth_token(request.user),
        'CENTRIFUGE_ENABLED': settings.CENTRIFUGE_ENABLED,
        'CENTRIFUGE_TIMEOUT_PING': settings.CENTRIFUGE_TIMEOUT_PING,
    }


def user_processor(request):
    user = request.user

    if not user.is_authenticated:
        return {}

    user = {
        'id': user.pk,
        'email': user.email,
        'username': user.username,
        'first_name_ru': user.first_name,
        'last_name_ru': user.last_name,

        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
    }

    return { 'kra_user': user }
