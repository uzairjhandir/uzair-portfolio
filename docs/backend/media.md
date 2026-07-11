# Spatie Media Library Architecture & Upload Flow

This document details the lifecycle of all media files managed within the Laravel Backend, utilizing `spatie/laravel-medialibrary`.

## Media Upload Flow

To prevent orphaned files, uploads use a multi-step Temporary Storage architecture.

1. **Upload Request**: Frontend uploads file to `/api/v1/media/upload`.
2. **Temporary Storage**: File is stored in a temporary directory or Spatie's `TemporaryUpload` model. It returns a temporary `uuid`.
3. **Attach to Model**: During entity creation (e.g., Blog Post `POST /api/v1/blogs`), the frontend sends `cover_image_uuid`.
4. **Processing (Queued)**:
   - Laravel attaches the file to the model.
   - Spatie triggers queued Image Conversions (Optimization, WebP generation, Responsive Images).
5. **Delete Temp**: The original temporary record is automatically cleaned up.

## Configured Collections
- **`hero`**: Homepage Hero section (Responsive WebP).
- **`blog`**: Blog post cover images and inline media.
- **`portfolio`**: Project thumbnails and deep gallery images.
- **`testimonials`**: Client avatars.
- **`avatars`**: Admin user profile pictures.
- **`logos`**: Client logos, Footer logos.
- **`documents`**: Resumes/CVs, Whitepapers, PDFs.

## Conversions
- Every raster image automatically generates a `.webp` variant.
- Responsive image sets are generated for `cover_images` and `gallery` out-of-the-box using Spatie's `withResponsiveImages()` method.

## Storage Disks & File Types
The system supports multiple disks transparently. Switching between them requires zero code changes, only `.env` updates.
- **Local** (`public` disk)
- **AWS S3** (`s3` disk)
- **Cloudflare R2** (S3 compatible driver)

### Supported File Types
- **Images**: JPEG, PNG, WEBP, GIF
- **Vector**: SVG (Icons, Logos)
- **Video**: MP4, WebM
- **Documents**: PDF, DOCX, XLSX
- **Archives**: ZIP
