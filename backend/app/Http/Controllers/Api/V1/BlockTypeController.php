<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Models\BlockType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlockTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $types = BlockType::where('status', 'active')->get();

        return response()->json([
            'success' => true,
            'data' => $types,
        ]);
    }

    public function show(string $uuid): JsonResponse
    {
        $type = BlockType::where('uuid', $uuid)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $type,
        ]);
    }
}
