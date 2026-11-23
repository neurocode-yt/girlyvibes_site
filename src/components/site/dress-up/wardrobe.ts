import * as THREE from "three";

export const outfitIds = [
  "petal-dress",
  "bow-blouse",
  "garden-overalls",
  "embroidered-abaya",
] as const;
export const paletteIds = ["rose", "lilac", "mint", "berry"] as const;
export const accessoryIds = ["none", "pearl-necklace", "ribbon", "heart-purse"] as const;
export const costumeIds = ["none", "wings", "hat"] as const;

export type OutfitId = (typeof outfitIds)[number];
export type PaletteId = (typeof paletteIds)[number];
export type AccessoryId = (typeof accessoryIds)[number];
export type CostumeId = (typeof costumeIds)[number];

export type WardrobeLook = {
  outfit: OutfitId;
  palette: PaletteId;
  accessory: AccessoryId;
  costume?: CostumeId;
};

const colors = {
  rose: { main: "#d47797", shadow: "#ab4d73", pale: "#f4bfd0", evening: "#87516c" },
  lilac: { main: "#9f7bc5", shadow: "#745197", pale: "#ddc9f0", evening: "#635084" },
  mint: { main: "#70a88f", shadow: "#427964", pale: "#c1e4d0", evening: "#396d61" },
  berry: { main: "#ad527e", shadow: "#763454", pale: "#e9aaca", evening: "#633950" },
} satisfies Record<PaletteId, Record<string, string>>;

type Point = readonly [x: number, y: number, z: number];
type Ring = readonly [
  height: number,
  width: number,
  depth: number,
  centerZ?: number,
  folds?: number,
  scallops?: number,
];
type Fabrics = ReturnType<typeof makeFabrics>;

function makeFabrics(palette: PaletteId) {
  const color = colors[palette];
  const fabric = (swatch: string, sheen: number) =>
    new THREE.MeshPhysicalMaterial({
      color: swatch,
      roughness: 0.74,
      side: THREE.DoubleSide,
      sheen,
      sheenColor: "#fff1f5",
      sheenRoughness: 0.7,
    });
  return {
    main: fabric(color.main, 0.52),
    shadow: fabric(color.shadow, 0.24),
    pale: fabric(color.pale, 0.48),
    evening: fabric(color.evening, 0.44),
    cream: fabric("#fff1e5", 0.52),
    gold: new THREE.MeshStandardMaterial({ color: "#e2b47a", metalness: 0.35, roughness: 0.29 }),
    pearl: new THREE.MeshPhysicalMaterial({
      color: "#fff4ea",
      clearcoat: 0.38,
      roughness: 0.31,
    }),
  };
}

function vertex([y, rx, rz, z = 0, fold = 0, scallop = 0]: Ring, angle: number, pleats: number) {
  const ripple = Math.cos(angle * pleats);
  return new THREE.Vector3(
    Math.sin(angle) * (rx + ripple * fold),
    y + scallop * ripple,
    z + Math.cos(angle) * (rz + ripple * fold),
  );
}

function cloth(
  root: THREE.Group,
  profile: readonly Ring[],
  material: THREE.Material,
  pleats = 10,
  neckline?: (angle: number) => number,
) {
  const steps = 96;
  const positions: number[] = [];
  const faces: number[] = [];

  for (const [row, ring] of profile.entries()) {
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const point = vertex(ring, angle, pleats);
      if (row <= 1 && neckline) point.y += neckline(angle) * (row === 0 ? 1 : 0.28);
      positions.push(point.x, point.y, point.z);
      if (row === 0) continue;
      const last = (row - 1) * steps;
      const current = row * steps;
      const next = (i + 1) % steps;
      faces.push(last + i, current + i, last + next, last + next, current + i, current + next);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  root.add(mesh);
  return mesh;
}

function stitch(
  root: THREE.Group,
  points: readonly (Point | THREE.Vector3)[],
  material: THREE.Material,
  radius: number,
  closed = false,
) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((point) => (point instanceof THREE.Vector3 ? point : new THREE.Vector3(...point))),
    closed,
  );
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(
      curve,
      Math.max(12, Math.min(112, points.length * 5)),
      radius,
      6,
      closed,
    ),
    material,
  );
  root.add(mesh);
  return mesh;
}

