export function mountMembership(host: HTMLElement, options: {id:string;locale?:string;readerOrigin?:string}) {
 const origin=options.readerOrigin??'https://gitblog.app';
 if(new URL(origin).origin!==origin || !origin.startsWith('https://'))throw new Error('Reader must be an HTTPS origin');
 const frame=document.createElement('iframe');frame.title='GitBlog membership article';frame.referrerPolicy='no-referrer';
 frame.style.cssText='display:block;width:100%;height:310px;border:0;color-scheme:normal';
 const theme=()=>document.documentElement.dataset.theme==='dark'||document.documentElement.classList.contains('dark')?'dark':document.documentElement.dataset.theme==='light'||document.documentElement.classList.contains('light')?'light':'auto';
 const update=()=>{
  const body=host.previousElementSibling?.matches('.article-content')?host.previousElementSibling:host;
  const style=getComputedStyle(body.querySelector('p')??body),root=getComputedStyle(document.documentElement);
  const heading=getComputedStyle(host.closest('article')?.querySelector('h1,h2')??host);
  const token=(key:string)=>root.getPropertyValue(key).trim();
  if(body!==host&&body.getBoundingClientRect().width>0)host.style.maxWidth=`${body.getBoundingClientRect().width}px`;
  frame.contentWindow?.postMessage({type:'gitblog-membership-theme',id:options.id,theme:theme(),appearance:{text:token('--text')||heading.color,bodyText:style.color,muted:token('--text-dim'),border:token('--border-dim'),surface:token('--bg-component'),background:token('--bg'),accent:token('--primary'),bodyFont:style.fontFamily,headingFont:heading.fontFamily,fontSize:parseFloat(style.fontSize),lineHeight:parseFloat(style.lineHeight)/parseFloat(style.fontSize)}},origin);
 };
 const receive=(event:MessageEvent)=>{if(event.origin!==origin||event.source!==frame.contentWindow||event.data?.type!=='gitblog-membership-resize'||event.data.id!==options.id)return;const height=Number(event.data.height);if(Number.isFinite(height))frame.style.height=`${Math.max(200,Math.min(100000,height))}px`;};
 let disposed=false;
 const observer=new MutationObserver(update);observer.observe(document.documentElement,{attributes:true,attributeFilter:['class','data-theme','style']});
 window.addEventListener('message',receive);window.addEventListener('resize',update);frame.addEventListener('load',update);
 frame.src=`${origin}/membership/embed/${encodeURIComponent(options.id)}?${new URLSearchParams({origin:location.origin,lang:options.locale||document.documentElement.lang||'en',theme:theme()})}`;
 host.append(frame);void document.fonts?.ready.then(()=>{if(!disposed)update();});
 return {destroy(){disposed=true;observer.disconnect();window.removeEventListener('message',receive);window.removeEventListener('resize',update);frame.remove();}};
}
