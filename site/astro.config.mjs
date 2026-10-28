import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://ohara.mugizer.workers.dev',
  integrations: [starlight({
    title: 'Ohara',
    description: 'Reusable formal knowledge, with inspectable evidence and explicit assumptions.',
    customCss: ['./src/styles/ohara.css'],
    components: { Footer: './src/components/Footer.astro' },
    sidebar: [
      { label: 'Start here', link: '/' },
      { label: 'Artifacts', link: '/artifacts/' },
      { label: 'Projects', link: '/projects/' },
      { label: 'Research results', link: '/research-results/' },
      { label: 'Connect an agent', link: '/guides/agents/' },
      { label: 'Understand the evidence', link: '/guides/evidence/' },
      { label: 'Contribute', link: '/contribute/' },
      { label: 'Operations & limits', link: '/guides/operations/' },
    ],
  })],
});
