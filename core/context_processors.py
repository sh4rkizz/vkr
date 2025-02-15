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

    return { 'user': user }
