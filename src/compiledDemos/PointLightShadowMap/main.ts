import { runDemo } from "../shared/demoRunner";
import { createPointLightShadowMapScene } from "./scene";

runDemo({
    createScene: createPointLightShadowMapScene,
});
