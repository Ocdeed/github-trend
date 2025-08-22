# Github Explorer

Github Explorer is a web application that allows users to discover trending GitHub repositories and get AI-powered insights. Users can search for repositories, filter by language, and generate summaries of a repository's README file using generative AI.

## Features

- **Trending Repositories**: View a list of trending GitHub repositories.
- **Search**: Search for repositories by keyword.
- **Filtering**: Filter repositories by programming language.
- **Sorting**: Sort repositories by stars, forks, last updated, and help wanted issues.
- **AI Summaries**: Generate an AI-powered summary of a repository's README file using Firebase Genkit.
- **Responsive Design**: The application is designed to work on both desktop and mobile devices.

## Architecture

Github Explorer is built with the following technologies:

- **Frontend**:
  - [Next.js](https://nextjs.org/) - A React framework for building server-side rendered and static web applications.
  - [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
  - [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
  - [Shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable UI components.
- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Used for server-side logic and API endpoints (specifically, Next.js Server Actions).
- **AI**:
  - [Firebase Genkit](https://firebase.google.com/docs/genkit) - A framework for building AI-powered features.
  - [Google AI](https://ai.google/) - The underlying generative AI model.
- **API**:
  - [GitHub API](https://docs.github.com/en/rest) - Used to fetch repository data and README files.
- **Deployment**:
  - [Firebase App Hosting](https-firebase.google.com/docs/hosting) - A fully-managed, serverless hosting service for web applications.

## Getting Started

To run the application locally, you will need to have Node.js and npm installed.

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
   This will start the Next.js development server on `http://localhost:9002`.

4. **Run the Genkit development server**:
   In a separate terminal, run the following command to start the Genkit development server:
   ```bash
   npm run genkit:dev
   ```
   This will start the Genkit server and make the AI flows available to the application.
