import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import React, { Component } from 'react'

// insert a line to import data from JSON file

export default class VerticalStoryDashboard extends Component {

    constructor(props) {
        super(props);
        // this.storyPaths = props.storyPaths; 
        // this.stories = [];
        // this.cameraPosition = props.cameraPosition;
        // this.camera = null; 
        
        // this.dyVelocity = 3;
        // this.dxVelocity = 5; 

        // this.loadStories();
        // this.initalizeStory();
        this.setupEventlisteners();
    }

    loadStories() {

        // const loader = new THREE.ObjectLoader();
        // https://threejsfundamentals.org/threejs/lessons/threejs-load-gltf.html

        // const loader = new GLTFLoader();

        // loader.load( 'path/to/model.glb', function ( gltf ) {   

	    // scene.add( gltf.scene );

        // }, undefined, function ( error ) {

	    // console.error( error );

        // } );

        // for(var path in this.storyPaths){

        // }
    }

    onCameraUpdate(event){
        console.log(event);
        // this.camera.position.x = window.scrollX/this.dxVelocity;
    }

    initializeCamera() {
        this.camera = new THREE.Camera({fov: 60, position: this.cameraPosition, near: 0.1, far: 5000})
    }

    setupEventlisteners() {
        
        // let root = document.querySelector('#root');
        // console.log(root );
        // root.onscroll = this.onCameraUpdate;
        // console.log(window);
        // console.log(root.onscroll);
        window.addEventListener('scroll', (e) => function(e){
            console.log('is this working');
            console.log(e);
        })
    }

    render() {
        return (
            <div className="test2"></div>
        )
    }
}