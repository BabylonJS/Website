declare module BOXMONGER {
    class BlocTypes {
        static STONE: number;
        static SNOW: number;
        static GRASS: number;
        static WOOD: number;
        static LEAFS: number;
        static Types: any[];
        static Materials: BABYLON.Material[];
    }
    class Chunk {
        static CHUNKHEIGHT: number;
        static CHUNKWIDTH: number;
        static CHUNKDEPTH: number;
        private _chunkData;
        private _displayer;
        private _positionInWorld;
        private _width;
        private _depth;
        private _height;
        private _boxToDraw;
        private _boxToErase;
        private _realHeight;
        constructor(positionInWorld: BABYLON.Vector3);
        show(displayer: ChunkDisplayer): void;
        hide(): ChunkDisplayer;
        positionInWorld: BABYLON.Vector3;
        displayer: ChunkDisplayer;
        applyChanges(): void;
        getHitBox(ray: BABYLON.Ray, playerPosition: BABYLON.Vector3): BABYLON.Vector3;
        getBoxType(x: number, y: number, z: number): number;
        addBox(x: number, y: number, z: number, boxType: number): void;
        removeBox(x: number, y: number, z: number): void;
    }
    class ChunkDisplayer {
        private _meshes;
        private _scene;
        private _positionInWorld;
        private _unitBoxSize;
        private _isInitialized;
        constructor(unitBoxSize: number, positionInWorld: BABYLON.Vector3, scene: BABYLON.Scene);
        private _initMeshes();
        addBox(x: number, y: number, z: number, boxType: number): void;
        eraseBox(x: number, y: number, z: number, boxType: number): void;
        empty(): void;
        updateMeshes(): void;
        positionInWorld: BABYLON.Vector3;
        isInitialized: boolean;
    }
    class WordManager {
        private _world;
        private _availableDisplayers;
        private _displayedChunk;
        private _width;
        private _depth;
        private _visibleChunksAroundPlayer;
        private _playerPosition;
        private _unitBoxSize;
        private _scene;
        constructor(width: number, depth: number, unitBoxSize: number, scene: BABYLON.Scene);
        initData(): void;
        createTree(position: BABYLON.Vector3): void;
        createPlane(position: BABYLON.Vector3, width: number, depth: number, blockType: number): void;
        removeFromCoords(x: number, y: number, camera: BABYLON.Camera): void;
        addFromCoords(x: number, y: number, camera: BABYLON.Camera): void;
        addBox(x: number, y: number, z: number, blocType: number): void;
        removeBox(x: any, y: any, z: any): void;
        getChunk(x: number, y: number): Chunk;
        setChunk(x: number, y: number, chunk: Chunk): Chunk;
        setPlayerPosition(x: number, y: number, z: number): void;
    }
}
