from django.contrib import admin
from .models import ActivityRecord


@admin.register(ActivityRecord)
class ActivityRecordAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "source_type",
        "activity_type",
        "facility",
        "quantity",
        "validation_status",
        "suspicious",
        "approved",
        "created_at",
    )

    list_filter = (
        "source_type",
        "validation_status",
        "suspicious",
        "approved",
    )

    search_fields = (
        "facility",
        "activity_type",
    )

    list_editable = (
        "approved",
    )