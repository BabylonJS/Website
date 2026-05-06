import { runDemo } from "../shared/demoRunner";
import { createVolumetricLightScatteringScene } from "./scene";

runDemo({
    createScene: createVolumetricLightScatteringScene,
});
