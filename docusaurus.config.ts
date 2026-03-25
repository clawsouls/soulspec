import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Soul Spec Docs',
  tagline: 'Open standard for AI agent personas — built for OpenClaw',
  favicon: 'img/favicon.ico',

  url: 'https://docs.clawsouls.ai',
  baseUrl: '/',

  organizationName: 'clawsouls',
  projectName: 'soulspec',

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'OpenClaw,AI,AI agent,AI persona,AI personality,agent persona,soul,Soul Spec,SoulSpec,SOUL.md,soul.md,hosting,AI agent hosting,AI agent deploy,context engineering,system prompt,prompt template,AI character,agent memory,agent personality,AI agent template,AI agent marketplace,Claude Code persona,cursor rules,BYOK,LLM persona,ClawSouls,SoulClaw,SoulScan,SoulHub,prompt engineering',
      },
    },
  ],

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/clawsouls/soulspec/tree/main/',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Soul Spec',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/api/rest-api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://blog.clawsouls.ai',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/clawsouls/soulspec',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Quick Start', to: '/docs/getting-started/quick-start'},
            {label: 'Soul Spec', to: '/docs/spec/overview'},
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {label: 'ClawSouls Registry', href: 'https://clawsouls.ai'},
            {label: 'SoulSpec.org', href: 'https://soulspec.org'},
            {label: 'OpenClaw', href: 'https://openclaw.ai'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/clawsouls'},
            {label: 'X / Twitter', href: 'https://x.com/ClawSoulsAI'},
            {label: 'Blog', href: 'https://blog.clawsouls.ai'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ClawSouls. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
