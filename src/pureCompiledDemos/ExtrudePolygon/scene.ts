import type { Engine } from "@babylonjs/core/pure";
import {
    ArcRotateCamera,
    Color3,
    Color4,
    ExtrudePolygon,
    HemisphericLight,
    Mesh,
    RegisterPolygonBuilder,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
    Vector4,
} from "@babylonjs/core/pure";
import { CreateBox } from "@babylonjs/core/pure";
import earcut from "earcut";

RegisterPolygonBuilder();

export function createExtrudePolygonScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);

    const extrudePolygon = (
        name: string,
        options: { shape: Vector3[]; holes?: Vector3[][]; depth?: number; faceUV?: Vector4[]; faceColors?: Color4[] },
        scn: Scene
    ) => ExtrudePolygon(name, options, scn, earcut);

    // camera
    const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 25, new Vector3(0, 0, 4.5), scene);
    camera.attachControl(canvas, true);

    new HemisphericLight("hemiLight", new Vector3(10, 10, 0), scene);

    const wallmat = new StandardMaterial("wallmaterial", scene);
    wallmat.diffuseTexture = new Texture("/Scenes/Customs/Ground.jpg", scene);

    const innerwallmat = new StandardMaterial("innerwallmaterial", scene);
    innerwallmat.diffuseColor = new Color3(240 / 255, 223 / 255, 203 / 255);

    //Polygon shape in XoZ plane
    const frontWallData = [
        new Vector3(-5.5, 0, -3),
        new Vector3(-0.5, 0, -3),
        new Vector3(-0.5, 0, -0.75),
        new Vector3(0.5, 0, -0.75),
        new Vector3(0.5, 0, -3),
        new Vector3(5.5, 0, -3),
        new Vector3(5.5, 0, 3),
        new Vector3(-5.5, 0, 3),
    ];

    //Holes in XoZ plane
    const frontWindowHoles = [];
    frontWindowHoles[0] = [
        new Vector3(-4.78, 0, -2.3),
        new Vector3(-1.58, 0, -2.3),
        new Vector3(-1.58, 0, -0.3),
        new Vector3(-4.78, 0, -0.3),
    ];
    frontWindowHoles[1] = [
        new Vector3(1.58, 0, -2.3),
        new Vector3(4.78, 0, -2.3),
        new Vector3(4.78, 0, -0.3),
        new Vector3(1.58, 0, -0.3),
    ];
    frontWindowHoles[2] = [
        new Vector3(-4.03, 0, 0.75),
        new Vector3(-2.13, 0, 0.75),
        new Vector3(-2.13, 0, 2.55),
        new Vector3(-4.03, 0, 2.55),
    ];
    frontWindowHoles[3] = [
        new Vector3(-0.65, 0, 0.75),
        new Vector3(0.65, 0, 0.75),
        new Vector3(0.65, 0, 2.55),
        new Vector3(-0.65, 0, 2.55),
    ];
    frontWindowHoles[4] = [
        new Vector3(2.13, 0, 0.75),
        new Vector3(4.03, 0, 0.75),
        new Vector3(4.03, 0, 2.55),
        new Vector3(2.13, 0, 2.55),
    ];

    const faceUV = new Array(3);

    faceUV[0] = new Vector4(0, 0, 7 / 15, 1);
    faceUV[1] = new Vector4(14 / 15, 0, 1, 1);
    faceUV[2] = new Vector4(7 / 15, 0, 14 / 15, 1);

    const frontWall = extrudePolygon(
        "wall",
        { shape: frontWallData, depth: 0.15, holes: frontWindowHoles, faceUV: faceUV },
        scene
    );
    frontWall.rotation.x = -Math.PI / 2;

    frontWall.material = wallmat;

    const rearWallnb1Data = [
        new Vector3(1.4, 0, -3),
        new Vector3(5.5, 0, -3),
        new Vector3(5.5, 0, 3),
        new Vector3(1.4, 0, 3),
    ];

    //Holes in XoZ plane
    const rear1WindowHoles = [];
    rear1WindowHoles[0] = [
        new Vector3(3.7, 0, -1.8),
        new Vector3(4.5, 0, -1.8),
        new Vector3(4.5, 0, -0.3),
        new Vector3(3.7, 0, -0.3),
    ];
    rear1WindowHoles[1] = [
        new Vector3(1.9, 0, 0.75),
        new Vector3(2.7, 0, 0.75),
        new Vector3(2.7, 0, 2.55),
        new Vector3(1.9, 0, 2.55),
    ];
    rear1WindowHoles[2] = [
        new Vector3(4.2, 0, 0.75),
        new Vector3(5, 0, 0.75),
        new Vector3(5, 0, 2.55),
        new Vector3(4.2, 0, 2.55),
    ];

    const rearFaceUV = [];
    rearFaceUV[0] = new Vector4(7 / 15, 0, 14 / 15, 1);
    rearFaceUV[1] = new Vector4(14 / 15, 0, 1, 1);
    rearFaceUV[2] = new Vector4(0, 0, 7 / 15, 1);

    const rearWallnb1 = extrudePolygon(
        "rearWallnb1",
        { shape: rearWallnb1Data, depth: 0.1, holes: rear1WindowHoles, faceUV: rearFaceUV },
        scene
    );
    rearWallnb1.rotation.x = -Math.PI / 2;
    rearWallnb1.position.z = 6.15;

    rearWallnb1.material = wallmat;

    const rearWallnb2Data = [
        new Vector3(-5.6, 0, -3),
        new Vector3(1.45, 0, -3),
        new Vector3(1.45, 0, 3),
        new Vector3(-2.075, 0, 5.5),
        new Vector3(-5.6, 0, 3),
    ];

    const rear2WindowHoles = [];
    rear2WindowHoles[0] = [
        new Vector3(-5, 0, -1.8),
        new Vector3(-1.85, 0, -1.8),
        new Vector3(-1.85, 0, -0.3),
        new Vector3(-5, 0, -0.3),
    ];
    rear2WindowHoles[1] = [
        new Vector3(-0.8, 0, -1.8),
        new Vector3(0.9, 0, -1.8),
        new Vector3(0.9, 0, -0.3),
        new Vector3(-0.8, 0, -0.3),
    ];
    rear2WindowHoles[2] = [
        new Vector3(-5, 0, 0.75),
        new Vector3(-1.85, 0, 0.75),
        new Vector3(-1.85, 0, 2.55),
        new Vector3(-5, 0, 2.55),
    ];
    rear2WindowHoles[3] = [
        new Vector3(-0.6, 0, 1.75),
        new Vector3(0.7, 0, 1.75),
        new Vector3(0.7, 0, 2.55),
        new Vector3(-0.6, 0, 2.55),
    ];

    const rearWallnb2 = extrudePolygon(
        "rearWallnb2",
        { shape: rearWallnb2Data, holes: rear2WindowHoles, depth: 0.1, faceUV: rearFaceUV },
        scene
    );
    rearWallnb2.rotation.x = -Math.PI / 2;
    rearWallnb2.position.z = 9.15;

    rearWallnb2.material = wallmat;

    const sideWallnb1Data = [
        new Vector3(-3.15, 0, -3),
        new Vector3(3.1, 0, -3),
        new Vector3(3.1, 0, 3),
        new Vector3(0, 0, 5.5),
        new Vector3(-3.15, 0, 3),
    ];

    const side1FaceUV = new Array(3);

    side1FaceUV[0] = new Vector4(0, 0, 7 / 15, 1);
    side1FaceUV[1] = new Vector4(14 / 15, 0, 1, 1);
    side1FaceUV[2] = new Vector4(7 / 15, 0, 14 / 15, 1);

    const sideWallnb1 = extrudePolygon(
        "sideWallnb1",
        { shape: sideWallnb1Data, depth: 0.1, faceUV: side1FaceUV },
        scene
    );
    sideWallnb1.rotation.z = -Math.PI / 2;
    sideWallnb1.rotation.x = -Math.PI / 2;
    sideWallnb1.position.x = 5.6;
    sideWallnb1.position.z = 3.15;

    sideWallnb1.material = wallmat;

    const sideWallnb2Data = [
        new Vector3(-3.15, 0, -3),
        new Vector3(6, 0, -3),
        new Vector3(6, 0, 3),
        new Vector3(3.1, 0, 3),
        new Vector3(0, 0, 5.5),
        new Vector3(-3.15, 0, 3),
    ];

    const side2FaceUV = new Array(3);

    side2FaceUV[0] = new Vector4(7 / 15, 0, 14 / 15, 1);
    side2FaceUV[1] = new Vector4(14 / 15, 0, 1, 1);
    side2FaceUV[2] = new Vector4(0, 0, 7 / 15, 1);

    const sideWallnb2 = extrudePolygon(
        "sideWallnb2",
        { shape: sideWallnb2Data, depth: 0.1, faceUV: side2FaceUV },
        scene
    );
    sideWallnb2.rotation.z = -Math.PI / 2;
    sideWallnb2.rotation.x = -Math.PI / 2;
    sideWallnb2.position.x = -5.5;
    sideWallnb2.position.z = 3.15;

    sideWallnb2.material = wallmat;

    const sideWallnb3Data = [
        new Vector3(3.1, 0, -3),
        new Vector3(4.5, 0, -3),
        new Vector3(4.5, 0, -0.75),
        new Vector3(5.5, 0, -0.75),
        new Vector3(5.5, 0, -3),
        new Vector3(6, 0, -3),
        new Vector3(6, 0, 3),
        new Vector3(3.1, 0, 3),
    ];

    const side3FaceUV = new Array(3);

    side3FaceUV[0] = new Vector4(0, 0, 7 / 15, 1);
    side3FaceUV[1] = new Vector4(14 / 15, 0, 1, 1);
    side3FaceUV[2] = new Vector4(7 / 15, 0, 14 / 15, 1);

    const sideWallnb3 = extrudePolygon(
        "sideWallnb3",
        { shape: sideWallnb3Data, depth: 0.1, faceUV: side3FaceUV },
        scene
    );
    sideWallnb3.rotation.z = -Math.PI / 2;
    sideWallnb3.rotation.x = -Math.PI / 2;
    sideWallnb3.position.x = 1.45;
    sideWallnb3.position.z = 3.15;

    sideWallnb3.material = wallmat;

    const roofmat = new StandardMaterial("roofmat", scene);
    roofmat.diffuseTexture = new Texture("/Scenes/Customs/Ground.jpg", scene);

    const roof1Data = [
        new Vector3(-0.05, 0, 0),
        new Vector3(0.1, 0, 0),
        new Vector3(3.3, 0, 2.65),
        new Vector3(6.5, 0, 0),
        new Vector3(6.6, 0, 0),
        new Vector3(3.3, 0, 2.8),
    ];

    const roof1 = extrudePolygon("roof1", { shape: roof1Data, depth: 11.5 }, scene);
    roof1.rotation.z = -Math.PI / 2;
    roof1.rotation.x = -Math.PI / 2;
    roof1.position.x = 5.7;
    roof1.position.y = 2.9;
    roof1.position.z = -0.15;

    roof1.material = roofmat;

    const roof2Data = [
        new Vector3(0, 0, 0),
        new Vector3(0.142, 0, 0),
        new Vector3(3.834, 0, 2.6),
        new Vector3(7.476, 0, 0),
        new Vector3(7.618, 0, 0),
        new Vector3(3.834, 0, 2.7),
    ];

    const roof2 = extrudePolygon("roof2", { shape: roof2Data, depth: 3.2 }, scene);
    roof2.rotation.x = -Math.PI / 2;
    roof2.position.x = -5.9;
    roof2.position.y = 2.9;
    roof2.position.z = 6.3;

    roof2.material = roofmat;

    const roof3Data = [
        new Vector3(0.3, 0, 0.2),
        new Vector3(0.442, 0, 0.2),
        new Vector3(3.834, 0, 2.6),
        new Vector3(7.476, 0, 0),
        new Vector3(7.618, 0, 0),
        new Vector3(3.834, 0, 2.7),
    ];

    const roof3 = extrudePolygon("roof3", { shape: roof3Data, depth: 3.2 }, scene);
    roof3.rotation.x = -Math.PI / 2;
    roof3.position.x = -5.9;
    roof3.position.y = 2.9;
    roof3.position.z = 3.1;

    roof3.material = roofmat;

    Mesh.MergeMeshes([roof1, roof2, roof3], true);

    const stairsDepth = 2;
    const stairsHeight = 3.0;
    const stairsThickness = 0.05;
    const nBStairs = 12;
    const stairs = [];
    let x = 0;
    let z = 0;
    //up
    stairs.push(new Vector3(x, 0, z));
    z += stairsHeight / nBStairs - stairsThickness;
    stairs.push(new Vector3(x, 0, z));
    for (let i = 0; i < nBStairs; i++) {
        x += stairsDepth / nBStairs;
        stairs.push(new Vector3(x, 0, z));
        z += stairsHeight / nBStairs;
        stairs.push(new Vector3(x, 0, z));
    }
    x += stairsDepth / nBStairs - stairsThickness;
    stairs.push(new Vector3(x, 0, z));

    //down
    for (let i = 0; i <= nBStairs; i++) {
        x -= stairsDepth / nBStairs;
        stairs.push(new Vector3(x, 0, z));
        z -= stairsHeight / nBStairs;
        stairs.push(new Vector3(x, 0, z));
    }
    const faceColors = [];
    faceColors[0] = new Color4(0, 0, 0, 1);
    faceColors[1] = new Color4(190 / 255, 139 / 255, 94 / 255, 1);
    faceColors[2] = new Color4(0, 0, 0, 1);

    const stairsWidth = 1.0;
    const stairCase = extrudePolygon("stairs", { shape: stairs, depth: stairsWidth, faceColors: faceColors }, scene);
    stairCase.position.x = 1.37;
    stairCase.position.y = -3.0;
    stairCase.position.z = 2.51;
    stairCase.rotation.x = -Math.PI / 2;
    stairCase.rotation.y = -Math.PI / 2;

    const floormat = new StandardMaterial("floormaterial", scene);
    floormat.diffuseTexture = new Texture("/Scenes/Customs/Ground.jpg", scene);

    const floorData = [
        new Vector3(-5.5, 0, 0),
        new Vector3(5.5, 0, 0),
        new Vector3(5.5, 0, 6),
        new Vector3(1.345, 0, 6),
        new Vector3(1.345, 0, 9),
        new Vector3(-5.5, 0, 9),
    ];

    const stairSpace = [];
    stairSpace[0] = [
        new Vector3(0.27, 0, 2.5),
        new Vector3(0.27, 0, 4.5),
        new Vector3(1.37, 0, 4.5),
        new Vector3(1.37, 0, 2.5),
    ];

    const floorFaceUV = new Array(3);

    floorFaceUV[0] = new Vector4(0, 0, 0.5, 1);
    floorFaceUV[2] = new Vector4(0.5, 0, 1, 1);

    const floor = extrudePolygon(
        "floor",
        { shape: floorData, holes: stairSpace, depth: 0.1, faceUV: floorFaceUV },
        scene
    );
    floor.position.y = 0.21;
    floor.position.z = 0.15;

    floor.material = floormat;

    const groundFloorData = [
        new Vector3(-5.6, 0, -0.1),
        new Vector3(5.6, 0, -0.1),
        new Vector3(5.6, 0, 6.1),
        new Vector3(1.36, 0, 6.1),
        new Vector3(1.36, 0, 9.1),
        new Vector3(-5.6, 0, 9.1),
    ];

    const groundFloorFaceUV = new Array(3);

    groundFloorFaceUV[0] = new Vector4(0, 0, 0.5, 1);
    groundFloorFaceUV[2] = new Vector4(0.5, 0, 1, 1);

    const groundFloor = extrudePolygon(
        "groundFloor",
        { shape: groundFloorData, depth: 0.04, faceUV: groundFloorFaceUV },
        scene
    );
    groundFloor.position.y = -3;
    groundFloor.position.z = 0.15;
    groundFloor.material = floormat;

    const ceilingData = [
        new Vector3(-5.5, 0, 0),
        new Vector3(5.5, 0, 0),
        new Vector3(5.5, 0, 6),
        new Vector3(1.345, 0, 6),
        new Vector3(1.345, 0, 9),
        new Vector3(-5.5, 0, 9),
    ];

    const ceiling = extrudePolygon("ceiling", { shape: ceilingData, depth: 0.1 }, scene);
    ceiling.position.y = 2.8;
    ceiling.position.z = 0.15;

    ceiling.material = innerwallmat;

    const innerWallnb1Data = [
        new Vector3(-3, 0, 0.6),
        new Vector3(-3, 0, 0),
        new Vector3(3, 0, 0),
        new Vector3(3, 0, 6.1),
        new Vector3(-3, 0, 6.1),
        new Vector3(-3, 0, 1.6),
        new Vector3(-1, 0, 1.6),
        new Vector3(-1, 0, 0.6),
    ];

    const doorSpace1 = [];
    doorSpace1[0] = [
        new Vector3(0.1, 0, 1.6),
        new Vector3(0.1, 0, 0.6),
        new Vector3(2, 0, 0.6),
        new Vector3(2, 0, 1.6),
    ];

    const innerWallnb1 = extrudePolygon(
        "innerWallnb1",
        { shape: innerWallnb1Data, holes: doorSpace1, depth: 0.1 },
        scene
    );
    innerWallnb1.rotation.z = Math.PI / 2;
    innerWallnb1.position.x = 1.35;
    innerWallnb1.position.z = 0.15;

    innerWallnb1.material = innerwallmat;

    const innerWallnb2Data = [
        new Vector3(-3, 0, 0),
        new Vector3(3, 0, 0),
        new Vector3(3, 0, 9),
        new Vector3(-3, 0, 9),
        new Vector3(-3, 0, 7.6),
        new Vector3(-1, 0, 7.6),
        new Vector3(-1, 0, 6.6),
        new Vector3(-3, 0, 6.6),
        new Vector3(-3, 0, 1.6),
        new Vector3(-1, 0, 1.6),
        new Vector3(-1, 0, 0.6),
        new Vector3(-3, 0, 0.6),
    ];

    const doorSpace2 = [];
    doorSpace2[0] = [
        new Vector3(0.1, 0, 0.6),
        new Vector3(2, 0, 0.6),
        new Vector3(2, 0, 1.6),
        new Vector3(0.1, 0, 1.6),
    ];
    doorSpace2[1] = [
        new Vector3(0.1, 0, 4.6),
        new Vector3(2, 0, 4.6),
        new Vector3(2, 0, 5.6),
        new Vector3(0.1, 0, 5.6),
    ];

    const innerWallnb2 = extrudePolygon(
        "innerWallnb2",
        { shape: innerWallnb2Data, holes: doorSpace2, depth: 0.1 },
        scene
    );
    innerWallnb2.rotation.z = Math.PI / 2;
    innerWallnb2.position.x = 1.35;
    innerWallnb2.position.z = 0.15;
    innerWallnb2.position.x = -1.4;

    innerWallnb2.material = innerwallmat;

    const bathroomWallData = [
        new Vector3(-1.4, 0, 0),
        new Vector3(-0.5, 0, 0),
        new Vector3(-0.5, 0, 2),
        new Vector3(0.5, 0, 2),
        new Vector3(0.5, 0, 0),
        new Vector3(1.4, 0, 0),
        new Vector3(1.4, 0, 6),
        new Vector3(-1.4, 0, 6),
    ];

    const doorSpace3 = [];
    doorSpace3[0] = [
        new Vector3(-0.5, 0, 3.2),
        new Vector3(-0.5, 0, 5.2),
        new Vector3(0.5, 0, 5.2),
        new Vector3(0.5, 0, 3.2),
    ];

    const bathroomWall = extrudePolygon(
        "bathroomWall",
        { shape: bathroomWallData, depth: 0.1, holes: doorSpace3 },
        scene
    );
    bathroomWall.rotation.x = -Math.PI / 2;
    bathroomWall.position.y = -3;
    bathroomWall.position.z = 6;

    bathroomWall.material = innerwallmat;

    const bedroom1WallData = [
        new Vector3(-5.5, 0, 0),
        new Vector3(-2.9, 0, 0),
        new Vector3(-2.9, 0, 2),
        new Vector3(-1.9, 0, 2),
        new Vector3(-1.9, 0, 0),
        new Vector3(-1.4, 0, 0),
        new Vector3(-1.4, 0, 6),
        new Vector3(-5.5, 0, 6),
    ];

    const bedroom1Wall = extrudePolygon("bedroom1Wall", { shape: bedroom1WallData, depth: 0.1 }, scene);
    bedroom1Wall.rotation.x = -Math.PI / 2;
    bedroom1Wall.position.y = -3;
    bedroom1Wall.position.z = 4.5;

    bedroom1Wall.material = innerwallmat;

    const bannisterWallData = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(1, 0, 1.4),
        new Vector3(1.75, 0, 1.4),
        new Vector3(1.75, 0, 0),
        new Vector3(3.5, 0, 0),
        new Vector3(3.5, 0, 3.2),
        new Vector3(1.5, 0, 3.2),
        new Vector3(0, 0, 0.75),
    ];
    const spindleThickness = 0.05;
    const spindles = 12;
    const railGap = (1.5 - spindles * spindleThickness) / (spindles - 1);
    const rail = [];
    let ac = spindleThickness;
    for (let s = 0; s < spindles - 1; s++) {
        rail[s] = [];
        rail[s].push(new Vector3(ac, 0, 0.1 + 1.6 * ac));
        rail[s].push(new Vector3(ac, 0, 0.75 - spindleThickness + 1.6 * ac));
        rail[s].push(new Vector3(ac + railGap, 0, 0.75 - spindleThickness + 1.6 * (ac + railGap)));
        rail[s].push(new Vector3(ac + railGap, 0, 1.6 * (ac + railGap)));
        ac += spindleThickness + railGap;
    }

    const bannisterWall = extrudePolygon("bannisterWall", { shape: bannisterWallData, holes: rail, depth: 0.1 }, scene);
    bannisterWall.rotation.x = -Math.PI / 2;
    bannisterWall.rotation.z = -Math.PI / 2;
    bannisterWall.position.x = 0.4;
    bannisterWall.position.y = -3;
    bannisterWall.position.z = 2.51;

    const bannister1Data = [
        new Vector3(0, 0, 0),
        new Vector3(2, 0, 0),
        new Vector3(2, 0, 0.75),
        new Vector3(0, 0, 0.75),
    ];
    const spindle1Thickness = 0.05;
    const spindles1 = 12;
    const rail1Gap = (2 - spindles1 * spindle1Thickness) / (spindles1 - 1);
    const rail1 = [];
    let ac1 = spindle1Thickness;
    for (let s = 0; s < spindles1 - 1; s++) {
        rail1[s] = [];
        rail1[s].push(new Vector3(ac1, 0, spindle1Thickness));
        rail1[s].push(new Vector3(ac1, 0, 0.75 - spindle1Thickness));
        rail1[s].push(new Vector3(ac1 + rail1Gap, 0, 0.75 - spindle1Thickness));
        rail1[s].push(new Vector3(ac1 + rail1Gap, 0, spindle1Thickness));
        ac1 += spindle1Thickness + rail1Gap;
    }

    const bannister1 = extrudePolygon("bannister1", { shape: bannister1Data, holes: rail1, depth: 0.1 }, scene);
    bannister1.rotation.x = -Math.PI / 2;
    bannister1.rotation.z = -Math.PI / 2;
    bannister1.position.x = 0.3;
    bannister1.position.y = 0.2;
    bannister1.position.z = 2.61;

    const bannister2Data = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(1, 0, 0.75),
        new Vector3(0, 0, 0.75),
    ];
    const spindle2Thickness = 0.05;
    const spindles2 = 6;
    const rail2Gap = (1 - spindles2 * spindle2Thickness) / (spindles2 - 1);
    const rail2 = [];
    let ac2 = spindle2Thickness;
    for (let s = 0; s < spindles2 - 1; s++) {
        rail2[s] = [];
        rail2[s].push(new Vector3(ac2, 0, spindle2Thickness));
        rail2[s].push(new Vector3(ac2, 0, 0.75 - spindle2Thickness));
        rail2[s].push(new Vector3(ac2 + rail2Gap, 0, 0.75 - spindle2Thickness));
        rail2[s].push(new Vector3(ac2 + rail2Gap, 0, spindle2Thickness));
        ac2 += spindle2Thickness + rail2Gap;
    }

    const bannister2 = extrudePolygon("bannister2", { shape: bannister2Data, holes: rail2, depth: 0.1 }, scene);
    bannister2.rotation.x = -Math.PI / 2;
    bannister2.position.x = 0.3;
    bannister2.position.y = 0.2;
    bannister2.position.z = 2.61;

    const windowMaker = function (width, height, frames, frameDepth, frameThickness) {
        const windowShape = [
            new Vector3(0, 0, 0),
            new Vector3(width, 0, 0),
            new Vector3(width, 0, height),
            new Vector3(0, 0, height),
        ];
        const glassWidth = (width - (frames + 1) * frameThickness) / frames;
        const glassTopHeight = height / 3 - frameThickness;
        const glassBotHeight = 2 * glassTopHeight;
        const glass = [];
        let acf = frameThickness;
        for (let f = 0; f < frames; f++) {
            glass[2 * f] = [];
            glass[2 * f].push(new Vector3(acf, 0, 2 * frameThickness + glassBotHeight));
            glass[2 * f].push(new Vector3(acf + glassWidth, 0, 2 * frameThickness + glassBotHeight));
            glass[2 * f].push(new Vector3(acf + glassWidth, 0, 2 * frameThickness + glassBotHeight + glassTopHeight));
            glass[2 * f].push(new Vector3(acf, 0, 2 * frameThickness + glassBotHeight + glassTopHeight));
            glass[2 * f + 1] = [];
            glass[2 * f + 1].push(new Vector3(acf, 0, frameThickness));
            glass[2 * f + 1].push(new Vector3(acf + glassWidth, 0, frameThickness));
            glass[2 * f + 1].push(new Vector3(acf + glassWidth, 0, frameThickness + glassBotHeight));
            glass[2 * f + 1].push(new Vector3(acf, 0, frameThickness + glassBotHeight));
            acf += frameThickness + glassWidth;
        }
        const window = extrudePolygon("window", { shape: windowShape, holes: glass, depth: frameDepth }, scene);
        window.rotation.x = -Math.PI / 2;
        return window;
    };

    const windowFBL = windowMaker(3.2, 2, 4, 0.15, 0.1);
    windowFBL.position.x = -4.78;
    windowFBL.position.y = -2.3;
    windowFBL.position.z = 0.1;

    const windowFBR = windowMaker(3.2, 2, 4, 0.15, 0.1);
    windowFBR.position.x = 1.58;
    windowFBR.position.y = -2.3;
    windowFBR.position.z = 0.1;

    const windowFTL = windowMaker(1.9, 1.8, 2, 0.15, 0.1);
    windowFTL.position.x = -4.03;
    windowFTL.position.y = 0.75;
    windowFTL.position.z = 0.1;

    const windowFTR = windowMaker(1.9, 1.8, 2, 0.15, 0.1);
    windowFTR.position.x = 2.13;
    windowFTR.position.y = 0.75;
    windowFTR.position.z = 0.1;

    const windowFTM = windowMaker(1.3, 1.8, 2, 0.15, 0.1);
    windowFTM.position.x = -0.65;
    windowFTM.position.y = 0.75;
    windowFTM.position.z = 0.1;

    const windowRBL = windowMaker(3.15, 1.5, 4, 0.15, 0.1);
    windowRBL.position.x = -5;
    windowRBL.position.y = -1.8;
    windowRBL.position.z = 9;

    const windowRBR = windowMaker(1.7, 1.5, 2, 0.15, 0.1);
    windowRBR.position.x = -0.8;
    windowRBR.position.y = -1.8;
    windowRBR.position.z = 9;

    const windowRTL = windowMaker(3.15, 1.8, 4, 0.15, 0.1);
    windowRTL.position.x = -5;
    windowRTL.position.y = 0.75;
    windowRTL.position.z = 9;

    const windowRTR = windowMaker(1.3, 0.8, 1, 0.15, 0.1);
    windowRTR.position.x = -0.6;
    windowRTR.position.y = 1.75;
    windowRTR.position.z = 9;

    const windowR1BL = windowMaker(0.8, 1.5, 1, 0.15, 0.1);
    windowR1BL.position.x = 3.7;
    windowR1BL.position.y = -1.8;
    windowR1BL.position.z = 6;

    const windowR1TL = windowMaker(0.8, 1.8, 1, 0.15, 0.1);
    windowR1TL.position.x = 1.9;
    windowR1TL.position.y = 0.75;
    windowR1TL.position.z = 6;

    const windowR1TR = windowMaker(0.8, 1.8, 1, 0.15, 0.1);
    windowR1TR.position.x = 4.2;
    windowR1TR.position.y = 0.75;
    windowR1TR.position.z = 6;

    const doorMaker = function (width, height, depth) {
        const doorShape = [
            new Vector3(0, 0, 0),
            new Vector3(width, 0, 0),
            new Vector3(width, 0, height),
            new Vector3(0, 0, height),
        ];
        const edgeThickness = width / 8;
        const panelWidth = width - 2 * edgeThickness;
        const panelBotHeight = (height - 3 * edgeThickness) / 1.75;
        const panelTopHeight = 0.75 * panelBotHeight;
        const panel = [];
        panel[0] = [];
        panel[0].push(new Vector3(edgeThickness, 0, 2 * edgeThickness + panelBotHeight));
        panel[0].push(new Vector3(edgeThickness + panelWidth, 0, 2 * edgeThickness + panelBotHeight));
        panel[0].push(new Vector3(edgeThickness + panelWidth, 0, 2 * edgeThickness + panelBotHeight + panelTopHeight));
        panel[0].push(new Vector3(edgeThickness, 0, 2 * edgeThickness + panelBotHeight + panelTopHeight));
        panel[1] = [];
        panel[1].push(new Vector3(edgeThickness, 0, edgeThickness));
        panel[1].push(new Vector3(edgeThickness + panelWidth, 0, edgeThickness));
        panel[1].push(new Vector3(edgeThickness + panelWidth, 0, edgeThickness + panelBotHeight));
        panel[1].push(new Vector3(edgeThickness, 0, edgeThickness + panelBotHeight));
        const door = extrudePolygon("door", { shape: doorShape, holes: panel, depth: depth }, scene);
        door.rotation.x = -Math.PI / 2;
        const panelB = CreateBox("p1b", { width: panelWidth, height: panelBotHeight, depth: depth / 2 }, scene);
        panelB.position.x = edgeThickness + panelWidth / 2;
        panelB.position.y = edgeThickness + panelBotHeight / 2;
        panelB.position.z = depth / 2;
        const panelT = CreateBox("p1t", { width: panelWidth, height: panelTopHeight, depth: depth / 2 }, scene);
        panelT.position.x = edgeThickness + panelWidth / 2;
        panelT.position.y = 2 * edgeThickness + panelBotHeight + panelTopHeight / 2;
        panelT.position.z = depth / 2;

        return Mesh.MergeMeshes([door, panelB, panelT], true);
    };

    const doormat = new StandardMaterial("door", scene);
    doormat.diffuseColor = new Color3(82 / 255, 172 / 255, 106 / 255);

    const frontDoor = doorMaker(1, 2.25, 0.1);
    frontDoor.position.x = -0.5;
    frontDoor.position.y = -3;
    frontDoor.position.z = 0.1;
    frontDoor.material = doormat;

    const backDoor = doorMaker(1, 2.25, 0.1);
    backDoor.rotation.y = Math.PI / 2;
    backDoor.position.x = 1.3;
    backDoor.position.y = -3;
    backDoor.position.z = 8.65;
    backDoor.material = doormat;
    return scene;
}
