const CACHE_NAME =
    'havadia-v1';

const urlsToCache = [

    '/',

    '/style/style.css',

    '/scripts/lyrics-script.js',

    '/scripts/newsletter.js'
];

self.addEventListener(
    'install',
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(cache => {

                return cache.addAll(
                    urlsToCache
                );
            })
        );
    }
);

self.addEventListener(
    'fetch',
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(response => {

                return (
                    response ||
                    fetch(
                        event.request
                    )
                );
            })
        );
    }
);