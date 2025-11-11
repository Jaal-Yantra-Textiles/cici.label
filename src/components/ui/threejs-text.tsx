"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

export function ThreeJsText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    textMesh: THREE.Mesh | null
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
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Lighting - softer, more subtle
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0xffffff, 0.5)
    pointLight1.position.set(3, 3, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xffffff, 0.3)
    pointLight2.position.set(-3, -3, 5)
    scene.add(pointLight2)

    let textMesh: THREE.Mesh | null = null

    // Load font and create text
    const fontLoader = new FontLoader()
    
    // Responsive text size based on screen width
    const isMobile = container.clientWidth < 768
    const isTablet = container.clientWidth < 1024
    const textSize = isMobile ? 0.5 : isTablet ? 0.9 : 1.2
    
    // Use a built-in font URL from CDN
    fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      (font) => {
        // Create individual letter geometries with spacing
        const text = 'c i c i   l a b e l'
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: textSize,
          depth: 0.2,
          curveSegments: 8,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.015,
          bevelOffset: 0,
          bevelSegments: 3
        })

        textGeometry.center()

        // Simple white material matching Tailwind text-white
        const material = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          metalness: 0.1,
          roughness: 0.6,
          emissive: 0xffffff,
          emissiveIntensity: 0.1
        })

        textMesh = new THREE.Mesh(textGeometry, material)
        scene.add(textMesh)

        if (sceneRef.current) {
          sceneRef.current.textMesh = textMesh
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
    const animate = () => {
      const animationId = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      if (textMesh) {
        // Very subtle rotation
        textMesh.rotation.y = Math.sin(time * 0.2) * 0.05
        textMesh.rotation.x = Math.sin(time * 0.15) * 0.02

        // Gentle floating
        textMesh.position.y = Math.sin(time * 0.4) * 0.08

        // Subtle pulsing glow
        const material = textMesh.material as THREE.MeshStandardMaterial
        material.emissiveIntensity = 0.1 + Math.sin(time * 1.5) * 0.05
      }

      // Gentle light movement
      pointLight1.position.x = Math.sin(time * 0.5) * 3
      pointLight1.position.y = Math.cos(time * 0.4) * 3

      pointLight2.position.x = Math.cos(time * 0.4) * 3
      pointLight2.position.y = Math.sin(time * 0.5) * 3

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
      textMesh,
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

        if (sceneRef.current.textMesh) {
          sceneRef.current.textMesh.geometry.dispose()
          const material = sceneRef.current.textMesh.material
          if (material && !Array.isArray(material)) {
            material.dispose()
          }
        }

        sceneRef.current.renderer.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-48 sm:h-64 md:h-80 lg:h-96"
      style={{
        background: 'transparent',
        overflow: 'hidden',
      }}
    />
  )
}
