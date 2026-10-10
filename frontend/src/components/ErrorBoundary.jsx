import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    if (import.meta.env.DEV) console.error("Render crash:", error, info);
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    // Component stacks and raw messages expose internal paths and data shapes,
    // so they are shown for local debugging only - never in a build.
    const isDev = import.meta.env.DEV;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "var(--bg)",
          color: "var(--ink)",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            width: "100%",
            padding: 24,
            borderRadius: 12,
            border: "1px solid color-mix(in srgb, var(--bad) 40%, transparent)",
            background: "var(--surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span
              style={{ width: 8, height: 8, borderRadius: 99, background: "var(--bad)" }}
            />
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              Something broke while rendering
            </h1>
          </div>

          <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--ink-2)" }}>
            {isDev
              ? "The app caught the error instead of showing a blank page. Copy the details below into a bug report."
              : "The app caught the error instead of showing a blank page. Reload to try again."}
          </p>

          {isDev && (
            <pre
              style={{
                margin: 0,
                padding: 14,
                borderRadius: 8,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--ink)",
                fontSize: 12,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 280,
                overflow: "auto",
              }}
            >
              {String(error?.message || error)}
              {info?.componentStack ? `\n\n${info.componentStack.trim()}` : ""}
            </pre>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "var(--accent)",
                color: "var(--accent-ink)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reload
            </button>
            {!isDev && (
              <button
                onClick={() => this.setState({ error: null, info: null })}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                  color: "var(--ink-2)",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
