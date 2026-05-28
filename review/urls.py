from django.urls import path

from .views import (
    ApproveRecordView,
    ActivityRecordListView,
    AuditLogListView
)

urlpatterns = [

    path(
        "approve/<int:record_id>/",
        ApproveRecordView.as_view()
    ),

    path(
        "records/",
        ActivityRecordListView.as_view()
    ),

    path(
        "audit-logs/",
        AuditLogListView.as_view()
    ),
]