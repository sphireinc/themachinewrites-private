import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('website CI security policy', () => {
  const workflow = readFileSync('.github/workflows/security.yml', 'utf8');
  const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
  const gitleaksConfig = readFileSync('.gitleaks.toml', 'utf8');

  it('uses read-only contents permissions and high-severity dependency review', () => {
    expect(workflow).toMatch(/permissions:\n\s+contents: read/);
    expect(workflow).toMatch(/docker:\/\/ghcr\.io\/gitleaks\/gitleaks:v8\.30\.1@sha256:[a-f0-9]{64}/);
    expect(workflow).toMatch(/actions\/checkout@v(?:6|7)/);
    expect(workflow).toContain('args: git --redact --config .gitleaks.toml .');
    expect(workflow).not.toContain('gitleaks/gitleaks-action');
    expect(gitleaksConfig).toMatch(/\[extend\]\s*useDefault = true/);
    expect(workflow).toContain('tmw-deterministic-canary');
    expect(workflow).toMatch(/actions\/dependency-review-action@v(?:4|5)/);
    expect(workflow).toContain('fail-on-severity: high');
    expect(workflow).toContain('npm audit --audit-level=high');
    expect(workflow).toContain('schedule:');
  });

  it('keeps the build workflow tokenless and reproducible from the lockfile', () => {
    expect(ci).toContain('node-version: \'22\'');
    expect(ci).toContain('npm ci');
    expect(ci).not.toMatch(/secrets\.|write-all|contents:\s*write/);
  });
});
