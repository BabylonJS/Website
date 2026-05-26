import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createPbrScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createPbrScene });
