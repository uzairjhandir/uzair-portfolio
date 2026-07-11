# Search Engine — Module 17 (v2)

Unified driver-based search engine with hybrid Indexed + Live provider architecture, weighted field scoring, faceted aggregations, async queue pipeline, and Ctrl+K admin global search.

---

## Architecture

```
SearchManager
│
├── Driver (scoring engine — swappable)
│     ├── Database   — weighted FULLTEXT, calculateScore()
│     ├── Meilisearch — native ranking, highlighting, synonyms
│     ├── Elastic / Algolia
│     └── Null       — safe no-op for tests/disabled environments
│
├── Indexed Providers (query search_index table via active Driver)
│     └── ContentSearchProvider  → Blog, Pages, Portfolio, Case Studies, Downloads
│
├── Live Providers (real-time DB queries, admin only)
│     ├── CRMSearchProvider      → crm_contacts
│     ├── UserSearchProvider     → users
│     ├── MediaSearchProvider    → media
│     └── SettingsSearchProvider → settings
│
└── Queue Pipeline (search queue)
      ├── IndexSearchDocumentJob
      ├── RemoveSearchDocumentJob
      └── RebuildSearchIndexJob
```

---

## Queue Pipeline

All indexing operations are asynchronous. The HTTP request cycle is never blocked.

```
ContentPublished / ContentUpdated
  → SearchIndexListener
  → IndexSearchDocumentJob  (search queue, 3 retries + exponential backoff)
  → SearchManager::index()
  → Active Driver

ContentDeleted
  → SearchIndexListener
  → RemoveSearchDocumentJob (search queue)
  → SearchManager::remove()
  → Active Driver

POST /api/v1/search/rebuild
  → SearchController::rebuild()
  → RebuildSearchIndexJob   (search queue, 1hr timeout, no retry)
  → SearchManager::rebuild()
  → Active Driver
```

---

## Database Schema

### `search_index` (extended in v2)

| Column | Type | Description |
|---|---|---|
| `id` | bigint | PK |
| `uuid` | uuid | API reference identifier |
| `searchable_type` | string | Model class (polymorphic) |
| `searchable_id` | bigint | Model PK (polymorphic) |
| `searchable_uuid` | uuid | Model's own UUID |
| `module` | string | Owning module (e.g. `Blog`) |
| `type` | string | Content type (e.g. `blog`) |
| `locale` | string | Language code (default: `en`) |
| `translation_group_uuid` | uuid | Groups all locale variants of one piece of content |
| `title` | string | FULLTEXT indexed (weight ×10) |
| `summary` | text | FULLTEXT indexed (weight ×4) |
| `content` | longText | FULLTEXT indexed (weight ×1) |
| `keywords` | text | FULLTEXT indexed (weight ×7) |
| `url` | string | Frontend URL |
| `image` | string | Preview image URL |
| `status` | string | `published`, `draft`, `archived` |
| `visibility` | string | `public`, `admin`, `restricted` |
| `published_at` | timestamp | Used for year facet |
| `boost` | integer | Module-level ranking boost |
| `index_version` | tinyint | Logical rebuild generation (v1, v2…) |
| `schema_version` | tinyint | Document structure version |
| `metadata` | json | Flexible per-module attributes |

### `search_suggestions`

Stores query analytics for popular/trending/recent suggestion modes.
**GDPR**: Only the query string is stored. No IP, user_id, or session_id.

| Column | Type | Description |
|---|---|---|
| `query` | string | The search term |
| `locale` | string | Language context |
| `type` | enum | `autocomplete \| recent \| popular \| trending` |
| `result_count` | int | Results returned for this query |
| `clicked_count` | int | Times a result was clicked |
| `search_count` | int | Times this query was searched |
| `last_used_at` | timestamp | For trending window calculations |

### `search_health`

Operational metrics snapshots consumed by Module 19 Dashboard.

| Column | Type | Description |
|---|---|---|
| `driver` | string | Active driver name |
| `driver_version` | string | e.g. `Meilisearch 1.7.0` |
| `indexed_documents` | int | Total docs in search_index |
| `pending_documents` | int | Docs waiting to be indexed |
| `failed_documents` | int | Docs that failed indexing |
| `queue_backlog` | int | Jobs waiting in the search queue |
| `average_query_time_ms` | decimal | Average search latency |
| `last_rebuild` | timestamp | Last full rebuild completion |
| `last_successful_index` | timestamp | Last successful single-doc index |
| `last_failed_index` | timestamp | Last indexing failure |

---

## Weighted Scoring (Database Driver)

The `calculateScore()` method is the only place in the codebase that knows about field weights. Drivers override this with their native ranking mechanism.

