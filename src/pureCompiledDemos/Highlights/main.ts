import { RegisterFullEngineExtensions } from "@babylonjs/core/pure";
import { runDemo } from "../shared/demoRunner";
import { createHighlightsScene } from "./scene";

RegisterFullEngineExtensions();

runDemo({ createScene: createHighlightsScene });
