import { runDemo } from "../../compiledDemos/shared/demoRunner";
import { createPbrGlossyBloomScene } from "./scene";

runDemo({ createScene: createPbrGlossyBloomScene });
