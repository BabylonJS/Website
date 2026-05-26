import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createAdvancedShadowsScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createAdvancedShadowsScene });
