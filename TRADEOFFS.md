# TRADEOFFS.md

## 1. PDF Utility Bill Parsing

Not implemented.

Reason:
OCR and utility bill extraction would require significant additional complexity and was not essential for demonstrating ingestion and normalization.

## 2. True Multi-Tenant Architecture

Not implemented.

Reason:
The prototype focuses on ingestion and review workflows. Multi-tenancy would require tenant management, permissions, and row-level isolation.

## 3. Advanced Emission Factor Management

Not implemented.

Reason:
The prototype uses static emission factors.

A production system would integrate with a maintained emissions database and support region-specific factors.
