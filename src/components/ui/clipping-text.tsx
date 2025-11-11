"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

export function ClippingText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    textMeshes: THREE.Mesh[]
    clipPlanes: THREE.Plane[]
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Scene setup
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.localClippingEnabled = true
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 10)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x03b9f1, 1, 50)
    pointLight.position.set(-5, 5, 5)
    scene.add(pointLight)

    const textMeshes: THREE.Mesh[] = []
    const clipPlanes: THREE.Plane[] = []

    // Load font and create text
    const fontLoader = new FontLoader()
    
    // Responsive sizing
    const isMobile = container.clientWidth < 768
    const letterSize = isMobile ? 1 : 2
    const spacing = isMobile ? 1.5 : 2.5
    
    console.log('Container size:', container.clientWidth, container.clientHeight)
    console.log('Letter size:', letterSize, 'Spacing:', spacing)

    fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      (font) => {
        const letters = ['C', 'I', 'C', 'I', ' ', 'L', 'A', 'B', 'E', 'L']
        let letterIndex = 0
        
        letters.forEach((letter, index) => {
          if (letter === ' ') return // Skip space

          const geometry = new TextGeometry(letter, {
            font: font,
            size: letterSize,
            depth: 0.4,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.03,
            bevelSegments: 5
          })

          geometry.center()

          // Create clipping plane for this letter (starts above, will animate down)
          const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10)
          clipPlanes.push(clipPlane)

          // Material with clipping
          const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 100,
            side: THREE.DoubleSide,
            clippingPlanes: [clipPlane],
            clipShadows: true,
          })

          const mesh = new THREE.Mesh(geometry, material)
          
          // Position letters in a row - calculate based on actual letter count
          const totalLetters = letters.filter(l => l !== ' ').length
          const xPosition = (letterIndex - totalLetters / 2) * spacing
          mesh.position.x = xPosition
          mesh.position.y = 0
          mesh.position.z = 0

          // Store initial data for animation
          mesh.userData = {
            index: letterIndex,
            initialY: 0,
            clipPlaneIndex: clipPlanes.length - 1,
            delay: letterIndex * 0.2, // Stagger animation
          }

          scene.add(mesh)
          textMeshes.push(mesh)
          
          console.log(`Letter ${letter} at position:`, mesh.position.x, mesh.position.y, mesh.position.z)
          
          letterIndex++
        })
        
        console.log(`Created ${textMeshes.length} letter meshes`)
        console.log('Camera position:', camera.position.x, camera.position.y, camera.position.z)

        if (sceneRef.current) {
          sceneRef.current.textMeshes = textMeshes
          sceneRef.current.clipPlanes = clipPlanes
        }
      }
    )

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', onWindowResize)

    // Animation loop
    const transform = new THREE.Matrix4()
    const tmpMatrix = new THREE.Matrix4()
    
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      textMeshes.forEach((mesh, index) => {
        const userData = mesh.userData
        const delayedTime = time - userData.delay

        // Animate mesh transformation
        mesh.rotation.x = time * 0.3 + userData.index * 0.2
        mesh.rotation.y = time * 0.2 + userData.index * 0.1
        
        // Bouncy scale effect
        const bouncy = Math.cos(time * 0.5 + userData.delay) * 0.15 + 0.85
        mesh.scale.set(bouncy, bouncy, bouncy)
        
        mesh.updateMatrix()
        transform.copy(mesh.matrix)

        // Animate clipping plane - moves with the mesh transformation
        if (clipPlanes[userData.clipPlaneIndex]) {
          // Create a clipping plane that moves dynamically
          const angle = time * 0.5 + userData.index * 0.3
          const planeNormal = new THREE.Vector3(
            Math.sin(angle) * 0.5,
            Math.cos(angle * 0.7),
            Math.cos(angle) * 0.3
          ).normalize()
          
          clipPlanes[userData.clipPlaneIndex].normal.copy(planeNormal)
          clipPlanes[userData.clipPlaneIndex].constant = Math.sin(time * 0.3 + userData.delay) * 0.5
        }
      })

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.2) * 0.5
      camera.position.y = Math.cos(time * 0.15) * 0.3

      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      textMeshes,
      clipPlanes,
      animationId: 0,
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.textMeshes.forEach((mesh) => {
          mesh.geometry.dispose()
          if (mesh.material && !Array.isArray(mesh.material)) {
            mesh.material.dispose()
          }
        })

        sceneRef.current.renderer.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen"
      style={{
        background: 'transparent',
        overflow: 'hidden',
      }}
    />
  )
}
