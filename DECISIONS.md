# DECISIONS.md

## SAP Ingestion

Decision:
CSV export ingestion.

Reason:
SAP exports are commonly delivered as flat files or OData extracts. CSV was chosen because it is realistic and easy to demonstrate.

Handled:

* Product
* Plant
* Creation date

Ignored:

* IDoc processing
* BAPI integration
* SAP authentication

## Utility Data

Decision:
CSV upload.

Reason:
Facilities teams frequently export electricity usage reports from utility portals.

Handled:

* Meter consumption
* Region
* Usage anomaly flag

Ignored:

* PDF bill parsing
* Tariff calculations
* Demand charges

## Travel Data

Decision:
Travel API integration using AviationStack plus fallback sample data.

Reason:
Corporate travel platforms expose travel data through APIs.

Handled:

* Flight routes
* Airport codes

Ignored:

* Hotel bookings
* Ground transportation
* Class-of-service adjustments

## Analyst Workflow

Decision:
Manual approval process.

Reason:
Analysts need visibility before records are finalized.

Approved records become locked and generate audit logs.

## Questions for PM

1. Should analysts be able to edit approved records?
2. What emission factor library should be used?
3. How should tenant-specific factors be managed?
4. What audit retention period is required?
5. Which ESG framework should reporting follow?
