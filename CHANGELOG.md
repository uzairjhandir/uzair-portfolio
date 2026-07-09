# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-09

### Added
- **Premium Personal Intro:** Comprehensive "About Me" section featuring floating glassmorphism cards, expertise grid, and professional storytelling.
- **Nodemailer API Integration:** Fully functional server-side `/api/contact` route handling form submissions, email dispatch, and auto-replies.
- **Trust Badges:** Added dynamic trust metrics (Experience, Projects, Clients) to the Contact section.
- **Legal Pages:** High-end `/privacy` and `/terms` pages with customized SEO metadata and JSON-LD schema support.
- **Visual Identity:** Custom MU monogram and typography-based logo component.
- **Animations:** Extensive use of `framer-motion` for scroll reveals, hover states, and dynamic page transitions.
- **Documentation:** Added comprehensive guides for Deployment, Server Setup, SMTP configuration, and Environments.

### Changed
- Refactored `Contact.tsx` UI to include advanced interactive form fields (Dropdowns, Company, Timeline).
- Replaced dummy text with polished professional copywriting targeted at high-ticket clients.
- Improved overall easing functions to `ease: [0.22, 1, 0.36, 1]` for all Framer Motion components.
- Upgraded Next.js dynamic routing to correctly `await params` per Next.js 15 standards.

### Fixed
- ESLint and React hooks purity warnings.
- Hydration mismatch issues by extracting client logic to appropriate `useEffect` hooks.
- Layout shifts and z-index overlapping issues in the Navigation and Footer components.
