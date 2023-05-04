import React, { useState, useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import alea from "alea";
import * as THREE from "three";
import seedrandom from "seedrandom";

const generateColorPalette = (baseColor) => {
	// Implement a color harmony function based on baseColor
	// For simplicity, I am returning the same colors array
	return [
		/* "#EE5C41",
		"#0c1b23",
		"#5f667a",
		"#000000",
		"#FF7F50",
		"#2E8B57", */
		"#6A5ACD",
		"#FF4500",
	];
};

const createShape = (shapeValue, shapeSize, x, y, color) => {
	if (shapeValue > 0) {
		return <circle cx={x} cy={y} r={shapeSize} fill={color} />;
	} else {
		const sides = 3 + Math.abs(Math.round(shapeValue * 5));
		const points = Array.from({ length: sides }, (_, j) => {
			const angle = (j * 2 * Math.PI) / sides;
			const radius = shapeSize;
			return `${x + radius * Math.cos(angle)},${y + radius * Math.sin(angle)}`;
		}).join(" ");

		return <polygon points={points} fill={color} />;
	}
};

export const Pic1 = ({ str, size = 32 }) => {
	const gridSize = 5;
	const circleRadius = size / (gridSize * 2);
	const seed = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

	const prng = alea(seed.toString());
	const noise2D = createNoise2D(prng);

	const baseColor = Math.abs(noise2D(0, 0));
	const colors = generateColorPalette(baseColor);

	const shapes = [];
	for (let i = 0; i < gridSize / 2; i++) {
		for (let j = 0; j < gridSize; j++) {
			const x = (size / gridSize) * i + size / (gridSize * 2);
			const y = (size / gridSize) * j + size / (gridSize * 2);

			const shapeValue = noise2D(x, y);
			const shapeSize = circleRadius * (1 + Math.abs(shapeValue) * 0.5);
			const colorIndex = Math.floor(
				Math.abs(noise2D(x + 10, y + 10)) * colors.length
			);

			const shape = createShape(
				shapeValue,
				shapeSize,
				x,
				y,
				colors[colorIndex]
			);
			shapes.push(shape);

			const mirroredX = size - x;
			const mirroredShape = createShape(
				shapeValue,
				shapeSize,
				mirroredX,
				y,
				colors[colorIndex]
			);
			shapes.push(mirroredShape);
		}
	}

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			xmlns="http://www.w3.org/2000/svg"
			style={{
				borderRadius: "50%",
				overflow: "hidden",
				display: "inline-block",
			}}
		>
			<defs>
				<clipPath id="circleClip">
					<circle cx={size / 2} cy={size / 2} r={size / 2} />
				</clipPath>
			</defs>
			<g clipPath="url(#circleClip)">{shapes}</g>
		</svg>
	);
};

/* 
export const CubeScene = () => {
	const containerRef = useRef();

	useEffect(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		containerRef.current.appendChild(renderer.domElement);

		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		camera.position.z = 5;

		const animate = () => {
			requestAnimationFrame(animate);

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			renderer.render(scene, camera);
		};

		animate();

		return () => {
			// Clean up the resources when the component is unmounted
			renderer.dispose();
			scene.dispose();
			material.dispose();
			geometry.dispose();
		};
	}, []);

	return <div ref={containerRef} />;
}; */

export const ShapeGrid = ({ uniqueString, gridSize = 4 }) => {
	const shapes = [
		"square",
		"circle",
		"quarter-circle",
		"quarter-circle-2",
		"quarter-circle-3",
		"quarter-circle-4",
		"half-circle",
		"triangle",
		"triangle-2",
		"triangle-3",
		"triangle-4",
	];

	const rng = seedrandom(uniqueString);
	const randomShape = () => {
		const index = Math.floor(rng() * shapes.length);
		return shapes[index];
	};

	const gridCellSize = 8; // Adjust this value as needed
	const blendModes = {
		darken: {
			mixBlendMode: "darken",
		},
		lighten: {
			mixBlendMode: "lighten",
		},
		difference: {
			mixBlendMode: "difference",
		},
	};
	const shapeStyles = {
		square: {
			backgroundColor: "#2F3131",
		},
		circle: {
			backgroundColor: "#2F3131",
			borderRadius: "50%",
		},
		"quarter-circle": {
			backgroundColor: "#F8F1E5",
			borderTopLeftRadius: "100%",
		},
		"quarter-circle-2": {
			backgroundColor: "#2F3131",
			borderTopRightRadius: "100%",
		},
		"quarter-circle-3": {
			backgroundColor: "#FBF2E3",
			borderBottomLeftRadius: "100%",
		},
		"quarter-circle-4": {
			backgroundColor: "#F9BA32",
			borderBottomRightRadius: "100%",
		},
		"half-circle": {
			backgroundColor: "#F8F1E5",
			borderTopLeftRadius: "100%",
			borderTopRightRadius: "100%",
		},
		triangle: {
			width: 0,
			height: 0,
			borderBottom: `${gridCellSize}px solid #F8F1E5`,
			borderLeft: `${gridCellSize / 2}px solid transparent`,
			borderRight: `${gridCellSize / 2}px solid transparent`,
		},
		"triangle-2": {
			width: 0,
			height: 0,
			borderTop: `${gridCellSize}px solid #DDE4ED`,
			borderLeft: `${gridCellSize / 2}px solid transparent`,
			borderRight: `${gridCellSize / 2}px solid transparent`,
		},
		"triangle-3": {
			width: 0,
			height: 0,
			borderLeft: `${gridCellSize}px solid #F9F051`,
			borderTop: `${gridCellSize / 2}px solid transparent`,
			borderBottom: `${gridCellSize / 2}px solid transparent`,
		},
		"triangle-4": {
			width: 0,
			height: 0,
			borderRight: `${gridCellSize}px solid #EABC41`,
			borderTop: `${gridCellSize / 2}px solid transparent`,
			borderBottom: `${gridCellSize / 2}px solid transparent`,
		},
	};

	const applyRandomBlendMode = (shapeType) => {
		const blendModeKeys = Object.keys(blendModes);
		const blendModeIndex = Math.floor(rng() * blendModeKeys.length);
		const blendMode = blendModes[blendModeKeys[blendModeIndex]];

		return {
			...shapeStyles[shapeType],
			...blendMode,
		};
	};

	const grid = [];
	for (let i = 0; i < gridSize; i++) {
		const row = [];
		for (let j = 0; j < gridSize; j++) {
			row.push(randomShape());
		}
		grid.push(row);
	}

	return (
		<div className="p-[3px] border-gray-200 rounded-full border-[1px]">
			<div className="flex flex-col overflow-hidden rounded-full w-max">
				{grid.map((row, rowIndex) => (
					<div key={`row-${rowIndex}`} className="flex">
						{row.map((shape, colIndex) => (
							<div
								key={`cell-${rowIndex}-${colIndex}`}
								className={`w-2 h-2 border border-gray-300`}
								style={applyRandomBlendMode(shape)}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
