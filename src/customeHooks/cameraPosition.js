import * as THREE from "three";

export const focusOnModel = (obj, object3D, camera, controls, duration = 1000, focusSide = 'front') => {
    if (!object3D || !camera || !controls) return;

    const box = new THREE.Box3().setFromObject(object3D);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    // console.log(obj, "obj");

    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 1.5;

    const focusDirections = {
        front: { x: 0, y: 0.5, z: -1 },
        back: { x: 0, y: 0.5, z: 0.5 },
        left: { x: -1, y: 0.7, z: 0 },
        right: { x: 1, y: 0.5, z: 0 },
        top: { x: 0, y: 1, z: 0.1 },
        counterTop: { x: -1, y: 0.7, z: 1 },
        partitionPanel: { x: 1, y: 0, z: 0.7 },
        defaultPosition: { x: -4, y: 3, z: -4.8 },

    };

    let direction = focusDirections[focusSide] || focusDirections.front;

    // 🔁 Override direction if object type is 'flooring'
    if (obj?.type === 'flooring') {
        direction = focusDirections.front; // 👈 Change view to X-axis (side)
    }
    if (obj?.type === 'swivelseat' || obj?.type === "backsplash" || obj?.type === "kitchen" || obj?.type === "stove" || obj?.type === "appliance" || obj?.type === "wall-cabinet-kitchen" || obj?.type === "shower" || obj?.type === "wall-ceiling" || obj?.type === "wall-ceiling-door-panel" || obj?.type === "wall-panel" || obj?.type === "ladder" || obj?.type === "Popout" || obj?.type === "window" ) {
        direction = focusDirections.right; // 👈 Change view to X-axis (side)
    }
    if (obj?.type === 'wall-cabinet-driver' ) {
        direction = focusDirections.left; // 👈 Change view to X-axis (side)
    }
     if (obj?.type === 'counter-top'  ) {
        direction = focusDirections.counterTop; // 👈 Change view to X-axis (side)
    }
    if (obj?.type === 'partition-panel' ) {
        direction = focusDirections.partitionPanel; // 👈 Change view to X-axis (side)
    }
    if (obj?.type === 'awning' ) {
        direction = focusDirections.defaultPosition; // 👈 Change view to X-axis (side)
    }



    const directionVector = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();

    const targetPosition = new THREE.Vector3(
        center.x + directionVector.x * distance,
        center.y + directionVector.y * distance,
        center.z + directionVector.z * distance
    );

    const startPosition = camera.position.clone();
    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        const progress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        camera.position.lerpVectors(startPosition, targetPosition, progress);

        const startTarget = controls.target.clone();
        const endTarget = center.clone();

        controls.target.lerpVectors(startTarget, endTarget, progress);
        controls.update();

        if (t < 1) requestAnimationFrame(animate);
    };

    animate();
};
