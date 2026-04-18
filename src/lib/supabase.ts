import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('[supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url ?? '', key ?? '', {
  auth: { persistSession: false },
});

export type Project = {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  year: number | null;
  category: string | null;
  summary: string | null;
  body: string | null;
  cover_image_url: string | null;
  accent_color: string | null;
  position: number | null;
  published: boolean;
};

export type ContentEntry = {
  id: string;
  title: string;
  slug: string;
  body: string | null;
  published_at: string | null;
  seo_description: string | null;
};

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('position', { ascending: true });
  if (error) {
    console.error('[supabase] getProjects', error.message);
    return [];
  }
  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) {
    console.error('[supabase] getProjectBySlug', error.message);
    return null;
  }
  return (data as Project) ?? null;
}
