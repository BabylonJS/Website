import { RegisterEnginesExtensionsEngineRawTexture, RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createPostProcessRefractionScene } from "./scene";

RegisterStandardEngineExtensions();
RegisterEnginesExtensionsEngineRawTexture();

runDemo({ createScene: createPostProcessRefractionScene });
