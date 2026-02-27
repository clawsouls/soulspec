import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary')} style={{textAlign: 'center', padding: '4rem 0'}}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Get Started →
          </Link>
          <Link className="button button--outline button--lg" to="/docs/spec/overview" style={{color: 'white', borderColor: 'white'}}>
            Read the Spec
          </Link>
          <Link className="button button--outline button--lg" href="https://clawsouls.ai" style={{color: 'white', borderColor: 'white'}}>
            Browse Souls ↗
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <HomepageHeader />
      <main style={{padding: '2rem 0'}}>
        <div className="container">
          <div className="row" style={{justifyContent: 'center', gap: '2rem', flexWrap: 'wrap'}}>
            <div className="col col--3" style={{textAlign: 'center'}}>
              <h3>🧠 Portable Personas</h3>
              <p>Define your AI agent's personality once. Use it with OpenClaw, Claude Code, Cursor, Windsurf, and any SOUL.md-compatible framework.</p>
            </div>
            <div className="col col--3" style={{textAlign: 'center'}}>
              <h3>📦 Open Standard</h3>
              <p>Structured, versioned, git-friendly. Each file has a clear purpose — no more giant system prompts. Security-scanned by <a href="/docs/platform/soulscan">SoulScan</a>.</p>
            </div>
            <div className="col col--3" style={{textAlign: 'center'}}>
              <h3>🚀 Rich Ecosystem</h3>
              <p><a href="https://clawsouls.ai">CLI tools</a>, <a href="/docs/api/mcp">MCP server</a>, <a href="/docs/platform/web-editor">web editor</a>, and a <a href="https://clawsouls.ai/souls">registry</a> with community souls ready to install.</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
