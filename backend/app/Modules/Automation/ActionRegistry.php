<?php

namespace App\Modules\Automation;

use App\Modules\Automation\Contracts\AutomationActionInterface;

class ActionRegistry
{
    /** @var array<string, AutomationActionInterface> */
    private array $actions = [];

    public function register(AutomationActionInterface $action): void
    {
        $this->actions[$action->type()] = $action;
    }

    public function get(string $type): AutomationActionInterface
    {
        if (!isset($this->actions[$type])) {
            throw new \InvalidArgumentException("Automation Action [{$type}] is not registered.");
        }
        return $this->actions[$type];
    }
    
    public function getRegisteredActions(): array
    {
        return array_keys($this->actions);
    }
}
