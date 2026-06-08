import type { Engine } from "@babylonjs/core/pure";
import type { AbstractMesh } from "@babylonjs/core/pure";
import type { Light } from "@babylonjs/core/pure";
import {
    ActionManager,
    ArcRotateCamera,
    CombineAction,
    Color3,
    CreateBox,
    CreateGround,
    CreateSphere,
    CreateTorus,
    DoNothingAction,
    ExecuteCodeAction,
    IncrementValueAction,
    InterpolateValueAction,
    PointLight,
    RegisterAction,
    RegisterAnimatable,
    RegisterAnimation,
    RegisterDirectActions,
    RegisterInterpolateValueAction,
    Scene,
    SetStateAction,
    SetValueAction,
    StandardMaterial,
    StateCondition,
    Vector3,
} from "@babylonjs/core/pure";

RegisterAction();
RegisterDirectActions();
RegisterInterpolateValueAction();
RegisterAnimation();
RegisterAnimatable();

export function createActionsScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 0, 0), scene);
    camera.setPosition(new Vector3(20, 200, 400));
    camera.attachControl(canvas, true);

    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 150;

    scene.clearColor = new Color3(0, 0, 0).toColor4(1);

    const light1 = new PointLight("omni", new Vector3(0, 50, 0), scene);
    const light2 = new PointLight("omni", new Vector3(0, 50, 0), scene);
    const light3 = new PointLight("omni", new Vector3(0, 50, 0), scene);

    light1.diffuse = Color3.Red();
    light2.diffuse = Color3.Green();
    light3.diffuse = Color3.Blue();

    light1.state = "on";
    light2.state = "on";
    light3.state = "on";

    const ground = CreateGround("ground", { width: 1000, height: 1000, subdivisions: 1 }, scene);
    const groundMaterial = new StandardMaterial("ground", scene);
    groundMaterial.specularColor = Color3.Black();
    ground.material = groundMaterial;

    const redBox = CreateBox("red", { size: 20 }, scene);
    const redMat = new StandardMaterial("ground", scene);
    redMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    redMat.specularColor = new Color3(0.4, 0.4, 0.4);
    redMat.emissiveColor = Color3.Red();
    redBox.material = redMat;
    redBox.position.x -= 100;

    const greenBox = CreateBox("green", { size: 20 }, scene);
    const greenMat = new StandardMaterial("ground", scene);
    greenMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    greenMat.specularColor = new Color3(0.4, 0.4, 0.4);
    greenMat.emissiveColor = Color3.Green();
    greenBox.material = greenMat;
    greenBox.position.z -= 100;

    const blueBox = CreateBox("blue", { size: 20 }, scene);
    const blueMat = new StandardMaterial("ground", scene);
    blueMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    blueMat.specularColor = new Color3(0.4, 0.4, 0.4);
    blueMat.emissiveColor = Color3.Blue();
    blueBox.material = blueMat;
    blueBox.position.x += 100;

    const sphere = CreateSphere("sphere", { segments: 16, diameter: 20 }, scene);
    const sphereMat = new StandardMaterial("ground", scene);
    sphereMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    sphereMat.specularColor = new Color3(0.4, 0.4, 0.4);
    sphereMat.emissiveColor = Color3.Purple();
    sphere.material = sphereMat;
    sphere.position.z += 100;

    const donut = CreateTorus("donut", { diameter: 20, thickness: 8, tessellation: 16 }, scene);

    const prepareButton = (mesh: AbstractMesh, color: Color3, light: Light) => {
        const goToColorAction = new InterpolateValueAction(
            ActionManager.OnPickTrigger,
            light,
            "diffuse",
            color,
            1000,
            undefined,
            true
        );

        mesh.actionManager = new ActionManager(scene);
        mesh.actionManager
            .registerAction(
                new InterpolateValueAction(ActionManager.OnPickTrigger, light, "diffuse", Color3.Black(), 1000)
            )!
            .then(
                new CombineAction(ActionManager.NothingTrigger, [
                    goToColorAction,
                    new SetValueAction(ActionManager.NothingTrigger, mesh.material, "wireframe", false),
                ])
            );
        mesh.actionManager
            .registerAction(new SetValueAction(ActionManager.OnPickTrigger, mesh.material, "wireframe", true))!
            .then(new DoNothingAction());
        mesh.actionManager
            .registerAction(new SetStateAction(ActionManager.OnPickTrigger, light, "off"))!
            .then(new SetStateAction(ActionManager.OnPickTrigger, light, "on"));
    };

    prepareButton(redBox, Color3.Red(), light1);
    prepareButton(greenBox, Color3.Green(), light2);
    prepareButton(blueBox, Color3.Blue(), light3);

    sphere.actionManager = new ActionManager(scene);
    const sphereActionManager = sphere.actionManager as ActionManager;
    const condition1 = new StateCondition(sphereActionManager, light1, "off");
    const condition2 = new StateCondition(sphereActionManager, light1, "on");

    sphere.actionManager.registerAction(
        new InterpolateValueAction(ActionManager.OnLeftPickTrigger, camera, "alpha", 0, 500, condition1)
    );
    sphere.actionManager.registerAction(
        new InterpolateValueAction(ActionManager.OnLeftPickTrigger, camera, "alpha", Math.PI, 500, condition2)
    );

    const makeOverOut = (mesh: AbstractMesh) => {
        mesh.actionManager!.registerAction(
            new SetValueAction(
                ActionManager.OnPointerOutTrigger,
                mesh.material,
                "emissiveColor",
                (mesh.material as StandardMaterial).emissiveColor
            )
        );
        mesh.actionManager!.registerAction(
            new SetValueAction(ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", Color3.White())
        );
        mesh.actionManager!.registerAction(
            new InterpolateValueAction(ActionManager.OnPointerOutTrigger, mesh, "scaling", new Vector3(1, 1, 1), 150)
        );
        mesh.actionManager!.registerAction(
            new InterpolateValueAction(
                ActionManager.OnPointerOverTrigger,
                mesh,
                "scaling",
                new Vector3(1.1, 1.1, 1.1),
                150
            )
        );
    };

    makeOverOut(redBox);
    makeOverOut(greenBox);
    makeOverOut(blueBox);
    makeOverOut(sphere);

    scene.actionManager = new ActionManager(scene);

    const rotate = (mesh: AbstractMesh) => {
        scene.actionManager!.registerAction(
            new IncrementValueAction(ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", 0.01)
        );
    };

    rotate(redBox);
    rotate(greenBox);
    rotate(blueBox);

    donut.actionManager = new ActionManager(scene);

    donut.actionManager.registerAction(
        new SetValueAction(
            { trigger: ActionManager.OnIntersectionEnterTrigger, parameter: sphere },
            donut,
            "scaling",
            new Vector3(1.2, 1.2, 1.2)
        )
    );
    donut.actionManager.registerAction(
        new SetValueAction(
            { trigger: ActionManager.OnIntersectionExitTrigger, parameter: sphere },
            donut,
            "scaling",
            new Vector3(1, 1, 1)
        )
    );

    scene.actionManager.registerAction(
        new ExecuteCodeAction({ trigger: ActionManager.OnKeyUpTrigger, parameter: "r" }, () => {
            camera.setPosition(new Vector3(20, 200, 400));
        })
    );

    let alpha = 0;
    scene.registerBeforeRender(() => {
        donut.position.x = 100 * Math.cos(alpha);
        donut.position.y = 5;
        donut.position.z = 100 * Math.sin(alpha);
        alpha += 0.01;
    });

    return scene;
}
