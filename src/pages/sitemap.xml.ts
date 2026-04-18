import type { APIRoute } from 'astro';
import { getProjects } from '../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ site }) => {
  const base = (import.meta.env.PUBLIC_SITE_URL || site?.toString() || 'https://sarah-chen.vercel.app').replace(/\/$/, '');
  const projects = await getProjects();
  const staticPaths = ['/', '/work', '/about', '/contact'];
  const urls = [
    ...staticPaths.map((p) => ({ loc: `${base}${p}`, lastmod: new Date().toISOString() })),
    ...projects.map((p) => ({ loc: `${base}/work/${p.slug}`, lastmod: new Date().toISOString() })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
