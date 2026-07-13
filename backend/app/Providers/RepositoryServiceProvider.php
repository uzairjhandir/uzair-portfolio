<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Auth / Users
use App\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;

// Media
use App\Interfaces\MediaRepositoryInterface;
use App\Repositories\MediaRepository;
use App\Interfaces\MediaFolderRepositoryInterface;
use App\Repositories\MediaFolderRepository;

// Pages
use App\Interfaces\PageRepositoryInterface;
use App\Repositories\PageRepository;

// Navigation
use App\Interfaces\NavigationRepositoryInterface;
use App\Repositories\NavigationRepository;

// Blocks
use App\Interfaces\BlockRepositoryInterface;
use App\Repositories\BlockRepository;

// Roles & Permissions
use App\Interfaces\RoleRepositoryInterface;
use App\Repositories\RoleRepository;
use App\Interfaces\PermissionRepositoryInterface;
use App\Repositories\PermissionRepository;

// Settings
use App\Interfaces\SettingRepositoryInterface;
use App\Repositories\SettingRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $bindings = [
            UserRepositoryInterface::class       => UserRepository::class,
            MediaRepositoryInterface::class      => MediaRepository::class,
            MediaFolderRepositoryInterface::class => MediaFolderRepository::class,
            PageRepositoryInterface::class       => PageRepository::class,
            NavigationRepositoryInterface::class => NavigationRepository::class,
            BlockRepositoryInterface::class      => BlockRepository::class,
            RoleRepositoryInterface::class       => RoleRepository::class,
            PermissionRepositoryInterface::class => PermissionRepository::class,
            SettingRepositoryInterface::class    => SettingRepository::class,
        ];

        foreach ($bindings as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }
}
