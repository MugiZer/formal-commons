import { useState } from 'react';
import { createAuthClient } from 'better-auth/react';
import { MarkGithubIcon } from '@primer/octicons-react';
import type { CommunityUser } from '../../../community/model';
import { Button } from './ui/button';
import { Field, Notice, Loading } from './shared';
import { safeReturn, useResource } from '../lib/api';

export const authClient = createAuthClient();
export type SessionInfo = { user: (CommunityUser & { email: string }) | null; maintainer: boolean };
export function AccountPage({ signup = false }: { signup?: boolean }) {
  const { data: config, error } = useResource<{
    github: boolean;
    local: boolean;
    available: boolean;
  }>('/config');
  const [pending, setPending] = useState(false),
    [failure, setFailure] = useState('');
  const [name, setName] = useState(''),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState('');
  const target =
    typeof window === 'undefined'
      ? '/workspace/'
      : safeReturn(new URLSearchParams(location.search).get('returnTo'));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setFailure('');
    try {
      const result = signup
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message ?? 'Sign-in failed.');
      location.assign(target);
    } catch (e) {
      setFailure((e as Error).message);
      setPending(false);
    }
  }
  async function github() {
    setPending(true);
    setFailure('');
    try {
      const result = await authClient.signIn.social({ provider: 'github', callbackURL: target });
      if (result.error) throw new Error(result.error.message ?? 'GitHub sign-in failed.');
    } catch (e) {
      setFailure((e as Error).message);
      setPending(false);
    }
  }
  return (
    <section className="account-page">
      <h1>{signup ? 'Join Ohara' : 'Welcome back'}</h1>
      <p className="muted">
        {signup
          ? 'Contribute formal knowledge and help check pending work.'
          : 'Sign in to continue your contributions and verification work.'}
      </p>
      {error && <Notice error>{error}</Notice>}
      {failure && <Notice error>{failure}</Notice>}
      {!config ? (
        <Loading />
      ) : !config.available ? (
        <Notice error>Account storage is unavailable on this deployment.</Notice>
      ) : (
        <>
          {config.github ? (
            <>
              <Button onClick={github} variant="outline" className="w-full" disabled={pending}>
                <MarkGithubIcon />
                Continue with GitHub
              </Button>
              <div className="form-divider">or use email</div>
            </>
          ) : (
            <p className="field-help">
              GitHub sign-in is not configured on this local instance. Use email below.
            </p>
          )}
          <form onSubmit={submit} className="form-stack">
            {signup && (
              <Field
                name="name"
                title="Display name"
                required
                maxLength={100}
                value={name}
                onChange={setName}
              />
            )}
            <Field
              name="email"
              title="Email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={setEmail}
              help="Your email stays private."
            />
            <Field
              name="password"
              title="Password"
              type="password"
              required
              maxLength={128}
              value={password}
              onChange={setPassword}
              help={signup ? 'Use at least 12 characters.' : undefined}
            />
            <Button type="submit" disabled={pending}>
              {pending ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}
            </Button>
          </form>
          <p className="account-switch">
            {signup ? 'Already a member?' : 'New to Ohara?'}{' '}
            <a href={`/${signup ? 'sign-in' : 'sign-up'}/?returnTo=${encodeURIComponent(target)}`}>
              {signup ? 'Sign in' : 'Create an account'}
            </a>
          </p>
          <p className="field-help">
            Public profiles show your display name and submitted work. An account does not confer
            reviewer or publication authority.
          </p>
        </>
      )}
    </section>
  );
}
export function Settings({ session }: { session: SessionInfo }) {
  const [name, setName] = useState(session.user?.name ?? ''),
    [message, setMessage] = useState(''),
    [failure, setFailure] = useState(''),
    [pending, setPending] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setFailure('');
    try {
      const r = await authClient.updateUser({ name });
      if (r.error) throw new Error(r.error.message);
      setMessage('Display name saved.');
    } catch (e) {
      setFailure((e as Error).message);
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="narrow-page">
      <h1>Account settings</h1>
      {failure && <Notice error>{failure}</Notice>}
      {message && <Notice>{message}</Notice>}
      <form className="form-stack" onSubmit={save}>
        <Field
          name="display-name"
          title="Display name"
          value={name}
          onChange={setName}
          required
          maxLength={100}
        />
        <p>
          Email: {session.user?.email} <span className="muted">(private)</span>
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
      <h2>Public profile</h2>
      <p>
        <a href={`/people/${session.user?.id}/`}>View your public contributions and reports</a>
      </p>
      <h2>Session</h2>
      <Button
        variant="outline"
        onClick={async () => {
          await authClient.signOut();
          location.assign('/');
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
