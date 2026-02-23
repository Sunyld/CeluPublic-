/**
 * SEO helpers: set document title, description and Open Graph tags.
 * Lightweight client-side head management (no extra libs).
 */

const isBrowser = typeof document !== 'undefined';

export function setPageTitleAndDescription(title: string, description?: string) {
  if (!isBrowser) return;
  document.title = title;
  if (description) {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }
}

type OgConfig = {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
};

export function setOpenGraphTags(config: OgConfig) {
  if (!isBrowser) return;
  const entries: [string, string | undefined][] = [
    ['og:title', config.title],
    ['og:description', config.description],
    ['og:image', config.image],
    ['og:type', config.type ?? 'website'],
  ];
  for (const [property, value] of entries) {
    if (!value) continue;
    let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = value;
  }
}

