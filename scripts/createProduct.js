function createProduct() {
    // Create a group to hold all lamp parts
    const lamp = new THREE.Group();
    
    // Material for the base
    function createBaseMaterial() {
        return new THREE.MeshPhysicalMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.8,
            clearcoat: 1.0,
            clearcoatRoughness: 0.2
        });
    }

    // Lamp base
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1.2, 0.3, 32),
        createBaseMaterial()
    );
    base.position.y = 0.15;
    base.castShadow = true;
    base.receiveShadow = true;
    base.userData = { name: 'Lamp Base' };
    lamp.add(base);

    // Lamp pole
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2, 16),
        createBaseMaterial()
    );
    pole.position.y = 1.3;
    pole.castShadow = true;
    pole.receiveShadow = true;
    pole.userData = { name: 'Lamp Pole' };
    lamp.add(pole);

    // Lamp shade
    const shade = new THREE.Mesh(
        new THREE.ConeGeometry(1, 1.5, 32),
        new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.1,
            clearcoat: 0.5,
            clearcoatRoughness: 0.3,
            transparent: true,
            opacity: 0.9
        })
    );
    shade.position.y = 2.5;
    shade.rotation.x = Math.PI;
    shade.castShadow = true;
    shade.receiveShadow = true;
    shade.userData = { name: 'Lamp Shade' };
    lamp.add(shade);

    // Light bulb (glowing sphere)
    const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        new THREE.MeshPhysicalMaterial({
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        })
    );
    bulb.position.y = 2.2;
    bulb.castShadow = true;
    bulb.receiveShadow = true;
    bulb.userData = { name: 'Light Bulb' };
    lamp.add(bulb);

    // Add lamp to scene
    scene.add(lamp);

    // Center the lamp
    lamp.position.set(0, 0, 0);

    return lamp;
} 