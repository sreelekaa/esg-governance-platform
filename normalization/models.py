from django.db import models


class ActivityRecord(models.Model):

    SOURCE_CHOICES = [
        ("sap", "SAP"),
        ("utility", "Utility"),
        ("travel", "Travel"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("valid", "Valid"),
        ("failed", "Failed"),
        ("approved", "Approved"),
    ]

    source_type = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES
    )

    activity_type = models.CharField(
        max_length=100
    )

    facility = models.CharField(
        max_length=100
    )

    quantity = models.FloatField(
        null=True
    )

    unit = models.CharField(
        max_length=20
    )

    activity_date = models.DateField()

    emission_factor = models.FloatField(
        default=0.0
    )

    co2_emission = models.FloatField(
    default=0.0,
    null=True,
    blank=True
)

    validation_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    suspicious = models.BooleanField(
        default=False
    )

    approved = models.BooleanField(
        default=False
    )

    locked = models.BooleanField(
        default=False
    )

    review_comment = models.TextField(
        blank=True,
        null=True
    )

    reviewed_by = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        try:
            quantity = float(self.quantity or 0)
        except:
            quantity = 0.0

        try:
            emission_factor = float(
                self.emission_factor or 0
            )
        except:
            emission_factor = 0.0

        self.co2_emission = (
            quantity * emission_factor
        )

        if self.approved:
            self.locked = True

        super().save(*args, **kwargs)

    def __str__(self):

        return (
            f"{self.source_type} - "
            f"{self.activity_type}"
        )


class AuditLog(models.Model):

    record = models.ForeignKey(
        ActivityRecord,
        on_delete=models.CASCADE
    )

    action = models.CharField(
        max_length=100
    )

    performed_by = models.CharField(
        max_length=100
    )

    timestamp = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.action} - "
            f"{self.performed_by}"
        )