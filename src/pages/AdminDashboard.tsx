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

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'content' | 'gallery' | 'cinematography' | 'photography' | 'pages'>('content');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('fashion');
  const [message, setMessage] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState({
    file: null as File | null,
    url: '',
    title: '',
    description: ''
  });
  const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'contact' | 'photography' | 'cinematography'>('home');
  const [pageMedia, setPageMedia] = useState<Record<string, GalleryImage | null>>({});
  const [pageMediaDraft, setPageMediaDraft] = useState({ category: '', url: '', file: null as File | null });
  const [showPageMediaModal, setShowPageMediaModal] = useState(false);

  const categories = [
    { id: 'fashion', name: 'Fashion & Lifestyle' },
    { id: 'concerts', name: 'Concerts' },
    { id: 'corporate', name: 'Corporate Events' },
    { id: 'people', name: 'People & Places' },
    { id: 'nightlife', name: 'Nightlife' },
    { id: 'wedding', name: "Wedding & Others" },
  ];

  const cinematographyCategories = [
    { id: 'corporate', name: 'Corporate Events' },
    { id: 'concerts', name: 'Concerts' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'events', name: 'Events' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'live', name: 'Live Shows' },
  ];

  const photographyCategories = [
    { id: 'fashion', name: 'Fashion & Lifestyle' },
    { id: 'people', name: 'People & Places' },
    { id: 'concerts', name: 'Concerts' },
    { id: 'corporate', name: 'Corporate Events' },
    { id: 'nightlife', name: 'Nightlife' },
    { id: 'wedding', name: "Wedding & Others" },
  ];

  const pageContentFields: Record<
    typeof selectedPage,
    { section: string; fields: Array<{ key: string; label: string; multiline?: boolean }> }
  > = {
    home: {
      section: 'hero',
      fields: [
        { key: 'name', label: 'Hero Name' },
        { key: 'subtitle', label: 'Hero Subtitle' },
        { key: 'tagline', label: 'Hero Tagline' },
      ],
    },
    about: {
      section: 'about',
      fields: [
        { key: 'heading', label: 'About Heading' },
        { key: 'paragraph1', label: 'About Paragraph 1', multiline: true },
        { key: 'paragraph2', label: 'About Paragraph 2', multiline: true },
      ],
    },
    contact: {
      section: 'contact',
      fields: [
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'location', label: 'Location' },
        { key: 'instagram', label: 'Instagram URL' },
        { key: 'linkedin', label: 'LinkedIn URL' },
      ],
    },
    photography: {
      section: 'photography',
      fields: [
        { key: 'heading', label: 'Photography Heading' },
        { key: 'subheading', label: 'Photography Subheading' },
      ],
    },
    cinematography: {
      section: 'cinematography',
      fields: [
        { key: 'heading', label: 'Cinematography Heading' },
        { key: 'subheading', label: 'Cinematography Subheading' },
      ],
    },
  };

  const pageMediaSlots: Record<
    typeof selectedPage,
    Array<{ category: string; label: string; accept: string }>
  > = {
    home: [
      { category: 'home-hero-bg', label: 'Home Hero Background (image/video)', accept: 'image/*,video/*' },
      { category: 'home-hero-portrait', label: 'Home Hero Portrait (image)', accept: 'image/*' },
    ],
    about: [{ category: 'about-image', label: 'About Image (image)', accept: 'image/*' }],
    contact: [
      { category: 'contact-hero-main', label: 'Contact Hero Main Image (image)', accept: 'image/*' },
      { category: 'contact-hero-secondary-1', label: 'Contact Hero Secondary 1 (image)', accept: 'image/*' },
      { category: 'contact-hero-secondary-2', label: 'Contact Hero Secondary 2 (image)', accept: 'image/*' },
    ],
    photography: [{ category: 'hero-photography', label: 'Photography Hero (image/video)', accept: 'image/*,video/*' }],
    cinematography: [{ category: 'hero-cinematography', label: 'Cinematography Hero (video)', accept: 'video/*' }],
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchContent();
    if (activeTab === 'gallery' || activeTab === 'cinematography' || activeTab === 'photography') {
      fetchGalleryImages();
    }
    if (activeTab === 'pages') {
      fetchPageMedia();
    }
  }, [user, selectedCategory, activeTab, selectedPage]);

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

  const fetchPageMedia = async () => {
    const categoriesToFetch = pageMediaSlots[selectedPage].map((slot) => slot.category);
    if (categoriesToFetch.length === 0) {
      setPageMedia({});
      return;
    }

    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .in('category', categoriesToFetch)
      .order('order_index', { ascending: true });

    if (error) {
      setMessage('Error loading page media');
      return;
    }

    const next: Record<string, GalleryImage | null> = {};
    for (const cat of categoriesToFetch) next[cat] = null;
    for (const row of data || []) {
      if (!next[row.category]) {
        next[row.category] = row;
      }
    }
    setPageMedia(next);
  };

  const getContentValue = (section: string, key: string) => {
    return content.find((item) => item.section === section && item.key === key)?.value || '';
  };

  const upsertContentValue = async (section: string, key: string, value: string) => {
    const { error } = await supabase
      .from('content')
      .upsert(
        {
          section,
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section,key' }
      );

    if (error) {
      setMessage('Error updating content');
      return;
    }

    setMessage('Content updated successfully!');
    setTimeout(() => setMessage(''), 3000);
    fetchContent();
  };

  const MEDIA_BUCKET = 'media';

  const uploadToStorage = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${folder}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const upsertPageMediaUrl = async (category: string, imageUrl: string) => {
    const existing = pageMedia[category];

    const payload = {
      category,
      image_url: imageUrl,
      title: category,
      description: null,
      order_index: 0,
    };

    const { error } = existing?.id
      ? await supabase.from('gallery_images').update(payload).eq('id', existing.id)
      : await supabase.from('gallery_images').insert(payload);

    if (error) {
      setMessage('Error updating media');
      return;
    }

    setMessage('Media updated successfully!');
    setTimeout(() => setMessage(''), 3000);
    fetchPageMedia();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadPreview({ ...uploadPreview, file, url });
      setShowUploadModal(true);
    }
  };

  const handleAddImageUrl = () => {
    setUploadPreview({ file: null, url: '', title: '', description: '' });
    setShowUploadModal(true);
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setUploadPreview({ file: null, url: '', title: '', description: '' });
  };

  const handleUploadSubmit = async () => {
    if (!uploadPreview.title.trim() || !uploadPreview.file) return;

    setIsUploading(true);

    try {
      const mediaUrl = await uploadToStorage(uploadPreview.file, selectedCategory);

      const { error } = await supabase.from('gallery_images').insert({
        category: selectedCategory,
        image_url: mediaUrl,
        title: uploadPreview.title.trim(),
        description: uploadPreview.description.trim() || null,
        order_index: galleryImages.length,
      });

      if (error) {
        setMessage('Error adding media');
      } else {
        setMessage('Media added successfully!');
        fetchGalleryImages();
        setShowUploadModal(false);
        setUploadPreview({ file: null, url: '', title: '', description: '' });
      }
    } catch {
      setMessage('Error uploading file (check Supabase Storage bucket)');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrlSubmit = async () => {
    if (!uploadPreview.title.trim() || !uploadPreview.url.trim()) return;

    setIsUploading(true);
    
    const { error } = await supabase.from('gallery_images').insert({
      category: selectedCategory,
      image_url: uploadPreview.url.trim(),
      title: uploadPreview.title.trim(),
      description: uploadPreview.description.trim() || null,
      order_index: galleryImages.length,
    });

    if (error) {
      setMessage('Error adding image');
    } else {
      setMessage('Image added successfully!');
      fetchGalleryImages();
      setShowUploadModal(false);
      setUploadPreview({ file: null, url: '', title: '', description: '' });
    }
    
    setIsUploading(false);
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
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-[#ff8c42]">
            Admin Dashboard
          </h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[#ff8c42] hover:bg-[#ff8c42] hover:text-black transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="uppercase tracking-wider text-sm">Sign Out</span>
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
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'content'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Content Management
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'pages'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Page Editor
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'gallery'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Gallery Management
          </button>
          <button
            onClick={() => setActiveTab('cinematography')}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'cinematography'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Cinematography
          </button>
          <button
            onClick={() => setActiveTab('photography')}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
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

        {activeTab === 'pages' && (
          <div className="space-y-10">
            <div className="border-2 border-gray-800 p-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                Select Page
              </h2>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'home', name: 'Home' },
                  { id: 'about', name: 'About' },
                  { id: 'photography', name: 'Photography' },
                  { id: 'cinematography', name: 'Cinematography' },
                  { id: 'contact', name: 'Contact' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPage(p.id as typeof selectedPage)}
                    className={`px-6 py-3 border-2 uppercase tracking-wider transition-all ${
                      selectedPage === p.id
                        ? 'bg-[#ff8c42] border-[#ff8c42] text-black'
                        : 'border-gray-700 hover:border-[#ff8c42]'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-2 border-gray-800 p-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                Page Content
              </h2>
              <div className="space-y-5">
                {pageContentFields[selectedPage].fields.map((field) => (
                  <div key={`${selectedPage}-${field.key}`}>
                    <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        defaultValue={getContentValue(pageContentFields[selectedPage].section, field.key)}
                        onBlur={(e) =>
                          upsertContentValue(pageContentFields[selectedPage].section, field.key, e.target.value)
                        }
                        rows={5}
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        defaultValue={getContentValue(pageContentFields[selectedPage].section, field.key)}
                        onBlur={(e) =>
                          upsertContentValue(pageContentFields[selectedPage].section, field.key, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-gray-800 p-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                Page Media
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pageMediaSlots[selectedPage].map((slot) => {
                  const current = pageMedia[slot.category];
                  const url = current?.image_url || '';
                  return (
                    <div key={slot.category} className="border-2 border-gray-800 p-4">
                      <div className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                        {slot.label}
                      </div>
                      <div className="aspect-video bg-black mb-4 overflow-hidden">
                        {url ? (
                          url.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={url} controls className="w-full h-full object-cover" />
                          ) : (
                            <img src={url} alt={slot.label} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 uppercase tracking-wider text-sm">
                            No Media
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setPageMediaDraft({ category: slot.category, url: url || '', file: null });
                            setShowPageMediaModal(true);
                          }}
                          className="flex-1 px-4 py-2 border-2 border-[#ff8c42] text-[#ff8c42] font-bold uppercase tracking-wider hover:bg-[#ff8c42] hover:text-black transition-colors"
                        >
                          Change
                        </button>
                        {url && (
                          <button
                            onClick={async () => {
                              const existing = pageMedia[slot.category];
                              if (!existing?.id) return;
                              const { error } = await supabase.from('gallery_images').delete().eq('id', existing.id);
                              if (error) {
                                setMessage('Error deleting media');
                                return;
                              }
                              setMessage('Media removed successfully!');
                              setTimeout(() => setMessage(''), 3000);
                              fetchPageMedia();
                            }}
                            className="px-4 py-2 border-2 border-red-500 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'gallery' || activeTab === 'cinematography' || activeTab === 'photography') && (
          <div>
            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider mb-4">
                Select Category
              </label>
              <div className="flex flex-wrap gap-4">
                {(activeTab === 'cinematography' ? cinematographyCategories : activeTab === 'photography' ? photographyCategories : categories).map((cat) => (
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
                Upload {activeTab === 'cinematography' ? 'Video/Image' : 'Image'}
                <input
                  type="file"
                  accept={activeTab === 'cinematography' ? 'image/*,video/*' : 'image/*'}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleAddImageUrl}
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
                    {image.image_url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={image.image_url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={image.image_url}
                        alt={image.title || ''}
                        className="w-full h-full object-cover"
                      />
                    )}
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

        {showPageMediaModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border-2 border-[#ff8c42] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                  Update Media
                </h2>

                <div className="mb-6">
                  <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                    Media URL
                  </label>
                  <input
                    type="url"
                    value={pageMediaDraft.url}
                    onChange={(e) => setPageMediaDraft({ ...pageMediaDraft, url: e.target.value })}
                    placeholder="https://example.com/file.jpg"
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#ff8c42] outline-none text-white"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                    Upload File
                  </label>
                  <input
                    type="file"
                    accept={pageMediaSlots[selectedPage].find((s) => s.category === pageMediaDraft.category)?.accept || 'image/*'}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setPageMediaDraft({ ...pageMediaDraft, file });
                    }}
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#ff8c42] outline-none text-white"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowPageMediaModal(false);
                      setPageMediaDraft({ category: '', url: '', file: null });
                    }}
                    disabled={isUploading}
                    className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!pageMediaDraft.category) return;
                      if (!pageMediaDraft.file && !pageMediaDraft.url.trim()) return;

                      setIsUploading(true);
                      try {
                        const url = pageMediaDraft.file
                          ? await uploadToStorage(pageMediaDraft.file, pageMediaDraft.category)
                          : pageMediaDraft.url.trim();
                        await upsertPageMediaUrl(pageMediaDraft.category, url);
                        setShowPageMediaModal(false);
                        setPageMediaDraft({ category: '', url: '', file: null });
                      } catch {
                        setMessage('Error uploading file (check Supabase Storage bucket)');
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                    disabled={isUploading || (!pageMediaDraft.file && !pageMediaDraft.url.trim())}
                    className="flex-1 px-6 py-3 bg-[#ff8c42] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
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
                      {activeTab === 'cinematography' ? 'Image/Video URL' : 'Image URL'} <span className="text-red-500">*</span>
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
