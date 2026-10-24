# Shared package maintenance

- Preserve public contracts and existing template behavior. Keep browser code free of Node APIs and secrets.
- Edit package source, not generated dist files. No install-time mutation of template repositories.
- Run build, tests and pack. Verify tarball installs in Svelte and Astro before publishing a version.
- Never replace published release assets. Publish a new version for changes.
- Keep GitBlog authorization, private body/media storage and credentials on the server.
