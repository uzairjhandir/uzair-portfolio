<?php

namespace App\Core\Automation;

/**
 * Workflow Context
 * 
 * Represents the state variables passed along the edges of the workflow graph.
 * Nodes can read from this context to make decisions, and write to it 
 * to pass data to subsequent nodes.
 */
class WorkflowContext
{
    public function __construct(private array $variables = []) {}

    public function get(string $key, mixed $default = null): mixed
    {
        return array_key_exists($key, $this->variables) ? $this->variables[$key] : $default;
    }

    public function set(string $key, mixed $value): void
    {
        $this->variables[$key] = $value;
    }

    public function merge(array $variables): void
    {
        $this->variables = array_merge($this->variables, $variables);
    }

    public function toArray(): array
    {
        return $this->variables;
    }
}
