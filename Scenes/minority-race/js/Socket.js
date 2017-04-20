var Socket = (function () {
    function Socket() {
    }
    Socket.connect = function () {
        var _this = this;
        socket = io.connect("http://127.0.0.1:8888");
        socket.on("ok", function (id) {
            _this.id = id;
            _this.isConnected = true;
            console.log("[INFO] Connected to the server");
        });
    };
    Socket.emit = function (eventName, params) {
        socket.emit(eventName, params);
    };
    Socket.on = function (eventName, callback) {
        socket.on(eventName, callback);
    };
    Socket.id = -1;
    Socket.isConnected = false;
    return Socket;
})();
//# sourceMappingURL=Socket.js.map