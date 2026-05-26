import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createConvolutionScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createConvolutionScene });
