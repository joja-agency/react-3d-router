import React, { Component } from "react";
import * as THREE from "three";
import controls from "./utils/OrbitControls";
import TWEEN from "@tweenjs/tween.js";
//import { isMobile } from "react-device-detect";
import {canvasContainerStyle} from './assets/styles'

class Three extends Component {

  componentDidMount() {
    this.setupScene();
    this.addGeometry();

    let container = document.getElementById("canvasContainer");
    container.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.windowRes, false);

    this.animate();
  }

  setupScene = () => {
    const aspect = window.innerWidth / window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 10000);
    this.camera.target = new THREE.Vector3(0, 0, 0);
    
    this.scene = new THREE.Scene();
    this.defaultColor = this.props.background;
    this.scene.background = new THREE.Color(this.defaultColor);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.light = new THREE.PointLight( 0xffffff, 1, 1000 );
    this.light.position.set( 350, 350, 350 );
    this.scene.add( this.light )
    this.scene.add(new THREE.AmbientLight(0xffffff, 1))

    this.controls = new controls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.15;
    this.controls.enableZoom = true;

    this.setCamPosition(this.props.initialPos.cam, this.props.initialPos.target, 0)

    this.movement = null;
  };

  addGeometry = () => {
    const {material} = this.props

    let loader = new THREE.ObjectLoader();
    this.object3d = loader.parse(this.props.object);

    //if user didn't specify material, use normal
    let objMaterial = material
    if (!objMaterial){
      objMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
      objMaterial.depthFunc = THREE.DoubleSide;
    }

    this.object3d.children[0].material = objMaterial;
    this.object3d.position.set(0, 0, 0);
    this.object3d.scale.set(2, 2, 2);
    this.scene.add(this.object3d);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    TWEEN.update();
    this.rotateObject(this.props.rotation)
    this.renderThree();
  };

  rotateObject(angles){
    if (!angles) return
    let {x, y, z} = angles
    if (!x && !y && !z) return 

    this.object3d.rotation.x += x
    this.object3d.rotation.y += y
    this.object3d.rotation.z += z
  }

  renderThree = () => {
    this.renderer.render(this.scene, this.camera);
  };

  windowRes = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  };

  //log position of camera and target
  onCanvasClick = () => {
    console.log(
      `cam:{x:${this.camera.position.x}, y:${this.camera.position.y}, z:${
        this.camera.position.z
      }},
      target:{x:${this.controls.target.x}, y:${this.controls.target.y}, z:${
        this.controls.target.z
      }}`
    );
  }

  setCamPosition = (
    camPos,
    targetPos = null,
    time = 1000,
    background = null,
    cbStart = null,
    cbEnd = null
  ) => {
    new TWEEN.Tween(this.camera.position)
      .to(camPos, time)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start()
      .onStart(cbStart)
      .onComplete(cbEnd);

    if (targetPos) {
      new TWEEN.Tween(this.controls.target)
        .to(targetPos, time)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .start();
    }

    if (background) {
      this.changeBackground(background);
    } else {
      this.changeBackground(this.defaultColor);
    }
  };

  changeBackground(color) {
    let newColor = new THREE.Color(color);

    new TWEEN.Tween(this.scene.background)
      .to(newColor)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  }

  setMovement = () => {
    if (this.movement) return; //already happening
    let _this = this;

    this.movement = new TWEEN.Tween(this.object3d.rotation)
      .to({ z: 0.7 })
      .delay(500)
      .onStop(() => {
        new TWEEN.Tween(_this.object3d.rotation)
          .to({ z: 0 })
          .onComplete(function() {
            _this.movement = null;
          })
          .start();
      })
      .easing(TWEEN.Easing.Bounce.Out)
      .repeat(Infinity)
      .yoyo(true)
      .start();
  };

  stopMovement = () => {
    if (this.movement) this.movement.stop();
  };

  render() {
    return <div id="canvasContainer" style = {canvasContainerStyle} onClick={this.onCanvasClick} />;
  }
}

export default Three;
