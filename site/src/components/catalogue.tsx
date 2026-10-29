import { useEffect, useState } from 'react';
import {
  SearchIcon,
  FilterIcon,
  PackageIcon,
  RepoIcon,
  FileCodeIcon,
} from '@primer/octicons-react';
import type { PublishedRecord } from '../../../registry/schema';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from './ui/sheet';
import { Empty, label, recordLink } from './shared';

const checkNames: Record<string, string> = {
  not_checked_by_us: 'No check recorded',
  upstream_reported: 'Upstream checks recorded',
  checked_at_pinned_revision: 'Checked revision',
};
export function Catalogue({
  records,
  mode = 'artifacts',
}: {
  records: PublishedRecord[];
  mode?: 'artifacts' | 'projects';
}) {
  const [query, setQuery] = useState(''),
    [proof, setProof] = useState(''),
    [kind, setKind] = useState(''),
    [check, setCheck] = useState(''),
    [order, setOrder] = useState('name');
  const [ready, setReady] = useState(false);
  const restore = () => {
    const u = new URLSearchParams(location.search);
    setQuery(u.get('query') ?? '');
    setProof(u.get('proof') ?? '');
    setKind(u.get('kind') ?? '');
    setCheck(u.get('check') ?? '');
    setOrder(u.get('sort') ?? 'name');
    setReady(true);
  };
  useEffect(() => {
    restore();
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({
      query,
      proof,
      kind,
      check,
      sort: order === 'name' ? '' : order,
    }))
      if (v) p.set(k, v);
    history.replaceState(null, '', location.pathname + (p.size ? '?' + p : ''));
  }, [query, proof, kind, check, order, ready]);
  const base = records.filter(
    (r) => mode === 'projects' ? r.kind === 'project' : r.kind !== 'project',
  );
  const matches = base
    .filter(
      (r) =>
        (!proof || r.proof_system === proof) &&
        (!kind || r.kind === kind) &&
        (!check || r.evidence.mechanical.status === check) &&
        query
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .every((t) =>
            [
              r.id,
              r.title,
              r.source.symbol,
              r.source.statement,
              r.summary,
              r.proof_system,
              ...r.tags,
            ]
              .join(' ')
              .toLowerCase()
              .includes(t),
          ),
    )
    .sort((a, b) =>
      order === 'updated' ? b.updated.localeCompare(a.updated) : a.title.localeCompare(b.title) || a.id.localeCompare(b.id),
    );
  const clear = () => {
    setQuery('');
    setProof('');
    setKind('');
    setCheck('');
  };
  const filters = (
    <div className="filter-content">
      <div className="rail-heading">
        <h2>Filter records</h2>
        <Button variant="link" size="sm" onClick={clear}>
          Clear
        </Button>
      </div>
      <fieldset>
        <legend>Proof system</legend>
        {[...new Set(base.map((r) => r.proof_system))].sort().map((system) => (
          <label className="filter-option" key={system}>
            <input
              type="checkbox"
              checked={proof === system}
              onChange={() => setProof(proof === system ? '' : system)}
            />
            {system}
            <span>{base.filter((r) => r.proof_system === system).length}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Record type</legend>
        {[...new Set(base.map((r) => r.kind))].sort().map((k) => (
          <label className="filter-option" key={k}>
            <input
              type="checkbox"
              checked={kind === k}
              onChange={() => setKind(kind === k ? '' : k)}
            />
            {label(k)}
            <span>{base.filter((r) => r.kind === k).length}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Mechanical check</legend>
        {Object.entries(checkNames).map(([k, v]) => (
          <label className="filter-option" key={k}>
            <input
              type="checkbox"
              checked={check === k}
              onChange={() => setCheck(check === k ? '' : k)}
            />
            {v}
          </label>
        ))}
      </fieldset>
    </div>
  );
  return (
    <div className="catalogue-layout">
      <section className="catalogue-main">
        <div className="page-heading">
          <div>
            <h1>
              {mode === 'projects' ? 'Projects' : 'Artifacts'}{' '}
              <span className="heading-count" aria-live="polite">
                {matches.length}
              </span>
            </h1>
          </div>
          <Button asChild variant="outline">
            <a href="/contributions/new/">Contribute</a>
          </Button>
        </div>
        <div className="catalogue-toolbar">
          <div className="search-input">
            <SearchIcon />
            <Input
              aria-label="Search records"
              type="search"
              placeholder="Filter by symbol, statement or keywords"
              maxLength={256}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <FilterIcon />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{mode === 'projects' ? 'Project filters' : 'Artifact filters'}</SheetTitle>
                <SheetDescription className="sr-only">Filter by proof system, record type and mechanical check.</SheetDescription>
              </SheetHeader>
              {filters}
            </SheetContent>
          </Sheet>
          <label className="sort-control">
            Sort{' '}
            <select
              aria-label="Sort records"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="updated">Recently updated</option>
            </select>
          </label>
        </div>
        {(query || proof || kind || check) && (
          <div className="active-filters">
            <span>
              {[proof, kind && label(kind), check && checkNames[check]]
                .filter(Boolean)
                .join(' · ') || `Search: ${query}`}
            </span>
            <Button variant="link" size="sm" onClick={clear}>
              Clear filters
            </Button>
          </div>
        )}
        <div className="results">
          {matches.map((r) => (
            <article className="result" key={r.record_digest}>
              <div className={`record-icon ${r.kind === 'project' ? 'project' : ''}`}>
                {r.kind === 'project' ? (
                  <RepoIcon size={20} />
                ) : r.kind === 'verified_component' ? (
                  <PackageIcon size={20} />
                ) : (
                  <FileCodeIcon size={20} />
                )}
              </div>
              <div className="result-body">
                <h2>
                  <a href={recordLink(r)}>{r.title}</a>
                </h2>
                {r.source.symbol && <p className="result-symbol"><code>{r.source.symbol}</code></p>}
                <p className="result-summary">{r.summary}</p>
                {r.source.statement && (
                  <code className="result-statement">{r.source.statement}</code>
                )}
                <div className="result-meta">
                  <span>{label(r.kind)}</span>
                  <span>{r.proof_system}</span>
                  <span>{checkNames[r.evidence.mechanical.status]}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!matches.length && (
          <Empty title="No records match">
            <p>Try another symbol or remove a filter.</p>
            <Button onClick={clear} variant="outline">
              Clear filters
            </Button>
          </Empty>
        )}
        <div className="collection-end">
          <span>
            {matches.length} {matches.length === 1 ? 'record' : 'records'}
          </span>
          <a href="/contributions/">Help extend the catalogue</a>
        </div>
      </section>
    </div>
  );
}
