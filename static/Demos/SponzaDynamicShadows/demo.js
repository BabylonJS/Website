var demo = {
    scene: "SponzaDynamicShadows",
    incremental: false,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: false,
    onload: function () {
        var node = scene.getMeshByName("litghtmesh");
        var particleSystem = new BABYLON.ParticleSystem("New Particle System", 1000, scene);
        particleSystem.emitter = node;
        particleSystem.name = "New Particle System";
        particleSystem.renderingGroupId = 0;
        particleSystem.emitRate = 200;
        particleSystem.manualEmitCount = -1;
        particleSystem.updateSpeed = 0.005;
        particleSystem.targetStopDuration = 0;
        particleSystem.disposeOnStop = false;
        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0.3;
        particleSystem.minLifeTime = 0.2;
        particleSystem.maxLifeTime = 0.5;
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.8;
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = 6.283185307179586;
        particleSystem.layerMask = 268435455;
        particleSystem.blendMode = 0;
        particleSystem.forceDepthWrite = false;
        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
        particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
        particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
        particleSystem.color1 = new BABYLON.Color3(0.7, 0.8, 0.5465114353377606);
        particleSystem.color2 = new BABYLON.Color3(0.6707185797327061, 0.5, 0.23185333620389842);
        particleSystem.colorDead = new BABYLON.Color3(0.2980971465478694, 0, 0.3312190517198549);
        particleSystem.textureMask = new BABYLON.Color4(1, 1, 1, 1);
        particleSystem.id = "New Particle System";
        particleSystem.particleTexture = BABYLON.Texture.CreateFromBase64String("data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdENzY1NjNCQjk0RjExRTU5OEQ4QkJFMENFNjYwODI0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdENzY1NjNDQjk0RjExRTU5OEQ4QkJFMENFNjYwODI0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0Q3NjU2MzlCOTRGMTFFNTk4RDhCQkUwQ0U2NjA4MjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0Q3NjU2M0FCOTRGMTFFNTk4RDhCQkUwQ0U2NjA4MjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCACAAIADAREAAhEBAxEB/8QBogAAAAYCAwEAAAAAAAAAAAAABwgGBQQJAwoCAQALAQAABgMBAQEAAAAAAAAAAAAGBQQDBwIIAQkACgsQAAIBAwQBAwMCAwMDAgYJdQECAwQRBRIGIQcTIgAIMRRBMiMVCVFCFmEkMxdScYEYYpElQ6Gx8CY0cgoZwdE1J+FTNoLxkqJEVHNFRjdHYyhVVlcassLS4vJkg3SThGWjs8PT4yk4ZvN1Kjk6SElKWFlaZ2hpanZ3eHl6hYaHiImKlJWWl5iZmqSlpqeoqaq0tba3uLm6xMXGx8jJytTV1tfY2drk5ebn6Onq9PX29/j5+hEAAgEDAgQEAwUEBAQGBgVtAQIDEQQhEgUxBgAiE0FRBzJhFHEIQoEjkRVSoWIWMwmxJMHRQ3LwF+GCNCWSUxhjRPGisiY1GVQ2RWQnCnODk0Z0wtLi8lVldVY3hIWjs8PT4/MpGpSktMTU5PSVpbXF1eX1KEdXZjh2hpamtsbW5vZnd4eXp7fH1+f3SFhoeIiYqLjI2Oj4OUlZaXmJmam5ydnp+So6SlpqeoqaqrrK2ur6/9oADAMBAAIRAxEAPwD5/wD7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xunrb1AcnmKShVdRn+4sLXv46WeX6f4eP37r3Xtw0BxmYq6EjSYPt7i1reSlgm+n/Tz37r3TL7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XuhY6OxRzfaO18YE1/c/xr0Wvfw7ey1R9P+nXv3Xuvd44o4TtHdGMKFDTfwX0EWI823cTUfT/AFpffuvdBP7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XujU/CjCPuD5NdaYkRNIKv++XAUsCIOv8AddTf6EceH37r3XfzWwb7f+TPZeKMTxil/ub6dJAHn6/2rU/0/wCb3v3Xuiq+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XunHH4yqyMgSBGIJsWsbf7D37r3Qy7a6oq68xs8DuWtyVJ+v+w49+691aP8Ayz+g5q35ldMwvRkrIOwiR47309U75e30/qPfuvdZ/wCZb0DNR/MruaJKMqqDrzgR2HPVOxmP4/q3v3Xuqwdy9RVVFrZad1K3NwpH/EfQe/de6BLK4SsxcjLNG2gEjVb6W/1X49+690ze/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XunHGY+TI1SQICQWGoj+l/p7917o43VfVbVzU/wDk976P7H09+691ZP1h8fmq0p/8iJuE/wB1/wCt+LX9+691dN/LL+Nn2ny96crHoLLEu/8AkxWtr6t3rGPxxy/v3Xupv8yz41/efL3uKtSguJV2BYiL/jn1bsiL+n9U9+691Td2X8eWpI5/8hIsG/3X/h/Qj37r3Vbfa3UrUJqP8m02Lf2Lf14+nv3XuiP53Dy4mreJlITUQLj9JB+n+tf37r3TH7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuh26o20a+rgdo9Rd1J4v9SP969+691cR8fusEq2ov8nBuY/7H+tb8f19+691eF0R0RHVx0f+Rg3Ef+6/9b/D6+/de6vN+CPQEWE7466zRogn2ibr9Xjtp+52PuSlH44v57e/de6dfnD8fY853v2JmRRB/u02tZvHe/2+yNt031tbjwe/de6pQ7y6DjpIqv8AyIAAP/uv+n9ePfuvdUh/IPqtKNq21OBbX/Yt9L/4f09+691TL3DtP7KoqSsenSzWNrWsbg/19+690WMggkH6gkH/AFx7917rr37r3Xvfuvde9+691737r3TzQbey+TKiipPMWtb/ACilivf6f56eMD37r3S/xXR/aOaKjGbY+5L203zW3YL3+n/AjLQ29+690KOE+FHya3A8QxXWn3YkZQv+/wAtgQXDEf8AKzuqG3Hv3XurFOg/5Z/zKrZqN4emRIpMdiewuql4Nvw++AffuvdXz/Gz+WX8vaT7B6zpxYlHiJP9/wDq17Wt+I96v7917q+noD4I98YSKiOa66Sk0CPVfdWyKm1rX4pdyTXt/hf37r3VxnQnQud2RncNmcxhkofsErQzCtxlSVNRjaujAAo6uoJBNRbi/wBffuvdPHdnReW3pm8vl8ViY6xq9KMKfu8fTljTY2kpP+UqpgPBp7c29+691Ul318He7c3FWnC9fpV6xIUI3Psym1A3sf8AKtwwWvf8+/de6of+Sf8ALQ+W9cK96Hp9JlPkIP8Af7q+P+tv87vSP37r3VB/yC/llfMyllrHfpgIoaTn/SH1STYXJ4XfJP09+691WLuP4NfKLb1TUjKdX/arHI1/9/r15PYX/pTbtmJ59+690E2V6D7awmoZTaf2un9X+53bU1rfX/gPmZb+/de6D7IbWzuLJFfQ+Ar9R9zRyW/6k1En9PfuvdMBBBIP1Bsf9ce/de669+6909UO4cxjSDRVngK/T/J6WS3+wlgkB9+690vsV3j2jhdP8M3R9to/T/uF29Na3/URiZb/AOx9+690KWD+a/yawEkRxXZf2vjdCP8Afm9fzkAEfmp2pN+B7917qxroH+Zb8yqOajSHuUIqmMAf6POqT9LH+1sZr29+691fb8a/5lny8rfsEre4llU+IEf3A6tj+tv+OWyEt7917q/H4+/OHvfORUQzPYiVeoJqH91tkU972v8A8BttwW49+691cf0X3Zmt6ZbE4rMZdK9q2Oquoo8bTFjBj6mqv/kdJARYwX4/p7917p57m7myezsnlMZjMpHRSUUdMQDTUFQQaigpqr/lKppiSTNfn37r3VR3fvzV7swUVaMLv9KMIJAg/uzsyosBe3/Arb05NvfuvdUMfJT+ZN8t6AV6UPcCwqPJpA2F1hJb62sZdlSE8e/de6oJ+Qn8zH5mVMtaj9zh1LSD/mXnVA4Nx9V2KpP09+691V9uX5yfKLcFVVfxTtD7tXka4/uV15Bfnn/gNtKG1z7917oJcr3721m9Rym7PutV9X+4LbUN7/X/AID4aK3v3Xug+yG6c9lCxr67zljc/wCS0cVyfqf2aeO3v3XumAkkkn6k3P8Arn37r3XXv3Xuve/de697917r3v3XujDdRbl+yqqdWfSVdQbn+hH+2Hv3Xurmvjz2XHSNQ/vgWMf9of4Ee/de6vT6D7yipI6L/KwABH/bt/Tn37r3V6Pwd76izfdvX+FNaH+7Tc40GS+r7bZm4arkXP08F/fuvdOvzV79iwXdm/8ACitCCjTbNkElgPuNmbeqvpcWv5/fuvdUnd797xVcVZ/lgNxJ/uy973/x+vv3XuqMvkR2hHVmutUA38n9r+t7f7x7917qlTubdS1dRVASBrs9rH/E/Qj37r3RUGJZix+rEk/65N/fuvdde/de697917r3v3Xuve/de697917r3v3Xuve/de6ecJlZMXWRzKxCahqsbW/2r/be/de6PH1L2saFqb/KCNOj+1/S3059+691Z31X8g2o0px97awT+3b6W/xt7917q63+Wh8kxW/Lfp+hevusyb+uDJ9fH1fvSX+p/wCOfv3Xup38yb5KCg+W/cFClfZYV2FZRJ9PL1hsqa1r/kye/de6po7Q+RBq46gffXuG/wB2X/3i9vfuvdVkduduGuNT/lJNy/8Ab+v1/wAfp7917oge587JmKyRtZaMOT9eCb3/AN4Pv3Xukv7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6fMPnavEyq0TtoBBsCQV/1vzb37r3Rgdp9w1FF41NSy6bXGoi1v6g/wCPv3XurV/5ZXyClpfmZ0u71pCoOwwbycXPVO+VH1P9T7917qT/ADMfkHLU/Mzud0rWKsOvLWc246p2Kv4P+0+/de6qy3V3NUVayAVTHUCLaz/rEfX37r3Rd87ueszEj6pHEbE/Um5H+x5Hv3Xukv7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XuuwSDcEg/1BsffuvdG5+DW46nb3yi6vygqZI1pf763OsgDz9ebtpvqTx/nvfuvde+cm5KrcHyi7Pyn3UjrVf3K51fXwdd7Spvr+beH37r3RRizMbsSx/qSSf8Aeffuvdde/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6GHoPKnCds7TyYbQab+O+r6W822szT/1H/HX37r3Xu/Mr/G+2t2ZPVr+5/gXqve/g21hqf6/9OffuvdA97917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XulDtWvOLz1BXBtJg+6s39PLR1EP+8+T37r3XW6sgcpnq+uZtRn+19V738VHTwj/AHiP37r3Sf8Afuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+6914EjkEg/wBRx7917rskk3JJP9Tyffuvdde/de697917r3v3Xuve/de697917r3v3Xuve/de6//Z", "data:Part.jpg", scene);
        node.attachedParticleSystem = particleSystem;
        particleSystem.start();
        node = scene.getNodeByName("litghtmesh");
        node.position = new BABYLON.Vector3(2.5223299803446766, 2.0876, -3.525673483620715);
        node.rotation = new BABYLON.Vector3(0, 0, 0);
        node.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, -1);
        node.scaling = new BABYLON.Vector3(1, 1, 1);
        
        scene.getLightByName("Omni002").direction = null;
        scene.getLightByName("Omni001").direction = null;

        var shadowGenerator = scene.getLightByName("Omni002").getShadowGenerator();
        shadowGenerator.getShadowMap().refreshRate = 0;
        shadowGenerator.forceBackFacesOnly = true;
        shadowGenerator.bias = 0.01;

        shadowGenerator = scene.getLightByName("Omni001").getShadowGenerator();
        shadowGenerator.forceBackFacesOnly = true;
        shadowGenerator.bias = 0.01;
    }
};