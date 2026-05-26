import { runDemo } from "../../compiledDemos/shared/demoRunner";
import { createFogScene } from "./scene";

runDemo({
    createScene: createFogScene,
});
