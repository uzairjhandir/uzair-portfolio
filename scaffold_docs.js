const fs = require('fs');
const path = require('path');

const FORCE = process.argv.includes('--force');
const VERSION = '1.0.0';
const FREEZE_DATE = new Date().toISOString().split('T')[0];

const metadata = "\n---\nversion: " + VERSION + "\nstatus: Frozen (Production Ready)\nlast_updated: " + FREEZE_DATE + "\n---\n";

const rootFiles = {
    'README.md': "# Uzair Portfolio DXP\n\nWelcome to the Uzair Portfolio Digital Experience Platform (DXP).\n\n## Quick Links\n- [Documentation Index](docs/README.md)\n- [Deployment Guide](DEPLOYMENT.md)\n- [API Reference](API_REFERENCE.md)",
    'CHANGELOG.md': "# Changelog\n\n## [1.0.0] - " + FREEZE_DATE + "\n- Initial Production Release.",
    'ROADMAP.md': "# Roadmap (v1.1+)\n\n- Server Operations Module\n- Client Portal\n- Billing & Support Desk\n- AI Assistant",
    'VERSION.md': "v" + VERSION,
    'LICENSE.md': "# License\n\nProprietary. All rights reserved.",
    'INSTALL.md': "# Installation Guide\n\nDetails for local development setup.",
    'DEPLOYMENT.md': "# Deployment Guide\n\nRefer to WHM/OpenLiteSpeed configurations.",
    'OPERATIONS.md': "# Day-to-Day Operations\n\nRefer to `docs/Operations/` for specific services.",
    'SECURITY.md': "# Security Policies\n\nFail2Ban, CSF, ModSecurity, and Laravel App Security.",
    'BACKUP.md': "# Backup Strategy\n\n1. MariaDB Dump\n2. Storage Backup\n3. VPS Snapshot",
    'RESTORE.md': "# Restore Procedures\n\nHow to restore the system from backups.",
    'DISASTER_RECOVERY.md': "# Disaster Recovery\n\nComplete VPS crash recovery procedures.",
    'TROUBLESHOOTING.md': "# Troubleshooting\n\nCommon issues and their resolutions.",
    'API_REFERENCE.md': "# API Reference\n\nScramble OpenAPI documentation endpoints.",
    'CONTRIBUTING.md': "# Contributing\n\nGuidelines for future developers.",
    'CODE_OF_CONDUCT.md': "# Code of Conduct\n\nGuidelines for interaction within the project."
};

