import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createRibbonsScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({
    createScene: createRibbonsScene,
});