function hem(
  root: THREE.Group,
  ring: Ring,
  material: THREE.Material,
  pleats: number,
  thickness = 0.004,
  neckline?: (angle: number) => number,
) {
  const segments = pleats * 8;
  const points = Array.from({ length: segments }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2;
    const point = vertex(ring, angle, pleats);
    if (neckline) point.y += neckline(angle);
    return point;
  });
  stitch(root, points, material, thickness, true);
}

function oval(root: THREE.Group, center: Point, radius: Point, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), material);
  mesh.position.set(...center);
  mesh.scale.set(...radius);
  root.add(mesh);
  return mesh;
}

function shaped(
  root: THREE.Group,
  shape: THREE.Shape,
  material: THREE.Material,
  center: Point,
  bevel = 0.004,
  depth = 0.007,
) {
  const mesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 3,
      curveSegments: 12,
    }),
    material,
  );
  mesh.position.set(...center);
  root.add(mesh);
  return mesh;
}

function heart(width: number) {
  const path = new THREE.Shape();
  path.moveTo(0, -width * 0.46);
  path.bezierCurveTo(
    -width * 0.14,
    -width * 0.3,
    -width * 0.51,
    -width * 0.11,
    -width * 0.5,
    width * 0.17,
  );
  path.bezierCurveTo(-width * 0.49, width * 0.44, -width * 0.16, width * 0.46, 0, width * 0.23);
  path.bezierCurveTo(
    width * 0.16,
    width * 0.46,
    width * 0.49,
    width * 0.44,
    width * 0.5,
    width * 0.17,
  );
  path.bezierCurveTo(width * 0.51, -width * 0.11, width * 0.14, -width * 0.3, 0, -width * 0.46);
  return path;
}

function bow(root: THREE.Group, center: Point, scale: number, fabrics: Fabrics, tilt = 0) {
  const ribbon = new THREE.Group();
  ribbon.position.set(...center);
  ribbon.rotation.z = tilt;
  ribbon.scale.setScalar(scale);
  root.add(ribbon);

  for (const side of [-1, 1]) {
    const loop = new THREE.Shape();
    loop.moveTo(0, 0);
    loop.bezierCurveTo(side * 0.053, 0.04, side * 0.105, 0.068, side * 0.115, 0.043);
    loop.bezierCurveTo(side * 0.137, 0.011, side * 0.122, -0.043, side * 0.102, -0.044);
    loop.bezierCurveTo(side * 0.073, -0.051, side * 0.027, -0.012, 0, 0);
    shaped(ribbon, loop, fabrics.main, [0, 0, 0], 0.008, 0.019);
    stitch(
      ribbon,
      [
        [side * 0.017, 0.008, 0.028],
        [side * 0.045, 0.013, 0.027],
        [side * 0.075, 0.022, 0.023],
      ],
      fabrics.pale,
      0.002,
    );

    const tail = new THREE.Shape();
    tail.moveTo(side * 0.009, -0.008);
    tail.bezierCurveTo(side * 0.011, -0.054, side * 0.03, -0.104, side * 0.061, -0.154);
    tail.lineTo(side * 0.072, -0.129);
    tail.lineTo(side * 0.094, -0.138);
    tail.bezierCurveTo(side * 0.065, -0.082, side * 0.062, -0.056, side * 0.029, -0.012);
    tail.closePath();
    shaped(ribbon, tail, fabrics.shadow, [0, 0, -0.012], 0.002, 0.007);
  }
  oval(ribbon, [0, 0.003, 0.028], [0.025, 0.023, 0.018], fabrics.main);
}

function sleeve(
  root: THREE.Group,
  side: number,
  end: Point,
  profile: readonly Ring[],
  material: THREE.Material,
  edge: THREE.Material,
) {
  const fitting = new THREE.Group();
  const shoulder = new THREE.Vector3(side * 0.2, 2.07, 0.006);
  const wrist = new THREE.Vector3(side * end[0], end[1], end[2]);
  fitting.position.copy(shoulder);
  fitting.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, -1, 0),
    wrist.clone().sub(shoulder).normalize(),
  );
  fitting.scale.y = shoulder.distanceTo(wrist) / Math.abs(profile[profile.length - 1][0]);
  cloth(fitting, profile, material, 8);
  hem(fitting, profile[profile.length - 1], edge, 8, 0.006);
  root.add(fitting);
}

