/* Service worker do FiecLab
   Guarda uma cópia do site no navegador para ele abrir mais rápido e continuar
   abrindo mesmo sem internet. */

// ao mudar arquivos do site, troque o número da versão (v2, v3...) para limpar o cache antigo
const CACHE_NAME = "fieclab-v1";

// arquivos guardados já na instalação
const PRECACHE_URLS = ["/", "/index.html", "/logo-fieclab.png"];

function saveInCache(request, response) {
  return caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
}

// 1) INSTALAÇÃO: guarda os arquivos básicos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// 2) ATIVAÇÃO: apaga caches de versões antigas e assume o controle da página
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3) BUSCA: decide se a resposta vem da internet ou do cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // só mexe em pedidos GET do próprio site (fontes do Google, VLibras e Firebase seguem direto)
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // páginas: tenta a internet primeiro; sem internet, abre a cópia guardada
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          saveInCache("/index.html", response.clone());
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // arquivos (js, css, imagens): usa o cache se já tiver; senão busca e guarda
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) saveInCache(request, response.clone());
          return response;
        })
    )
  );
});
