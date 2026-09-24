# Data flow

```mermaid
flowchart LR
  A[Account or guest local config] --> B[Section source and filters]
  B --> C[Existing timeline feed list or search query]
  C --> D[Existing moderation and local attention]
  D --> E[Interactive post renderer]
  E --> F[Supplied-record information]
  E --> G[Moderated text image]
  E --> H[Existing network actions]
  H --> I[PDS write guard rejects new blocks]
```

Sections and reading settings persist only in account-scoped local storage. PDS discovery fetches a public DID document without credentials and validates the document identity before displaying its declared HTTPS service. No custom record publish path exists.
