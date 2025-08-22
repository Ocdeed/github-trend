import type { GithubRepo } from './github-types';

const GITHUB_API_BASE = 'https://api.github.com';

async function fetcher<T>(url: string): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Github-Explorer-App',
      },
      next: {
        revalidate: 60 * 60, // Revalidate every hour
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { data: null, error: errorData.message || 'An error occurred while fetching data from GitHub.' };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'An unexpected error occurred. Please check your network connection.' };
  }
}

export async function getTrendingRepos(): Promise<{ repos: GithubRepo[]; error: string | null }> {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `${GITHUB_API_BASE}/search/repositories?q=created:>${oneWeekAgo}&sort=stars&order=desc&per_page=12`;
  
  const { data, error } = await fetcher<{ items: GithubRepo[] }>(url);
  return { repos: data?.items || [], error };
}

export async function searchRepos({
  query,
  sort = 'stars',
  language = '',
}: {
  query: string;
  sort?: string;
  language?: string;
}): Promise<{ repos: GithubRepo[]; error: string | null }> {
  let q = query;
  if (language) {
    q += `+language:${language}`;
  }
  const url = `${GITHUB_API_BASE}/search/repositories?q=${q}&sort=${sort}&order=desc&per_page=12`;

  const { data, error } = await fetcher<{ items: GithubRepo[] }>(url);
  return { repos: data?.items || [], error };
}
