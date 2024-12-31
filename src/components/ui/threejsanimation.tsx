'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

const ChatTorusAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!mountRef.current || rendererRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    rendererRef.current = renderer
    renderer.setSize(400, 400)
    mountRef.current.appendChild(renderer.domElement)

    // Torus Knot (central element)
    const torusGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
    const torusMaterial = new THREE.MeshBasicMaterial({ 
      color: "white",  // Light blue color often used in chat apps
      wireframe: true
    })
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial)
    scene.add(torusKnot)

    // Chat bubbles
    const bubbleGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const bubbleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const bubbles: THREE.Mesh[] = []

    for (let i = 0; i < 20; i++) {
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 15 + Math.random() * 5
      bubble.position.x = radius * Math.sin(phi) * Math.cos(theta)
      bubble.position.y = radius * Math.sin(phi) * Math.sin(theta)
      bubble.position.z = radius * Math.cos(phi)
      scene.add(bubble)
      bubbles.push(bubble)
    }

    camera.position.z = 30

    const animate = () => {
      requestAnimationFrame(animate)
      torusKnot.rotation.x += 0.01
      torusKnot.rotation.y += 0.01

      // Animate bubbles
      bubbles.forEach((bubble, index) => {
        const time = Date.now() * 0.001 + index
        bubble.position.y += Math.sin(time) * 0.02
        bubble.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      rendererRef.current = null
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full min-h-[400px]" />
}

export default ChatTorusAnimation

