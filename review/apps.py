from django.apps import AppConfig

class ReviewConfig(AppConfig):

    default_auto_field = "django.db.models.BigAutoField"
    name = "review"

    def ready(self):

        print("REVIEW APP STARTED")

        try:

            from ingestion.sample_loader import load_sample_data

            print("CALLING SAMPLE LOADER")

            load_sample_data()

            print("SAMPLE LOADER FINISHED")

        except Exception as e:

            print("LOADER ERROR:", e)