function buildPetalDress(root: THREE.Group, fabrics: Fabrics) {
  const fittedTop = [
    [2.017, 0.203, 0.115, 0.01],
    [1.994, 0.202, 0.128, 0.014],
    [1.955, 0.183, 0.12, 0.012],
    [1.9, 0.165, 0.111, 0.005],
    [1.83, 0.147, 0.101],
    [1.77, 0.145, 0.103],
  ] satisfies Ring[];
  const sweetheart = (angle: number) =>
    -0.058 * Math.exp(-Math.pow((Math.acos(Math.cos(angle)) - 0.04) / 0.32, 2));
  cloth(root, fittedTop, fabrics.main, 10, sweetheart);
  hem(root, fittedTop[0], fabrics.pale, 10, 0.004, sweetheart);

  for (const side of [-1, 1]) {
    stitch(
      root,
      [
        [side * 0.137, 2.007, 0.101],
        [side * 0.14, 2.085, 0.067],
        [side * 0.148, 2.121, 0.004],
        [side * 0.147, 2.089, -0.063],
        [side * 0.141, 2.008, -0.083],
      ],
      fabrics.shadow,
      0.011,
    );
    stitch(
      root,
      [
        [side * 0.103, 2.001, 0.124],
        [side * 0.097, 1.95, 0.119],
        [side * 0.081, 1.875, 0.104],
        [side * 0.071, 1.78, 0.099],
      ],
      fabrics.pale,
      0.0029,
    );
  }

  const skirt = [
    [1.792, 0.147, 0.102, 0, 0.003],
    [1.746, 0.167, 0.116, 0, 0.005],
    [1.641, 0.225, 0.148, -0.001, 0.009],
    [1.516, 0.275, 0.178, -0.004, 0.011],
    [1.297, 0.332, 0.221, -0.012, 0.017],
    [1.1, 0.387, 0.265, -0.015, 0.022, 0.033],
  ] satisfies Ring[];
  const lining = [
    [1.245, 0.329, 0.216, -0.012, 0.014],
    [1.11, 0.378, 0.254, -0.015, 0.02, 0.019],
    [1.048, 0.389, 0.266, -0.02, 0.023, 0.029],
  ] satisfies Ring[];
  cloth(root, lining, fabrics.pale, 9);
  cloth(root, skirt, fabrics.main, 9);
  hem(root, skirt[skirt.length - 1], fabrics.pale, 9, 0.0047);
  hem(root, [1.768, 0.152, 0.107], fabrics.shadow, 12, 0.008);
  oval(root, [0, 1.767, 0.113], [0.016, 0.019, 0.009], fabrics.pearl);
}

function blouse(root: THREE.Group, fabrics: Fabrics, long: boolean) {
  cloth(
    root,
    [
      [2.151, 0.076, 0.069, 0.002],
      [2.135, 0.136, 0.081, 0.003],
      [2.114, 0.201, 0.09, 0.003],
      [2.104, 0.221, 0.094, 0.004],
      [2.078, 0.223, 0.1, 0.007],
      [2.024, 0.205, 0.12, 0.012],
      [1.958, 0.186, 0.132, 0.011],
      [1.897, 0.171, 0.116, 0.008],
      [1.822, 0.154, 0.105],
      [1.755, 0.147, 0.101],
    ],
    fabrics.cream,
  );
  hem(root, [2.151, 0.076, 0.069, 0.002], fabrics.pale, 8);
  for (const side of [-1, 1]) {
    const cap = [
      [0.01, 0.047, 0.05],
      [-0.017, 0.075, 0.071],
      [-0.062, 0.089, 0.077],
      [-0.105, 0.09, 0.074, 0, 0.003],
      [-0.149, 0.067, 0.061, 0, 0.004],
      [-0.18, 0.058, 0.057],
    ] satisfies Ring[];
    sleeve(root, side, [0.276, 1.907, 0.013], cap, fabrics.cream, fabrics.pale);
    if (long) {
      const arm = [
        [-0.145, 0.062, 0.057, -0.007],
        [-0.275, 0.059, 0.058, -0.015],
        [-0.368, 0.053, 0.052, -0.013],
        [-0.5, 0.043, 0.043, -0.005],
        [-0.55, 0.038, 0.036],
      ] satisfies Ring[];
      sleeve(root, side, [0.386, 1.535, 0.057], arm, fabrics.cream, fabrics.pale);
    }
  }
}

