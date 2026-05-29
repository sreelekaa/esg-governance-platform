from django.core.management.base import BaseCommand
from ingestion.sample_loader import load_sample_data

class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        load_sample_data()

        self.stdout.write(
            self.style.SUCCESS(
                "Sample data loaded"
            )
        )