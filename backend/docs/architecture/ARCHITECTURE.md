# Architecture Overview

This platform is an Enterprise Digital Experience Platform (DXP) built on Laravel.

## Layers
1. **Core**: Core utilities (Enums, Health, DTOs).
2. **Modules**: Domain logic (CRM, Blog, Portfolio, LiveChat).
3. **Infrastructure**: Operational logic (Queue, Scheduler, Production Hardening).

## Event-Driven Design
Modules strictly communicate via Domain Events (e.g., `LeadCreated`). The `NotificationManager` and `AutomationEngine` listen to these events asynchronously to orchestrate cross-module business logic without hard coupling.
