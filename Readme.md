# ESG Multi-Source Ingestion & Review Platform

A full-stack ESG data ingestion and analyst review platform built using Django REST Framework and React.

The system ingests ESG-related operational data from multiple enterprise-style sources, normalizes records into a common schema, validates records, flags suspicious data, and supports analyst approval workflows before audit locking.

---

# Features

## Multi-Source Data Ingestion

### 1. SAP Procurement & Fuel Data
- CSV upload ingestion
- Simulates SAP ERP export data
- Handles:
  - product data
  - plant/facility mappings
  - quantities
  - procurement records

### 2. Utility Electricity Data
- CSV upload ingestion
- Simulates utility billing exports
- Handles:
  - electricity usage
  - facility-level consumption
  - meter-style records

### 3. Corporate Travel Data
- API ingestion using AviationStack API
- Simulates enterprise travel platforms like:
  - Concur
  - Navan
- Handles:
  - flight activity
  - airport routes
  - travel records

---

# Core Workflow

Raw Source Data
↓
Ingestion Layer
↓
Normalization
↓
Validation Engine
↓
Suspicious Detection
↓
Analyst Review Dashboard
↓
Approval Workflow
↓
Audit Locking

---

# Tech Stack

## Backend
- Django
- Django REST Framework
- SQLite
- Pandas

## Frontend
- React
- Axios

---

# Validation Rules

## SAP Validation
- Missing product → failed validation
- Missing plant → suspicious record

## Utility Validation
- Negative usage → failed validation
- Extremely high usage → suspicious

## Travel Validation
- Missing airport codes → failed validation
- Same departure/arrival airport → suspicious

---

# Suspicious Detection

The platform flags records that may require analyst review before approval.

Examples:
- Unknown plant mappings
- Excessive electricity usage
- Invalid travel routes
- Missing operational metadata

---

# Approval Workflow

Analysts review records through the React dashboard.

Approved records:
- are marked approved
- become audit locked
- cannot be modified further

This simulates enterprise ESG auditability requirements.

---

# Frontend Dashboard Features

- ESG operations dashboard
- Summary cards
- Suspicious filtering
- Approved filtering
- Failed filtering
- Approve actions
- Live record updates

---

# API Endpoints

## SAP Upload
POST /api/upload/sap/

## Utility Upload
POST /api/upload/utility/

## Travel Sync
POST /api/travel/sync/

## Get Records
GET /api/review/records/

## Approve Record
POST /api/review/approve/<id>/

---

# Project Structure

ESG/
│
├── backend/
├── ingestion/
├── normalization/
├── review/
├── audit/
├── frontend/
│
├── manage.py
└── README.md

---

# Setup Instructions

## Backend Setup

### Install dependencies

pip install django djangorestframework django-cors-headers pandas requests

### Run migrations

python manage.py makemigrations

python manage.py migrate

### Start backend server

python manage.py runserver

Backend runs on:
http://localhost:8000

---

## Frontend Setup

### Navigate to frontend

cd frontend

### Install dependencies

npm install

### Start React app

npm start

Frontend runs on:
http://localhost:3000

---

# Example Sources Used

## SAP Dataset
- Kaggle SAP ERP transaction dataset

## Utility Dataset
- Simulated electricity billing CSV

## Travel Source
- AviationStack API

---

# Future Improvements

- File upload UI
- Charts & analytics
- Authentication
- Pagination
- Async ingestion
- Background jobs
- PostgreSQL support
- Docker deployment

---

# Author

Built as a full-stack ESG ingestion and analyst review system using Django REST Framework and React.