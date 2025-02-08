from rest_framework import serializers

from stages.models import Stage


class StageSerializers:
    class StageSerializerForStudent(serializers.ModelSerializer):
        class Meta:
            model = Stage
            fields = ['id', 'title', 'description', 'start_date', 'end_date']

    class StageSerializerForTutor(serializers.ModelSerializer):
        class Meta:
            model = Stage
            fields = ['id', 'title', 'description', 'start_date', 'end_date', 'updated_at']
