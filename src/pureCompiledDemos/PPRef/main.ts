import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createPostProcessRefractionScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createPostProcessRefractionScene });
