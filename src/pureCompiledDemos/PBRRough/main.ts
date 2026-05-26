import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createPbrRoughScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createPbrRoughScene });
