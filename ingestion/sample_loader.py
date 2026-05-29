import pandas as pd
import os
import requests

from normalization.models import ActivityRecord


def load_sample_data():

    if ActivityRecord.objects.exists():
        return

    # =====================
    # SAP DATA
    # =====================

    sap_df = pd.read_csv(
        "sample_data/sample_sap.csv"
    )

    for _, row in sap_df.iterrows():

        activity_date = pd.to_datetime(
            row["CREATIONDATE"],
            errors="coerce",
            dayfirst=True
        )

        if pd.isna(activity_date):
            continue

        ActivityRecord.objects.create(

            source_type="sap",

            activity_type=str(
                row["PRODUCT"]
            ),

            facility=str(
                row["PLANT"]
            ),

            quantity=1.0,

            unit="transaction",

            activity_date=activity_date.date(),

            emission_factor=1.4,

            co2_emission=1.4,

            validation_status="valid",

            suspicious=False,

            review_comment=""
        )

    # =====================
    # UTILITY DATA
    # =====================

    utility_df = pd.read_csv(
        "sample_data/sample_utility.csv"
    )

    for _, row in utility_df.iterrows():

        energy = pd.to_numeric(
            row["Actual_Energy(kwh)"],
            errors="coerce"
        )

        if pd.isna(energy):
            energy = 0.0

        activity_date = pd.to_datetime(
            row["Date"],
            errors="coerce",
            dayfirst=True
        )

        if pd.isna(activity_date):
            continue

        suspicious = bool(
            row["Abnormal_Usage"]
        )

        ActivityRecord.objects.create(

            source_type="utility",

            activity_type="electricity",

            facility=str(
                row["Region_Code"]
            ),

            quantity=float(energy),

            unit="kWh",

            activity_date=activity_date.date(),

            emission_factor=0.82,

            co2_emission=float(energy) * 0.82,

            validation_status="valid",

            suspicious=suspicious,

            review_comment=(

                "Abnormal electricity usage"

                if suspicious

                else ""
            )
        )

    # =====================
    # TRAVEL DATA
    # =====================

    API_KEY = os.getenv(
        "AVIATIONSTACK_API_KEY"
    )

    flights = []

    if API_KEY:

        try:

            response = requests.get(
                f"http://api.aviationstack.com/v1/flights?access_key={API_KEY}",
                timeout=10
            )

            data = response.json()

            flights = data.get(
                "data",
                []
            )[:5]

        except Exception:

            flights = []

    # Fallback Flights

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

        suspicious = (
            departure == arrival
        )

        ActivityRecord.objects.create(

            source_type="travel",

            activity_type="flight",

            facility=f"{departure}-{arrival}",

            quantity=1.0,

            unit="trip",

            activity_date="2024-01-01",

            emission_factor=2.5,

            co2_emission=2.5,

            validation_status="valid",

            suspicious=suspicious,

            review_comment=(

                "Potential duplicate route"

                if suspicious

                else ""
            )
        )

    print("Sample ESG data loaded successfully")