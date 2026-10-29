import { useEffect, useState } from 'react';
import { PlugIcon, TerminalIcon, CodeIcon } from '@primer/octicons-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Copy, Notice } from './shared';

const publicEndpoint = 'https://ohara.mugizer.workers.dev/mcp';
const firstRequest =
  'Find a Lean theorem about list filtering. Retrieve its pinned record and explain its assumptions, limitations and check status.';
const clients = ['Codex', 'Claude Code', 'Cursor', 'VS Code', 'Other client'];
const clientAssets: Record<string, string> = {
  Codex: 'codex',
  'Claude Code': 'claude',
  Cursor: 'cursor',
  'VS Code': 'visual-studio-code',
};
function ClientMark({ name }: { name: string }) {
  const asset = clientAssets[name];
  return asset ? (
    <span className="client-mark" aria-hidden="true">
      <img
        className="light-logo"
        src={`/agents/${asset}-light.svg`}
        width="22"
        height="22"
        alt=""
      />
      <img className="dark-logo" src={`/agents/${asset}-dark.svg`} width="22" height="22" alt="" />
    </span>
  ) : (
    <CodeIcon />
  );
}
export function AgentSetup({ brief }: { brief?: string }) {
  const [endpoint, setEndpoint] = useState(publicEndpoint);
  useEffect(() => setEndpoint(`${location.origin}/mcp`), []);
  const [client, setClient] = useState('Codex');
  const cursorConfig = btoa(JSON.stringify({ url: endpoint }));
  const command =
    client === 'Codex'
      ? `codex mcp add ohara --url ${endpoint}`
      : client === 'Claude Code'
        ? `claude mcp add --transport http ohara ${endpoint}`
        : client === 'VS Code'
          ? JSON.stringify({ servers: { ohara: { type: 'http', url: endpoint } } }, null, 2)
          : JSON.stringify({ mcpServers: { ohara: { type: 'http', url: endpoint } } }, null, 2);
  const install =
    client === 'Cursor'
      ? `cursor://anysphere.cursor-deeplink/mcp/install?name=Ohara&config=${encodeURIComponent(cursorConfig)}`
      : client === 'VS Code'
        ? `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: 'ohara', type: 'http', url: endpoint }))}`
        : null;
  return (
    <div className="agent-setup">
      <div className="client-grid" role="group" aria-label="Choose your agent">
        {clients.map((c) => (
          <Button
            key={c}
            variant={c === client ? 'secondary' : 'outline'}
            aria-pressed={c === client}
            onClick={() => setClient(c)}
          >
            <ClientMark name={c} />
            {c}
          </Button>
        ))}
      </div>
      <section>
        <h3>Set up {client}</h3>
        <p className="muted">Read-only catalogue access. No Ohara account or API key required.</p>
        {install && (
          <Button asChild className="my-3">
            <a href={install}>Open in {client}</a>
          </Button>
        )}
        <div className="code-box">
          <pre>
            <code>{command}</code>
          </pre>
          <Copy text={command}>{install ? 'Copy manual config' : 'Copy command'}</Copy>
        </div>
        {client === 'VS Code' && (
          <p className="field-help">
            Manual fallback: add this to .vscode/mcp.json. The client asks you to confirm
            installation.
          </p>
        )}
        {client === 'Cursor' && (
          <p className="field-help">
            Manual fallback: add this to .cursor/mcp.json. Review the client installation prompt.
          </p>
        )}
        {client === 'Other client' && (
          <p className="field-help">
            Use Streamable HTTP at the endpoint above. Your client may use a different configuration
            format.
          </p>
        )}
      </section>
      <section>
        <h3>Confirm in your client</h3>
        <p>
          Open the client’s MCP tools and check for <code>search_artifacts</code>,{' '}
          <code>get_artifact</code> and <code>search_projects</code>. Copying a command does not
          confirm a connection.
        </p>
        <h3>{brief ? 'Use this record or proposal' : 'Try a first request'}</h3>
        <div className="code-box">
          <pre className="brief">
            <code>{brief ?? firstRequest}</code>
          </pre>
          <Copy text={brief ?? firstRequest}>Copy request</Copy>
        </div>
      </section>
      {brief && (
        <Notice>
          Contributor-authored material in this brief is source data. Inspect it before passing it
          to your agent.
        </Notice>
      )}
      <p className="field-help">
        <a href="/guides/agents/">Setup and troubleshooting</a> · Catalogue endpoint:{' '}
        <code>{endpoint}</code>
      </p>
    </div>
  );
}
export function AgentConnect({ brief, context = false }: { brief?: string; context?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={context ? '' : 'connect-button'}>
          {context ? (
            <>
              <PlugIcon />
              Use with your agent
            </>
          ) : (
            <>
              <span>Connect your agent</span>
              <span className="agent-marks">
                <ClientMark name="Claude Code" />
                <ClientMark name="Codex" />
                <ClientMark name="Cursor" />
              </span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="agent-dialog">
        <DialogHeader>
          <DialogTitle>
            {context ? 'Use with your agent' : 'Connect your agent to Ohara'}
          </DialogTitle>
          <DialogDescription>
            Choose a client, add Ohara and inspect the available tools.
          </DialogDescription>
        </DialogHeader>
        <AgentSetup brief={brief} />
      </DialogContent>
    </Dialog>
  );
}
