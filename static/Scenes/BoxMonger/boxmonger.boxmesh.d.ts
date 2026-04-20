declare module BOXMONGER {
    class BoxMesh {
        private _mesh;
        private _unitBoxSize;
        private _boxMaterial;
        private _capacity;
        private _indices;
        private _positions;
        private _numberofCubes;
        private _cubesPositions;
        private _nextWritablePositions;
        private _scene;
        private _normalsSource;
        private _cubeVerticeCache;
        constructor(name: string, unitBoxsize: number, startCapacity: number, scene: BABYLON.Scene, material: BABYLON.Material, position?: BABYLON.Vector3);
        isVisible: boolean;
        positionInWorld: BABYLON.Vector3;
        private _initMesh();
        addBox(x: number, y: number, z: number): void;
        addBoxes(positions: number[]): void;
        removeBox(x: number, y: number, z: number): void;
        moveBox(x: number, y: number, z: number, newx: number, newy: number, newz: number): void;
        removeBoxes(positions: number[]): void;
        empty(): void;
        private _getCubePosition(x, y, z);
        private _setCubePosition(x, y, z, value);
        private _addBoxGeneric(x, y, z, positions, indices);
        private _Clone(name, unitBoxsize, startCapacity, scene, material, position?);
        private _initCubeVerticeCache();
        updateMesh(): void;
        private _extendCapacity(min);
        private _getFirstWritablePosition();
        checkCollisions: boolean;
        private _cleanDataForRemovedCubes(cubes);
    }
}
