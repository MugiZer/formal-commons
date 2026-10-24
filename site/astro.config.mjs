import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://ohara.mugizer.workers.dev',
  integrations: [starlight({
    title: 'Ohara',
    description: 'Formal statements and verification projects with pinned sources and review status.',
    customCss: ['./src/styles/ohara.css'],
    components: { Footer: './src/components/Footer.astro' },
    sidebar: [
      { label: 'Catalogue', link: '/' },
      { label: 'Artifacts', link: '/artifacts/' },
      { label: 'Projects', link: '/projects/' },
      { label: 'Connect an agent', link: '/guides/agents/' },
      { label: 'Evidence labels', link: '/guides/evidence/' },
      { label: 'Contribute', link: '/contribute/' },
      { label: 'Operations & limits', link: '/guides/operations/' },
    ],
  })],
});
