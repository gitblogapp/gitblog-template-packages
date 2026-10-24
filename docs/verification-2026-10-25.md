# Shared-package adoption verification — 2026-10-25

## Repository rename and 0.1.1 preparation

The repository and local checkout are now named `gitblog-template-packages`. Package names remain `@gitblogapp/core`, `@gitblogapp/cli`, and `@gitblogapp/browser`. Version 0.1.1 updates their repository metadata, declares public npm access, and makes the CLI declarations self-contained for NodeNext consumers.

Six package tests, the build, and packing passed. Both templates installed the 0.1.1 tarballs locally and passed `update:check`, including production builds, SEO fixtures, and preservation checks. Astro also passed `test:integration`. These checks precede publication; registry publication and adoption must be confirmed separately.

## Released artifacts

- Source: `gitblogapp/gitblog-template-packages`, initial implementation `5a8b217`.
- Release: `v0.1.0`, npm-compatible core/CLI/browser tarballs and SHA-256 checksums.
- Package CI on Node 24 passed (Actions run `40116194033`).
- Both templates installed the public GitHub release URLs and then completed `npm ci`. Their lockfiles contain tarball integrity hashes, with no local `file:` package dependency.
- Svelte integration source: `bfafa54`; template release `1.14.0`, manifest commit `78a3f11`.
- Astro integration is applied in the existing local `astro-gitblog-template` directory, which has no Git remote. No new remote Astro template or catalog entry was created.

## Validation

Package build, declarations, five contract/browser tests, and tarball packing passed. Tests cover immutable identity, excerpt/XML handling, membership stub restrictions, source-policy inheritance, speech language/hash selection, analytics privacy, and iframe origin/source checks plus teardown.

Svelte passed:

- `npm run check` (including Svelte diagnostics: zero errors/warnings).
- `PUBLIC_SITE_URL=https://fixture.github.io PUBLIC_SITE_REPOSITORY=fixture/blog npm run update:check`: checks, production build, translated SEO fixtures, and preservation checks. The template's saved address remains unconfigured; these values were process-local test inputs.
- `npm run test:memberships`: approved previews, locked stubs, translations, membership SEO, and exclusion from full speech generation.
- `npm run test:tts`: DeepL/manual translation fixtures and Python speech pipeline tests.

Astro passed:

- `npm run update:check`: harness tests, Astro diagnostics (zero errors/warnings), content contract tests, production build, SEO and preservation checks.
- `npm run test:integration`: root GitHub Pages, project-path Pages, and custom-domain fixtures; RSS, sitemap, Markdown, discovery, search, extension preservation, stale translation rejection, source withdrawal, and empty blogs. Added assertions verify related-panel identity/language/count, analytics configuration, and speech input manifests.
- `npm run test:browser`: real headless Chrome, project-base navigation, Korean/English Pagefind, Unicode URLs, Markdown MIME, drafts, mobile widths, and persistent theme.
- Membership and translated-TTS fixtures ran as part of the harness; Python speech pipeline tests also passed separately.

Speech tests use deterministic synthesis fixtures to check routing, caching and outputs. They do not claim a new live model inference or listening-quality assessment. Browser membership authorization remains in the existing hosted service; this change does not alter that backend.

## Operational boundaries

The template repository's deploy workflow skips publishing a blog from the template itself. Existing user blogs were not upgraded or deployed. Astro's official registration remains opt-in and also requires its repository to be published in GitBlog's template catalog. The application, databases, membership records, DNS and secrets were not changed.

Framework route/environment adapters, theme code and root workflow/script entry points remain in templates. Shared libraries replace their common implementations. The historical `template-standard` snapshots remain archived references; its maintenance guide points package-enabled templates to this repository.
