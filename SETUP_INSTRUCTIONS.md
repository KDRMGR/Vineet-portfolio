# Vineet Labdhe Portfolio - Setup Instructions

## Project Overview

This is a modern portfolio website for Vineet Labdhe, featuring:
- Dynamic content management through Supabase
- Admin dashboard for managing content and gallery images
- Authentication system for secure admin access
- Gallery pages for different photography categories
- Responsive design with smooth animations

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Routing**: React Router
- **Database & Auth**: Supabase
- **Icons**: Lucide React

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase project: https://vdkyezqasgzksftfopet.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the SQL script to create tables and insert default data

### 2. Create Admin User

1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click **Add User** (or **Invite User**)
3. Enter an email and password for the admin account
4. Confirm the user account

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5174 (or the port shown in terminal)

## Application Structure

### Public Pages
- **Home** (`/`) - Main portfolio page with all sections
- **Gallery Pages** (`/gallery/:category`) - Individual gallery pages for each category:
  - `/gallery/fashion` - Fashion & Lifestyle
  - `/gallery/concerts` - Concerts
  - `/gallery/corporate` - Corporate Events
  - `/gallery/people` - People & Places
  - `/gallery/nightlife` - Nightlife

### Admin Pages
- **Login** (`/login`) - Admin authentication
- **Dashboard** (`/admin`) - Content and gallery management (protected)

## Admin Dashboard Features

### Content Management
- Edit hero section (name, title, subtitle, tagline)
- Update about section paragraphs
- Modify contact information (email, phone, location, social links)
- Changes save automatically on blur

### Gallery Management
- Select category to manage
- Add new images (URL, title, description)
- Delete existing images
- Images display in order

## Database Schema

### Tables

#### `content`
Stores editable website text content
- `id`: UUID (primary key)
- `section`: Text (e.g., 'hero', 'about', 'contact')
- `key`: Text (e.g., 'name', 'email', 'paragraph1')
- `value`: Text (the actual content)
- `created_at`, `updated_at`: Timestamps

#### `gallery_images`
Stores gallery images for different categories
- `id`: UUID (primary key)
- `category`: Text (fashion, concerts, corporate, people, nightlife)
- `image_url`: Text (full URL to image)
- `title`: Text (optional)
- `description`: Text (optional)
- `order_index`: Integer (for sorting)
- `created_at`: Timestamp

## Default Credentials

After creating your admin user in Supabase, use those credentials to log in at `/login`.

Example:
- Email: admin@vineetlabdhe.com
- Password: [Your chosen password]

## Adding Images to Gallery

1. Log in to the admin dashboard at `/admin`
2. Go to **Gallery Management** tab
3. Select a category
4. Click **Add Image**
5. Enter:
   - Image URL (you can use Unsplash, Imgur, or upload to Supabase Storage)
   - Title (optional)
   - Description (optional)

## Updating Website Content

1. Log in to the admin dashboard at `/admin`
2. Go to **Content Management** tab
3. Edit any field by clicking into it
4. Changes save automatically when you click outside the field

## Security

- All admin routes are protected with authentication
- Row Level Security (RLS) is enabled on all tables
- Public can only read data
- Only authenticated users can modify data

## Deployment

For production deployment:
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Ensure environment variables are set if needed

## Support

For issues or questions, contact the developer.

## License

Private project - All rights reserved.
