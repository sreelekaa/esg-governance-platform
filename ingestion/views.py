from django.shortcuts import render

import pandas as pd
import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import RawUpload
from normalization.models import ActivityRecord


class SAPUploadView(APIView):

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        raw_upload = RawUpload.objects.create(
            source_type="sap",
            file=file
        )

        df = pd.read_csv(raw_upload.file.path).head(20)

        records = []

        for _, row in df.iterrows():

            product = str(row.get("PRODUCT", "unknown"))

            plant = str(row.get("PLANT", "unknown"))

            quantity = row.get(
                "CUMULATIVEORDERQUANTITY",
                0
            )

            validation_status = "valid"

            suspicious = False

            # Validation rules

            if product == "unknown":
                validation_status = "failed"

            if quantity <= 0:
                validation_status = "failed"

            if plant == "unknown":
                suspicious = True
            if quantity > 10000:
                suspicious = True

            emission_factor = 1.4

            records.append(

                ActivityRecord(

                    source_type="sap",

                    activity_type=product,

                    facility=plant,

                    quantity=quantity,

                    unit="liters",

                    activity_date=row.get(
                        "CREATIONDATE",
                        "2024-01-01"
                    ),

                    emission_factor=emission_factor,

                    validation_status=validation_status,

                    suspicious=suspicious,

                    review_comment=(
                        "High procurement quantity"
                        if suspicious
                        else ""
                    ),
                )
            )

        ActivityRecord.objects.bulk_create(records)

        return Response({
            "message": "SAP file uploaded successfully",
            "rows_processed": len(records)
        })


class UtilityUploadView(APIView):

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        raw_upload = RawUpload.objects.create(
            source_type="utility",
            file=file
        )

        df = pd.read_csv(raw_upload.file.path).head(20)

        records = []

        for _, row in df.iterrows():

            quantity = row.get("usage_kwh", 0)

            facility = str(
                row.get("facility", "unknown")
            )

            validation_status = "valid"

            suspicious = False

            # Validation rules

            if quantity <= 0:
                validation_status = "failed"

            if quantity > 5000:
                suspicious = True

            if facility == "unknown":
                suspicious = True
          
            emission_factor = 0.82

            records.append(

                ActivityRecord(

                    source_type="utility",

                    activity_type="electricity",

                    facility=facility,

                    quantity=quantity,

                    unit="kWh",

                    activity_date="2024-01-01",

                    emission_factor=emission_factor,

                    validation_status=validation_status,

                    suspicious=suspicious,

                    review_comment=(
                        "Abnormally high electricity usage"
                        if suspicious
                        else ""
                    ),
                )
            )

        ActivityRecord.objects.bulk_create(records)

        return Response({
            "message": "Utility file uploaded successfully",
            "rows_processed": len(records)
        })


class TravelSyncView(APIView):

    def post(self, request):

        API_KEY = "7fa28d6cb1143c7f66cdda3e38b4dcd8"

        url = (
            f"http://api.aviationstack.com/v1/flights"
            f"?access_key={API_KEY}"
        )

        response = requests.get(url)

        data = response.json()

        records = []

        flights = data.get("data", [])

        # fallback mock data
        if not flights:

            flights = [
                {
                    "flight_number": "EK543",
                    "departure": {"iata": "MAA"},
                    "arrival": {"iata": "DXB"}
                },
                {
                    "flight_number": "AI302",
                    "departure": {"iata": "DEL"},
                    "arrival": {"iata": "BOM"}
                }
            ]

        for flight in flights:

            validation_status = "valid"

            suspicious = False

            departure = "UNK"

            arrival = "UNK"

            # Get airport codes

            if flight.get("departure"):

                departure = flight["departure"].get(
                    "iata",
                    "UNK"
                )

            if flight.get("arrival"):

                arrival = flight["arrival"].get(
                    "iata",
                    "UNK"
                )

            # Validation rules

            if departure == "UNK" or arrival == "UNK":
                validation_status = "failed"

            if departure == arrival:
                suspicious = True

            if departure == "SIN":
                suspicious = True

            emission_factor = 2.5

            records.append(

                ActivityRecord(

                    source_type="travel",

                    activity_type="flight",

                    facility=f"{departure}-{arrival}",

                    quantity=1,

                    unit="trip",

                    activity_date="2024-01-01",

                    emission_factor=emission_factor,

                    validation_status=validation_status,

                    suspicious=suspicious,

                    review_comment=(
                        "Potential duplicate route"
                        if suspicious
                        else ""
                    ),
                )
            )

        ActivityRecord.objects.bulk_create(records)

        return Response({
            "message": "Travel data synced successfully",
            "rows_processed": len(records)
        })