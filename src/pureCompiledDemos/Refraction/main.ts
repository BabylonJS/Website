import { RegisterFullEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createRefractionScene } from "./scene";

RegisterFullEngineExtensions();

runDemo({
    createScene: createRefractionScene,
});
