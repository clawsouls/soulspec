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
        'spec/v0.6',
        'spec/v0.5',
        'spec/v0.4',
        'spec/v0.3',
        'spec/migration',
        'spec/examples',
      ],
    },
    {
      type: 'category',
      label: 'Framework Guides',
      items: [
        'guides/openclaw',
        'guides/hermes',
        'guides/claude-code-plugin',
        'guides/claude-desktop',
        'guides/cursor',
        'guides/windsurf',
        'guides/telegram-channels',
        'guides/migration-to-claude-channels',
        'guides/memory-sync',
        'guides/migration-from-openclaw',
        'guides/local-llm-gemma4',
        'guides/soultalk',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/rest-api',
        'api/soulscan-api',
        'api/mcp',
        'api/cli',
      ],
    },
    {
      type: 'category',
      label: 'Platform',
      items: [
        'platform/soulclaw-cli',
        'platform/soul-memory',
        'platform/publishing',
        'platform/soulscan',
        'platform/checkpoint',
        'platform/swarm',
        'platform/dag-memory',
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
