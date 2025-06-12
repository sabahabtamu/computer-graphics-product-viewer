let isAutoRotating = true;
let rotationSpeed = 0.5; // degrees per frame

function startCameraAnimation() {
    // Add event listeners for user interaction
    controls.addEventListener('start', () => {
        isAutoRotating = false;
    });

    controls.addEventListener('end', () => {
        // Resume auto-rotation after 2 seconds of no user interaction
        setTimeout(() => {
            isAutoRotating = true;
        }, 2000);
    });

    // Add auto-rotation to animation loop
    const originalAnimate = animate;
    animate = function() {
        requestAnimationFrame(animate);
        
        if (isAutoRotating) {
            // Rotate camera around Y axis
            const time = Date.now() * 0.001;
            camera.position.x = Math.sin(time * rotationSpeed) * 5;
            camera.position.z = Math.cos(time * rotationSpeed) * 5;
            camera.lookAt(0, 0, 0);
        }

        controls.update();
        renderer.render(scene, camera);
    };
} 