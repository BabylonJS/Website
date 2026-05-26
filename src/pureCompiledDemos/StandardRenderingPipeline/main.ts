import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createStandardRenderingPipelineScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createStandardRenderingPipelineScene });
