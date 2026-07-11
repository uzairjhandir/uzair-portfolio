# Installation Guide

## Requirements
* PHP 8.2+
* Composer
* MySQL 8.0+
* Redis
* Node.js & NPM (for frontend/SDK tools)

## Local Setup (Docker)
1. `git clone <repo>`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. `docker-compose up -d`
6. `php artisan migrate --seed`
