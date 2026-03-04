// This file defines the ThreeJsParticles class, which manages a 3D particle system
// using the Three.js library. It initializes a scene, camera, and renderer,
// and provides methods for setting the view and destroying the particle system.

import * as THREE from 'three';

import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl';
import { getCorePositions, getSpacePositions } from './positions';

export default class ThreeJsParticles {
	// Settings
	count = 10000;
	coreSize = 5;
	currentView: 'space' | 'core' = 'space';

	time = 0;

	container: HTMLElement | null = null;
	width = 0;
	height = 0;

	scene = new THREE.Scene();
	camera: THREE.PerspectiveCamera | null = null;
	cameraPos = { x: 0, y: 0, z: 5 };

	renderer = new THREE.WebGLRenderer({
		antialias: true,
	});

	spacePositions: Float32Array | null = null;
	corePositions: Float32Array | null = null;

	progress = 100;

	geometry: THREE.BufferGeometry | null = null;
	properties: Float32Array | null = null;
	material: THREE.ShaderMaterial | null = null;
	particles: THREE.Points | null = null;

	constructor(container: HTMLElement) {
		this.init(container);
	}

	init(container: HTMLElement) {
		console.log('ThreeJsParticles init');

		this.container = container;

		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;

		// SCENE + CAMERA
		this.camera = new THREE.PerspectiveCamera(
			70, // Field of view
			this.width / this.height, // Aspect ratio
			0.01, // Near plane
			1000, // Far plane
		);

		this.camera.position.set(
			this.cameraPos.x,
			this.cameraPos.y,
			this.cameraPos.z,
		);

		// RENDERER
		this.renderer.setSize(this.width, this.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setClearColor(0xffffff, 0);

		this.container.appendChild(this.renderer.domElement);

		// HELPER
		// this.scene.add(new THREE.AxesHelper(1));

		// RESIZE
		window.addEventListener('resize', this.resize.bind(this));

		// PARTICLES - Stars
		// Geometry
		this.geometry = new THREE.BufferGeometry();

		// Positions
		// Space
		this.spacePositions = getSpacePositions(this.count);

		// Core (spiral galaxy seen from above — Z is up)
		this.corePositions = getCorePositions(this.count, this.coreSize);

		const startPositions =
			this.currentView === 'space' ? this.spacePositions : this.corePositions;

		// Properties - Size, Color, Animation shift
		function getParticleProperties(count: number) {
			const properties = new Float32Array(count * 3);

			for (let i = 0; i < count * 3; i = i + 3) {
				properties[i + 0] = (Math.random() + 0.1) * 2; // Size - Avoid 0
				properties[i + 1] = 3000 + Math.random() * 22000; // Color 3000 to 25000 K
				properties[i + 2] = Math.random(); // Animation shift (0 to 1)
			}
			return properties;
		}
		this.properties = getParticleProperties(this.count);

		// Attributes
		setGeometryAttribute(this.geometry, 'position', startPositions);
		setGeometryAttribute(this.geometry, 'aTarget', startPositions);
		setGeometryAttribute(this.geometry, 'aProperties', this.properties);

		// Material
		function getMaterial() {
			return new THREE.ShaderMaterial({
				uniforms: {
					uTime: { value: 0 },
					uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
					uBaseSize: { value: 10.0 },
					uOpacity: { value: 1.0 },
					uProgress: { value: 100.0 },
				},
				vertexShader,
				fragmentShader,
				transparent: true,
				depthWrite: false,
				depthTest: true,
				blending: THREE.AdditiveBlending,
			});
		}

		this.material = getMaterial();

		// Mesh
		const stars: THREE.Points = new THREE.Points(this.geometry, this.material);

		// Add to scene
		this.scene.add(stars);

		// DEBUG - Change positions on key press '1' and '2'
		window.addEventListener('keydown', (event) => {
			if (event.key === '1') {
				this.setView('core');
			} else if (event.key === '2') {
				this.setView('space');
			}
		});

		// START RENDER LOOP
		this.renderer.setAnimationLoop(this.tick.bind(this));
	}

	resize() {
		// Guard against resize being called before init
		if (!this.container || !this.camera || !this.renderer) return;

		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.width, this.height);

		// Update pixel ratio in case it changed (e.g. when moving the window to a different screen)
		if (this.material) {
			this.material.uniforms.uPixelRatio.value = Math.min(
				window.devicePixelRatio,
				2,
			);
		}
	}

	setView(view: 'space' | 'core') {
		if (
			view === this.currentView ||
			this.progress < 100 ||
			!this.geometry ||
			!this.material ||
			!this.spacePositions ||
			!this.corePositions
		)
			return;
		console.log('Setting view to', view);

		this.currentView = view;

		const target = view === 'space' ? this.spacePositions : this.corePositions;

		setGeometryAttribute(this.geometry, 'aTarget', target);

		this.progress = 0;
	}

	tick() {
		if (!this.camera || !this.material) return;

		// Update time uniform for animation
		this.time += 1;
		setUniform(this.material, 'uTime', this.time);

		// Change positions animation progress
		if (this.progress < 100) {
			this.progress = Math.min(this.progress + 0.2, 100);

			const easedProgress = easeInOutCubic(this.progress / 100) * 100;
			setUniform(this.material, 'uProgress', easedProgress);

			// Animation complete: copy aTarget → position so next transition starts from here
			if (this.progress >= 100 && this.geometry) {
				const target =
					this.currentView === 'space'
						? this.spacePositions!
						: this.corePositions!;
				setGeometryAttribute(this.geometry, 'position', target);
			}
		}

		// Render AFTER all uniforms/attributes are up to date
		this.renderer.render(this.scene, this.camera);
	}

	destroy() {
		this.container?.removeChild(this.renderer.domElement);
		this.renderer.setAnimationLoop(null);
		this.renderer.dispose();
		this.container = null;
		this.geometry = null;
		this.material = null;
		this.particles = null;
	}
}

function setGeometryAttribute(
	geometry: THREE.BufferGeometry,
	attributeName: string,
	floatArrayObj: Float32Array,
) {
	geometry.setAttribute(
		attributeName,
		new THREE.BufferAttribute(floatArrayObj, 3),
	);
}

function setUniform(
	material: THREE.ShaderMaterial,
	uniform: string,
	value: number,
) {
	if (material.uniforms[uniform]) {
		material.uniforms[uniform].value = value;
	}
}

function easeInOutCubic(t: number): number {
	if (t < 0.5) return 4 * t * t * t; // Ease-in
	return 1 - Math.pow(-2 * t + 2, 3) / 2; // Ease-out
}
