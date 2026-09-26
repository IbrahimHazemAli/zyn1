/**
 * Utility to resolve static public assets (images, videos, icons)
 * ensuring proper path resolution both locally and when deployed to GitHub Pages subpath (/zyn1/).
 */
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (
    typeof path !== 'string' ||
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  if (baseUrl !== '/' && path.startsWith(baseUrl)) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}${cleanPath}`;
};
