import {isPostId} from './post-identity';
/** Public stub only. Private bodies never belong in a template input. */
export function membershipStub(data:Record<string,unknown>,body:string,source?:{access:string;membershipId:string|null;previewAllowed:boolean}) {
 const member=(source?.access??data.access)==='membership';
 const previewAllowed=member?(source?.previewAllowed??data.previewAllowed===true):true;
 const membershipId=member?(source?.membershipId??data.membershipId??null):null;
 if(member&&(!isPostId(membershipId)||membershipId!==data.id))throw new Error('Invalid membership stub');
 if(member&&!source&&!previewAllowed&&body.trim())throw new Error('Membership stub cannot contain private body');
 return {access:member?'membership' as const:'public' as const,membershipId:membershipId as string|null,previewAllowed,body:member&&!previewAllowed?'':body};
}
