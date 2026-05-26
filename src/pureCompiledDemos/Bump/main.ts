import { runDemo } from "../../compiledDemos/shared/demoRunner";
import { createBumpScene } from "./scene";

runDemo({
    createScene: createBumpScene,
});
