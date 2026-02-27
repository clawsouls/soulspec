import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/your-first-soul',
      ],
    },
    {
      type: 'category',
      label: 'Spec Reference',
      items: [
        'spec/overview',
        'spec/v0.5',
        'spec/v0.4',
        'spec/v0.3',
        'spec/migration',
      ],
    },
    {
      type: 'category',
      label: 'Framework Guides',
      items: [
        'guides/openclaw',
        'guides/claude-code',
        'guides/claude-desktop',
        'guides/cursor',
        'guides/windsurf',
        'guides/memory-sync',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/rest-api',
        'api/mcp',
        'api/cli',
      ],
    },
    {
      type: 'category',
      label: 'Platform',
      items: [
        'platform/publishing',
        'platform/soulscan',
        'platform/web-editor',
      ],
    },
    {
      type: 'category',
      label: 'Community',
      items: [
        'community/contributing',
        'community/changelog',
      ],
    },
  ],
};

export default sidebars;
