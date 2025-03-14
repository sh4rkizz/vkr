def user_processor(request):
    user = request.user

    if not user.is_authenticated:
        return {}

    return {
        'kra_user': {
            'id': user.pk, 'email': user.email, 'username': user.username,
            'first_name': user.first_name, 'last_name': user.last_name, 'patronymic': user.patronymic,
        },
        'kra_user_access': { 'is_staff': user.is_staff, 'is_superuser': user.is_superuser }
    }
