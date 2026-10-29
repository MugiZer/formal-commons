import { useEffect, useState, type ReactNode } from 'react';
import {
  RepoIcon,
  FileCodeIcon,
  GitPullRequestIcon,
  BookIcon,
  SignOutIcon,
  GearIcon,
} from '@primer/octicons-react';
import type { Catalogue as CatalogueData, PublishedRecord } from '../../../registry/schema';
import { latestRecords, discoverable } from '../../../registry/discovery';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AgentConnect, AgentSetup } from './agent-connect';
import { Catalogue } from './catalogue';
import { RecordPage } from './record';
import { AccountPage, Settings, authClient, type SessionInfo } from './account';
import {
  Contributions,
  ContributionPage,
  ProposalEditor,
  Workspace,
  Profile,
  ReviewWorkspace,
} from './community';
import { Empty, Loading, Notice, SignInPrompt } from './shared';
import { useResource } from '../lib/api';

const docs = [
  {
    url: '/research-results/',
    title: 'Research results',
    description: 'Published proofs, model checks and patterns.',
  },
  {
    url: '/guides/agents/',
    title: 'Connect an agent',
    description: 'MCP tools, client setup and troubleshooting.',
  },
  {
    url: '/guides/evidence/',
    title: 'Evidence labels',
    description: 'Mechanical checks, human assessment, correspondence and version applicability.',
  },
  {
    url: '/guides/operations/',
    title: 'Operations and limits',
    description: 'Publication, trust boundaries, corrections and rollback.',
  },
];
const nav = [
  { url: '/artifacts/', title: 'Artifacts', icon: FileCodeIcon },
  { url: '/projects/', title: 'Projects', icon: RepoIcon },
  { url: '/contributions/', title: 'Contributions', icon: GitPullRequestIcon },
  { url: '/docs/', title: 'Docs', icon: BookIcon },
];