```
final_score = MATCH(title)    × 10
            + MATCH(keywords) × 7
            + MATCH(summary)  × 4
            + MATCH(content)  × 1
            + boost
```

Separate per-field FULLTEXT indexes are required:
- `search_ft_title` on `(title)`
- `search_ft_keywords` on `(keywords)`
- `search_ft_summary` on `(summary)`
- `search_ft_content` on `(content)`

---

## Faceted Aggregations

All search responses include a `facets` block. The frontend builds filters dynamically from this data — nothing is hardcoded.

```json
{
  "data": [...],
  "total": 26,
  "facets": {
    "type":   { "blog": 15, "portfolio": 4, "download": 7 },
    "year":   { "2025": 18, "2024": 8 },
    "module": { "Blog": 15, "Downloads": 7, "Portfolio": 4 },
    "locale": { "en": 24, "ar": 2 }
  }
}
```

---

## Public API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/search` | Full search with filters + facets |
| `GET` | `/api/v1/search/suggest` | Suggestions (autocomplete/recent/popular/trending) |
| `GET` | `/api/v1/search/related` | Related content via ContentRelations graph |

### `GET /api/v1/search`

```
q          string    Search term (required)
type       string    Filter by content type (blog, portfolio, download…)
locale     string    Filter by locale (default: en)
year       int       Filter by published year
author     string    Filter by author (stored in metadata)
taxonomy   string    Filter by taxonomy slug
limit      int       Max results (default 20, max 100)
```

### `GET /api/v1/search/suggest`

```
q       string    Partial term (min 2 chars, except for recent/popular/trending)
mode    string    autocomplete | recent | popular | trending (default: autocomplete)
locale  string    (default: en)
limit   int       (default 5, max 20)
```

---

## Admin API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/admin/search` | Global Ctrl+K search across all providers |
| `GET` | `/api/v1/admin/search/health` | Search health metrics |
| `POST` | `/api/v1/search/rebuild` | Queue full or partial index rebuild |
| `DELETE` | `/api/v1/search/index` | Flush index |

### Admin Global Search (`Ctrl+K`)

Merges results from all providers:
- **Content** (indexed): Blog, Portfolio, Case Studies, Downloads
- **CRM** (live): Contacts
- **Users** (live): User accounts
- **Media** (live): Files, images, uploads
- **Settings** (live): Config keys and labels

---

## Driver Capabilities

```php
$search->capabilities();
// {
//   "highlighting":  false,  // ✅ true in Meilisearch / Elastic
//   "facets":        true,   // ✅ true in all (DB uses aggregate queries)
//   "geo_search":    false,  // ✅ true in Elastic
//   "suggestions":   true,   // ✅ true in all
//   "vector_search": false,  // ✅ future AI/semantic search
//   "synonyms":      false,  // ✅ true in Meilisearch / Elastic
// }
```

No module or controller should ever check `config('search.default') === 'meilisearch'`. Always use `$search->supportsX()`.

---

## Module Registry (`module.json` search block)

Content modules declare their search participation in `module.json`:

```json
{
  "search": {
    "enabled": true,
    "provider": "content",
    "type": "blog",
    "visibility": "public",
    "boost": 40,
    "index_version": 1,
    "schema_version": 1
  }
}
```

`SearchManager::discoverModules()` scans all `module.json` files and returns every module with `search.enabled = true`. No manual registration required.

**Boost scale** (higher = appears earlier in results):

| Module | Boost |
|---|---|
| Blog | 40 |
| Portfolio | 35 |
| Case Studies | 30 |
| Downloads | 25 |

---

## Related Content

`GET /api/v1/search/related?type=blog&uuid=xxx`

Priority:
1. **ContentRelations graph edges** — `content_relations` table (`score += 50 + edge.weight`)
2. **Same-type similarity fallback** — ordered by boost

---

## Index Versioning

- `index_version` — logical rebuild generation. Increment when scoring or ranking changes. Old version stays queryable while new version builds (zero-downtime).
- `schema_version` — structural document format version. Increment when `toSearchDocument()` output changes.

---

## Test Coverage

```bash
# Driver capability flags
php artisan test --filter DriverCapabilityTest

# Queue dispatch (not synchronous execution)
php artisan test --filter SearchQueueDispatchTest

# Module auto-discovery
php artisan test --filter SearchModuleDiscoveryTest

# Permission filtering
php artisan test --filter SearchPermissionTest

# Facet aggregation structure
php artisan test --filter SearchFacetTest

# Related content ranking (graph + similarity)
php artisan test --filter SearchRelatedTest

# Provider merge (content + CRM + users)
php artisan test --filter SearchProviderMergeTest
```
