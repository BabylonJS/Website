import { runDemo } from "../shared/demoRunner";
import { createFresnelScene } from "./scene";

runDemo({
    createScene: createFresnelScene,
});
