import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createPbrGlossyBloomScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createPbrGlossyBloomScene });
