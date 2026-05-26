import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createDofScene } from "./scene";

RegisterStandardEngineExtensions();

runDemo({ createScene: createDofScene });
