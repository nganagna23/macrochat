const CACHE='latoto-macro-v2';
const ASSETS=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(net=>{const clone=net.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return net}).catch(()=>caches.match('./index.html'))))});
