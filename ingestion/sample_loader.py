import pandas as pd
import os
import requests


from normalization.models import ActivityRecord



def load_sample_data():

    if ActivityRecord.objects.exists():
        return

    # SAP DATA

    sap_df = pd.read_csv(
      "sample_data/sample_sap.csv"
        
    )

    for _, row in sap_df.iterrows():

        ActivityRecord.objects.create(

            source_type="sap",

            activity_type=row["PRODUCT"],

            facility=row["PLANT"],

            quantity=row["CUMULATIVEORDERQUANTITY"],

            unit="liters",

            activity_date=row["CREATIONDATE"],

            emission_factor=1.4,

            validation_status="valid",

            suspicious=(
                row["CUMULATIVEORDERQUANTITY"] > 10000
            ),

            review_comment=(
                "High procurement quantity"
                if row["CUMULATIVEORDERQUANTITY"] > 10000
                else ""
            )
        )

    # UTILITY DATA

    utility_df = pd.read_csv(
         "sample_data/sample_utility.csv"
        
    )

    for _, row in utility_df.iterrows():

        ActivityRecord.objects.create(

            source_type="utility",

            activity_type="electricity",

            facility=row["facility"],

            quantity=row["usage_kwh"],

            unit="kWh",

            activity_date="2024-01-01",

            emission_factor=0.82,

            validation_status="valid",

            suspicious=(
                row["usage_kwh"] > 5000
            ),

            review_comment=(
                "Abnormally high electricity usage"
                if row["usage_kwh"] > 5000
                else ""
            )
        )

    # TRAVEL DATA

       # TRAVEL API DATA

    API_KEY = os.getenv(
        "AVIATIONSTACK_API_KEY"
    )

    flights = []

    if API_KEY:

        try:

            url = (
                "http://api.aviationstack.com/v1/flights"
                f"?access_key={API_KEY}"
            )

            response = requests.get(
                url,
                timeout=10
            )

            data = response.json()

            flights = data.get(
                "data",
                []
            )[:5]

        except Exception:

            flights = []

    # Fallback sample flights

    if not flights:

        flights = [

            {
                "departure": {
                    "iata": "MAA"
                },

                "arrival": {
                    "iata": "DXB"
                }
            },

            {
                "departure": {
                    "iata": "SIN"
                },

                "arrival": {
                    "iata": "LHR"
                }
            }
        ]

    for flight in flights:

        departure = (
            flight.get(
                "departure",
                {}
            ).get(
                "iata",
                "UNK"
            )
        )

        arrival = (
            flight.get(
                "arrival",
                {}
            ).get(
                "iata",
                "UNK"
            )
        )

        suspicious = False

        if departure == arrival:
            suspicious = True

        ActivityRecord.objects.create(

            source_type="travel",

            activity_type="flight",

            facility=
            f"{departure}-{arrival}",

            quantity=1,

            unit="trip",

            activity_date="2024-01-01",

            emission_factor=2.5,

            validation_status="valid",

            suspicious=suspicious,

            review_comment=(
                "Potential duplicate route"
                if suspicious
                else ""
            )
        )