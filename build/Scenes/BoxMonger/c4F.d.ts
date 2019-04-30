declare module BOXMONGER {
    class EqData {
        private _worldData;
        private _edgeSize;
        static STONE: number;
        static GRASS: number;
        static SNOW: number;
        constructor(edgeSize: number);
        getData(x: number, y: number): any;
        setData(x: number, y: number, value: number, blocType: number): void;
        setPitch(x: number, y: number, pitch: number): void;
        setBoxData(point: BABYLON.Vector2, dimensions: BABYLON.Vector2, value: number, blockType: number): void;
        edgeSize: number;
    }
    class C4fWorldManager {
        private _worldData;
        private _edgeSize;
        private _grassBox;
        private _grassHeight;
        private _snowBox;
        private _snowHeight;
        private _stoneBox;
        private _stoneHeight;
        private _analyzer;
        private _scene;
        private _sounds;
        private _soundVolume;
        private _step;
        private _pitchMultiplier;
        private _updateEveryTweets;
        private _freqStart;
        private _freqStartUp;
        private _shootSound;
        private _geekCouncilSound;
        private _swoochSound;
        private _scratchSound;
        private _logoCoordinates;
        tweetCount: number;
        private _initialAudioStartTime;
        constructor(edgeSize: number, unitBoxSize: number, scene: BABYLON.Scene);
        startSounds(): void;
        nextStep(): void;
        waveFromSound(): void;
        moveSquares(): void;
        moveMultipleWave(): void;
        moveMultipleWave2(): void;
        loadNextTweets(): void;
        displayTweet(tweet: any): void;
        deleteNextForLogo(): boolean;
        private loadLogoCoordinates();
        static CreateTweetPlane(name: string, height: number, width: number, scene: BABYLON.Scene, updatable?: boolean): BABYLON.Mesh;
        static CreateTweetPlaneVertexData(height: number, width: number): BABYLON.VertexData;
        fadeSounds(): void;
        stopSounds(): void;
        moveSquare(up: boolean, distanceFromCenter: number): void;
        setPitch(x: number, y: number, pitch: number): void;
        playSratch(): void;
        startFinish(): void;
        initPlane(): void;
        addBox(x: number, y: number, z: number): void;
        removeBox(x: any, y: any, z: any): void;
        Update(): void;
        setHeightForBlockType(height: number, blockType: number, variance: number): void;
    }
}
