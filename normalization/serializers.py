from rest_framework import serializers

from .models import (
    ActivityRecord,
    AuditLog
)


class ActivityRecordSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = ActivityRecord

        fields = "__all__"


class AuditLogSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = AuditLog

        fields = "__all__"