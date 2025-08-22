import { GithubExplorer } from '@/components/github-explorer';
import { getTrendingRepos } from '@/lib/github';

export default async function HomePage() {
  const { repos, error } = await getTrendingRepos();

  return <GithubExplorer initialRepos={repos} error={error} />;
}
