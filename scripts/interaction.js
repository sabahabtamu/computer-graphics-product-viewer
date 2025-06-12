let raycaster, mouse, selectedObject = null;
const infoPanel = document.getElementById('info-panel');

// Create outline material
const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.5
});

// Store original materials
const originalMaterials = new Map();

function setupInteraction(product) {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Store original materials
    product.children.forEach(part => {
        originalMaterials.set(part, {
            color: part.material.color.clone(),
            emissive: part.material.emissive.clone(),
            emissiveIntensity: part.material.emissiveIntensity
        });
    });

    // Mouse move event for hover effects
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        checkIntersection(product);
    });

    // Click event for part selection
    window.addEventListener('click', () => {
        if (selectedObject) {
            highlightPart(selectedObject);
            showPartName(selectedObject.userData.name);
        }
    });
}

function checkIntersection(product) {
    raycaster.setFromCamera(mouse, camera);
    
    // Get all meshes from the product group
    const meshes = product.children;
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        const newSelected = intersects[0].object;
        
        if (selectedObject !== newSelected) {
            if (selectedObject) {
                resetPart(selectedObject);
            }
            selectedObject = newSelected;
            hoverPart(selectedObject);
        }
    } else {
        if (selectedObject) {
            resetPart(selectedObject);
            selectedObject = null;
        }
    }
}

function hoverPart(object) {
    const original = originalMaterials.get(object);
    
    // Create a subtle glow effect
    new TWEEN.Tween(object.material.emissive)
        .to({ r: 0.2, g: 0.2, b: 0.2 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    
    object.material.emissiveIntensity = 0.2;
    
    // Add a subtle scale effect
    new TWEEN.Tween(object.scale)
        .to({ x: 1.02, y: 1.02, z: 1.02 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    
    // Add or update outline effect
    if (!object.userData.outline) {
        const outline = new THREE.Mesh(object.geometry, outlineMaterial.clone());
        outline.scale.multiplyScalar(1.05);
        outline.position.copy(object.position);
        outline.rotation.copy(object.rotation);
        outline.visible = true;
        object.add(outline);
        object.userData.outline = outline;

        // Fade in outline
        outline.material.opacity = 0;
        new TWEEN.Tween(outline.material)
            .to({ opacity: 0.5 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
    
    document.body.style.cursor = 'pointer';
}

function resetPart(object) {
    const original = originalMaterials.get(object);
    
    // Reset emissive
    new TWEEN.Tween(object.material.emissive)
        .to({ r: 0, g: 0, b: 0 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    
    object.material.emissiveIntensity = original.emissiveIntensity;
    
    // Reset scale
    new TWEEN.Tween(object.scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    
    // Fade out and remove outline
    if (object.userData.outline) {
        const outline = object.userData.outline;
        new TWEEN.Tween(outline.material)
            .to({ opacity: 0 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                object.remove(outline);
                object.userData.outline = null;
            })
            .start();
    }
    
    document.body.style.cursor = 'default';
}

function highlightPart(object) {
    const original = originalMaterials.get(object);
    
    // Create a more dramatic highlight effect
    const highlightColor = new THREE.Color(0xffd700);
    const highlightEmissive = new THREE.Color(0x333333);
    
    // Animate color change
    object.material.color.set(highlightColor);
    setTimeout(() => {
        object.material.color.copy(original.color);
    }, 1000);
    
    // Animate emissive
    new TWEEN.Tween(object.material.emissive)
        .to(highlightEmissive, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            new TWEEN.Tween(object.material.emissive)
                .to(original.emissive, 500) 
                .easing(TWEEN.Easing.Quadratic.In)
                .start();
        })
        .start();
    
    // Add a bounce effect
    new TWEEN.Tween(object.position)
        .to({ y: object.position.y + 0.1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .yoyo(true)
        .repeat(1)
        .start();

    // Flash the outline
    if (object.userData.outline) {
        const outline = object.userData.outline;
        new TWEEN.Tween(outline.material)
            .to({ opacity: 1 }, 100)
            .easing(TWEEN.Easing.Quadratic.Out)
            .chain(
                new TWEEN.Tween(outline.material)
                    .to({ opacity: 0.5 }, 200)
                    .easing(TWEEN.Easing.Quadratic.In)
            )
            .start();
    }
}

function showPartName(name) {
    // Clear any existing timeouts
    if (window.nameTimeout) {
        clearTimeout(window.nameTimeout);
    }

    // Update and show the panel
    infoPanel.textContent = name;
    infoPanel.classList.add('visible');

    // Hide the panel after 1 second
    window.nameTimeout = setTimeout(() => {
        infoPanel.classList.remove('visible');
    }, 1000);
} 