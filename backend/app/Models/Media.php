<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model; // Use Fallback model if Spatie isn't installed physically
// use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends Model // extends BaseMedia
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'folder_id',
        'model_type',
        'model_id',
        'collection_name',
        'name',
        'file_name',
        'mime_type',
        'disk',
        'conversions_disk',
        'size',
        'manipulations',
        'custom_properties',
        'generated_conversions',
        'responsive_images',
        'alt_text',
        'caption',
        'title',
        'description',
        'credits',
        'license',
        'focal_point',
        'dominant_color',
        'blur_placeholder',
        'width',
        'height',
        'duration',
        'status',
        'visibility',
        'checksum',
        'uploaded_by',
        'order_column',
    ];

    protected $casts = [
        'manipulations' => 'json',
        'custom_properties' => 'json',
        'generated_conversions' => 'json',
        'responsive_images' => 'json',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function folder()
    {
        return $this->belongsTo(MediaFolder::class, 'folder_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
