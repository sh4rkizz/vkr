def get_client_user_agent(request):
    user_agent = request.META.get('HTTP_USER_AGENT')
    return user_agent

def get_client_ip(request):
    ip = request.META.get('HTTP_X_REAL_IP')
    if not ip:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
    if not ip:
        ip = request.META.get('REMOTE_ADDR')

    if ip and hasattr(ip, 'strip'):
        ip = ip.strip()
    return ip
