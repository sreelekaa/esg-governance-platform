
from django.apps import AppConfig

class ReviewConfig(AppConfig):

    default_auto_field = "django.db.models.BigAutoField"

    name = "review"

    def ready(self):

        try:

            from ingestion.sample_loader import (
                load_sample_data
            )

            load_sample_data()

        except Exception as e:
            print(e)