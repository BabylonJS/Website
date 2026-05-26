import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createPbrGlossyScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createPbrGlossyScene });
