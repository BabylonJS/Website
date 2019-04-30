declare module BOXMONGER {
    class BoxMesh {
        private _mesh;
        private _unitBoxSize;
        private _boxMaterial;
        private _capacity;
        private _indices;
        private _positions;
        private _numberofCubes;
        private _nextWriteableCube;
        private _cubesPositions;
        private _normalsSource;
        constructor(name: string, unitBoxsize: number, startCapacity: number, scene: BABYLON.Scene, material?: BABYLON.Material);
        private _initMesh();
        private _updateMesh();
        public AddBox(position: BABYLON.Vector3): void;
        public AddBoxes(positions: BABYLON.Vector3[]): void;
        private _extendCapacity();
        public RemoveBox(position: BABYLON.Vector3): void;
        public RemoveBoxes(positions: BABYLON.Vector3[]): void;
        private _getFirstWritablePosition();
        private _getCubePositionInArray(position);
        private _cleanDataForRemovedCubes();
        private _emptyCubesPositions(from, howMany);
        private _addBoxGeneric(position, positions, indices);
    }
}
