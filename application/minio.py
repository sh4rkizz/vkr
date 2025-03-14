from datetime import datetime
from hashlib import sha256
import os
import boto3
from django.conf import settings

from core.utils import get_random_string


def get_boto3_client():
    return boto3.client(
        service_name='s3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )


def get_step_colution_file_path(instance, filename):
    date_part = datetime.now().strftime('%Y/%m/%d')
    random_part = get_random_string(8)
    solution_part = f'solution_{instance.solution_id}'

    hash_part = random_part + solution_part + settings.SECRET_KEY
    hash_part = sha256(hash_part.encode()).hexdigest()

    extension = os.path.splitext(filename)[-1]
    new_filename = random_part + hash_part + extension
    return os.path.join('solution_files', date_part, solution_part, new_filename)
