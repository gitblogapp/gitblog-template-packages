# GitBlog Template Packages

Framework-independent contracts and tooling shared by GitBlog's Svelte and Astro templates. Templates retain their own renderers, routes, design, editable content, and extension points.

## Packages

| Package | Responsibility |
| --- | --- |
| `@gitblogapp/core` | Immutable identity, excerpt/XML budgets, taxonomy, membership stubs, AI discovery policy, site/deployment settings, and speech matching. |
| `@gitblogapp/cli` | Authoring/translation validation, taxonomy tools, setup helpers, preservation checks, image optimization, and Cloudflare origin routing. |
| `@gitblogapp/browser` | Privacy-aware analytics request construction and the membership iframe lifecycle/theme/resize adapter. |

Use explicit subpaths, for example:

```js
import { createBodyExcerpt } from '@gitblogapp/core/body-excerpt';
import { membershipStub } from '@gitblogapp/core/membership';
import { optimizeImages } from '@gitblogapp/cli/optimize-images';
import { mountMembership } from '@gitblogapp/browser/membership';
```

Node-only code and dependencies never belong in the browser package. Core's identity and speech modules use Node crypto and run at build time. Import only browser entry points from client code.

## Install a release

The initial distribution uses npm-compatible tarballs in GitHub Releases. No npm account or private package token is needed to install them. Each template commits exact release URLs and its npm lockfile:

```sh
npm install https://github.com/gitblogapp/gitblog-template-packages/releases/download/v0.1.0/gitblogapp-core-0.1.0.tgz https://github.com/gitblogapp/gitblog-template-packages/releases/download/v0.1.0/gitblogapp-cli-0.1.0.tgz https://github.com/gitblogapp/gitblog-template-packages/releases/download/v0.1.0/gitblogapp-browser-0.1.0.tgz
```

These packages have not been published to the npm registry. Do not use `npm install @gitblogapp/core` until registry publication is announced. Lockfile integrity protects downloaded tarballs; never replace a published release asset in place. Upgrade the version and lockfiles together, and validate the template before releasing it.

## Template adapters

The template's existing `scripts/*.mjs` commands remain stable. Shared library implementations are imported from these packages; repository-root lookup, environment loading, framework routing, and output writing stay in the template. The CLI's `gitblog author`, `site`, `translate`, `taxonomy`, and `validate` commands dispatch to these explicit template entry points. Run them from the template root. `gitblog images` directly runs the shared optimizer.

The Astro adapter preserves its existing `content/site.json` fallback. Svelte retains its environment and route integration. Build output remains `build/` in both templates.

Related and Giscus remain independently hosted services. Membership's authenticated service and private content stay in GitBlog; this package only mounts the public reader iframe. TTS inference and model downloads remain an explicit Python/Actions step in the template. No model files or credentials are distributed here.

## Security and compatibility

- Membership public stubs cannot contain a body when preview permission is disabled. Translation rendering inherits the source policy.
- Private membership content must never be committed to a public blog, indexed, or included in full-article TTS.
- The membership SDK checks origin, frame window, and article ID before accepting resize messages. Destroy it when the article unmounts.
- Image optimization works on build output and caches content hashes; it does not rewrite source uploads.
- Existing personal instructions, content, theme, and extension files remain owned by the template user. Dependency upgrades do not overwrite them.
- `AGENTS.md`, workflow YAML, and personal instruction files remain visible in the user's repository. Package installation does not run a postinstall migration.

## Development and release

Node.js 24.12 or later:

```sh
npm ci
npm run build
npm test
npm run pack
```

Source is in `packages/*/src`; build output and declarations are generated in `packages/*/dist`. `artifacts/` contains the three installable tarballs. The build bundles shared source into independent packages so installation does not depend on unpublished npm packages. External dependencies are declared in each package.

Before releasing, install the packed artifacts into both templates and run their checks, integration/SEO fixtures, membership/TTS tests, and preservation checks. CI validates these package-level tests and packed file contents. Publishing a release and adopting it in templates are separate steps; neither deploys a user blog.

To publish to npm, sign in with an account that can publish to the `gitblogapp` organization. All three packages explicitly use public access. Publish the exact tested tarballs, replacing `VERSION` with their shared version:

```sh
npm whoami
npm publish ./artifacts/gitblogapp-core-VERSION.tgz --access public
npm publish ./artifacts/gitblogapp-cli-VERSION.tgz --access public
npm publish ./artifacts/gitblogapp-browser-VERSION.tgz --access public
```

Keep npm credentials in the local npm configuration or a protected CI credential store, never this repository. Once all three packages are publicly available, pin the new version in each template, regenerate its lockfile, and verify a clean `npm ci`. Create a GitHub release with the same tested tarballs and checksums for traceability. Published package versions and release assets are immutable; use a new version for corrections.

## Source provenance

Initial contracts and CLI modules were extracted from `gitblogapp/svelte-gitblog-template` 1.13.2 (source revision `7df40bb2fd70ff10bec83111ef9bd92bb9a90e4a`). Thin compatibility exports preserve existing template import paths. The first release also supplies framework-neutral membership and speech helpers used by both renderers.
