# MODEL.md

## Data Model Overview

The system is designed to ingest ESG activity data from multiple enterprise sources and normalize it into a common structure for analyst review and audit.

### Core Entity: ActivityRecord

Fields:

* source_type (sap, utility, travel)
* activity_type
* facility
* quantity
* unit
* activity_date
* emission_factor
* co2_emission
* validation_status
* suspicious
* approved
* locked
* review_comment
* reviewed_by
* created_at
* updated_at

### Multi-Tenancy

The prototype assumes a single tenant.

For production deployment, a Tenant model would be introduced and every ActivityRecord would contain:

* tenant_id
* business_unit
* reporting_period

This ensures data isolation between enterprise customers.

### Scope Categorization

Scope mapping:

* Scope 1 → Fuel consumption from SAP procurement records
* Scope 2 → Electricity consumption from utility data
* Scope 3 → Business travel emissions

Scope would be stored as an additional field in production.

### Source of Truth Tracking

Each record stores:

* source_type
* created_at
* updated_at

This allows tracing records back to SAP, Utility, or Travel ingestion.

### Unit Normalization

Different source systems use different units.

The prototype normalizes:

* Electricity → kWh
* Travel → trip
* SAP procurement → transaction

Emission factors are applied after normalization.

### Audit Trail

AuditLog stores:

* record
* action
* performed_by
* timestamp

Every approval action creates an immutable audit record.

Approved records become locked and cannot be modified, supporting audit requirements.
