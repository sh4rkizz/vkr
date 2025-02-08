from rest_framework.permissions import IsAuthenticated

from study.models import StudentSubgroupStatus, TutorSubgroupStatus


class IsTutor(IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        active_tutoring = TutorSubgroupStatus.objects \
            .filter(user_pk=request.user.pk) \
            .exclude(role=TutorSubgroupStatus.ROLE_EXPELLED)
        return is_authenticated and active_tutoring.exists()


class IsStudent(IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        active_studying = StudentSubgroupStatus.objects \
            .filter(user_pk=request.user.pk) \
            .exclude(status=StudentSubgroupStatus.STATUS_EXPELLED)
        return is_authenticated and active_studying.exists()

# class IsStaff(IsAuthenticated):
#     def has_permission(self, request, view):
#         is_authenticated = super().has_permission(request, view)
#         return is_authenticated and (request.user.is_superuser or request.user.is_staff)
