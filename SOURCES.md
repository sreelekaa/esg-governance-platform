# SOURCES.md

## SAP

Research

- SAP ERP exports
- SAP OData services
- SAP CSV exports

Chosen Format

CSV export representing procurement transactions.

Sample Data

- Product
- Plant
- Creation Date

Why

Represents a common enterprise export workflow.

Potential Production Issues

- Inconsistent units
- Missing plant mappings
- Localization differences

---

## Utility

Research

- Electricity portal exports
- Utility consumption reports

Chosen Format

CSV export.

Sample Data

- Meter ID
- Region
- Actual Energy
- Abnormal Usage Flag

Why

Matches common facility-management workflows.

Potential Production Issues

- Missing meter mappings
- Different billing periods
- Timezone alignment

---

## Travel

Research

- Concur API
- Navan API
- AviationStack API

Chosen Format

API ingestion.

Sample Data

- Departure Airport
- Arrival Airport

Why

Travel platforms commonly expose APIs.

Potential Production Issues

- Missing distance data
- Hotel emissions
- Ground transport emissions
- Duplicate bookings