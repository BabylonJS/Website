var CheckpointManager = (function () {
    function CheckpointManager() {
    }
    CheckpointManager.prototype.initCheckpoints = function (scene, checkpoints, car) {
        for (var i = 0; i < checkpoints.length; i++) {
            checkpoints[i].visibility = 0;
            checkpoints[i].parent = null;
            if (checkpoints[i].name == "checkpoint_001") {
                this.finishLine = checkpoints[i];
                this.activateCheckpoint(scene, this.finishLine, car);
            }
            else if (checkpoints[i].name == "checkpoint_002") {
                this.checkpoint2 = checkpoints[i];
                this.activateCheckpoint(scene, this.checkpoint2, car);
            }
            else if (checkpoints[i].name == "checkpoint_003") {
                this.checkpoint3 = checkpoints[i];
                this.activateCheckpoint(scene, this.checkpoint3, car);
            }
        }
    };
    CheckpointManager.prototype.verifyCheckpoints = function (car) {
        if (car.isFinishLinePassed) {
            if (!car.isCheckpoint2Passed && !car.isCheckpoint3Passed) {
                car.isFinishLinePassed = false;
                return false;
            }
            else
                return true;
        }
    };
    CheckpointManager.prototype.activateCheckpoint = function (scene, checkpoint, car) {
        checkpoint.actionManager = new BABYLON.ActionManager(scene);
        var trigger = { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: car };
        var booleanName;
        if (checkpoint == this.finishLine) {
            booleanName = "isFinishLinePassed";
        }
        else if (checkpoint == this.checkpoint2)
            booleanName = "isCheckpoint2Passed";
        else if (checkpoint == this.checkpoint3)
            booleanName = "isCheckpoint3Passed";
        else {
            console.warn("wrong mesh for a checkpoint");
            return;
        }
        var sba = new BABYLON.SwitchBooleanAction(trigger, car, booleanName);
        checkpoint.actionManager.registerAction(sba);
    };
    return CheckpointManager;
})();
//# sourceMappingURL=CheckpointManager.js.map