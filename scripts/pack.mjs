import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
await mkdir('artifacts',{recursive:true});
for(const name of ['core','cli','browser']) {
 const result=spawnSync('npm',['pack',`./packages/${name}`,'--pack-destination','artifacts'],{stdio:'inherit'});
 if(result.status)process.exit(result.status);
}
