#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {existsSync} from 'node:fs';
import {optimizeImages} from './optimize-images.mjs';
const [command,...args]=process.argv.slice(2);
if(command==='images') await optimizeImages({root:process.cwd()});
else {
 const entries={author:'authoring.mjs',site:'setup.mjs',translate:'sync-content.mjs',taxonomy:'taxonomy.mjs',validate:'validate-hub-contract.mjs'};
 const file=entries[command];
 if(!file){console.error('Usage: gitblog <author|site|translate|taxonomy|validate|images> [arguments]');process.exit(2);}
 const entry=resolve('scripts',file);
 if(!existsSync(entry))throw new Error('Run this command from a GitBlog template root containing scripts/'+file);
 const result=spawnSync(process.execPath,[entry,...args],{stdio:'inherit',env:process.env});
 process.exit(result.status??1);
}