function Header({ session, path, communityAvailable }: { session?: SessionInfo; path: string; communityAvailable?: boolean }) {
  const [theme, setTheme] = useState('system');
  useEffect(() => {
    setTheme(localStorage.getItem('ohara.theme') ?? 'system');
  }, []);
  function changeTheme(value: string) {
    setTheme(value);
    localStorage.setItem('ohara.theme', value);
    document.documentElement.classList.toggle(
      'dark',
      value === 'dark' ||
        (value === 'system' && matchMedia('(prefers-color-scheme: dark)').matches),
    );
  }
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="app-header">
        <div className="header-inner">
          <a className="wordmark" href="/">Ohara</a>
          <nav aria-label="Main navigation" className="desktop-nav">
            <a href="/artifacts/" className={path === '/' || path.startsWith('/artifacts/') ? 'active' : ''}>
              <FileCodeIcon />Artifacts
            </a>
          </nav>
          <div className="header-actions">
            <AgentConnect />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">More</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {nav.filter((item) => item.url !== '/artifacts/').map(({ url, title, icon: Icon }) => (
                  <DropdownMenuItem key={url} asChild>
                    <a href={url}><Icon />{title}</a>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
                  <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="account-button" aria-label="Account menu">
                    <span className="avatar">{session.user.name.slice(0, 2).toUpperCase()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-2 font-semibold">{session.user.name}</div>
                  <DropdownMenuItem asChild>
                    <a href="/workspace/">My workspace</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/people/${session.user.id}/`}>Public profile</a>
                  </DropdownMenuItem>
                  {session.maintainer && (
                    <DropdownMenuItem asChild>
                      <a href="/review/">Review workspace</a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <a href="/settings/">
                      <GearIcon />
                      Account settings
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await authClient.signOut();
                      location.assign('/');
                    }}
                  >
                    <SignOutIcon />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : communityAvailable !== false ? (
              <a
                className="sign-in-link"
                href={`/sign-in/?returnTo=${encodeURIComponent(path)}`}
                onClick={(event) => {
                  event.currentTarget.href = `/sign-in/?returnTo=${encodeURIComponent(location.pathname + location.search)}`;
                }}
              >
                Sign in
              </a>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
}

export default function App({
  snapshot,
  route,
  record,
  docTitle,
  children,
}: {
  snapshot: CatalogueData;
  route: string;
  record?: PublishedRecord;
  docTitle?: string;
  children?: ReactNode;
}) {
  const [path, setPath] = useState(route);
  const { data: config } = useResource<{ available: boolean }>('/config');
  const { data: session, error: sessionError, reload } = useResource<SessionInfo>('/me');
  useEffect(() => {
    setPath(location.pathname);
  }, []);
  const records = latestRecords(snapshot).filter(discoverable);
  const clean = path.replace(/\/$/, '') || '/';
  const privatePage = ['/workspace', '/settings', '/review', '/contributions/new'].includes(clean);
  let content: ReactNode;
  if (record) content = <RecordPage record={record} records={snapshot.records} />;
  else if (docTitle)
    content = (
      <div className="docs-layout">
        <aside>
          <h2>Documentation</h2>
          {docs.map((d) => (
            <a key={d.url} className={path === d.url ? 'active' : ''} href={d.url}>
              {d.title}
            </a>
          ))}
          <a href="/contributions/">Contribute to Ohara</a>
        </aside>
        <article className="docs-content">
          <h1>{docTitle}</h1>
          {children}
        </article>
      </div>
    );
  else if (config?.available === false && ['/contributions', '/contribute', '/contributions/new', '/sign-in', '/sign-up', '/workspace', '/settings', '/review'].includes(clean))
    content = (
      <div className="standard-page">
        <h1>Contribute to Ohara</h1>
        <p>Accounts and community submissions are not available on this deployment yet.</p>
        <p><a href="https://github.com/MugiZer/ohara/issues/new/choose">Propose a contribution on GitHub</a></p>
      </div>
    );
  else if (privatePage && !session)
    content = (
      <div className="standard-page">
        {sessionError ? (
          <>
            <Notice error>{sessionError}</Notice>
            <Button onClick={reload}>Retry</Button>
          </>
        ) : (
          <Loading />
        )}
      </div>
    );
  else if (privatePage && !session?.user)
    content = (
      <div className="standard-page">
        <h1>
          {clean === '/contributions/new'
            ? 'New contribution'
            : clean === '/review'
              ? 'Review workspace'
              : 'Your workspace'}
        </h1>
        <SignInPrompt />
      </div>
    );
  else if (clean === '/') content = <Catalogue records={records} mode='artifacts' />;
  else if (clean === '/artifacts' || clean === '/projects')
    content = (
      <Catalogue records={records} mode={clean === '/projects' ? 'projects' : 'artifacts'} />
    );
  else if (clean === '/contributions' || clean === '/contribute') content = <Contributions />;
  else if (clean === '/contributions/new')
    content = <ProposalEditor session={session!} records={records} />;
  else if (/^\/contributions\/[\w-]+$/.test(clean))
    content = session ? (
      <ContributionPage id={clean.split('/')[2]} session={session} records={records} />
    ) : sessionError ? (
      <div className="standard-page">
        <Notice error>{sessionError}</Notice>
        <Button onClick={reload}>Retry</Button>
      </div>
    ) : (
      <Loading />
    );
  else if (/^\/people\/[\w-]+$/.test(clean)) content = <Profile id={clean.split('/')[2]} />;
  else if (clean === '/workspace') content = <Workspace />;
  else if (clean === '/settings') content = <Settings session={session!} />;
  else if (clean === '/review')
    content = session?.maintainer ? (
      <ReviewWorkspace />
    ) : (
      <div className="standard-page">
        <Notice error>
          Maintainer access is required. Community verification is open to all members.
        </Notice>
        <Button asChild variant="outline">
          <a href="/contributions/">Browse pending contributions</a>
        </Button>
      </div>
    );
  else if (clean === '/sign-in' || clean === '/sign-up')
    content = <AccountPage signup={clean === '/sign-up'} />;
  else if (clean === '/connect')
    content = (
      <div className="narrow-page">
        <h1>Connect your agent</h1>
        <p className="lead">Search published formal knowledge from the tools you already use.</p>
        <AgentSetup />
      </div>
    );
  else if (clean === '/docs')
    content = (
      <div className="docs-index standard-page">
        <h1>Documentation</h1>
        <p className="lead">Use the catalogue, inspect evidence and connect your tools.</p>
        {docs.map((d) => (
          <article key={d.url}>
            <BookIcon size={20} />
            <div>
              <h2>
                <a href={d.url}>{d.title}</a>
              </h2>
              <p>{d.description}</p>
            </div>
          </article>
        ))}
      </div>
    );
  else if (clean === '/community') content = <Loading />;
  else
    content = (
      <div className="standard-page">
        <Empty title="Page not found">
          <p>The address may have changed.</p>
          <Button asChild variant="outline">
            <a href="/">Return to the catalogue</a>
          </Button>
        </Empty>
      </div>
    );
  return (
    <>
      <Header session={session} path={path} communityAvailable={config?.available} />
      <main id="main" tabIndex={-1}>
        {content}
      </main>
      <footer className="app-footer">
        <div>
          <a className="footer-name" href="/">
            Ohara
          </a>
        </div>
        <nav aria-label="Footer">
          <a href="/guides/evidence/">Evidence labels</a>
          <a href="https://github.com/MugiZer/ohara">Source</a>
          <a href="/registry.json">
            Snapshot <code>{snapshot.snapshot_id.slice(0, 8)}</code>
          </a>
        </nav>
      </footer>
    </>
  );
}
