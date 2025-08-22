'use server';

/**
 * @fileOverview Summarizes a GitHub repository's purpose and key features.
 *
 * - summarizeRepository - A function that summarizes the repository.
 * - SummarizeRepositoryInput - The input type for the summarizeRepository function.
 * - SummarizeRepositoryOutput - The return type for the summarizeRepository function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRepositoryInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  readmeContent: z
    .string()
    .optional()
    .describe('The content of the README file. If not provided, it will be fetched.'),
});
export type SummarizeRepositoryInput = z.infer<typeof SummarizeRepositoryInputSchema>;

const SummarizeRepositoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the repository.'),
});
export type SummarizeRepositoryOutput = z.infer<typeof SummarizeRepositoryOutputSchema>;

export async function summarizeRepository(input: SummarizeRepositoryInput): Promise<SummarizeRepositoryOutput> {
  return summarizeRepositoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRepositoryPrompt',
  input: {schema: SummarizeRepositoryInputSchema},
  output: {schema: SummarizeRepositoryOutputSchema},
  prompt: `You are a helpful AI assistant that provides concise summaries of GitHub repositories.

  Summarize the following GitHub repository based on its README content:

  Repository URL: {{{repoUrl}}}
  README Content: {{{readmeContent}}}

  Provide a summary of the repository's purpose and key features.
  The summary should be no more than 150 words.
  `,
});

const summarizeRepositoryFlow = ai.defineFlow(
  {
    name: 'summarizeRepositoryFlow',
    inputSchema: SummarizeRepositoryInputSchema,
    outputSchema: SummarizeRepositoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
