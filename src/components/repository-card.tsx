'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ExternalLink, GitFork, Loader2, Sparkles, Star } from 'lucide-react';

import type { GithubRepo } from '@/lib/github-types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSummaryAction } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

function SummaryButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Summarizing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Summary
        </>
      )}
    </Button>
  );
}

export function RepositoryCard({ repo, className, style }: { repo: GithubRepo, className?: string; style?: React.CSSProperties }) {
  const [state, formAction] = useActionState(getSummaryAction, { summary: '', error: '' });
  const { toast } = useToast();
  
  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  return (
    <Card className={cn("flex flex-col h-full hover:shadow-lg transition-shadow duration-300", className)} style={style}>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-start">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex-1 truncate"
          >
            {repo.name}
          </a>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-muted-foreground hover:text-primary"
            aria-label="Open repository in new tab"
          >
             <ExternalLink className="h-4 w-4" />
          </a>
        </CardTitle>
        <CardDescription>By {repo.owner.login}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {repo.description || 'No description available.'}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4 text-primary" />
                <span>{repo.forks_count.toLocaleString()}</span>
              </div>
          </div>
          {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Sparkles className="mr-2 h-4 w-4 text-accent-foreground/50" />
              AI Summary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>AI-Powered Summary</DialogTitle>
              <DialogDescription>
                An AI-generated summary of the repository's README file.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {state.summary ? (
                 <div className="prose prose-sm dark:prose-invert max-h-[400px] overflow-y-auto rounded-md border p-4 bg-muted/50">
                    <p>{state.summary}</p>
                 </div>
              ): state.error ? (
                  <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
              ) : null}
            </div>
            <DialogFooter className="sm:justify-between gap-2">
               <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              {!state.summary && (
                <form action={formAction}>
                  <input type="hidden" name="repoUrl" value={repo.html_url} />
                  <input type="hidden" name="owner" value={repo.owner.login} />
                  <input type="hidden" name="repoName" value={repo.name} />
                  <SummaryButton />
                </form>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
