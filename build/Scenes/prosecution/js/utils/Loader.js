var Loader = (function () {
    function Loader(scene) {
        this.assetManager = new BABYLON.AssetsManager(scene);
        this.namesToMeshes = {};
        this.namesToSounds = {};
        this.namesToMeshTasks = {};
        this.namesToSoundTasks = {};
    }
    Loader.prototype.addSound = function (pathFile) {
        var results = /(.*[\/\\])?([A-Za-z0-9\-_]*)/g.exec(pathFile);
        if (!results) {
            throw "Invalid path \"" + pathFile + "\" for sound ! Don't set extension (loader choose between ogg or wav)";
        }
        var extension;
        var audio = new Audio();
        if (audio.canPlayType("audio/ogg") != "") {
            extension = ".ogg";
        }
        else if (audio.canPlayType("audio/wav") != "") {
            extension = ".wav";
        }
        else if (audio.canPlayType("audio/mpeg") != "") {
            extension = ".mp3";
        }
        var folderName = (results.length == 3) ? results[1] : "./";
        var soundName = results[results.length - 1];
        var taskName = soundName + "Task";
        var fileName = soundName + extension;
        this.namesToSoundTasks[soundName] = this.assetManager.addBinaryFileTask(taskName, folderName + fileName);
    };
    Loader.prototype.addMesh = function (pathFile) {
        var results = /(.*[\/\\])?(.*).babylon/g.exec(pathFile);
        if (!results) {
            throw "PathFile \"" + pathFile + "\" is not valid to add Mesh. (it accepts only \".babylon\" file)";
        }
        var folderName = (results.length == 3) ? results[1] : "./";
        var meshName = results[results.length - 1];
        var taskName = meshName + "Task";
        var fileName = meshName + ".babylon";
        this.namesToMeshTasks[meshName] = this.assetManager.addMeshTask(taskName, meshName, folderName, fileName);
    };
    Loader.prototype.getTaskAmount = function () {
        return this.getSoundTaskAmount() + this.getMeshTaskAmount();
    };
    Loader.prototype.getSoundTaskAmount = function () {
        return Object.keys(this.namesToSoundTasks).length;
    };
    Loader.prototype.getMeshTaskAmount = function () {
        return Object.keys(this.namesToMeshTasks).length;
    };
    Loader.prototype.load = function (onComplete, onProgressRatio, onError) {
        var meshTask;
        var soundTask;
        var taskAmount = this.getTaskAmount();
        var that = this;
        var onLoadError = function (error, task) {
            if (onError) {
                onError(error, task);
            }
            else {
                throw error;
            }
        };
        var onTaskLoaded = function () {
            var currentTaskAmount = that.getTaskAmount();
            if (onProgressRatio) {
                onProgressRatio(Math.min((taskAmount - currentTaskAmount) / taskAmount, 1));
            }
            if (currentTaskAmount == 0) {
                onComplete();
            }
        };
        for (var name in this.namesToMeshTasks) {
            meshTask = this.namesToMeshTasks[name];
            meshTask.onSuccess = function (task) {
                that.onMeshTaskLoaded(this, task);
                onTaskLoaded();
            }.bind(name);
            meshTask.onError = function (task) {
                onLoadError("Error on loading mesh " + this + ", corresponding file : \"" + task.rootUrl + task.sceneFilename + "\"", task);
            }.bind(name);
        }
        for (var soundName in this.namesToSoundTasks) {
            soundTask = this.namesToSoundTasks[soundName];
            soundTask.onSuccess = function (task) {
                that.onSoundTaskLoaded(this, task);
                onTaskLoaded();
            }.bind(soundName);
            soundTask.onError = function (task) {
                onLoadError("Error on loading sound " + this + ", corresponding file : \"" + task.url + "/" + this + ".wav\"", task);
            }.bind(soundName);
        }
        this.assetManager.load();
        onProgressRatio(0);
    };
    Loader.prototype.onSoundTaskLoaded = function (soundName, soundTask) {
        var sound = new BABYLON.Sound(soundName, soundTask.data, Services.scene, null, {});
        this.namesToSounds[soundName] = sound;
        delete this.namesToSoundTasks[soundName];
    };
    Loader.prototype.onMeshTaskLoaded = function (meshName, meshTask) {
        var mesh = new BABYLON.Mesh(meshName, Services.scene);
        var abstractMesh;
        if (meshTask.loadedMeshes.length == 0) {
            throw "Mesh \"" + mesh + "\" not found on file \"" + meshTask.rootUrl + meshName + ".babylon\"";
        }
        for (var index in meshTask.loadedMeshes) {
            abstractMesh = meshTask.loadedMeshes[index];
            if (abstractMesh.parent == null) {
                abstractMesh.parent = mesh;
            }
        }
        mesh.setEnabled(false);
        this.namesToMeshes[meshName] = mesh;
        delete this.namesToMeshTasks[meshName];
    };
    Loader.prototype.getMesh = function (meshName) {
        var referenceMesh = this.namesToMeshes[meshName];
        if (!referenceMesh) {
            throw "No mesh loaded with name \"" + meshName + "\"";
        }
        var mesh = referenceMesh.clone(meshName + "_clone");
        mesh.setEnabled(true);
        return mesh;
    };
    Loader.prototype.getSound = function (soundName) {
        var referenceSound = this.namesToSounds[soundName];
        if (!referenceSound) {
            throw "No sound loaded with name \"" + soundName + "\"";
        }
        return referenceSound.clone();
    };
    return Loader;
}());
//# sourceMappingURL=Loader.js.map