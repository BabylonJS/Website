import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createGlowLayerScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createGlowLayerScene });
