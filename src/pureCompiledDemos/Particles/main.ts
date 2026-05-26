import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createParticlesScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({
    createScene: createParticlesScene,
});
