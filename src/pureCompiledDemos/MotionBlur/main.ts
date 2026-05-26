import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createMotionBlurScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createMotionBlurScene });
