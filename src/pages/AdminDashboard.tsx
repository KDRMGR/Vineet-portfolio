import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, LayoutType, publishCmsUpdate } from '../lib/supabase';
import { LogOut, Trash2, Plus, Image as ImageIcon, Layout, Save, Eye, Pencil, ArrowUp, ArrowDown } from 'lucide-react';

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

interface CategoryItem {
  id: string;
  name: string;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'content' | 'gallery' | 'cinematography' | 'photography' | 'pages' | 'media'
  >('content');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryDraft, setGalleryDraft] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('fashion');
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('grid');
  const [layoutDraft, setLayoutDraft] = useState<LayoutType>('grid');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [contentDraft, setContentDraft] = useState<Record<string, string>>({});
  const [contentOriginal, setContentOriginal] = useState<Record<string, string>>({});
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
  const [siteMedia, setSiteMedia] = useState<Record<string, GalleryImage | null>>({});
  const [pageMediaDraft, setPageMediaDraft] = useState({ category: '', url: '', file: null as File | null });
  const [showPageMediaModal, setShowPageMediaModal] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [imageEditDraft, setImageEditDraft] = useState({ title: '', description: '' });
  const [draggingImageId, setDraggingImageId] = useState<string | null>(null);
  const [galleryOrderMode, setGalleryOrderMode] = useState<'manual' | 'reverse' | 'title_asc' | 'title_desc'>('manual');
  const [newCategoryDraft, setNewCategoryDraft] = useState({ id: '', name: '' });

  const categories = [
    { id: 'fashion', name: 'Fashion & Lifestyle' },
    { id: 'concerts', name: 'Concerts' },
    { id: 'corporate', name: 'Corporate Events' },
    { id: 'people', name: 'People & Places' },
    { id: 'nightlife', name: 'Nightlife' },
    { id: 'wedding', name: "Wedding & Others" },
  ];

  const defaultCinematographyCategories: CategoryItem[] = [
    { id: 'cinematography-highlight-reels', name: 'Highlight Reels' },
    { id: 'cinematography-wedding-social-media', name: 'Wedding Social Media' },
    { id: 'cinematography-short-films', name: 'Short Films' },
    { id: 'cinematography-social-media-event-decor', name: 'Social Media Event Decor' },
    { id: 'cinematography-tata-marathon', name: 'Tata Marathon' },
    { id: 'cinematography-starbucks', name: 'Starbucks' },
    { id: 'cinematography-others', name: 'Others' },
    { id: 'corporate', name: 'Corporate Events' },
    { id: 'concerts', name: 'Concerts' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'events', name: 'Events' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'live', name: 'Live Shows' },
  ];

  const defaultPhotographyCategories: CategoryItem[] = [
    { id: 'photography-entertainment', name: 'Entertainment' },
    { id: 'photography-events', name: 'Events' },
    { id: 'photography-street', name: 'Street Photography' },
    { id: 'photography-product', name: 'Product Photography' },
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
    cinematography: [{ category: 'hero-cinematography', label: 'Cinematography Hero (image/video)', accept: 'image/*,video/*' }],
  };

  const siteMediaSlots: Array<{ category: string; label: string; accept: string }> = [
    { category: 'home-hero-bg', label: 'Home Hero Background (image/video)', accept: 'image/*,video/*' },
    { category: 'home-hero-portrait', label: 'Home Hero Portrait (image)', accept: 'image/*' },
    { category: 'about-image', label: 'Home About Image (image)', accept: 'image/*' },
    { category: 'contact-hero-main', label: 'Contact Hero Main Image (image)', accept: 'image/*' },
    { category: 'contact-hero-secondary-1', label: 'Contact Hero Secondary 1 (image)', accept: 'image/*' },
    { category: 'contact-hero-secondary-2', label: 'Contact Hero Secondary 2 (image)', accept: 'image/*' },
    { category: 'hero-photography', label: 'Photography Page Hero (image/video)', accept: 'image/*,video/*' },
    { category: 'hero-cinematography', label: 'Cinematography Page Hero (image/video)', accept: 'image/*,video/*' },
  ];

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3000);
  };

  const getAcceptForCategory = (category: string) => {
    for (const slots of Object.values(pageMediaSlots)) {
      const slot = slots.find((s) => s.category === category);
      if (slot) return slot.accept;
    }
    const siteSlot = siteMediaSlots.find((s) => s.category === category);
    return siteSlot?.accept || 'image/*';
  };

  const contentKey = (section: string, key: string) => `${section}:${key}`;

  const safeParseCategoryList = (raw: string | undefined, fallback: CategoryItem[]) => {
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return fallback;
      const next: CategoryItem[] = [];
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue;
        const maybe = item as { id?: unknown; name?: unknown };
        if (typeof maybe.id !== 'string' || typeof maybe.name !== 'string') continue;
        const id = maybe.id.trim();
        const name = maybe.name.trim();
        if (!id || !name) continue;
        next.push({ id, name });
      }
      return next.length ? next : fallback;
    } catch {
      return fallback;
    }
  };

  const categoriesKeyForSection = (section: 'photography' | 'cinematography') => contentKey(section, 'categories');

  const getCategoriesForSection = (section: 'photography' | 'cinematography') => {
    const fallback = section === 'photography' ? defaultPhotographyCategories : defaultCinematographyCategories;
    return safeParseCategoryList(contentDraft[categoriesKeyForSection(section)], fallback);
  };

  const setCategoriesForSection = (section: 'photography' | 'cinematography', next: CategoryItem[]) => {
    const key = categoriesKeyForSection(section);
    setContentDraft((prev) => ({ ...prev, [key]: JSON.stringify(next) }));
    setHasUnsavedChanges(true);
  };

  const addCategoryToSection = (section: 'photography' | 'cinematography') => {
    const id = newCategoryDraft.id.trim();
    const name = newCategoryDraft.name.trim();
    if (!id || !name) return;
    const current = getCategoriesForSection(section);
    if (current.some((c) => c.id === id)) {
      showToast('error', 'Category id already exists');
      return;
    }
    setCategoriesForSection(section, [...current, { id, name }]);
    setNewCategoryDraft({ id: '', name: '' });
  };

  const renameCategoryInSection = (section: 'photography' | 'cinematography', id: string, nextName: string) => {
    const name = nextName;
    const current = getCategoriesForSection(section);
    const next = current.map((c) => (c.id === id ? { ...c, name } : c));
    setCategoriesForSection(section, next);
  };

  const moveCategoryInSection = (section: 'photography' | 'cinematography', id: string, dir: -1 | 1) => {
    const current = getCategoriesForSection(section);
    const fromIdx = current.findIndex((c) => c.id === id);
    if (fromIdx === -1) return;
    const toIdx = fromIdx + dir;
    if (toIdx < 0 || toIdx >= current.length) return;
    const next = [...current];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setCategoriesForSection(section, next);
  };

  const deleteCategoryInSection = (section: 'photography' | 'cinematography', id: string) => {
    const ok = confirm('Remove this category from the page? Existing media will not be deleted.');
    if (!ok) return;
    const current = getCategoriesForSection(section);
    const next = current.filter((c) => c.id !== id);
    setCategoriesForSection(section, next);
    if (selectedCategory === id) {
      const first = next[0]?.id;
      if (first) setSelectedCategory(first);
    }
  };

  const resetDrafts = () => {
    setContentDraft(contentOriginal);
    setGalleryDraft(galleryImages);
    setLayoutDraft(currentLayout);
    setHasUnsavedChanges(false);
  };

  const guardUnsaved = (next: () => void) => {
    if (!hasUnsavedChanges) return next();
    const ok = confirm('You have unsaved changes. Discard them?');
    if (!ok) return;
    resetDrafts();
    next();
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!user) return;
    if (
      activeTab === 'content' ||
      activeTab === 'pages' ||
      activeTab === 'media' ||
      activeTab === 'photography' ||
      activeTab === 'cinematography'
    ) {
      fetchContent();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'gallery' || activeTab === 'cinematography' || activeTab === 'photography') {
      fetchGalleryImages();
      fetchGalleryLayout();
    }
  }, [user, activeTab, selectedCategory]);

  const photographyCategories = getCategoriesForSection('photography');
  const cinematographyCategories = getCategoriesForSection('cinematography');

  useEffect(() => {
    setNewCategoryDraft({ id: '', name: '' });
  }, [activeTab]);

  useEffect(() => {
    const options =
      activeTab === 'cinematography' ? cinematographyCategories : activeTab === 'photography' ? photographyCategories : categories;
    if (!options.some((c) => c.id === selectedCategory)) {
      const next = options[0]?.id;
      if (next) setSelectedCategory(next);
    }
  }, [activeTab, cinematographyCategories, photographyCategories, selectedCategory]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'pages') {
      fetchPageMedia();
    }
  }, [user, activeTab, selectedPage]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'media') {
      fetchSiteMedia();
    }
  }, [user, activeTab]);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('section', { ascending: true });

    if (!error && data) {
      setContent(data);
      const next: Record<string, string> = {};
      for (const row of data) {
        next[contentKey(row.section, row.key)] = row.value;
      }
      setContentDraft(next);
      setContentOriginal(next);
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
      setGalleryDraft(data);
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
      showToast('error', 'Error loading page media');
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

  const fetchSiteMedia = async () => {
    const categoriesToFetch = siteMediaSlots.map((slot) => slot.category);
    if (categoriesToFetch.length === 0) {
      setSiteMedia({});
      return;
    }

    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .in('category', categoriesToFetch)
      .order('order_index', { ascending: true });

    if (error) {
      showToast('error', 'Error loading site media');
      return;
    }

    const next: Record<string, GalleryImage | null> = {};
    for (const cat of categoriesToFetch) next[cat] = null;
    for (const row of data || []) {
      if (!next[row.category]) next[row.category] = row;
    }
    setSiteMedia(next);
  };

  const fetchGalleryLayout = async () => {
    const { data, error } = await supabase
      .from('gallery_settings')
      .select('layout_type')
      .eq('category', selectedCategory)
      .single();

    if (!error && data) {
      const layout = data.layout_type as LayoutType;
      setCurrentLayout(layout);
      setLayoutDraft(layout);
    } else {
      setCurrentLayout('grid');
      setLayoutDraft('grid');
    }
  };

  const MEDIA_BUCKET = 'media';

  const uploadToStorage = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${folder}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const uploadOptions: { upsert: boolean; contentType?: string } = { upsert: true };
    if (file.type) uploadOptions.contentType = file.type;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, uploadOptions);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const upsertPageMediaUrl = async (category: string, imageUrl: string) => {
    const existing = pageMedia[category] || siteMedia[category];

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
      showToast('error', 'Error updating media');
      return;
    }

    showToast('success', 'Media updated successfully!');
    publishCmsUpdate();
    fetchPageMedia();
    fetchSiteMedia();
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
    if (!uploadPreview.file) return;

    setIsUploading(true);

    try {
      const mediaUrl = await uploadToStorage(uploadPreview.file, selectedCategory);

      const { error } = await supabase.from('gallery_images').insert({
        category: selectedCategory,
        image_url: mediaUrl,
        title: uploadPreview.title.trim() || null,
        description: uploadPreview.description.trim() || null,
        order_index: galleryImages.length,
      });

      if (error) {
        showToast('error', 'Error adding media');
      } else {
        showToast('success', 'Media added successfully!');
        publishCmsUpdate();
        fetchGalleryImages();
        setShowUploadModal(false);
        setUploadPreview({ file: null, url: '', title: '', description: '' });
      }
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? ((err as { message?: string }).message ?? 'Upload failed')
            : 'Upload failed';
      showToast('error', message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrlSubmit = async () => {
    if (!uploadPreview.url.trim()) return;

    setIsUploading(true);
    
    const { error } = await supabase.from('gallery_images').insert({
      category: selectedCategory,
      image_url: uploadPreview.url.trim(),
      title: uploadPreview.title.trim() || null,
      description: uploadPreview.description.trim() || null,
      order_index: galleryImages.length,
    });

    if (error) {
      showToast('error', 'Error adding image');
    } else {
      showToast('success', 'Image added successfully!');
      publishCmsUpdate();
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
      showToast('error', 'Error deleting image');
    } else {
      showToast('success', 'Image deleted successfully!');
      publishCmsUpdate();
      fetchGalleryImages();
    }
  };

  const normalizeGalleryOrder = (items: GalleryImage[]) => {
    return items.map((item, idx) => ({ ...item, order_index: idx }));
  };

  const applyGalleryOrder = (items: GalleryImage[]) => {
    setGalleryDraft(normalizeGalleryOrder(items));
    setHasUnsavedChanges(true);
  };

  const moveGalleryItem = (id: string, direction: -1 | 1) => {
    const fromIdx = galleryDraft.findIndex((g) => g.id === id);
    if (fromIdx === -1) return;
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= galleryDraft.length) return;
    const next = [...galleryDraft];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    applyGalleryOrder(next);
    setGalleryOrderMode('manual');
  };

  const openImageEditor = (id: string) => {
    const img = galleryDraft.find((g) => g.id === id);
    if (!img) return;
    setEditingImageId(id);
    setImageEditDraft({ title: img.title || '', description: img.description || '' });
  };

  const applyImageEdits = () => {
    if (!editingImageId) return;
    setGalleryDraft((prev) =>
      prev.map((img) =>
        img.id === editingImageId
          ? {
              ...img,
              title: imageEditDraft.title.trim() || null,
              description: imageEditDraft.description.trim() || null,
            }
          : img
      )
    );
    setHasUnsavedChanges(true);
    setEditingImageId(null);
  };

  const saveGalleryChanges = async () => {
    setIsSaving(true);
    try {
      const originalById = new Map(galleryImages.map((img) => [img.id, img]));
      const updates = galleryDraft.filter((img) => {
        const original = originalById.get(img.id);
        if (!original) return true;
        return (
          original.order_index !== img.order_index ||
          (original.title || '') !== (img.title || '') ||
          (original.description || '') !== (img.description || '')
        );
      });

      for (const img of updates) {
        const { error } = await supabase
          .from('gallery_images')
          .update({
            title: img.title,
            description: img.description,
            order_index: img.order_index,
          })
          .eq('id', img.id);
        if (error) {
          showToast('error', 'Error saving gallery changes');
          return;
        }
      }

      if (layoutDraft !== currentLayout) {
        const { error } = await supabase
          .from('gallery_settings')
          .upsert(
            {
              category: selectedCategory,
              layout_type: layoutDraft,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'category' }
          );
        if (error) {
          showToast('error', 'Error saving layout');
          return;
        }
        setCurrentLayout(layoutDraft);
      }

      const contentUpdates = Object.entries(contentDraft).filter(
        ([key, value]) => (value ?? '') !== (contentOriginal[key] ?? '')
      );
      if (contentUpdates.length > 0) {
        const updated_at = new Date().toISOString();
        const payload = contentUpdates
          .map(([compound, value]) => {
            const idx = compound.indexOf(':');
            if (idx <= 0) return null;
            const section = compound.slice(0, idx);
            const key = compound.slice(idx + 1);
            if (!section || !key) return null;
            return { section, key, value: value ?? '', updated_at };
          })
          .filter(Boolean) as Array<{ section: string; key: string; value: string; updated_at: string }>;

        if (payload.length > 0) {
          const { error } = await supabase.from('content').upsert(payload, { onConflict: 'section,key' });
          if (error) {
            showToast('error', 'Error saving content');
            return;
          }
        }
      }

      showToast('success', 'Changes saved successfully');
      publishCmsUpdate();
      setHasUnsavedChanges(false);
      fetchGalleryImages();
      fetchGalleryLayout();
      fetchContent();
    } finally {
      setIsSaving(false);
    }
  };

  const saveContentChanges = async () => {
    setIsSaving(true);
    try {
      const updates = Object.entries(contentDraft).filter(
        ([key, value]) => (value ?? '') !== (contentOriginal[key] ?? '')
      );

      if (updates.length === 0) {
        setHasUnsavedChanges(false);
        return;
      }

      const updated_at = new Date().toISOString();
      const payload = updates
        .map(([compound, value]) => {
          const idx = compound.indexOf(':');
          if (idx <= 0) return null;
          const section = compound.slice(0, idx);
          const key = compound.slice(idx + 1);
          if (!section || !key) return null;
          return { section, key, value: value ?? '', updated_at };
        })
        .filter(Boolean) as Array<{ section: string; key: string; value: string; updated_at: string }>;

      if (payload.length === 0) {
        setHasUnsavedChanges(false);
        return;
      }

      const { error } = await supabase.from('content').upsert(payload, { onConflict: 'section,key' });
      if (error) {
        showToast('error', 'Error saving content');
        return;
      }

      showToast('success', 'Changes saved successfully');
      publishCmsUpdate();
      setHasUnsavedChanges(false);
      fetchContent();
    } finally {
      setIsSaving(false);
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (hasUnsavedChanges) {
                  showToast('error', 'Save changes before preview');
                  return;
                }
                window.open(`/?preview=${Date.now()}`, '_blank', 'noopener,noreferrer');
              }}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-600 hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all"
            >
              <Eye className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">Preview</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#ff8c42] hover:bg-[#ff8c42] hover:text-black transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {toast && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div
            className={`border-2 rounded p-4 ${
              toast.type === 'success'
                ? 'bg-green-500/10 border-green-500 text-green-500'
                : 'bg-red-500/10 border-red-500 text-red-500'
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => guardUnsaved(() => setActiveTab('content'))}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'content'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Content Management
          </button>
          <button
            onClick={() => guardUnsaved(() => setActiveTab('pages'))}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'pages'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Page Editor
          </button>
          <button
            onClick={() => guardUnsaved(() => setActiveTab('media'))}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'media'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Media
          </button>
          <button
            onClick={() => guardUnsaved(() => setActiveTab('gallery'))}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'gallery'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Gallery Management
          </button>
          <button
            onClick={() => guardUnsaved(() => setActiveTab('cinematography'))}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'cinematography'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Cinematography
          </button>
          <button
            onClick={() => guardUnsaved(() => setActiveTab('photography'))}
            className={`px-6 py-3 uppercase tracking-wider font-semibold transition-colors ${
              activeTab === 'photography'
                ? 'text-[#ff8c42] border-b-2 border-[#ff8c42]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Photography
          </button>
        </div>

        {hasUnsavedChanges && (
          <div className="mb-8 border-2 border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-yellow-200 uppercase tracking-wider text-sm">
            You have unsaved changes
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={saveContentChanges}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center gap-2 px-6 py-3 border-2 border-green-500 text-green-500 font-bold uppercase tracking-wider hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save / Publish'}
              </button>
            </div>
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
                          value={contentDraft[contentKey(item.section, item.key)] ?? ''}
                          onChange={(e) => {
                            setContentDraft((prev) => ({
                              ...prev,
                              [contentKey(item.section, item.key)]: e.target.value,
                            }));
                            setHasUnsavedChanges(true);
                          }}
                          rows={4}
                          className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={contentDraft[contentKey(item.section, item.key)] ?? ''}
                          onChange={(e) => {
                            setContentDraft((prev) => ({
                              ...prev,
                              [contentKey(item.section, item.key)]: e.target.value,
                            }));
                            setHasUnsavedChanges(true);
                          }}
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
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={saveContentChanges}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-green-500 text-green-500 font-bold uppercase tracking-wider hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save / Publish'}
                </button>
              </div>
              <div className="space-y-5">
                {pageContentFields[selectedPage].fields.map((field) => (
                  <div key={`${selectedPage}-${field.key}`}>
                    <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        value={contentDraft[contentKey(pageContentFields[selectedPage].section, field.key)] ?? ''}
                        onChange={(e) => {
                          setContentDraft((prev) => ({
                            ...prev,
                            [contentKey(pageContentFields[selectedPage].section, field.key)]: e.target.value,
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        rows={5}
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={contentDraft[contentKey(pageContentFields[selectedPage].section, field.key)] ?? ''}
                        onChange={(e) => {
                          setContentDraft((prev) => ({
                            ...prev,
                            [contentKey(pageContentFields[selectedPage].section, field.key)]: e.target.value,
                          }));
                          setHasUnsavedChanges(true);
                        }}
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
                                showToast('error', 'Error deleting media');
                                return;
                              }
                              showToast('success', 'Media removed successfully!');
                              publishCmsUpdate();
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

        {activeTab === 'media' && (
          <div className="space-y-10">
            <div className="border-2 border-gray-800 p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={saveContentChanges}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-green-500 text-green-500 font-bold uppercase tracking-wider hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save / Publish'}
                </button>
              </div>

              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                Home Hero Background Opacity
              </h2>

              {(() => {
                const key = contentKey('hero', 'background_opacity');
                const raw = contentDraft[key] ?? '';
                const parsed = Number.parseFloat(raw);
                const value = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0.4;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-6 items-center">
                    <div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={value}
                        onChange={(e) => {
                          const next = Number.parseFloat(e.target.value);
                          setContentDraft((prev) => ({ ...prev, [key]: String(next) }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full"
                      />
                      <div className="mt-2 text-sm uppercase tracking-wider text-gray-400">
                        Current: {Math.round(value * 100)}%
                      </div>
                    </div>
                    <div>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={value}
                        onChange={(e) => {
                          const next = Number.parseFloat(e.target.value);
                          if (!Number.isFinite(next)) {
                            setContentDraft((prev) => ({ ...prev, [key]: '' }));
                          } else {
                            const clamped = Math.min(1, Math.max(0, next));
                            setContentDraft((prev) => ({ ...prev, [key]: String(clamped) }));
                          }
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="border-2 border-gray-800 p-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                Site Media
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {siteMediaSlots.map((slot) => {
                  const current = siteMedia[slot.category];
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
                              const existing = siteMedia[slot.category];
                              if (!existing?.id) return;
                              const { error } = await supabase.from('gallery_images').delete().eq('id', existing.id);
                              if (error) {
                                showToast('error', 'Error deleting media');
                                return;
                              }
                              showToast('success', 'Media removed successfully!');
                              publishCmsUpdate();
                              fetchSiteMedia();
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
            {(activeTab === 'cinematography' || activeTab === 'photography') &&
              (() => {
                const section = activeTab === 'photography' ? 'photography' : 'cinematography';
                const list = section === 'photography' ? photographyCategories : cinematographyCategories;
                return (
                  <div className="mb-10 border-2 border-gray-800 p-6">
                    <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                      {section} Categories
                    </h2>
                    <div className="space-y-4">
                      {list.map((cat, idx) => (
                        <div key={cat.id} className="border-2 border-gray-800 p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_160px] gap-4 items-center">
                            <div className="text-sm uppercase tracking-wider text-gray-400 break-all">
                              {cat.id}
                            </div>
                            <input
                              type="text"
                              value={cat.name}
                              onChange={(e) => renameCategoryInSection(section, cat.id, e.target.value)}
                              className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => moveCategoryInSection(section, cat.id, -1)}
                                disabled={idx === 0}
                                className="px-3 py-2 border-2 border-gray-700 text-gray-300 hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                type="button"
                                aria-label="Move category up"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveCategoryInSection(section, cat.id, 1)}
                                disabled={idx === list.length - 1}
                                className="px-3 py-2 border-2 border-gray-700 text-gray-300 hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                type="button"
                                aria-label="Move category down"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteCategoryInSection(section, cat.id)}
                                className="px-3 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                type="button"
                                aria-label="Remove category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="border-2 border-gray-800 p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_180px] gap-4 items-center">
                          <input
                            type="text"
                            value={newCategoryDraft.id}
                            onChange={(e) => setNewCategoryDraft((prev) => ({ ...prev, id: e.target.value }))}
                            placeholder="category-id"
                            className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                          />
                          <input
                            type="text"
                            value={newCategoryDraft.name}
                            onChange={(e) => setNewCategoryDraft((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Category name"
                            className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                          />
                          <button
                            onClick={() => addCategoryToSection(section)}
                            disabled={!newCategoryDraft.id.trim() || !newCategoryDraft.name.trim()}
                            className="px-6 py-3 border-2 border-[#ff8c42] text-[#ff8c42] font-bold uppercase tracking-wider hover:bg-[#ff8c42] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider mb-4">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => guardUnsaved(() => setSelectedCategory(e.target.value))}
                className="w-full md:w-96 px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
              >
                {(activeTab === 'cinematography'
                  ? cinematographyCategories
                  : activeTab === 'photography'
                    ? photographyCategories
                    : categories
                ).map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-gray-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <div className="mb-6 border-2 border-gray-800 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-4 text-[#ff8c42] flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Gallery Layout
                </h3>
                <div className="flex flex-wrap gap-4">
                  {(['grid', 'masonry', 'collage', 'grouped'] as LayoutType[]).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => {
                        setLayoutDraft(layout);
                        setHasUnsavedChanges(true);
                      }}
                      className={`px-6 py-3 border-2 uppercase tracking-wider transition-all ${
                        layoutDraft === layout
                          ? 'bg-[#ff8c42] border-[#ff8c42] text-black'
                          : 'border-gray-700 hover:border-[#ff8c42]'
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  Layout: <span className="text-white font-semibold uppercase">{layoutDraft}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
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
                <button
                  onClick={saveGalleryChanges}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-green-500 text-green-500 font-bold uppercase tracking-wider hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save / Publish'}
                </button>
                <select
                  value={galleryOrderMode}
                  onChange={(e) => {
                    const mode = e.target.value as typeof galleryOrderMode;
                    setGalleryOrderMode(mode);
                    if (mode === 'manual') return;
                    if (mode === 'reverse') {
                      applyGalleryOrder([...galleryDraft].reverse());
                      return;
                    }
                    if (mode === 'title_asc') {
                      applyGalleryOrder(
                        [...galleryDraft].sort((a, b) =>
                          (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' })
                        )
                      );
                      return;
                    }
                    if (mode === 'title_desc') {
                      applyGalleryOrder(
                        [...galleryDraft].sort((a, b) =>
                          (b.title || '').localeCompare(a.title || '', undefined, { sensitivity: 'base' })
                        )
                      );
                    }
                  }}
                  className="px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors uppercase tracking-wider"
                >
                  <option value="manual" className="bg-gray-900">
                    Manual Order
                  </option>
                  <option value="reverse" className="bg-gray-900">
                    Reverse Order
                  </option>
                  <option value="title_asc" className="bg-gray-900">
                    Sort Title A-Z
                  </option>
                  <option value="title_desc" className="bg-gray-900">
                    Sort Title Z-A
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryDraft.map((image) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => setDraggingImageId(image.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (!draggingImageId) return;
                    if (draggingImageId === image.id) return;
                    const fromIdx = galleryDraft.findIndex((g) => g.id === draggingImageId);
                    const toIdx = galleryDraft.findIndex((g) => g.id === image.id);
                    if (fromIdx === -1 || toIdx === -1) return;
                    const next = [...galleryDraft];
                    const [moved] = next.splice(fromIdx, 1);
                    next.splice(toIdx, 0, moved);
                    applyGalleryOrder(next);
                    setGalleryOrderMode('manual');
                    setDraggingImageId(null);
                  }}
                  className="border-2 border-gray-800 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs uppercase tracking-wider text-gray-500">
                      Order: {image.order_index + 1}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveGalleryItem(image.id, -1)}
                        disabled={image.order_index === 0}
                        className="px-3 py-2 border-2 border-gray-700 text-gray-300 hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Move up"
                        type="button"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveGalleryItem(image.id, 1)}
                        disabled={image.order_index === galleryDraft.length - 1}
                        className="px-3 py-2 border-2 border-gray-700 text-gray-300 hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Move down"
                        type="button"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
                      onClick={() => openImageEditor(image.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-600 text-gray-300 hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
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

            {galleryDraft.length === 0 && (
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
                    accept={getAcceptForCategory(pageMediaDraft.category)}
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
                      } catch (err) {
                        console.error(err);
                        const message =
                          err instanceof Error
                            ? err.message
                            : typeof err === 'object' &&
                                err !== null &&
                                'message' in err &&
                                typeof (err as { message?: unknown }).message === 'string'
                              ? ((err as { message?: string }).message ?? 'Upload failed')
                              : 'Upload failed';
                        showToast('error', message);
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

        {editingImageId && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border-2 border-[#ff8c42] rounded-lg max-w-xl w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-[#ff8c42]">
                  Edit Image Details
                </h2>

                <div className="mb-4">
                  <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                    Title
                  </label>
                  <input
                    type="text"
                    value={imageEditDraft.title}
                    onChange={(e) => setImageEditDraft({ ...imageEditDraft, title: e.target.value })}
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#ff8c42] outline-none text-white"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm uppercase tracking-wider mb-2 text-gray-400">
                    Description
                  </label>
                  <textarea
                    value={imageEditDraft.description}
                    onChange={(e) => setImageEditDraft({ ...imageEditDraft, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#ff8c42] outline-none text-white resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setEditingImageId(null)}
                    className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyImageEdits}
                    className="flex-1 px-6 py-3 bg-[#ff8c42] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    Apply
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
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={uploadPreview.title}
                    onChange={(e) => setUploadPreview({ ...uploadPreview, title: e.target.value })}
                    placeholder="Enter title"
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-[#ff8c42] outline-none text-white"
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
                    disabled={isUploading || (!uploadPreview.file && !uploadPreview.url.trim())}
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