const docsStructure = {
    'README.md': "# Documentation Index\n" + metadata + "\n\n## Sections\n1. [Architecture](Architecture/)\n2. [Infrastructure](Infrastructure/)\n3. [Deployment](Deployment/)\n4. [Operations](Operations/)\n5. [API](API/)\n6. [ADR](ADR/)",
    
    'ADR/ADR-001-Laravel-Selected.md': "# ADR-001: Laravel Selected\n\n**Status**: Accepted\n**Context**: Need a robust, headless backend.\n**Decision**: Use Laravel 11.",
    'ADR/ADR-002-NextJS-Selected.md': "# ADR-002: Next.js Selected\n\n**Status**: Accepted\n**Context**: Need SEO-friendly, dynamic frontend.\n**Decision**: Use Next.js 14 App Router.",
    'ADR/ADR-003-Redis-Selected.md': "# ADR-003: Redis Selected\n\n**Decision**: Use Redis for Cache, Queue, Sessions, Broadcast.",
    'ADR/ADR-004-OLS-Selected.md': "# ADR-004: OpenLiteSpeed Selected\n\n**Decision**: Use OpenLiteSpeed as primary reverse proxy over Apache.",
    'ADR/ADR-005-Search-Architecture.md': "# ADR-005: Search Architecture\n\n**Decision**: Meilisearch / Scout.",
    'ADR/ADR-006-Automation-Engine.md': "# ADR-006: Automation Engine\n\n**Decision**: Event-driven automation using Laravel Jobs and Listeners.",

    'Architecture/Backend.md': "# Backend Architecture\n\n```mermaid\ngraph TD\n    Router --> Controller\n    Controller --> Service\n    Service --> Repository\n    Repository --> Database\n```",
    'Architecture/Frontend.md': "# Frontend Architecture\n\n```mermaid\ngraph TD\n    Component --> ReactQuery\n    ReactQuery --> ApiClient\n    ApiClient --> LaravelAPI\n```",
    'Architecture/Database.md': "# Database Schema",
    'Architecture/Modules.md': "# Modular Architecture",
    'Architecture/Events.md': "# Event-Driven System\n\n```mermaid\ngraph LR\n    Event --> Listener\n    Listener --> JobQueue\n    JobQueue --> Execution\n```",

    'Backend/Laravel.md': "# Laravel Standards",
    'Backend/API.md': "# API Guidelines",
    'Backend/Services.md': "# Service Layer",
    'Backend/Repositories.md': "# Repository Pattern",

    'Frontend/NextJS.md': "# Next.js Implementation",
    'Frontend/ReactAdmin.md': "# React Admin Details",
    'Frontend/TanStack.md': "# TanStack Query Setup",
    'Frontend/Components.md': "# Component Library",

    'Deployment/Production.md': "# Production Deployment",
    'Deployment/Staging.md': "# Staging Deployment",
    'Deployment/Local.md': "# Local Environment",

    'Operations/Queues.md': "# Queue Management",
    'Operations/Cron.md': "# Cron Jobs",
    'Operations/Supervisor.md': "# Supervisor Configs",
    'Operations/PM2.md': "# PM2 Next.js Management",
    'Operations/Cloudflare.md': "# Cloudflare Setup",
    'Operations/Backups.md': "# Backup Routines",
    'Operations/Monitoring.md': "# Monitoring Stack",
    'Operations/Logging.md': "# Log Management",

    'Infrastructure/Redis.md': "# Redis Server",
    'Infrastructure/MariaDB.md': "# MariaDB Server",
    'Infrastructure/PHP84.md': "# PHP 8.4 (LSPHP)",
    'Infrastructure/WHM.md': "# WHM Configuration",
    'Infrastructure/OLS.md': "# OpenLiteSpeed Config",
    'Infrastructure/Apache.md': "# Apache Settings",
    'Infrastructure/SSL.md': "# SSL Certificates",

    'API/Authentication.md': "# Auth API",
    'API/CMS.md': "# CMS API",
    'API/Blog.md': "# Blog API",
    'API/Portfolio.md': "# Portfolio API",
    'API/CRM.md': "# CRM API",
    'API/Newsletter.md': "# Newsletter API",
    'API/Search.md': "# Search API",
    'API/Downloads.md': "# Downloads API",
    'API/Notifications.md': "# Notifications API",
    'API/Automation.md': "# Automation API",
    'API/Analytics.md': "# Analytics API",

    'Developer/CodingStandards.md': "# Coding Standards",
    'Developer/Release.md': "# Release Engineering",
    'Developer/Testing.md': "# Testing Protocols",

    'Contributing/README.md': "# Contribution Guide"
};

function createFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    if (fs.existsSync(filePath) && !FORCE) {
        console.log("Skipped (exists): " + filePath);
        return;
    }

    // Insert metadata for nested markdown files if they don't have it explicitly
    let finalContent = content;
    if (filePath.endsWith('.md') && !content.includes('---') && path.basename(filePath) !== 'README.md') {
        finalContent = metadata + "\n" + content;
    }

    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log("Created: " + filePath);
}

console.log('--- Scaffolding Enterprise Documentation ---');

// Root files
Object.keys(rootFiles).forEach(file => {
    createFile(path.join(process.cwd(), file), rootFiles[file]);
});

// Docs directory
Object.keys(docsStructure).forEach(file => {
    createFile(path.join(process.cwd(), 'docs', file), docsStructure[file]);
});

console.log('--- Documentation Scaffolding Complete ---');
