var BOXMONGER;
(function (BOXMONGER) {
    var BoxMesh = (function () {
        function BoxMesh(name, unitBoxsize, startCapacity, scene, material) {
            this._normalsSource = [
                new BABYLON.Vector3(0, 0, 1),
                new BABYLON.Vector3(0, 0, -1),
                new BABYLON.Vector3(1, 0, 0),
                new BABYLON.Vector3(-1, 0, 0),
                new BABYLON.Vector3(0, 1, 0),
                new BABYLON.Vector3(0, -1, 0)
            ];
            this._mesh = new BABYLON.Mesh(name, scene);
            this._unitBoxSize = unitBoxsize;
            this._capacity = startCapacity;
            this._initMesh();

            //adding first box
            this.AddBox(new BABYLON.Vector3(0, 0, 0));

            this._nextWriteableCube = 0;

            if (material) {
                this._mesh.material = material;
                this._boxMaterial = material;
            }
        }
        BoxMesh.prototype._initMesh = function () {
            var vertexData = new BABYLON.VertexData();
            vertexData.indices = [];
            vertexData.positions = [];
            vertexData.uvs = [];
            vertexData.normals = [];

            for (var cubeIndex = 0; cubeIndex < this._capacity; cubeIndex++) {
                for (var index = 0; index < this._normalsSource.length; index++) {
                    var normal = this._normalsSource[index];

                    // Get two vectors perpendicular to the face normal and to each other.
                    var side1 = new BABYLON.Vector3(normal.y, normal.z, normal.x);
                    var side2 = BABYLON.Vector3.Cross(normal, side1);

                    // Four vertices per face.
                    vertexData.normals.push(normal.x, normal.y, normal.z);
                    vertexData.normals.push(normal.x, normal.y, normal.z);
                    vertexData.normals.push(normal.x, normal.y, normal.z);
                    vertexData.normals.push(normal.x, normal.y, normal.z);

                    if (normal.x == 1) {
                        vertexData.uvs.push(1.0, 0.0);
                        vertexData.uvs.push(1.0, 1.0);
                        vertexData.uvs.push(0.0, 1.0);
                        vertexData.uvs.push(0.0, 0.0);
                    } else if (normal.z == 1) {
                        vertexData.uvs.push(1.0, 1.0);
                        vertexData.uvs.push(0.0, 1.0);
                        vertexData.uvs.push(0.0, 0.0);
                        vertexData.uvs.push(1.0, 0.0);
                    } else if (normal.x == -1) {
                        vertexData.uvs.push(1.0, 0.0);
                        vertexData.uvs.push(1.0, 1.0);
                        vertexData.uvs.push(0.0, 1.0);
                        vertexData.uvs.push(0.0, 0.0);
                    } else if (normal.z == -1) {
                        vertexData.uvs.push(0.0, 0.0);
                        vertexData.uvs.push(1.0, 0.0);
                        vertexData.uvs.push(1.0, 1.0);
                        vertexData.uvs.push(0.0, 1.0);
                    } else {
                        vertexData.uvs.push(1.0, 1.0);
                        vertexData.uvs.push(0.0, 1.0);
                        vertexData.uvs.push(0.0, 0.0);
                        vertexData.uvs.push(1.0, 0.0);
                    }
                }
            }

            vertexData.positions = new Array(this._capacity * 72);
            this._cubesPositions = new Array(this._capacity);
            this._numberofCubes = 0;

            //push to the gpu
            vertexData.applyToMesh(this._mesh, true);
            this._positions = new Float32Array(this._mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind));
            this._indices = this._mesh.getIndices();
        };

        BoxMesh.prototype._updateMesh = function () {
            this._mesh.updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, this._positions);
            this._mesh.setIndices(this._indices, this._numberofCubes * 24);
        };

        BoxMesh.prototype.AddBox = function (position) {
            if (this._numberofCubes + 1 > this._capacity)
                this._extendCapacity();

            this._addBoxGeneric(position, this._positions, this._indices);
            this._updateMesh();
        };

        BoxMesh.prototype.AddBoxes = function (positions) {
            if (this._numberofCubes + positions.length > this._capacity)
                this._extendCapacity();

            for (var i = 0; i < positions.length; i++) {
                this._addBoxGeneric(positions[i], this._positions, this._indices);
            }
            this._updateMesh();
        };

        BoxMesh.prototype._extendCapacity = function () {
            var initialCapacity = this._capacity;

            //doubles the capacity
            this._capacity = this._capacity * 2;

            //extend existing arrays
            var oldPositions = this._positions;
            var oldIndices = this._indices;
            var oldNumberOfCubes = this._numberofCubes;
            var oldCubepositions = this._cubesPositions;

            this._initMesh();

            for (var i = 0; i < oldCubepositions.length; i++) {
                this._cubesPositions[i] = oldCubepositions[i];
            }
            this._numberofCubes = oldNumberOfCubes;
            this._positions.set(oldPositions, 0);
            for (var i = 0; i < oldIndices.length; i++) {
                this._indices.push(oldIndices[i]);
            }
        };

        BoxMesh.prototype.RemoveBox = function (position) {
            var positionInArray = this._getCubePositionInArray(position);
            if (positionInArray != -1) {
                this._cubesPositions[positionInArray] = null;
                this._numberofCubes--;
                this._cleanDataForRemovedCubes();
                this._updateMesh();
            }
        };

        BoxMesh.prototype.RemoveBoxes = function (positions) {
            for (var i = 0; i < positions.length; i++) {
                var positionInArray = this._getCubePositionInArray(positions[i]);
                if (positionInArray != -1) {
                    this._cubesPositions[positionInArray] = null;
                    this._numberofCubes--;
                }
            }

            this._cleanDataForRemovedCubes();
            this._updateMesh();
        };

        BoxMesh.prototype._getFirstWritablePosition = function () {
            for (var i = 0; i < this._cubesPositions.length; i++) {
                if (this._cubesPositions[i] == undefined || this._cubesPositions == null) {
                    return i;
                }
            }

            return 0;
        };

        BoxMesh.prototype._getCubePositionInArray = function (position) {
            var cubesFound = 0;
            for (var i = 0; i < this._cubesPositions.length; i++) {
                if (this._cubesPositions[i] != undefined && this._cubesPositions != null) {
                    if (this._cubesPositions[i].x == position.x && this._cubesPositions[i].y == position.y && this._cubesPositions[i].z == position.z)
                        return i;
                    else
                        cubesFound++;
                }
                if (cubesFound >= this._numberofCubes)
                    return -1;
            }
            return -1;
        };

        BoxMesh.prototype._cleanDataForRemovedCubes = function () {
            var numberOfCubeToDelete = 0;

            for (var i = 0; i < this._numberofCubes; i++) {
                //if this a cube we keep?
                if (this._cubesPositions[i] != undefined && this._cubesPositions != null) {
                    //do we need to remove previous cubes ?
                    if (numberOfCubeToDelete > 0) {
                        this._emptyCubesPositions(i, numberOfCubeToDelete);
                        numberOfCubeToDelete = 0;
                        i--;
                    }
                } else {
                    numberOfCubeToDelete++;
                }
            }

            //remove tail cubes if needed
            if (numberOfCubeToDelete > 0) {
                this._emptyCubesPositions(i, numberOfCubeToDelete);
            }
        };

        BoxMesh.prototype._emptyCubesPositions = function (from, howMany) {
            this._cubesPositions.splice(from, howMany);

            for (var pos = from * 72 - howMany * 72; pos < howMany * 72; pos++) {
                this._positions[pos] = 0;
            }
        };

        BoxMesh.prototype._addBoxGeneric = function (position, positions, indices) {
            var writePosition = this._getFirstWritablePosition();
            var positionsWriteStart = writePosition * 72;
            var indicesWriteStart = writePosition * 36;

            for (var index = 0; index < this._normalsSource.length; index++) {
                var normal = this._normalsSource[index];

                // Get two vectors perpendicular to the face normal and to each other.
                var side1 = new BABYLON.Vector3(normal.y, normal.z, normal.x);
                var side2 = BABYLON.Vector3.Cross(normal, side1);

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
                var vertex = normal.subtract(side1).subtract(side2).scale(this._unitBoxSize / 2).add(position);
                positions[positionsWriteStart++] = vertex.x;
                positions[positionsWriteStart++] = vertex.y;
                positions[positionsWriteStart++] = vertex.z;

                vertex = normal.subtract(side1).add(side2).scale(this._unitBoxSize / 2).add(position);
                positions[positionsWriteStart++] = vertex.x;
                positions[positionsWriteStart++] = vertex.y;
                positions[positionsWriteStart++] = vertex.z;

                vertex = normal.add(side1).add(side2).scale(this._unitBoxSize / 2).add(position);
                positions[positionsWriteStart++] = vertex.x;
                positions[positionsWriteStart++] = vertex.y;
                positions[positionsWriteStart++] = vertex.z;

                vertex = normal.add(side1).subtract(side2).scale(this._unitBoxSize / 2).add(position);
                positions[positionsWriteStart++] = vertex.x;
                positions[positionsWriteStart++] = vertex.y;
                positions[positionsWriteStart++] = vertex.z;
            }

            this._numberofCubes++;
            this._cubesPositions[writePosition] = position;
        };
        return BoxMesh;
    })();
    BOXMONGER.BoxMesh = BoxMesh;
})(BOXMONGER || (BOXMONGER = {}));
//# sourceMappingURL=boxmonger.js.map