function buildBowBlouse(root: THREE.Group, fabrics: Fabrics) {
  blouse(root, fabrics, true);
  const pleatedSkirt = [
    [1.8, 0.148, 0.11],
    [1.759, 0.155, 0.11, 0, 0.002],
    [1.648, 0.217, 0.154, -0.004, 0.006],
    [1.475, 0.247, 0.173, -0.01, 0.011],
    [1.102, 0.294, 0.207, -0.012, 0.014],
    [0.762, 0.333, 0.227, -0.016, 0.021, 0.009],
  ] satisfies Ring[];
  cloth(root, pleatedSkirt, fabrics.main, 16);
  hem(root, pleatedSkirt[5], fabrics.shadow, 16, 0.005);
  hem(root, [1.787, 0.155, 0.112], fabrics.shadow, 16, 0.007);
  bow(root, [0, 2.044, 0.138], 0.86, fabrics);
}

function buildOveralls(root: THREE.Group, fabrics: Fabrics) {
  blouse(root, fabrics, false);

  cloth(
    root,
    [
      [1.785, 0.146, 0.109],
      [1.727, 0.152, 0.112],
      [1.62, 0.183, 0.128, -0.003],
      [1.537, 0.207, 0.139, -0.005],
      [1.46, 0.211, 0.134, -0.007],
      [1.392, 0.205, 0.128, -0.01],
    ],
    fabrics.main,
  );
  hem(root, [1.774, 0.151, 0.112], fabrics.shadow, 10, 0.005);

  for (const side of [-1, 1]) {
    const leg = cloth(
      root,
      [
        [1.481, 0.122, 0.128, -0.008],
        [1.38, 0.12, 0.128, -0.009],
        [1.23, 0.108, 0.12, -0.008],
        [1.01, 0.101, 0.11, -0.004],
        [0.77, 0.093, 0.1, 0.002],
        [0.49, 0.092, 0.105, -0.006, 0.003],
        [0.278, 0.097, 0.092, 0.004, 0.004],
        [0.252, 0.093, 0.086, 0.004, 0.004],
      ],
      fabrics.main,
      6,
    );
    leg.position.x = side * 0.109;
    leg.rotation.z = side * 0.013;
    const cuff = new THREE.Group();
    cuff.position.x = leg.position.x;
    cuff.rotation.z = leg.rotation.z;
    cloth(
      cuff,
      [
        [0.299, 0.097, 0.091, 0.004, 0.003],
        [0.282, 0.102, 0.097, 0.004, 0.003],
        [0.236, 0.101, 0.095, 0.004, 0.003],
        [0.226, 0.097, 0.088, 0.004, 0.003],
      ],
      fabrics.pale,
      6,
    );
    root.add(cuff);

    stitch(
      root,
      [
        [side * 0.1, 1.937, 0.13],
        [side * 0.128, 2.067, 0.083],
        [side * 0.134, 2.127, 0.011],
        [side * 0.142, 2.076, -0.086],
        [side * 0.132, 1.878, -0.111],
        [side * 0.1, 1.777, -0.094],
      ],
      fabrics.main,
      0.018,
    );

    stitch(
      root,
      [
        [side * 0.18, 1.512, 0.078],
        [side * 0.189, 1.205, 0.065],
        [side * 0.182, 0.869, 0.068],
        [side * 0.179, 0.545, 0.075],
        [side * 0.183, 0.285, 0.077],
      ],
      fabrics.shadow,
      0.0023,
    );
  }

  const bib = new THREE.Shape();
  bib.moveTo(-0.127, 1.775);
  bib.lineTo(-0.114, 1.933);
  bib.quadraticCurveTo(0, 1.946, 0.114, 1.933);
  bib.lineTo(0.127, 1.775);
  bib.closePath();
  shaped(root, bib, fabrics.main, [0, 0, 0.117], 0.007, 0.025);
  for (const side of [-1, 1]) {
    oval(root, [side * 0.095, 1.916, 0.15], [0.013, 0.013, 0.006], fabrics.gold);
  }
  const patch = new THREE.Shape();
  patch.moveTo(-0.05, 1.876);
  patch.lineTo(0.05, 1.876);
  patch.lineTo(0.048, 1.837);
  patch.quadraticCurveTo(0, 1.793, -0.048, 1.837);
  patch.closePath();
  shaped(root, patch, fabrics.pale, [0, 0, 0.152], 0.003, 0.007);
  shaped(root, heart(0.035), fabrics.cream, [0, 1.846, 0.162], 0.0015, 0.003);
}

