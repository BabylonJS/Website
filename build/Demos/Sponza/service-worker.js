self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        './',
        '/Demos/Sponza/',
        '/Demos/Sponza/../../css/index.css',
        '/Demos/Sponza/index.html',
        '/Demos/Sponza/index.css',
        '/Demos/Sponza/index.js',
        '/Demos/Sponza/register-sw.js',
        '/Demos/Sponza/demo.json',
        'https://code.jquery.com/pep/0.4.0/pep.min.js',
        '/Scenes/Sponza/Sponza.babylon.manifest',
        'https://preview.babylonjs.com/babylon.js',
        '/Demos/Sponza/babylon.demo.js',
        '/Demos/Sponza/camera.png',
        '/Demos/Sponza/volume.png',
        '/Demos/Sponza/fullscreen.png',
        '/Demos/Sponza/speaker.png',
        '/Demos/Sponza/mute.png',
        '/Demos/Sponza/vricon.svg',
        '/Demos/Sponza/SponzaBackgroundLoader.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
    console.dir('Oh, fetch ' + event.request.url);
    event.respondWith(
      caches.match(event.request, {ignoreSearch: true}).then(function(resp) {
        return resp || fetch(event.request).then(function(response) {
          return caches.open('v1').then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });  
        });
      })
    );
});
