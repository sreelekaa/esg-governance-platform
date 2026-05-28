from django.db import models



class RawUpload(models.Model):

    SOURCE_CHOICES = [
        ("sap", "SAP"),
        ("utility", "Utility"),
        ("travel", "Travel"),
    ]

    source_type = models.CharField(max_length=20)

    file = models.FileField(upload_to="uploads/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.source_type

class ActivityRecord(models.Model):

    source_type = models.CharField(max_length=20)

    activity_type = models.CharField(max_length=100)

    facility = models.CharField(max_length=100)

    quantity = models.FloatField(null=True)

    unit = models.CharField(max_length=20)

    activity_date = models.DateField()

    validation_status = models.CharField(
        max_length=20,
        default="pending"
    )

    suspicious = models.BooleanField(default=False)

    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)