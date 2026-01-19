export const getEmbedSrc = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    
    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (host.endsWith('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.includes('embed')) return url;
      if (segments.includes('v')) return `https://www.youtube.com/embed/${segments[segments.indexOf('v') + 1]}`;
      if (segments.includes('shorts')) return `https://www.youtube.com/embed/${segments[segments.indexOf('shorts') + 1]}`;
    }
    if (host.endsWith('vimeo.com')) {
      const id = parsed.pathname.split('/').pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
};

export const isEmbeddableUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be' || host.endsWith('youtube.com')) return true;
    if (host.endsWith('vimeo.com')) return true;
    // Instagram embeds often require more complex handling (blockquote), so we might treat them differently or just return true if we have a way to handle them.
    // The original code included instagram.com, so we keep it.
    if (host.endsWith('instagram.com')) return true;
  } catch {
    return false;
  }
  return false;
};

export const isVideoUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  try {
    // Remove query params to check extension
    const cleanUrl = url.split('?')[0];
    return !!cleanUrl.match(/\.(mp4|webm|ogg)$/i);
  } catch {
    return false;
  }
};
