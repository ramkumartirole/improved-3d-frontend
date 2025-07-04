import * as THREE from "three";

export const focusOnModel = (object3D, camera, controls, duration = 1000, focusSide = 'front') => {
    if (!object3D || !camera || !controls) return;

    const box = new THREE.Box3().setFromObject(object3D); // get the bounding box of the object
    const center = box.getCenter(new THREE.Vector3()); // get the center of the object
    const size = box.getSize(new THREE.Vector3()); // get the size of the object

    // Very close zoom (adjust multiplier as needed)
    const maxDim = Math.max(size.x, size.y, size.z); // get the maximum dimension of the object
    const distance = maxDim * 1.5; // Very close (originally 10, now 1.5)

    // Define focus directions (modified for extreme close-up)
    const focusDirections = {
        front: { x: 0, y: 0.5, z: -1 },   // Thoda upar se front
        back: { x: 0, y: 0.5, z: 0.5 },     // Thoda upar se back
        left: { x: -1, y: 0.5, z: 0 },    // Thoda upar se left
        right: { x: 1, y: 0.5, z: 0 },    // Thoda upar se right
        top: { x: 0, y: 1, z: 0.1 }       // Slight tilt from top
    };


    // Get direction vector
    const direction = focusDirections[focusSide] || focusDirections.front; // get the direction of the object
    const directionVector = new THREE.Vector3(direction.x, direction.y, direction.z).normalize(); // get the direction vector of the object

    // Calculate target position (very close)
    const targetPosition = new THREE.Vector3(
        center.x + directionVector.x * distance, // get the target position of the object
        center.y + directionVector.y * distance, // get the target position of the object
        center.z + directionVector.z * distance // get the target position of the object
    );

    const startPosition = camera.position.clone(); // get the start position of the camera
    const startTime = Date.now(); // get the start time of the animation

    const animate = () => {
        const elapsed = Date.now() - startTime; // get the elapsed time of the animation
        const t = Math.min(elapsed / duration, 1); // get the progress of the animation

        // Smooth easing (for smooth zoom)
        const progress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // get the progress of the animation

        // Move camera closer
        camera.position.lerpVectors(startPosition, targetPosition, progress); // move the camera closer to the target position

        // Always look directly at center (perfect front view)
        const startTarget = controls.target.clone(); // Controls ka current target
        const endTarget = center; // Naya target (object ka center)

        // Animation loop mein yeh add karo
        controls.target.lerpVectors(startTarget, endTarget, progress);
        // copy the center of the object to the target
        controls.update(); // update the controls

        if (t < 1) requestAnimationFrame(animate); // request the next frame of the animation
    };

    animate(); // start the animation
};