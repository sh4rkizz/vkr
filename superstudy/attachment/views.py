from rest_framework.views import APIView


class UploadFileView(APIView):
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        ...
