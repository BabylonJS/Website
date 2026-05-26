import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createDefaultRenderingPipelineScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createDefaultRenderingPipelineScene });
