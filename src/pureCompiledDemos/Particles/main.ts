import { runDemo } from "../../compiledDemos/shared/demoRunner";
import { createParticlesScene } from "./scene";

runDemo({
    createScene: createParticlesScene,
});
