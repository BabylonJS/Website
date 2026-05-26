import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createCustomRenderTargetScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createCustomRenderTargetScene });