function embroiderSprig(
  root: THREE.Group,
  x: number,
  y: number,
  z: number,
  tilt: number,
  fabrics: Fabrics,
) {
  const sprig = new THREE.Group();
  sprig.position.set(x, y, z);
  sprig.rotation.z = tilt;
  root.add(sprig);
  stitch(
    sprig,
    [
      [0, -0.05, 0],
      [0.013, -0.013, 0],
      [0, 0.032, 0],
    ],
    fabrics.gold,
    0.0029,
  );
  for (const side of [-1, 1]) {
    stitch(
      sprig,
      [
        [0.007, -0.023, 0],
        [side * 0.018, -0.001, 0.004],
        [side * 0.028, 0.025, 0.004],
        [side * 0.012, 0.013, 0.003],
        [0.007, -0.023, 0],
      ],
      fabrics.gold,
      0.0025,
    );
  }
  oval(sprig, [0, 0.037, 0], [0.008, 0.009, 0.004], fabrics.pearl);
}

function buildAbaya(root: THREE.Group, fabrics: Fabrics) {
  const robe = [
    [2.15, 0.075, 0.068],
    [2.133, 0.148, 0.085],
    [2.114, 0.209, 0.092],
    [2.104, 0.228, 0.097],
    [2.088, 0.225, 0.1, 0.006],
    [2.019, 0.214, 0.127, 0.013],
    [1.953, 0.194, 0.139, 0.009],
    [1.868, 0.17, 0.129, 0.001],
    [1.746, 0.172, 0.118],
    [1.599, 0.214, 0.154, -0.007, 0.003],
    [1.438, 0.252, 0.174, -0.012, 0.005],
    [1.083, 0.292, 0.193, -0.014, 0.006],
    [0.65, 0.321, 0.212, -0.017, 0.009],
    [0.208, 0.372, 0.239, -0.022, 0.015, 0.009],
  ] satisfies Ring[];
  cloth(root, robe, fabrics.evening, 12);
  hem(root, robe[0], fabrics.gold, 12, 0.0032);
  hem(root, robe[robe.length - 1], fabrics.gold, 12, 0.0042);

  for (const side of [-1, 1]) {
    const fullSleeve = [
      [0.015, 0.056, 0.055],
      [-0.04, 0.082, 0.085],
      [-0.154, 0.074, 0.073],
      [-0.293, 0.061, 0.065],
      [-0.425, 0.066, 0.064],
      [-0.528, 0.074, 0.071],
      [-0.549, 0.072, 0.071],
    ] satisfies Ring[];
    sleeve(root, side, [0.394, 1.523, 0.057], fullSleeve, fabrics.evening, fabrics.gold);
    stitch(
      root,
      [
        [side * 0.045, 2.14, 0.069],
        [side * 0.047, 2.084, 0.104],
        [side * 0.041, 1.955, 0.152],
        [side * 0.038, 1.867, 0.133],
        [side * 0.034, 1.75, 0.124],
        [side * 0.034, 1.602, 0.153],
        [side * 0.032, 1.438, 0.171],
        [side * 0.031, 1.083, 0.19],
        [side * 0.029, 0.65, 0.208],
        [side * 0.027, 0.215, 0.232],
      ],
      fabrics.gold,
      0.0033,
    );

    for (const [y, z] of [
      [1.922, 0.141],
      [1.81, 0.124],
      [0.404, 0.22],
      [0.298, 0.227],
    ]) {
      embroiderSprig(root, side * 0.091, y, z, side * -0.29, fabrics);
    }
  }

  for (const [y, z] of [
    [2.03, 0.138],
    [1.968, 0.153],
    [1.902, 0.143],
    [1.837, 0.133],
    [1.772, 0.123],
  ]) {
    oval(root, [0, y, z], [0.008, 0.008, 0.004], fabrics.pearl);
  }
}

