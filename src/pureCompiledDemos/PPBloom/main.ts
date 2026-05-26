import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createPostProcessBloomScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createPostProcessBloomScene });
