import {test} from 'node:test';import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {mountMembership} from '../packages/browser/dist/membership.js';
test('iframe accepts only its own trusted resize message and tears down',()=>{
 const window=new Window({url:'https://blog.example.com'});
 for(const key of ['window','document','location','MutationObserver','HTMLElement'])globalThis[key]=window[key]??window;
 globalThis.getComputedStyle=window.getComputedStyle.bind(window);
 const host=window.document.createElement('section');window.document.body.append(host);
 const reader=mountMembership(host,{id:'11111111-1111-4111-8111-111111111111',locale:'ja'}),frame=host.querySelector('iframe');
 assert.match(frame.src,/lang=ja/);assert.match(frame.src,/origin=https%3A%2F%2Fblog.example.com/);
 const data={type:'gitblog-membership-resize',id:'11111111-1111-4111-8111-111111111111',height:700};
 window.dispatchEvent(new window.MessageEvent('message',{origin:'https://evil.test',source:frame.contentWindow,data}));assert.equal(frame.style.height,'310px');
 window.dispatchEvent(new window.MessageEvent('message',{origin:'https://gitblog.app',source:window,data}));assert.equal(frame.style.height,'310px');
 window.dispatchEvent(new window.MessageEvent('message',{origin:'https://gitblog.app',source:frame.contentWindow,data}));assert.equal(frame.style.height,'700px');
 reader.destroy();assert.equal(host.children.length,0);window.happyDOM.abort();
});
