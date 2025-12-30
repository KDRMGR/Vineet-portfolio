import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

interface ContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
}

interface GalleryImage {
  id: string;
  category: string;
  image_url: string;
  title: string | null;
  description: string | null;
  order_index: number;
}

interface UploadPreview {
  file: File | null;
  url: string;
  title: string;
  description: string;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'content' | 'gallery' | 'cinematography' | 'photography'>('content');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('fashion');
  const [message, setMessage] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<UploadPreview>({
    file: null,
    url: '',
    title: '',
    description: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { id: 'fashion', name: 'Fashion & Lifestyle' },
    { id: 'concerts', name: 'Concerts' },
    { id: 'corporate', name: 'Corporate Events' },
    { id: 'people', name: 'People & Places' },
    { id: 'nightlife', name: 'Nightlife' },
  ];

  const cinematographyCategories = [
    { id: 'commercials', name: 'Commercials' },
    { id: 'music-videos', name: 'Music Videos' },
    { id: 'documentaries', name: 'Documentaries' },
    { id: 'short-films', name: 'Short Films' },
  ];

  const photographyCategories = [
    { id: 'fashion', name: 'Fashion & Lifestyle' },
    { id: 'concerts', name: 'Concerts' },
    { id: 'corporate', name: 'Corporate Events' },
    { id: 'people', name: 'People & Places' },
    { id: 'nightlife', name: 'Nightlife' },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchContent();
    fetchGalleryImages();
  }, [user, selectedCategory]);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('section', { ascending: true });

