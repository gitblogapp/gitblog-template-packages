import {test} from 'node:test';
import assert from 'node:assert/strict';
import {membershipStub} from '../packages/core/dist/membership.js';
import {createGiscusTerm} from '../packages/core/dist/post-identity.js';
import {createBodyExcerpt,createSpokenText,bodyExcerptXml} from '../packages/core/dist/body-excerpt.js';
import {speechLocale,findAudio,ttsHash,rawAudio} from '../packages/core/dist/speech.js';
import {analyticsRequest} from '../packages/browser/dist/analytics.js';
import {readFileSync} from 'node:fs';
const id='11111111-1111-4111-8111-111111111111';
test('member stubs fail closed and source policy controls translations',()=>{
 const data={id,membershipId:id,access:'membership',previewAllowed:false};
 assert.throws(()=>membershipStub(data,'PRIVATE'));
 assert.throws(()=>membershipStub({...data,membershipId:'wrong'},''));
 const source=membershipStub(data,'');assert.equal(membershipStub({id},'stale translated text',source).body,'');
 assert.equal(membershipStub({...data,previewAllowed:true},'Approved').body,'Approved');
});
test('post identity, visible excerpt and XML remain stable',()=>{
 assert.match(createGiscusTerm(id),/^giscus-post-[a-f0-9]{16}$/);
 const markdown='# Heading\n\nVisible & useful\n\n![private](secret.png)';
 assert.equal(createBodyExcerpt(markdown),'Visible & useful');assert.equal(createSpokenText(markdown),'Visible & useful');
 assert.match(bodyExcerptXml(createBodyExcerpt(markdown),1000),/Visible &amp; useful/);
});
test('speech supports the canonical language list and rejects stale/private URL shapes',()=>{
 const langs=JSON.parse(readFileSync('tests/speech-languages.json'));
 for(const lang of langs)assert.equal(speechLocale(lang.toUpperCase()+'-XX'),lang);
 assert.equal(speechLocale('zh-hans'),null);
 const entry={postId:id,locale:'ja',voice:'F1',fullHash:ttsHash('hello'),version:'supertonic3-v1'};
 assert.equal(findAudio([entry],id,'ja','F1','hello'),entry);assert.equal(findAudio([entry],id,'ja','F1','changed'),undefined);
 assert.equal(rawAudio('owner/repo','../secret'),null);
});
test('analytics respects privacy and site origin boundaries',()=>{
 const config={siteUrl:'https://blog.example.com',repository:'owner/repo'};
 assert.ok(analyticsRequest(config,'https://blog.example.com/post'));
 assert.equal(analyticsRequest(config,'https://other.example.com/post'),null);
 assert.equal(analyticsRequest(config,'https://blog.example.com/post','',true),null);
});
