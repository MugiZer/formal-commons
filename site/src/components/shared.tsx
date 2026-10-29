import { useEffect, useState, type ReactNode } from "react";
import { CheckIcon, CopyIcon, AlertIcon } from "@primer/octicons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export const label = (value: string) =>
  value.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());
export const short = (value: string) => value.slice(0, 12);
export const date = (value: string) =>
  new Date(value).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
export const recordLink = (r: { id: string; record_digest: string }) =>
  `/records/${r.id}/${r.record_digest}/`;
export function Status({ value }: { value: string }) {
  return <span className={`status status-${value}`}>{label(value)}</span>;
}
export function Notice({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={`notice ${error ? "error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {error && <AlertIcon />}
      <span className="whitespace-pre-wrap">{children}</span>
    </div>
  );
}
export function Loading() {
  return (
    <p className="loading" role="status">
      Loading…
    </p>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
export function Copy({
  text,
  children = "Copy",
}: {
  text: string;
  children?: ReactNode;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => setState("idle"), [text]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  }
  return (
    <span className="copy-control">
      <Button type="button" variant="outline" size="sm" onClick={copy}>
        {state === "copied" ? <CheckIcon /> : <CopyIcon />}
        {state === "copied" ? "Copied" : children}
      </Button>
      {state === "failed" && (
        <span role="alert">
          Copy failed. Select the text and copy it manually.
        </span>
      )}
    </span>
  );
}
export function Field({
  name,
  title,
  value,
  onChange,
  multiline = false,
  required = false,
  help,
  type = "text",
  maxLength = 6000,
  placeholder,
}: {
  name: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
  help?: string;
  type?: string;
  maxLength?: number;
  placeholder?: string;
}) {
  const props = {
    id: name,
    name,
    value,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    required,
    maxLength,
    placeholder,
    "aria-describedby": help ? `${name}-help` : undefined,
  };
  return (
    <div className="field">
      <Label htmlFor={name}>
        {title}
        {required && <span className="muted"> (required)</span>}
      </Label>
      {multiline ? (
        <Textarea {...props} rows={4} />
      ) : (
        <Input {...props} type={type} />
      )}
      {help && (
        <p id={`${name}-help`} className="field-help">
          {help}
        </p>
      )}
    </div>
  );
}
export function SignInPrompt({
  children = "Sign in to contribute.",
}: {
  children?: ReactNode;
}) {
  const target = encodeURIComponent(
    typeof window === "undefined"
      ? "/workspace/"
      : window.location.pathname + window.location.search,
  );
  return (
    <Notice>
      {children} <a href={`/sign-in/?returnTo=${target}`}>Sign in</a> or{" "}
      <a href={`/sign-up/?returnTo=${target}`}>create an account</a>.
    </Notice>
  );
}
