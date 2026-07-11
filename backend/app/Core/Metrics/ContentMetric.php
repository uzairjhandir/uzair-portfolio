<?php

namespace App\Core\Metrics;

use Illuminate\Database\Eloquent\Model;

class ContentMetric extends Model
{
    protected $fillable = [
        'measurable_type', 'measurable_id',
        'views', 'downloads', 'shares', 'favorites', 'conversions',
        'popularity_score', 'trending_at',
    ];

    protected $casts = [
        'trending_at' => 'datetime',
    ];

    public function measurable()
    {
        return $this->morphTo();
    }
}
