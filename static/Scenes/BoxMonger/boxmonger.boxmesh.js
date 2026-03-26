var BOXMONGER;
(function (BOXMONGER) {
    var BoxMesh = (function () {
        function BoxMesh(name, unitBoxsize, startCapacity, scene, material, position) {
            this._normalsSource = [
                new BABYLON.Vector3(0, 0, 1),
                new BABYLON.Vector3(0, 0, -1),
                new BABYLON.Vector3(1, 0, 0),
                new BABYLON.Vector3(-1, 0, 0),
                new BABYLON.Vector3(0, 1, 0),
                new BABYLON.Vector3(0, -1, 0)
            ];
            this._unitBoxSize = unitBoxsize;
            this._capacity = startCapacity;
            this._boxMaterial = material;
            this._scene = scene;
            this._mesh = new BABYLON.Mesh(name, this._scene);
            if (position !== undefined) {
                this._mesh.position = position;
            }
            this._mesh.material = this._boxMaterial;
            this._initCubeVerticeCache();
            this._initMesh();
            this._nextWritablePositions = new Array();
            this._nextWritablePositions.push(0);
            //adding first box
            this.addBox(0, 0, 0);
        }
        Object.defineProperty(BoxMesh.prototype, "isVisible", {
            get: function () {
                return this._mesh.isVisible;
            },
            set: function (value) {
                this._mesh.isVisible = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoxMesh.prototype, "positionInWorld", {
            get: function () {
                return this._mesh.position;
            },
            set: function (value) {
                this._mesh.position = value;
            },
            enumerable: true,
            configurable: true
        });
        //Init the mesh with empty values
        BoxMesh.prototype._initMesh = function () {
            var vertexData = new BABYLON.VertexData();
            vertexData.indices = [];
            vertexData.positions = [];
            vertexData.uvs = [];
            vertexData.normals = [];
            for (var cubeIndex = 0; cubeIndex < this._capacity; cubeIndex++) {
                // Create each face in turn.
                for (var index = 0; index < this._normalsSource.length; index++) {
                    var normal = this._normalsSource[index];
                    // Get two vectors perpendicular to the face normal and to each other.
                    var side1 = new BABYLON.Vector3(normal.y, normal.z, normal.x);
                    var side2 = BABYLON.Vector3.Cross(normal, side1);
                    // Four vertices per face.
                    var normals = vertexData.normals;
                    normals.push(normal.x, normal.y, normal.z);
                    normals.push(normal.x, normal.y, normal.z);
                    normals.push(normal.x, normal.y, normal.z);
                    normals.push(normal.x, normal.y, normal.z);
                    //Configuring uvs
                    var uvs = vertexData.uvs;
                    if (normal.x === -1) {
                        uvs.push(0.0, 0.66);
                        uvs.push(0.0, 0.33);
                        uvs.push(1.0, 0.33);
                        uvs.push(1.0, 0.66);
                    }
                    else if (normal.z === -1) {
                        uvs.push(1.0, 0.66);
                        uvs.push(0.0, 0.66);
                        uvs.push(0.0, 0.33);
                        uvs.push(1.0, 0.33);
                    }
                    else if (normal.x === 1) {
                        uvs.push(0.0, 0.66);
                        uvs.push(0.0, 0.33);
                        uvs.push(1.0, 0.33);
                        uvs.push(1.0, 0.66);
                    }
                    else if (normal.z === 1) {
                        uvs.push(0.0, 0.33);
                        uvs.push(1.0, 0.33);
                        uvs.push(1.0, 0.66);
                        uvs.push(0.0, 0.66);
                    }
                    else if (normal.y === 1) {
                        uvs.push(1.0, 1.0);
                        uvs.push(0.0, 1.0);
                        uvs.push(0.0, 0.6666);
                        uvs.push(1.0, 0.6666);
                    }
                    else {
                        uvs.push(1.0, 0.33);
                        uvs.push(0.0, 0.33);
                        uvs.push(0.0, 0.0);
                        uvs.push(1.0, 0.0);
                    }
                }
            }
            vertexData.positions = new Array(this._capacity * 72);
            this._cubesPositions = {};
            this._numberofCubes = 0;
            //push to the gpu
            vertexData.applyToMesh(this._mesh, true);
            this._positions = new Float32Array(this._mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind));
            this._indices = this._mesh.getIndices();
        };
        //Add single box
        BoxMesh.prototype.addBox = function (x, y, z) {
            if (this._numberofCubes > this._capacity)
                this._extendCapacity(this._numberofCubes + 1);
            this._addBoxGeneric(x, y, z, this._positions, this._indices);
        };
        //Add multiple boxes in batch
        BoxMesh.prototype.addBoxes = function (positions) {
            if (this._numberofCubes + positions.length / 3 > this._capacity)
                this._extendCapacity(this._numberofCubes + positions.length / 3);
            var pos = positions.length;
            for (var i = 0; i < pos; i += 3) {
                this._addBoxGeneric(positions[i], positions[i + 1], positions[i + 2], this._positions, this._indices);
            }
        };
        //Remove single box
        BoxMesh.prototype.removeBox = function (x, y, z) {
            var positionInArray = this._getCubePosition(x, y, z);
            if (positionInArray != undefined) {
                this._setCubePosition(x, y, z, -1);
                this._nextWritablePositions.push(positionInArray);
                this._numberofCubes--;
                this._cleanDataForRemovedCubes(new Float32Array([positionInArray / 3]));
            }
        };
        BoxMesh.prototype.moveBox = function (x, y, z, newx, newy, newz) {
            var writePosition = this._getCubePosition(x, y, z);
            if (writePosition === undefined)
                return;
            var positionsWriteStart = writePosition / 3 * 72;
            var indicesWriteStart = writePosition / 3 * 36;
            var positionInVerticeCache = 0;
            // Create each face in turn.
            for (var index = 0; index < 6; index++) {
                // Four vertices per face.
                var vertex = this._cubeVerticeCache[positionInVerticeCache++];
                this._positions[positionsWriteStart++] = vertex.x + newx;
                this._positions[positionsWriteStart++] = vertex.y + newy;
                this._positions[positionsWriteStart++] = vertex.z + newz;
                vertex = this._cubeVerticeCache[positionInVerticeCache++];
                this._positions[positionsWriteStart++] = vertex.x + newx;
                this._positions[positionsWriteStart++] = vertex.y + newy;
                this._positions[positionsWriteStart++] = vertex.z + newz;
                vertex = this._cubeVerticeCache[positionInVerticeCache++];
                this._positions[positionsWriteStart++] = vertex.x + newx;
                this._positions[positionsWriteStart++] = vertex.y + newy;
                this._positions[positionsWriteStart++] = vertex.z + newz;
                vertex = this._cubeVerticeCache[positionInVerticeCache++];
                this._positions[positionsWriteStart++] = vertex.x + newx;
                this._positions[positionsWriteStart++] = vertex.y + newy;
                this._positions[positionsWriteStart++] = vertex.z + newz;
            }
            this._setCubePosition(newx, newy, newz, writePosition);
        };
        //Remove multiple boxes in batch
        BoxMesh.prototype.removeBoxes = function (positions) {
            var pos = positions.length;
            var cubesToClean = new Float32Array(pos);
            for (var i = 0; i < pos; i += 3) {
                var positionInArray = this._getCubePosition(positions[i], positions[i + 1], positions[i + 2]);
                if (positionInArray != -1) {
                    this._setCubePosition(positions[i], positions[i + 1], positions[i + 2], -1);
                    this._nextWritablePositions.push(positionInArray);
                    cubesToClean.set(positionInArray / 3, i);
                    this._numberofCubes--;
                }
            }
            if (cubesToClean.length > 0) {
                this._cleanDataForRemovedCubes(cubesToClean);
            }
        };
        //Remove all boxes in batch
        BoxMesh.prototype.empty = function () {
            //we need to keep at least one cube
            this._cubesPositions = new Array(this._capacity * 3);
            this._setCubePosition(0, 0, 0, 0);
            this._numberofCubes = 0;
            for (var i = 72; i < this._positions.length; i++)
                this._positions[i] = 0;
        };
        BoxMesh.prototype._getCubePosition = function (x, y, z) {
            return this._cubesPositions[x + "-" + y + "-" + z];
        };
        BoxMesh.prototype._setCubePosition = function (x, y, z, value) {
            this._cubesPositions[x + "-" + y + "-" + z] = value;
        };
        BoxMesh.prototype._addBoxGeneric = function (x, y, z, positions, indices) {
            var writePosition = this._getFirstWritablePosition();
            var positionsWriteStart = writePosition / 3 * 72;
            var indicesWriteStart = writePosition / 3 * 36;
            var positionInVerticeCache = 0;
            // Create each face in turn.
            for (var index = 0; index < 6; index++) {
                // Six indices (two triangles) per face.
                var verticesLength = positionsWriteStart / 3;
                if (indicesWriteStart >= indices.length) {
                    indices.push(verticesLength);
                    indices.push(verticesLength + 1);
                    indices.push(verticesLength + 2);
                    indices.push(verticesLength);
                    indices.push(verticesLength + 2);
                    indices.push(verticesLength + 3);
                    indicesWriteStart += 6;
                }
                // Four vertices per face.
                var vertex = this._cubeVerticeCache[positionInVerticeCache++];
                positions[positionsWriteStart++] = vertex.x + x;
                positions[positionsWriteStart++] = vertex.y + y;
                positions[positionsWriteStart++] = vertex.z + z;
                vertex = this._cubeVerticeCache[positionInVerticeCache++];
                positions[positionsWriteStart++] = vertex.x + x;
                positions[positionsWriteStart++] = vertex.y + y;
                positions[positionsWriteStart++] = vertex.z + z;
                vertex = this._cubeVerticeCache[positionInVerticeCache++];
                positions[positionsWriteStart++] = vertex.x + x;
                positions[positionsWriteStart++] = vertex.y + y;
                positions[positionsWriteStart++] = vertex.z + z;
                vertex = this._cubeVerticeCache[positionInVerticeCache++];
                positions[positionsWriteStart++] = vertex.x + x;
                positions[positionsWriteStart++] = vertex.y + y;
                positions[positionsWriteStart++] = vertex.z + z;
            }
            this._numberofCubes++;
            this._setCubePosition(x, y, z, writePosition);
        };
        BoxMesh.prototype._Clone = function (name, unitBoxsize, startCapacity, scene, material, position) {
            this._unitBoxSize = unitBoxsize;
            this._capacity = startCapacity;
            this._boxMaterial = material;
            this._scene = scene;
            this._mesh = new BABYLON.Mesh(name, this._scene);
            if (position !== undefined) {
                this._mesh.position = position;
            }
            this._mesh.material = this._boxMaterial;
            this._initCubeVerticeCache();
            this._initMesh();
            this._nextWritablePositions = new Array();
            this._nextWritablePositions.push(0);
            //adding first box
            this.addBox(0, 0, 0);
        };
        BoxMesh.prototype._initCubeVerticeCache = function () {
            this._cubeVerticeCache = new Array();
            for (var index = 0; index < this._normalsSource.length; index++) {
                var normal = this._normalsSource[index];
                // Get two vectors perpendicular to the face normal and to each other.
                var side1 = new BABYLON.Vector3(normal.y, normal.z, normal.x);
                var side2 = BABYLON.Vector3.Cross(normal, side1);
                // Four vertices per face.
                this._cubeVerticeCache.push(normal.subtract(side1).subtract(side2).scale(this._unitBoxSize / 2));
                this._cubeVerticeCache.push(normal.subtract(side1).add(side2).scale(this._unitBoxSize / 2));
                this._cubeVerticeCache.push(normal.add(side1).add(side2).scale(this._unitBoxSize / 2));
                this._cubeVerticeCache.push(normal.add(side1).subtract(side2).scale(this._unitBoxSize / 2));
            }
        };
        BoxMesh.prototype.updateMesh = function () {
            this._mesh.updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, this._positions);
            this._mesh.setIndices(this._indices, this._numberofCubes * 24);
        };
        BoxMesh.prototype._extendCapacity = function (min) {
            var initialCapacity = this._capacity;
            while (this._capacity < min) {
                //doubles the capacity
                this._capacity = this._capacity * 2;
            }
            console.info("extending capacity to" + this._capacity);
            //extend existing arrays
            var oldPositions = this._positions;
            var oldIndices = this._indices;
            var oldNumberOfCubes = this._numberofCubes;
            var oldCubepositions = this._cubesPositions;
            this._initMesh();
            for (var key in oldCubepositions) {
                this._cubesPositions[key] = oldCubepositions[key];
            }
            this._numberofCubes = oldNumberOfCubes;
            for (var i = 0; i < oldPositions.length; i++) {
                this._positions[i] = oldPositions[i];
            }
            for (var i = 0; i < oldIndices.length; i++) {
                this._indices.push(oldIndices[i]);
            }
        };
        BoxMesh.prototype._getFirstWritablePosition = function () {
            if (this._nextWritablePositions.length === 0) {
                return this._numberofCubes * 3;
            }
            else {
                return this._nextWritablePositions.pop();
            }
        };
        Object.defineProperty(BoxMesh.prototype, "checkCollisions", {
            get: function () {
                return this._mesh.checkCollisions;
            },
            set: function (value) {
                this._mesh.checkCollisions = value;
            },
            enumerable: true,
            configurable: true
        });
        BoxMesh.prototype._cleanDataForRemovedCubes = function (cubes) {
            for (var i = 0; i < cubes.length; i++) {
                var cubeIndex = cubes[i] * 72;
                this._positions.set(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), cubeIndex);
            }
        };
        return BoxMesh;
    }());
    BOXMONGER.BoxMesh = BoxMesh;
})(BOXMONGER || (BOXMONGER = {}));
//# sourceMappingURL=boxmonger.boxmesh.js.map