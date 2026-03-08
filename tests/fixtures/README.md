# tests/fixtures/

Sample files required for E2E upload tests.

## Required files

| File | Used in | Description |
|---|---|---|
| `consent_form.png` | Module 11 uploadDocumentation() | Physical consent form scan |
| `personal_doc.png` | Module 11 uploadDocumentation() | Personal document (Aadhaar/Passport) |
| `balance_sheet.pdf` | Module 15 addITRAndPL() | Company balance sheet |
| `itr_doc.pdf` | Module 15 addITRAndPL() | ITR document (last 3 years) |
| `gst_doc.png` | Module 14 addGST() | GST certificate / monthly sales |
| `takeover_doc.png` | Module 13 addTakeOver() | Sanction letter for takeover |
| `financial_doc.png` | Module 12 addFinancialInfo() | CA-certified financial statement |
| `psl_doc.jpg` | Module 10 addPSL() | PSL category document |

## How to add files

1. Place actual sample documents in this folder.
2. For CI/CD, commit small placeholder PNG/PDF files or store via GitHub Actions secrets.
3. File names must match the entries above (or update `journeyData.json` `docs` keys).

## CI note

If fixture files are missing, upload steps log a warning and continue —
they will NOT fail the test suite. This lets the rest of the journey
be verified even without real documents present.
