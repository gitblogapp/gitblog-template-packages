import {build} from 'esbuild';
import {readdir, mkdir, rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
for (const name of ['core','cli','browser']) {
 const root=`packages/${name}`;
 await rm(`${root}/dist`,{recursive:true,force:true}); await mkdir(`${root}/dist`,{recursive:true});
 const entryPoints=(await readdir(`${root}/src`)).filter(x=>/\.(ts|mjs|js)$/.test(x)).map(x=>`${root}/src/${x}`);
 await build({entryPoints,outdir:`${root}/dist`,bundle:true,packages:'external',format:'esm',platform:name==='browser'?'browser':'node',target:'es2022'});
}
const result=spawnSync('node',['node_modules/typescript/bin/tsc','--project','tsconfig.json'],{stdio:'inherit'});
if(result.status) process.exit(result.status);
import {cp,readFile,writeFile} from 'node:fs/promises';
for(const name of ['core','cli','browser']) {
 for(const file of await readdir(`.types/${name}/src`)) {
  if(/\.d\.(ts|mts)$/.test(file)) await cp(`.types/${name}/src/${file}`,`packages/${name}/dist/${file.replace('.d.mts','.d.ts')}`);
 }
}
await cp('packages/core/dist/taxonomy.d.ts','packages/cli/dist/taxonomy-types.d.ts');
const declaration='packages/cli/dist/taxonomy.d.ts';
await writeFile(declaration,(await readFile(declaration,'utf8')).replace('../../core/src/taxonomy.ts','./taxonomy-types'));
await rm('.types',{recursive:true,force:true});
