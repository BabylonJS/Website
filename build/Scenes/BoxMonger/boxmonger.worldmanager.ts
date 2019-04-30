module BOXMONGER {
    export class BlocTypes {
        public static STONE: number = 0;
        public static SNOW: number = 1;
        public static GRASS: number = 2;
        public static WOOD: number = 3;
        public static LEAFS: number = 4;

        public static Types: any[] = [
            { typeName: "Stone", typeId: BlocTypes.STONE, url: "./Assets/Textures/stone.png", transparency: false },
            { typeName: "Grass", typeId: BlocTypes.GRASS, url: "./Assets/Textures/grass.png", transparency: false },
            { typeName: "Snow", typeId: BlocTypes.SNOW, url: "./Assets/Textures/snow.png", transparency: false },
            { typeName: "Wood", typeId: BlocTypes.WOOD, url: "./Assets/Textures/wood.png", transparency: false },
            { typeName: "Leafs", typeId: BlocTypes.LEAFS, url: "./Assets/Textures/leafs.png", transparency: true },
        ];

        public static Materials: BABYLON.Material[] = new Array(BlocTypes.Types.length);
    }

    export class Chunk {
        public static CHUNKHEIGHT: number = 32;
        public static CHUNKWIDTH: number = 24;
        public static CHUNKDEPTH: number = 24;

        private _chunkData: number[];
        private _displayer: ChunkDisplayer;
        private _positionInWorld: BABYLON.Vector3;
        private _width: number;
        private _depth: number;
        private _height: number;
        private _boxToDraw: number[][];
        private _boxToErase: number[][];
        private _realHeight: number;

        constructor(positionInWorld: BABYLON.Vector3) {
            this._width = Chunk.CHUNKWIDTH;
            this._depth = Chunk.CHUNKDEPTH;
            this._height = Chunk.CHUNKHEIGHT;
            this._chunkData = new Array(this._width * this._depth * this._height);
            this._boxToDraw = new Array(BlocTypes.Types.length);
            this._positionInWorld = positionInWorld;
            this._realHeight = 0;

            for (var i = 0; i < BlocTypes.Types.length; i++) {
                this._boxToDraw[i] = new Array();
            }
            this._boxToErase = new Array(BlocTypes.Types.length);
            for (var i = 0; i < BlocTypes.Types.length; i++) {
                this._boxToErase[i] = new Array();
            }
        }

        public show(displayer: ChunkDisplayer) {
            if (displayer != undefined) {
                this._displayer = displayer;
                this._displayer.positionInWorld = this._positionInWorld;
                //could be a different method
                this.applyChanges();
            }
        }

        public hide(): ChunkDisplayer {
            var displayer = this._displayer;
            if (displayer != undefined) {
                displayer.empty();
            }
            return displayer;
        }

        public get positionInWorld(): BABYLON.Vector3 {
            return this._positionInWorld;
        }

        public set positionInWorld(value: BABYLON.Vector3) {
            this._positionInWorld = value;
        }

        public get displayer(): ChunkDisplayer {
            return this._displayer;
        }

        public set displayer(value: ChunkDisplayer) {
            this._displayer = value;
        }

        public applyChanges() {
            var boxType;
            if (this._displayer != undefined) {
                if (!this._displayer.isInitialized) {
                    //init boxes
                    for (var x = 0; x < this._width; x++) {
                        for (var y = 0; y <= this._realHeight; y++) {
                            for (var z = 0; z < this._depth; z++) {
                                boxType = this.getBoxType(x, y, z);
                                if (boxType != undefined) {
                                    this._displayer.addBox(x, y, z, boxType);
                                }
                            }
                        }
                    }
                    for (var i = 0; i < BlocTypes.Types.length; i++) {
                        this._boxToDraw[i] = new Array();
                    }
                    this._boxToErase = new Array(BlocTypes.Types.length);
                    for (var i = 0; i < BlocTypes.Types.length; i++) {
                        this._boxToErase[i] = new Array();
                    }
                    this._displayer.updateMeshes();
                    this._displayer.isInitialized = true;
                }
                else {
                    //update boxes
                    for (var meshId = 0; meshId < BlocTypes.Types.length; meshId++) {
                        while (this._boxToDraw[meshId].length > 0) {
                            var x = this._boxToDraw[meshId].pop();
                            var y = this._boxToDraw[meshId].pop();
                            var z = this._boxToDraw[meshId].pop();
                            this._displayer.addBox(x, y, z, meshId);
                        }
                        while (this._boxToErase[meshId].length > 0) {
                            var x = this._boxToErase[meshId].pop();
                            var y = this._boxToErase[meshId].pop();
                            var z = this._boxToErase[meshId].pop();
                            this._displayer.eraseBox(x, y, z, meshId);
                        }
                        this._displayer.updateMeshes();
                    }
                }
            }
        }

        public getHitBox(ray: BABYLON.Ray, playerPosition: BABYLON.Vector3): BABYLON.Vector3 {
            var boxType;
            var hitbox;
            var distanceFromPlayer;
            for (var x = 0; x < this._width; x++) {
                for (var y = 0; y <= this._realHeight; y++) {
                    for (var z = 0; z < this._depth; z++) {
                        boxType = this.getBoxType(x, y, z);
                        if (boxType != undefined) {
                            var half = 0.5;
                            var minimum = new BABYLON.Vector3(this.positionInWorld.x + x - half, this.positionInWorld.y + y - half, this.positionInWorld.z + z - half);
                            var maximum = new BABYLON.Vector3(this.positionInWorld.x + x + half, this.positionInWorld.y + y + half, this.positionInWorld.z + z + half);
                            var intersected = ray.intersectsBoxMinMax(minimum, maximum);
                            var hit = new BABYLON.Vector3(this.positionInWorld.x + x, this.positionInWorld.y + y, this.positionInWorld.z + z);
                            if (intersected && (hitbox === undefined || distanceFromPlayer > BABYLON.Vector3.Distance(hit, playerPosition))) {
                                hitbox = hit;
                                distanceFromPlayer = BABYLON.Vector3.Distance(hitbox, playerPosition);
                            }
                        }
                    }
                }
            }

            return hitbox;
        }

        public getBoxType(x: number, y: number, z: number): number {
            return this._chunkData[x * this._width + y * this._width * this._height + z];
        }

        public addBox(x: number, y: number, z: number, boxType: number) {
            this._chunkData[x * this._width + y * this._width * this._height + z] = boxType;
            if (y > this._realHeight)
                this._realHeight = y;
            this._boxToDraw[boxType].push(z, y, x);
        }

        public removeBox(x: number, y: number, z: number) {
            var boxType = this.getBoxType(x, y, z);
            this._chunkData[x * this._width + y * this._width * this._height + z] = undefined;
            if (boxType != undefined)
                this._boxToErase[boxType].push(z, y, x);
        }
    }

    export class ChunkDisplayer {
        private _meshes: BoxMesh[];
        private _scene: BABYLON.Scene;
        private _positionInWorld: BABYLON.Vector3;
        private _unitBoxSize: number;
        private _isInitialized: boolean;

        constructor(unitBoxSize: number, positionInWorld: BABYLON.Vector3, scene: BABYLON.Scene) {
            this._scene = scene;
            this._positionInWorld = positionInWorld;
            this._unitBoxSize = unitBoxSize;
            this._isInitialized = false;
            this._initMeshes();
        }

        private _initMeshes() {
            this._meshes = new Array(BlocTypes.Types.length);

            for (var typeIndex = 0; typeIndex < BlocTypes.Types.length; typeIndex++) {
                var material;
                if (BlocTypes.Materials[typeIndex] === undefined) {
                    material = new BABYLON.StandardMaterial(BlocTypes.Types[typeIndex].typeName + "Material", this._scene);
                    material.diffuseTexture = new BABYLON.Texture(BlocTypes.Types[typeIndex].url, this._scene);
                    if (BlocTypes.Types[typeIndex].transparency) {
                        material.diffuseTexture.hasAlpha = true;
                    }
                    BlocTypes.Materials[typeIndex] = material;
                }
                else {
                    material = BlocTypes.Materials[typeIndex];
                }
                this._meshes[BlocTypes.Types[typeIndex].typeId] = new BoxMesh(BlocTypes.Types[typeIndex].typeName + "Box", this._unitBoxSize, Chunk.CHUNKHEIGHT * 4, this._scene, material, this._positionInWorld);
                this._meshes[BlocTypes.Types[typeIndex].typeId].checkCollisions = true;
            }
        }

        public addBox(x: number, y: number, z: number, boxType: number) {
            this._meshes[boxType].addBox(x, y, z);
        }

        public eraseBox(x: number, y: number, z: number, boxType: number) {
            this._meshes[boxType].removeBox(x, y, z);
        }

        public empty() {
            for (var meshId = 0; meshId < this._meshes.length; meshId++) {
                this._meshes[meshId].empty();
            }
            this._isInitialized = false;
        }

        public updateMeshes() {
            for (var meshId = 0; meshId < this._meshes.length; meshId++) {
                this._meshes[meshId].updateMesh();
            }
        }

        public get positionInWorld(): BABYLON.Vector3 {
            return this._positionInWorld;
        }

        public set positionInWorld(value: BABYLON.Vector3) {
            this._positionInWorld = value;
            for (var meshId = 0; meshId < this._meshes.length; meshId++) {
                this._meshes[meshId].positionInWorld = this._positionInWorld;
            }
        }

        public get isInitialized(): boolean {
            return this._isInitialized;
        }

        public set isInitialized(value: boolean) {
            this._isInitialized = value;
        }
    }

    export class WordManager {
        private _world: Chunk[];
        private _availableDisplayers: ChunkDisplayer[];
        private _displayedChunk: Chunk[];
        private _width: number;
        private _depth: number;
        private _visibleChunksAroundPlayer: number = 2;
        private _playerPosition: BABYLON.Vector3;
        private _unitBoxSize: number;
        private _scene: BABYLON.Scene;

        constructor(width: number, depth: number, unitBoxSize: number, scene: BABYLON.Scene) {
            this._world = new Array(width * depth);
            this._displayedChunk = new Array();
            this._width = width;
            this._depth = depth;
            this._unitBoxSize = unitBoxSize;
            this._scene = scene;

            //init displayers
            this._availableDisplayers = new Array();
            for (var disp = 0; disp < (this._visibleChunksAroundPlayer + 1) * (this._visibleChunksAroundPlayer + 1) * 4; disp++) {
                this._availableDisplayers.push(new ChunkDisplayer(this._unitBoxSize, new BABYLON.Vector3(0, 0, 0), this._scene));
            }
        }

        public initData() {
            var height = 1;
            for (var x = 0; x < this._width * Chunk.CHUNKWIDTH; x++) {
                for (var z = 0; z < this._depth * Chunk.CHUNKDEPTH; z++) {
                    height = 1;
                    this.addBox(x, 1, z, BlocTypes.GRASS);
                    if (Math.random() > 0.8) {
                        if (Math.random() > 0.8) {
                            this.addBox(x, 2, z, BlocTypes.STONE);
                        }
                        else {
                            this.addBox(x, 2, z, BlocTypes.SNOW);
                        }
                        height = 2;
                    }
                    if (Math.random() > 0.99) {
                        this.createTree(new BABYLON.Vector3(x, height + 1, z));
                    }
                }
            }
        }

        public createTree(position: BABYLON.Vector3) {
            var height = Math.floor(Math.random() * 5) + 2;
            for (var h = 0; h < height; h++) {
                this.addBox(position.x, position.y + h, position.z, BlocTypes.WOOD);
            }

            this.createPlane(new BABYLON.Vector3(position.x - 2, position.y + height, position.z - 2), 5, 5, BlocTypes.LEAFS);
            this.createPlane(new BABYLON.Vector3(position.x - 3, position.y + height + 1, position.z - 3), 7, 7, BlocTypes.LEAFS);
            this.createPlane(new BABYLON.Vector3(position.x - 3, position.y + height + 2, position.z - 3), 7, 7, BlocTypes.LEAFS);
            this.createPlane(new BABYLON.Vector3(position.x - 2, position.y + height + 3, position.z - 2), 5, 5, BlocTypes.LEAFS);
        }

        public createPlane(position: BABYLON.Vector3, width: number, depth: number, blockType: number) {
            for (var x = position.x; x < position.x + width; x++) {
                for (var z = position.z; z < position.z + depth; z++) {
                    this.addBox(x, position.y, z, blockType);
                }
            }
        }

        public removeFromCoords(x: number, y: number, camera: BABYLON.Camera) {
            var ray = this._scene.createPickingRay(x, y, BABYLON.Matrix.Identity(), camera);
            var hitChunkFar;
            var hitChunk;
            var distanceFromPlayerHitChunk;
            var distanceFromPlayerHitChunkFar;

            //for (var chunkid = 0; chunkid < this._displayedChunk.length; chunkid++) {
            //    var chunk = this._displayedChunk[chunkid];
            //    var minimum = chunk.positionInWorld.add(new BABYLON.Vector3(-Chunk.CHUNKWIDTH / 2, -Chunk.CHUNKHEIGHT / 2, -Chunk.CHUNKDEPTH / 2));
            //    var maximum = chunk.positionInWorld.add(new BABYLON.Vector3(Chunk.CHUNKWIDTH / 2, Chunk.CHUNKHEIGHT / 2, Chunk.CHUNKDEPTH / 2));
            //    var intersected = ray.intersectsBoxMinMax(minimum, maximum);
            //    if (intersected) {
            //        if (hitChunk === undefined || distanceFromPlayerHitChunk > BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition)) {
            //            hitChunk = chunk;
            //            distanceFromPlayerHitChunk = BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition);
            //        }
            //        else if(hitChunk === undefined || distanceFromPlayerHitChunkFar > BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition)) {
            //            hitChunkFar = chunk;
            //            distanceFromPlayerHitChunkFar = BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition);
            //        }
            //    }
            //}

            var playerchunkX = Math.floor(this._playerPosition.x / Chunk.CHUNKWIDTH);
            var playerchunkY = Math.floor(this._playerPosition.z / Chunk.CHUNKDEPTH);
            hitChunk = this.getChunk(playerchunkX, playerchunkY);

            if (hitChunk != undefined) {
                var hitBox = hitChunk.getHitBox(ray, this._playerPosition);

                if (hitBox != undefined) {
                    this.removeBox(hitBox.x, hitBox.y, hitBox.z);
                    hitChunk.applyChanges();
                }
            }
        }

        public addFromCoords(x: number, y: number, camera: BABYLON.Camera) {
            var ray = this._scene.createPickingRay(x, y, BABYLON.Matrix.Identity(), camera);
            var hitChunkFar;
            var hitChunk;
            var distanceFromPlayerHitChunk;
            var distanceFromPlayerHitChunkFar;

            //for (var chunkid = 0; chunkid < this._displayedChunk.length; chunkid++) {
            //    var chunk = this._displayedChunk[chunkid];
            //    var minimum = chunk.positionInWorld.add(new BABYLON.Vector3(-Chunk.CHUNKWIDTH / 2, -Chunk.CHUNKHEIGHT / 2, -Chunk.CHUNKDEPTH / 2));
            //    var maximum = chunk.positionInWorld.add(new BABYLON.Vector3(Chunk.CHUNKWIDTH / 2, Chunk.CHUNKHEIGHT / 2, Chunk.CHUNKDEPTH / 2));
            //    var intersected = ray.intersectsBoxMinMax(minimum, maximum);
            //    if (intersected) {
            //        if (hitChunk === undefined || distanceFromPlayerHitChunk > BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition)) {
            //            hitChunk = chunk;
            //            distanceFromPlayerHitChunk = BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition);
            //        }
            //        else if(hitChunk === undefined || distanceFromPlayerHitChunkFar > BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition)) {
            //            hitChunkFar = chunk;
            //            distanceFromPlayerHitChunkFar = BABYLON.Vector3.Distance(chunk.positionInWorld, this._playerPosition);
            //        }
            //    }
            //}

            var playerchunkX = Math.floor(this._playerPosition.x / Chunk.CHUNKWIDTH);
            var playerchunkY = Math.floor(this._playerPosition.z / Chunk.CHUNKDEPTH);
            hitChunk = this.getChunk(playerchunkX, playerchunkY);

            if (hitChunk != undefined) {
                var hitBox = hitChunk.getHitBox(ray, this._playerPosition);

                if (hitBox != undefined) {
                    this.addBox(hitBox.x, hitBox.y + 1, hitBox.z, BlocTypes.GRASS);
                    hitChunk.applyChanges();
                }
            }
        }

        public addBox(x: number, y: number, z: number, blocType: number) {
            //Select chunk
            var chunkx = Math.floor(x / Chunk.CHUNKWIDTH);
            var chunky = Math.floor(z / Chunk.CHUNKDEPTH)
            var chunk = this.getChunk(chunkx, chunky);

            chunk.addBox(x - chunkx * Chunk.CHUNKWIDTH, y, z - chunky * Chunk.CHUNKDEPTH, blocType);
        }

        public removeBox(x, y, z) {
            //Select chunk
            var chunkx = Math.floor(x / Chunk.CHUNKWIDTH);
            var chunky = Math.floor(z / Chunk.CHUNKDEPTH)
            var chunk = this.getChunk(chunkx, chunky);

            chunk.removeBox(x - chunkx * Chunk.CHUNKWIDTH, y, z - chunky * Chunk.CHUNKDEPTH);
        }

        public getChunk(x: number, y: number): Chunk {
            var chunk = this._world[x * this._width + y];
            if (chunk === undefined) {
                chunk = new Chunk(new BABYLON.Vector3(x * Chunk.CHUNKWIDTH, 0, y * Chunk.CHUNKDEPTH));
                this.setChunk(x, y, chunk);
            }
            return chunk;
        }

        public setChunk(x: number, y: number, chunk: Chunk) {
            return this._world[x * this._width + y] = chunk;
        }

        public setPlayerPosition(x: number, y: number, z: number) {

            //Trouver le chunk dans lequel le joueur se trouve
            var newChunkX = Math.round(x / Chunk.CHUNKWIDTH);
            var newChunkY = Math.round(z / Chunk.CHUNKDEPTH);

            var newChunkBoundingBoxXMin = newChunkX - this._visibleChunksAroundPlayer;
            var newChunkBoundingBoxXMax = newChunkX + this._visibleChunksAroundPlayer;
            var newChunkBoundingBoxYMin = newChunkY - this._visibleChunksAroundPlayer;
            var newChunkBoundingBoxYMax = newChunkY + this._visibleChunksAroundPlayer;

            if (this._playerPosition === undefined) {
                this._playerPosition = new BABYLON.Vector3(x, y, z);
                for (var x = newChunkBoundingBoxXMin; x <= newChunkBoundingBoxXMax; x++) {
                    for (var y = newChunkBoundingBoxYMin; y <= newChunkBoundingBoxYMax; y++) {
                        var chunk = this.getChunk(x, y);
                        chunk.show(this._availableDisplayers.pop());
                        this._displayedChunk.push(chunk);
                    }
                }
            }
            else {
                //Current Chunk
                var oldChunkX = Math.round(this._playerPosition.x / Chunk.CHUNKWIDTH);
                var oldChunkY = Math.round(this._playerPosition.z / Chunk.CHUNKDEPTH);

                var oldChunkBoundingBoxXMin = oldChunkX - this._visibleChunksAroundPlayer;
                var oldChunkBoundingBoxXMax = oldChunkX + this._visibleChunksAroundPlayer;
                var oldChunkBoundingBoxYMin = oldChunkY - this._visibleChunksAroundPlayer;
                var oldChunkBoundingBoxYMax = oldChunkY + this._visibleChunksAroundPlayer;

                // Si c'est un autre chunk
                if (oldChunkX != newChunkX || oldChunkY != newChunkY) {
                    this._playerPosition.x = x;
                    this._playerPosition.y = y;
                    this._playerPosition.z = z;

                    // Libérer les chunks à virer
                    for (var x = oldChunkBoundingBoxXMin; x <= oldChunkBoundingBoxXMax; x++) {
                        for (var y = oldChunkBoundingBoxYMin; y <= oldChunkBoundingBoxYMax; y++) {
                            if (x < newChunkBoundingBoxXMin || x > newChunkBoundingBoxXMax || y < newChunkBoundingBoxYMin || y > newChunkBoundingBoxYMax) {
                                var removedChunk = this.getChunk(x, y);
                                var displayer = removedChunk.hide();
                                this._displayedChunk.splice(this._displayedChunk.indexOf(removedChunk), 1);
                                if (displayer != undefined)
                                    this._availableDisplayers.push(displayer);
                            }
                        }
                    }

                    // Afficher les chunks à afficher
                    for (var x = newChunkBoundingBoxXMin; x <= newChunkBoundingBoxXMax; x++) {
                        for (var y = newChunkBoundingBoxYMin; y <= newChunkBoundingBoxYMax; y++) {
                            if (x < oldChunkBoundingBoxXMin || x > oldChunkBoundingBoxXMax || y < oldChunkBoundingBoxYMin || y > oldChunkBoundingBoxYMax) {
                                var chunk = this.getChunk(x, y);
                                chunk.show(this._availableDisplayers.pop());
                                this._displayedChunk.push(chunk);
                            }
                        }
                    }
                }
            }
        }
    }
}