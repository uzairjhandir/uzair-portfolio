# Validation Rules Synchronization

This document maps the exact Zod frontend validation schemas to the future Laravel FormRequests. This ensures the backend perfectly matches the frontend.

## Blog Post Validation
| Field | Frontend (Zod) | Backend (Laravel FormRequest) |
|---|---|---|
| title | `z.string().min(3).max(255)` | `'required|string|min:3|max:255'` |
| slug | `z.string().min(3).regex(/^[a-z0-9-]+$/)` | `'required|string|min:3|regex:/^[a-z0-9-]+$/|unique:blog_posts,slug'` |
| content | `z.string().min(10)` | `'required|string|min:10'` |
| status | `z.enum(["draft", "published", "archived"])` | `'required|in:draft,published,archived'` |
| author_id | `z.string().or(z.number())` | `'required|exists:users,id'` |

## User Validation
| Field | Frontend (Zod) | Backend (Laravel FormRequest) |
|---|---|---|
| name | `z.string().min(2).max(100)` | `'required|string|min:2|max:100'` |
| email | `z.string().email()` | `'required|email|unique:users,email'` |
| role | `z.string().min(1)` | `'required|exists:roles,name'` |
| status | `z.enum(["active", "inactive"])` | `'required|in:active,inactive'` |

## CRM Lead Validation (Updating)
| Field | Frontend (Zod) | Backend (Laravel FormRequest) |
|---|---|---|
| status | `z.enum(["new", "in-progress", "resolved", "spam"])` | `'required|in:new,in-progress,resolved,spam'` |
| priority | `z.enum(["low", "medium", "high"])` | `'required|in:low,medium,high'` |
| internal_notes | `z.string().optional()` | `'nullable|string'` |

## Testimonial Validation
| Field | Frontend (Zod) | Backend (Laravel FormRequest) |
|---|---|---|
| client_name | `z.string().min(2)` | `'required|string|min:2'` |
| rating | `z.number().min(1).max(5)` | `'required|numeric|min:1|max:5'` |

*(All FormRequests generated in Laravel MUST match these exact constraints.)*
