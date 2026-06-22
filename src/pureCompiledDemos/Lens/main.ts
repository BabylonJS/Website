import { RegisterRay } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createLensScene } from "./scene";

RegisterRay();

runDemo({ createScene: createLensScene });