    if (!error && data) {
      setContent(data);
    }
  };

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', selectedCategory)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setGalleryImages(data);
    }
  };

  const handleContentUpdate = async (id: string, value: string) => {
    const { error } = await supabase
      .from('content')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      setMessage('Error updating content');
    } else {
      setMessage('Content updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Error: File size must be less than 5MB');
      setTimeout(() => setMessage(''), 3000);
      event.target.value = '';
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setMessage('Error: Please upload an image or video file');
      setTimeout(() => setMessage(''), 3000);
      event.target.value = '';
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setUploadPreview({
      file,
      url: previewUrl,
      title: '',
      description: ''
    });
    setShowUploadModal(true);

    // Reset file input
    event.target.value = '';
  };

  const handleUploadSubmit = async () => {
    if (!uploadPreview.file) {
      setMessage('No file selected');
      return;
    }

    setIsUploading(true);
    setMessage('Uploading...');

    try {
      const fileExt = uploadPreview.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${selectedCategory}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, uploadPreview.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setMessage('Error uploading: ' + uploadError.message);
        setIsUploading(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase.from('gallery_images').insert({
        category: selectedCategory,
        image_url: publicUrl,
        title: uploadPreview.title || 'Untitled',
        description: uploadPreview.description || null,
        order_index: galleryImages.length,
      });

      if (dbError) {
        console.error('Database error:', dbError);
        setMessage('Error saving: ' + dbError.message);
        setIsUploading(false);
        return;
      }

      setMessage('Upload successful!');
      setShowUploadModal(false);
      setUploadPreview({ file: null, url: '', title: '', description: '' });
      fetchGalleryImages();

    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('Unexpected error occurred');
    }

    setIsUploading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancelUpload = () => {
    if (uploadPreview.url) {
      URL.revokeObjectURL(uploadPreview.url);
    }
    setShowUploadModal(false);
    setUploadPreview({ file: null, url: '', title: '', description: '' });
  };

  const handleAddImageUrl = () => {
    setUploadPreview({
      file: null,
      url: '',
      title: '',
      description: ''
    });
    setShowUploadModal(true);
  };

  const handleAddUrlSubmit = async () => {
    if (!uploadPreview.url.trim()) {
      setMessage('Please enter a URL');
      return;
    }

    setIsUploading(true);
    setMessage('Adding...');

    try {
      const { error } = await supabase.from('gallery_images').insert({
        category: selectedCategory,
        image_url: uploadPreview.url,
        title: uploadPreview.title || 'Untitled',
        description: uploadPreview.description || null,
        order_index: galleryImages.length,
      });

      if (error) {
        console.error('Database error:', error);
        setMessage('Error adding: ' + error.message);
        setIsUploading(false);
        return;
      }

      setMessage('Added successfully!');
      setShowUploadModal(false);
      setUploadPreview({ file: null, url: '', title: '', description: '' });
      fetchGalleryImages();

    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('Unexpected error occurred');
    }

    setIsUploading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const { error } = await supabase.from('gallery_images').delete().eq('id', id);

    if (error) {
      setMessage('Error deleting image');
    } else {
      setMessage('Image deleted successfully!');
      fetchGalleryImages();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider text-[#ff8c42]">
            Admin Dashboard
          </h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border-2 border-[#ff8c42] hover:bg-[#ff8c42] hover:text-black transition-all"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="uppercase tracking-wider text-xs sm:text-sm">Sign Out</span>
          </button>
        </div>
      </nav>

      {message && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-green-500/10 border-2 border-green-500 rounded p-4 text-green-500">
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'content'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Site Content
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Gallery (Homepage)
          </button>
          <button
            onClick={() => setActiveTab('cinematography')}
            className={`px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'cinematography'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Cinematography
          </button>
          <button
            onClick={() => setActiveTab('photography')}
            className={`px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'photography'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Photography
          </button>
        </div>

        {activeTab === 'content' && (
          <div className="space-y-8">
            {Object.entries(groupedContent).map(([section, items]) => (
              <div key={section} className="border-2 border-gray-800 p-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                  {section}
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id}>
                      <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                        {item.key}
                      </label>
                      {item.value.length > 100 ? (
                        <textarea
                          value={item.value}
                          onChange={(e) => {
                            const updated = content.map((c) =>
                              c.id === item.id ? { ...c, value: e.target.value } : c
                            );
                            setContent(updated);
                          }}
                          onBlur={(e) => handleContentUpdate(item.id, e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const updated = content.map((c) =>
                              c.id === item.id ? { ...c, value: e.target.value } : c
                            );
                            setContent(updated);
                          }}
                          onBlur={(e) => handleContentUpdate(item.id, e.target.value)}
                          className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider mb-4">
                Select Category
              </label>
              <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-3 border-2 uppercase tracking-wider transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#ff8c42] border-[#ff8c42] text-black'
                        : 'border-gray-700 hover:border-[#ff8c42]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 px-6 py-3 bg-[#ff8c42] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer">
                <ImageIcon className="w-5 h-5" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleAddImage}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#ff8c42] text-[#ff8c42] font-bold uppercase tracking-wider hover:bg-[#ff8c42] hover:text-black transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add URL
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="border-2 border-gray-800 p-4">
                  <div className="aspect-video relative overflow-hidden mb-4 bg-gray-900">
                    <img
                      src={image.image_url}
                      alt={image.title || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Title:</span> {image.title || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Description:</span>{' '}
                      {image.description || 'N/A'}
                    </p>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {galleryImages.length === 0 && (
              <div className="text-center py-20">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                <p className="text-gray-500 uppercase tracking-wider">
                  No images in this category yet
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cinematography' && (
          <div>
            <div className="mb-8 p-6 border-2 border-[#ff8c42] bg-[#ff8c42]/5">
              <h3 className="text-xl font-bold uppercase tracking-wider mb-3 text-[#ff8c42]">
                Cinematography Page Management
              </h3>
              <p className="text-gray-400 text-sm">
                Manage videos, reels, and cinematography projects. You can add YouTube/Vimeo embeds or video files.
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider mb-4">
                Select Category
              </label>
              <div className="flex flex-wrap gap-4">
                {cinematographyCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-3 border-2 uppercase tracking-wider transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#ff8c42] border-[#ff8c42] text-black'
                        : 'border-gray-700 hover:border-[#ff8c42]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 px-6 py-3 bg-[#ff8c42] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer">
                <ImageIcon className="w-5 h-5" />
                Upload Video/Image
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleAddImageUrl}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#ff8c42] text-[#ff8c42] font-bold uppercase tracking-wider hover:bg-[#ff8c42] hover:text-black transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Video URL
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="border-2 border-gray-800 p-4">
                  <div className="aspect-video relative overflow-hidden mb-4 bg-gray-900">
                    <img
                      src={image.image_url}
                      alt={image.title || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Title:</span> {image.title || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Description:</span>{' '}
                      {image.description || 'N/A'}
                    </p>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {galleryImages.length === 0 && (
              <div className="text-center py-20">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                <p className="text-gray-500 uppercase tracking-wider">
                  No content in this category yet
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photography' && (
          <div>
            <div className="mb-8 p-6 border-2 border-[#ff8c42] bg-[#ff8c42]/5">
              <h3 className="text-xl font-bold uppercase tracking-wider mb-3 text-[#ff8c42]">
                Photography Page Management
              </h3>
              <p className="text-gray-400 text-sm">
                Manage photography portfolio images for the dedicated photography page.
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider mb-4">
                Select Category
              </label>
              <div className="flex flex-wrap gap-4">
                {photographyCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-3 border-2 uppercase tracking-wider transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#ff8c42] border-[#ff8c42] text-black'
                        : 'border-gray-700 hover:border-[#ff8c42]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 px-6 py-3 bg-[#ff8c42] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer">
                <ImageIcon className="w-5 h-5" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleAddImage}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#ff8c42] text-[#ff8c42] font-bold uppercase tracking-wider hover:bg-[#ff8c42] hover:text-black transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add URL
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="border-2 border-gray-800 p-4">
                  <div className="aspect-video relative overflow-hidden mb-4 bg-gray-900">
                    <img
                      src={image.image_url}
                      alt={image.title || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Title:</span> {image.title || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Description:</span>{' '}
                      {image.description || 'N/A'}
                    </p>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {galleryImages.length === 0 && (
              <div className="text-center py-20">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                <p className="text-gray-500 uppercase tracking-wider">
                  No images in this category yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border-2 border-[#ff8c42] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                  {uploadPreview.file ? 'Upload' : 'Add'} {activeTab === 'cinematography' ? 'Video/Image' : 'Image'}
                </h2>

                {/* URL Input (only if no file selected) */}
                {!uploadPreview.file && (
                  <div className="mb-6">
                    <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                      Image/Video URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={uploadPreview.url}
                      onChange={(e) => setUploadPreview({ ...uploadPreview, url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#ff8c42] outline-none text-white"
                      required
                    />
                  </div>
                )}

                {/* Preview */}
                {(uploadPreview.file || uploadPreview.url) && (
                  <div className="mb-6">
                    <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                      Preview
                    </label>
                    <div className="aspect-video bg-black rounded overflow-hidden">
                      {uploadPreview.file?.type.startsWith('video/') || uploadPreview.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={uploadPreview.file ? uploadPreview.url : uploadPreview.url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={uploadPreview.file ? uploadPreview.url : uploadPreview.url}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="gray"%3ENo Preview%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      )}
                    </div>
                    {uploadPreview.file && (
                      <p className="text-xs text-gray-500 mt-2">
                        File: {uploadPreview.file.name} ({((uploadPreview.file.size || 0) / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                )}

                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadPreview.title}
                    onChange={(e) => setUploadPreview({ ...uploadPreview, title: e.target.value })}
                    placeholder="Enter title"
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#ff8c42] outline-none text-white"
                    required
                  />
                </div>

                {/* Description Input */}
                <div className="mb-6">
                  <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                    Description (Optional)
                  </label>
                  <textarea
                    value={uploadPreview.description}
                    onChange={(e) => setUploadPreview({ ...uploadPreview, description: e.target.value })}
                    placeholder="Enter description"
                    rows={4}
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#ff8c42] outline-none text-white resize-none"
                  />
                </div>

                {/* Category Info */}
                <div className="mb-6 p-4 bg-black/50 rounded">
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold text-white">Category:</span> {selectedCategory}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="font-semibold text-white">Section:</span> {activeTab}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleCancelUpload}
                    disabled={isUploading}
                    className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={uploadPreview.file ? handleUploadSubmit : handleAddUrlSubmit}
                    disabled={isUploading || !uploadPreview.title.trim() || (!uploadPreview.file && !uploadPreview.url.trim())}
                    className="flex-1 px-6 py-3 bg-[#ff8c42] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (uploadPreview.file ? 'Uploading...' : 'Adding...') : (uploadPreview.file ? 'Upload' : 'Add')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
