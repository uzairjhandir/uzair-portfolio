
---
version: 1.0.0
status: Frozen (Production Ready)
last_updated: 2026-07-11
---

# Frontend Architecture

```mermaid
graph TD
    Component --> ReactQuery
    ReactQuery --> ApiClient
    ApiClient --> LaravelAPI
```