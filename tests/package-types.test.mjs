import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

test('published module declarations resolve without sibling source repositories', async () => {
 const directory = await mkdtemp(join(tmpdir(), 'gitblog-package-types-'));
 try {
  const imports = [];
  for (const name of ['core', 'cli', 'browser']) {
   const target = join(directory, 'node_modules', '@gitblogapp', name);
   await mkdir(target, { recursive: true });
   await cp(`packages/${name}/package.json`, join(target, 'package.json'));
   await cp(`packages/${name}/dist`, join(target, 'dist'), { recursive: true });
   for (const file of await readdir(join(target, 'dist'))) {
    if (file.endsWith('.js')) imports.push(`import * as module${imports.length} from '@gitblogapp/${name}/${file.slice(0, -3)}';`);
   }
  }
  await writeFile(join(directory, 'consumer.mts'), imports.join('\n'));
  const result = spawnSync(process.execPath, [
   resolve('node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--module', 'NodeNext',
   '--target', 'ES2022', '--types', 'node', '--typeRoots', resolve('node_modules/@types'), 'consumer.mts'
  ], { cwd: directory, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
 } finally {
  await rm(directory, { recursive: true, force: true });
 }
});
