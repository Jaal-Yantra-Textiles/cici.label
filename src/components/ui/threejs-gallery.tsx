"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Media } from "@/types/blocks"

interface ThreeJsGalleryProps {
  medias: Media[]
  apiUrl?: string
}

export function ThreeJsGallery({ medias, apiUrl }: ThreeJsGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    meshes: THREE.Mesh[]
    animationId: number
  } | null>(null)
  const scrollRef = useRef(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || medias.length === 0) {
      console.log('ThreeJsGallery: Container or medias not ready', {
        hasContainer: !!containerRef.current,
        mediasCount: medias.length
      })
      return
    }

    const container = containerRef.current
    const AWS_S3_URL = process.env.NEXT_PUBLIC_AWS_S3 || ''
    
    console.log('ThreeJsGallery initializing:', {
      mediasCount: medias.length,
      AWS_S3_URL,
      firstMedia: medias[0]
    })

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 1, 15)

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Create image meshes
    const meshes: THREE.Mesh[] = []
    const textureLoader = new THREE.TextureLoader()
    
    // Enable CORS for texture loading
    textureLoader.setCrossOrigin('anonymous')
    
    let loadedCount = 0

    medias.forEach((media, index) => {
      const imageUrl = media.file_path 
        ? `${AWS_S3_URL}${media.file_path}`
        : media.filename_disk
          ? `${AWS_S3_URL}/${media.filename_disk}`
          : ''

      if (!imageUrl) {
        console.warn('No image URL for media:', media)
        return
      }

      console.log(`Loading texture ${index + 1}/${medias.length}:`, imageUrl)

      textureLoader.load(
        imageUrl,
        (texture) => {
          console.log(`✓ Loaded texture ${index + 1}:`, imageUrl)
          // Calculate aspect ratio
          const aspect = texture.image.width / texture.image.height
          const width = aspect > 1 ? 2 : 2 * aspect
          const height = aspect > 1 ? 2 / aspect : 2

          const geometry = new THREE.PlaneGeometry(width, height)
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
          })

          const mesh = new THREE.Mesh(geometry, material)

          // Position images in a spiral pattern
          const angle = (index / medias.length) * Math.PI * 4
          const radius = 3 + (index % 3)
          const yOffset = Math.sin(index * 0.5) * 2
          
          mesh.position.x = Math.cos(angle) * radius
          mesh.position.y = yOffset + (index * 0.3) - (medias.length * 0.15)
          mesh.position.z = -index * 0.5 - 2

          // Random rotation for variety
          mesh.rotation.y = Math.random() * 0.3 - 0.15
          mesh.rotation.x = Math.random() * 0.2 - 0.1

          // Store initial position for animation
          mesh.userData = {
            initialX: mesh.position.x,
            initialY: mesh.position.y,
            initialZ: mesh.position.z,
            speed: 0.5 + Math.random() * 0.5,
            amplitude: 0.3 + Math.random() * 0.3,
            offset: Math.random() * Math.PI * 2,
            index: index,
          }

          scene.add(mesh)
          meshes.push(mesh)

          loadedCount++
          if (loadedCount === medias.length) {
            setImagesLoaded(true)
          }
        },
        undefined,
        (error) => {
          console.error(`✗ Error loading texture ${index + 1}:`, imageUrl, error)
          
          // Try to load a fallback placeholder
          const fallbackGeometry = new THREE.PlaneGeometry(2, 2)
          const fallbackMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3,
          })

          const mesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial)

          // Position fallback mesh
          const angle = (index / medias.length) * Math.PI * 4
          const radius = 3 + (index % 3)
          const yOffset = Math.sin(index * 0.5) * 2
          
          mesh.position.x = Math.cos(angle) * radius
          mesh.position.y = yOffset + (index * 0.3) - (medias.length * 0.15)
          mesh.position.z = -index * 0.5 - 2

          mesh.userData = {
            initialX: mesh.position.x,
            initialY: mesh.position.y,
            initialZ: mesh.position.z,
            speed: 0.5 + Math.random() * 0.5,
            amplitude: 0.3 + Math.random() * 0.3,
            offset: Math.random() * Math.PI * 2,
            index: index,
          }

          scene.add(mesh)
          meshes.push(mesh)
        }
      )
    })

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', onWindowResize)

    // Handle scroll
    const onScroll = () => {
      scrollRef.current = window.scrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      const scrollFactor = scrollRef.current * 0.001

      meshes.forEach((mesh, index) => {
        const userData = mesh.userData

        // Floating animation
        mesh.position.y = 
          userData.initialY + 
          Math.sin(time * userData.speed + userData.offset) * userData.amplitude

        // Scroll-based movement
        const scrollSpeed = 1 + scrollFactor * 0.5
        mesh.position.z = userData.initialZ + scrollFactor * 2

        // Side-to-side movement based on scroll
        const sideMovement = Math.sin(time + index * 0.5 + scrollFactor) * 0.5
        mesh.position.x = userData.initialX + sideMovement

        // Rotation animation
        mesh.rotation.y += 0.002 * userData.speed
        mesh.rotation.x = Math.sin(time * 0.5 + userData.offset) * 0.1

        // Fade out images that are too close or too far
        const distance = camera.position.z - mesh.position.z
        const material = mesh.material as THREE.MeshStandardMaterial
        if (distance < 1) {
          material.opacity = Math.max(0, distance)
        } else if (distance > 10) {
          material.opacity = Math.max(0, 1 - (distance - 10) / 5)
        } else {
          material.opacity = 0.9
        }

        // Recycle images that have passed the camera
        if (mesh.position.z > camera.position.z + 2) {
          mesh.position.z -= medias.length * 0.5 + 10
        }
      })

      // Camera gentle movement
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
      meshes,
      animationId: 0,
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize)
      window.removeEventListener('scroll', onScroll)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.meshes.forEach((mesh) => {
          mesh.geometry.dispose()
          if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose()
          }
        })

        sceneRef.current.renderer.dispose()
      }
    }
  }, [medias, apiUrl])

  return (
    <div className="relative w-full" style={{ height: '200vh' }}>
      <div 
        ref={containerRef}
        className="sticky top-0 w-full h-screen"
        style={{
          background: 'transparent',
          overflow: 'hidden',
        }}
      />
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-sm">Loading gallery...</div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-8 pointer-events-none">
        <p className="text-white/30 text-sm">Scroll to explore</p>
      </div>
    </div>
  )
}
