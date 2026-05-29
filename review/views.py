from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView

from normalization.models import (
    ActivityRecord,
    AuditLog
)

from normalization.serializers import (
    ActivityRecordSerializer,
    AuditLogSerializer
)


class ApproveRecordView(APIView):

    def post(self, request, record_id):

        try:

            record = ActivityRecord.objects.get(
                id=record_id
            )

        except ActivityRecord.DoesNotExist:

            return Response(
                {"error": "Record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # APPROVE RECORD

        record.approved = True

        # AUDIT LOCK

        record.locked = True

        # OPTIONAL REVIEWER

        record.reviewed_by = "ESG Analyst"

        # SAVE RECORD

        record.save()

        # CREATE AUDIT LOG

        AuditLog.objects.create(

            record=record,

            action="Record Approved",

            performed_by="ESG Analyst"
        )

        return Response({

            "message":
                f"Record {record_id} approved and locked"

        })


class ActivityRecordListView(APIView):

    def get(self, request):

        try:

            records = ActivityRecord.objects.all()

            serializer = ActivityRecordSerializer(
                records,
                many=True
            )

            return Response(serializer.data)

        except Exception as e:

            return Response({
                "error": str(e)
            })

class AuditLogListView(ListAPIView):

    queryset = (
        AuditLog.objects
        .all()
        .order_by("-timestamp")
    )

    serializer_class = AuditLogSerializer