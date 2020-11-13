import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useMemo } from 'react'
import { Canvas, useUpdate } from 'react-three-fiber'
import './styles.css'
// https://codesandbox.io/s/r3f-instanced-colors-fjvcj?file=/src/index.js

function Test({ points }) {
   // convert points to spline curve 
  const curve = useMemo(() => new THREE.SplineCurve(points.map(v => new THREE.Vector2(...v))), [points])
  
  const ref = useUpdate(geo => geo.setFromPoints(curve.getPoints(50)), [curve])
  return (
    <line>
      <bufferGeometry attach="geometry" ref={ref} />
      <lineBasicMaterial attach="material" color="blue" />
    </line>
  )
}