function addAccessory(root: THREE.Group, accessory: AccessoryId, fabrics: Fabrics) {
  if (accessory === "ribbon") {
    bow(root, [0.213, 2.703, 0.145], 0.67, fabrics, -0.28);
  }

  if (accessory === "pearl-necklace") {
    const strand = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.093, 2.161, 0.044),
      new THREE.Vector3(-0.078, 2.096, 0.088),
      new THREE.Vector3(0, 2.045, 0.134),
      new THREE.Vector3(0.078, 2.096, 0.088),
      new THREE.Vector3(0.093, 2.161, 0.044),
    ]);
    for (const point of strand.getSpacedPoints(18)) {
      oval(root, point.toArray(), [0.009, 0.009, 0.009], fabrics.pearl);
    }
    shaped(root, heart(0.037), fabrics.gold, [0, 2.019, 0.149], 0.003, 0.005);
  }

  if (accessory === "heart-purse") {
    stitch(
      root,
      [
        [-0.13, 2.104, -0.05],
        [-0.13, 2.124, 0.017],
        [-0.108, 2.071, 0.102],
        [-0.052, 1.956, 0.165],
        [0.053, 1.753, 0.145],
        [0.175, 1.563, 0.16],
        [0.269, 1.434, 0.18],
      ],
      fabrics.shadow,
      0.009,
    );
    shaped(root, heart(0.236), fabrics.shadow, [0.268, 1.357, 0.178], 0.018, 0.043);
    shaped(root, heart(0.196), fabrics.main, [0.268, 1.36, 0.229], 0.009, 0.014);
    shaped(root, heart(0.042), fabrics.gold, [0.268, 1.361, 0.253], 0.003, 0.005);
  }
}

function addWings(root: THREE.Group, fabrics: Fabrics) {
  for (const side of [-1, 1]) {
    const shape = new THREE.Shape();
    shape.moveTo(0.022, 0.006);
    shape.bezierCurveTo(0.075, 0.292, 0.268, 0.467, 0.472, 0.446);
    shape.bezierCurveTo(0.588, 0.443, 0.49, 0.343, 0.427, 0.293);
    shape.bezierCurveTo(0.543, 0.327, 0.481, 0.198, 0.369, 0.155);
    shape.bezierCurveTo(0.469, 0.167, 0.375, 0.057, 0.293, 0.032);
    shape.bezierCurveTo(0.357, 0.025, 0.24, -0.067, 0.169, -0.058);
    shape.bezierCurveTo(0.092, -0.073, 0.051, -0.041, 0.022, 0.006);
    const wing = new THREE.Group();
    wing.position.set(side * 0.104, 1.676, -0.167);
    wing.scale.x = side;
    wing.rotation.y = side * 0.32;
    root.add(wing);
    shaped(wing, shape, fabrics.cream, [0, 0, 0], 0.012, 0.019).castShadow = true;
    for (const [x, y] of [
      [0.424, 0.389],
      [0.386, 0.278],
      [0.315, 0.154],
      [0.246, 0.052],
    ]) {
      stitch(
        wing,
        [
          [0.082, 0.005, 0.029],
          [x * 0.62, y * 0.62, 0.034],
          [x, y, 0.029],
        ],
        fabrics.pale,
        0.004,
      );
    }
  }
}

function addHat(root: THREE.Group, fabrics: Fabrics) {
  const hat = new THREE.Group();
  hat.position.set(0.008, 2.799, 0.012);
  hat.rotation.z = -0.16;
  root.add(hat);
  oval(hat, [0, 0.005, 0.016], [0.232, 0.026, 0.238], fabrics.shadow);
  oval(hat, [0.003, 0.051, -0.013], [0.183, 0.091, 0.179], fabrics.main);
  hem(hat, [0.022, 0.185, 0.174, -0.013], fabrics.gold, 12, 0.006);
  oval(hat, [0.069, 0.041, 0.144], [0.024, 0.024, 0.012], fabrics.gold);
}

const outfitBuilders = {
  "petal-dress": buildPetalDress,
  "bow-blouse": buildBowBlouse,
  "garden-overalls": buildOveralls,
  "embroidered-abaya": buildAbaya,
} satisfies Record<OutfitId, (root: THREE.Group, fabrics: Fabrics) => void>;

export function createWardrobe(look: WardrobeLook): THREE.Group {
  const wardrobe = new THREE.Group();
  const fabrics = makeFabrics(look.palette);
  wardrobe.name = "Atelier wardrobe";
  outfitBuilders[look.outfit](wardrobe, fabrics);
  addAccessory(wardrobe, look.accessory, fabrics);
  if (look.costume === "wings") addWings(wardrobe, fabrics);
  if (look.costume === "hat") addHat(wardrobe, fabrics);

  return wardrobe;
}
