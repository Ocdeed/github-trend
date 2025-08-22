'use client';

import { useState, useTransition, useEffect } from 'react';
import { Github, Loader2, Search, X } from 'lucide-react';

import type { GithubRepo } from '@/lib/github-types';
import { searchRepos } from '@/lib/github';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RepositoryCard } from './repository-card';
import { Logo } from './logo';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';

const languages = ['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust', 'C++', 'PHP', 'C#', 'Swift'];
const sortOptions = [
  { value: 'stars', label: 'Stars' },
  { value: 'forks', label: 'Forks' },
  { value: 'updated', label: 'Updated' },
  { value: 'help-wanted-issues', label: 'Help Wanted' },
];

export function GithubExplorer({
  initialRepos,
  error: initialError,
}: {
  initialRepos: GithubRepo[];
  error?: string | null;
}) {
  const [repos, setRepos] = useState<GithubRepo[]>(initialRepos);
  const [query, setQuery] = useState('react');
  const [activeLanguage, setActiveLanguage] = useState('');
  const [sort, setSort] = useState('stars');
  const [error, setError] = useState<string | null>(initialError || null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (initialError) {
      toast({
        variant: 'destructive',
        title: 'Error loading repositories',
        description: initialError,
      });
    }
  }, [initialError, toast]);

  const handleSearch = () => {
    if (!query) return;
    setError(null);
    startTransition(async () => {
      const { repos: newRepos, error } = await searchRepos({ query, sort, language: activeLanguage });
      if (error) {
        toast({ variant: 'destructive', title: 'Search Failed', description: error });
        setError(error);
      } else {
        setRepos(newRepos);
      }
    });
  };
  
  const handleLanguageChange = (lang: string) => {
    setError(null);
    const newLang = lang === activeLanguage ? '' : lang;
    setActiveLanguage(newLang);
    startTransition(async () => {
      const { repos: newRepos, error } = await searchRepos({ query, sort, language: newLang });
      if (error) {
        toast({ variant: 'destructive', title: 'Filter Failed', description: error });
        setError(error);
      } else {
        setRepos(newRepos);
      }
    });
  };

  const handleSortChange = (newSort: string) => {
    setError(null);
    setSort(newSort);
    startTransition(async () => {
      const { repos: newRepos, error } = await searchRepos({ query, sort: newSort, language: activeLanguage });
      if (error) {
        toast({ variant: 'destructive', title: 'Sort Failed', description: error });
        setError(error);
      } else {
        setRepos(newRepos);
      }
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <Logo />
        <p className="text-muted-foreground mt-2">
          Discover trending repositories and get AI-powered insights.
        </p>
      </header>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for repositories... (e.g., 'nextjs')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
             {query && <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => setQuery('')}/>}
          </div>
          <div className="flex gap-4">
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isPending} className="w-full sm:w-auto">
              {isPending ? <Loader2 className="animate-spin" /> : 'Search'}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Button
              key={lang}
              variant={activeLanguage === lang ? 'default' : 'secondary'}
              size="sm"
              onClick={() => handleLanguageChange(lang)}
              disabled={isPending}
            >
              {lang}
            </Button>
          ))}
        </div>
      </div>

      <main className="mt-8">
        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg border animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="flex justify-between items-center mt-6">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
           <Alert variant="destructive" className="max-w-2xl mx-auto">
             <Github className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : repos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, i) => (
              <RepositoryCard key={repo.id} repo={repo}
                className="animate-in fade-in-0 duration-500"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No Repositories Found</h2>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
