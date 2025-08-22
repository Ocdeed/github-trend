
'use server';

import { summarizeRepository } from '@/ai/flows/summarize-repository';
import { z } from 'zod';

const getReadmeContent = async (owner: string, repo: string): Promise<string | null> => {
    const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
    try {
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw',
                'User-Agent': 'Github-Explorer-App'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            console.error(`Failed to fetch README for ${owner}/${repo}: ${res.statusText}`);
            return null;
        }
        return res.text();
    } catch (error) {
        console.error(`Error fetching README for ${owner}/${repo}:`, error);
        return null;
    }
}


export async function getSummaryAction(
  prevState: any,
  formData: FormData
) {
  const schema = z.object({
    repoUrl: z.string().url({ message: 'Invalid repository URL.' }),
    owner: z.string().min(1, { message: 'Owner is required.' }),
    repoName: z.string().min(1, { message: 'Repository name is required.' }),
  });

  const validatedFields = schema.safeParse({
    repoUrl: formData.get('repoUrl'),
    owner: formData.get('owner'),
    repoName: formData.get('repoName'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }
  
  const { repoUrl, owner, repoName } = validatedFields.data;

  try {
    const readmeContent = await getReadmeContent(owner, repoName);

    if (!readmeContent) {
      return { error: 'Could not find a README file for this repository.' };
    }
    
    if (readmeContent.length < 100) {
        return { error: "README is too short to provide a meaningful summary." }
    }

    const truncatedContent = readmeContent.substring(0, 10000);

    const result = await summarizeRepository({
      repoUrl: repoUrl,
      readmeContent: truncatedContent,
    });

    if (!result.summary) {
        return { error: 'AI model could not generate a summary.' };
    }

    return { summary: result.summary };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while generating the summary.' };
  }
}
