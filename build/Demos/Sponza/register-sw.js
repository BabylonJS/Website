if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(function(reg) {
        console.log("Service worker registered");
    }).catch(function(err) {
      console.log('Oh no! Service workers is not available', err);
    });
}