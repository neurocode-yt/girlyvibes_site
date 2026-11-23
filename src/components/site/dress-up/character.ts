import * as THREE from "three";
import { sculptHairstyle, type HairColor, type HairStyle } from "./hairstyles";
import {
  bodySurface,
  ellipse,
  gaussian,
  porcelain,
  profileAt,
  strand,
  surface,
  taper,
  type Point,
  type Ring,
} from "./sculpt";

export type { HairColor, HairStyle };
export type SkinTone = "porcelain" | "honey" | "umber";
export type CharacterAppearance = { skin: SkinTone; hairStyle: HairStyle; hairColor: HairColor };

const skinColors = {
  porcelain: { base: "#f7ccb9", blush: "#eb9299", shadow: "#dfa59c", lip: "#cc7d85" },
  honey: { base: "#c78c63", blush: "#b95461", shadow: "#9e6659", lip: "#a74960" },
  umber: { base: "#895443", blush: "#b75b68", shadow: "#693e45", lip: "#a64d65" },
} as const;

const browColors: Record<HairColor, string> = {
  espresso: "#472932",
  chestnut: "#62392d",
  rosewood: "#5d3345",
  honey: "#77513b",
};

const headRings: readonly Ring[] = [
  [2.247, 0.022, 0.031, 0.079],
  [2.265, 0.089, 0.095, 0.075],
  [2.293, 0.14, 0.137, 0.06],
  [2.327, 0.174, 0.169, 0.041],
  [2.368, 0.197, 0.192, 0.031],
  [2.416, 0.218, 0.201, 0.018],
  [2.465, 0.224, 0.205, 0.013],
  [2.526, 0.226, 0.209, 0.01],
  [2.585, 0.23, 0.207, 0.002],
  [2.641, 0.217, 0.194, -0.007],
  [2.69, 0.19, 0.173, -0.017],
  [2.736, 0.151, 0.141, -0.025],
  [2.774, 0.087, 0.089, -0.031],
  [2.8, 0.002, 0.003, -0.034],
];

const torsoRings: readonly Ring[] = [
  [1.36, 0.008, 0.018, -0.004],
  [1.4, 0.147, 0.098, -0.005],
  [1.49, 0.19, 0.116, -0.008],
  [1.57, 0.17, 0.103, -0.006],
  [1.7, 0.126, 0.086, 0],
  [1.78, 0.122, 0.083, 0],
  [1.9, 0.15, 0.095, 0.004],
  [1.98, 0.185, 0.111, 0.016],
  [2.08, 0.212, 0.081, 0],
  [2.11, 0.202, 0.078, 0],
  [2.131, 0.132, 0.066, 0.001],
  [2.157, 0.073, 0.054, 0.006],
  [2.187, 0.057, 0.055, 0.007],
  [2.246, 0.057, 0.051, 0.031],
  [2.292, 0.044, 0.043, 0.048],
];

function faceRelief(x: number, y: number, frontness: number) {
  const frontal = THREE.MathUtils.smoothstep(frontness, 0, 0.7);
  const side = Math.abs(x);
  const bridge = 0.014 * gaussian(x, y, 0, 2.472, 0.037, 0.062);
  const nose = 0.022 * gaussian(x, y, 0, 2.423, 0.034, 0.036);
  const nostril = 0.01 * gaussian(side, y, 0.029, 2.412, 0.022, 0.018);
  const cheek = 0.019 * gaussian(side, y, 0.135, 2.41, 0.068, 0.049);
  const socket = 0.012 * gaussian(side, y, 0.099, 2.505, 0.059, 0.04);
  const lips = 0.007 * gaussian(x, y, 0, 2.352, 0.084, 0.031);
  return frontal * (bridge + nose + nostril + cheek + lips - socket);
}

function facePoint(x: number, y: number, offset: number): Point {
  const [, width, depth, center] = profileAt(headRings, y);
  const facing = Math.sqrt(Math.max(0, 1 - (x / width) ** 2));
  return [x, y, center + facing * depth + faceRelief(x, y, facing) + offset];
}

function addBody(group: THREE.Group, material: THREE.MeshStandardMaterial) {
  group.add(bodySurface(torsoRings, material));

  const shoes = porcelain("#ead7ca", 0.45);
  const shoeEdge = porcelain("#cda79e", 0.55);
  const strap = porcelain("#f4e3db", 0.54);

  for (const side of [-1, 1]) {
    group.add(ellipse(material, [side * 0.199, 2.068, 0.004], [0.062, 0.054, 0.056]));
    const arm: Point[] = [
      [side * 0.175, 2.093, 0.004],
      [side * 0.231, 2.028, 0.008],
      [side * 0.264, 1.914, 0.007],
      [side * 0.302, 1.78, 0.016],
      [side * 0.352, 1.655, 0.037],
      [side * 0.391, 1.526, 0.06],
    ];
    group.add(
      strand(
        arm,
        (time) => {
          const radius =
            THREE.MathUtils.lerp(0.066, 0.022, time) *
            (0.48 + 0.52 * Math.sin(Math.PI * Math.min(0.5, time * 5)));
          return [radius, radius * 0.88];
        },
        material,
        { steps: 36, sides: 20 },
      ),
    );

    const palm = ellipse(material, [side * 0.399, 1.485, 0.062], [0.031, 0.053, 0.019]);
    palm.rotation.z = side * 0.22;
    group.add(palm);

    for (let finger = 0; finger < 4; finger++) {
      const x = side * (0.382 + finger * 0.011);
      const depth = 0.061 + finger * 0.002;
      const length = [0.041, 0.047, 0.042, 0.031][finger];
      group.add(
        strand(
          [
            [x, 1.463, depth],
            [x + side * 0.009, 1.443, depth + 0.005],
            [x + side * 0.009, 1.464 - length, depth + 0.008],
          ],
          (time) => [0.0075 * taper(time, 0.38), 0.0064 * taper(time, 0.38)],
          material,
          { steps: 8, sides: 8 },
        ),
      );
    }

    group.add(
      strand(
        [
          [side * 0.378, 1.507, 0.074],
          [side * 0.365, 1.478, 0.075],
          [side * 0.373, 1.456, 0.076],
        ],
        (time) => [0.01 * taper(time, 0.33), 0.008 * taper(time, 0.33)],
        material,
        { steps: 10, sides: 9 },
      ),
    );

    const legRings: Ring[] = [
      [0.075, 0.037, 0.041, 0.007],
      [0.185, 0.043, 0.047, 0.002],
      [0.384, 0.054, 0.059, -0.011],
      [0.55, 0.065, 0.061, -0.016],
      [0.734, 0.056, 0.057, 0.02],
      [0.855, 0.064, 0.063, 0.014],
      [1.02, 0.081, 0.075, 0.002],
      [1.215, 0.093, 0.092, -0.003],
      [1.4, 0.094, 0.099, -0.003],
      [1.5, 0.044, 0.056, -0.003],
    ];
    const leg = bodySurface(legRings, material);
    leg.position.x = side * 0.101;
    leg.rotation.z = side * 0.015;
    group.add(leg);

    const foot = new THREE.Group();
    foot.position.x = side * 0.102;
    foot.rotation.y = side * 0.1;
    const slipper = ellipse(shoes, [0, 0.064, 0.059], [0.058, 0.048, 0.109]);
    slipper.rotation.x = -0.115;
    foot.add(slipper, ellipse(shoeEdge, [0, 0.028, 0.062], [0.06, 0.02, 0.111]));
    foot.add(ellipse(material, [0, 0.09, 0.01], [0.037, 0.05, 0.067]));
    foot.add(
      strand(
        [
          [-0.051, 0.081, 0.057],
          [-0.026, 0.103, 0.055],
          [0, 0.112, 0.054],
          [0.026, 0.103, 0.055],
          [0.051, 0.081, 0.057],
        ],
        (time) => [0.008 * taper(time, 0.65), 0.0069 * taper(time, 0.65)],
        strap,
        { steps: 14 },
      ),
    );
    group.add(foot);
  }
}

function addFace(
  group: THREE.Group,
  appearance: CharacterAppearance,
  material: THREE.MeshStandardMaterial,
) {
  const palette = skinColors[appearance.skin];
  const base = new THREE.Color(palette.base);
  const blush = new THREE.Color(palette.blush);
  const shadow = new THREE.Color(palette.shadow);
  const headMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.68 });
  const head = bodySurface(headRings, headMaterial, faceRelief, (x, y, frontness) => {
    const width = Math.abs(x);
    const cheek = 0.36 * gaussian(width, y, 0.137, 2.415, 0.058, 0.038);
    const nose = 0.08 * gaussian(x, y, 0, 2.416, 0.045, 0.028);
    const lid = 0.13 * gaussian(width, y, 0.1, 2.537, 0.062, 0.029);
    const nostril = 0.22 * gaussian(width, y, 0.022, 2.409, 0.008, 0.0048);
    const forward = THREE.MathUtils.smoothstep(frontness, 0.04, 0.63);
    return base
      .clone()
      .lerp(blush, (cheek + nose) * forward)
      .lerp(shadow, (lid + nostril) * forward);
  });
  head.castShadow = true;
  group.add(head);

  const innerEar = porcelain(palette.shadow);
  const white = new THREE.MeshStandardMaterial({
    color: "#fff8ef",
    roughness: 0.46,
    side: THREE.DoubleSide,
  });
  const liner = porcelain("#553737");
  const brows = porcelain(browColors[appearance.hairColor]);
  const pupil = new THREE.MeshStandardMaterial({
    color: "#291921",
    roughness: 0.32,
    side: THREE.DoubleSide,
  });
  const iris = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.37,
    side: THREE.DoubleSide,
  });
  const reflection = new THREE.MeshBasicMaterial({ color: "#fff9f4", side: THREE.DoubleSide });
  const darkIris = new THREE.Color("#3b2324");
  const irisAmber = new THREE.Color(appearance.hairColor === "honey" ? "#968254" : "#ad7b4e");

  for (const side of [-1, 1]) {
    if (appearance.hairStyle !== "wrap") {
      const ear = ellipse(material, [side * 0.217, 2.435, 0.02], [0.034, 0.058, 0.033]);
      ear.rotation.z = side * -0.16;
      group.add(ear, ellipse(innerEar, [side * 0.23, 2.433, 0.043], [0.017, 0.03, 0.009]));
    }

    const cx = side * 0.096;
    const cy = 2.511;
    const eyeContour = (angle: number, radius: number, offset: number): Point => {
      const x = radius * Math.cos(angle) * 0.0585;
      const sine = Math.sin(angle);
      const width = sine >= 0 ? 0.036 : 0.029;
      const y = radius * width * sine * (0.74 + 0.26 * Math.abs(sine)) + side * x * 0.078;
      return facePoint(cx + x, cy + y, offset + 0.007 * (1 - radius ** 2));
    };
    group.add(
      new THREE.Mesh(
        surface(9, 40, (radius, rotation) => ({
          point: eyeContour(rotation * Math.PI * 2, radius, 0.0032),
        })),
        white,
      ),
    );

    const glowDisk = (
      x: number,
      y: number,
      radius: number,
      thickness: number,
      offset: number,
      material: THREE.Material,
      shading?: (radial: number, arc: number) => THREE.Color,
    ) =>
      new THREE.Mesh(
        surface(8, 42, (radial, arc) => {
          const turn = arc * Math.PI * 2;
          return {
            point: facePoint(
              x + radius * radial * Math.cos(turn),
              y + thickness * radial * Math.sin(turn),
              offset + 0.0032 * (1 - radial ** 2),
            ),
            color: shading?.(radial, arc),
          };
        }),
        material,
      );

    const eyeX = cx - side * 0.002;
    group.add(
      glowDisk(eyeX, cy + 0.002, 0.034, 0.03, 0.012, iris, (radial, arc) => {
        const rim = 1 - THREE.MathUtils.smoothstep(radial, 0.7, 1);
        const ray =
          0.68 + 0.13 * Math.cos(arc * Math.PI * 38) + 0.15 * Math.sin(arc * Math.PI * 82);
        const warmth = THREE.MathUtils.smoothstep(radial, 0.4, 0.61);
        return darkIris.clone().lerp(irisAmber, rim * warmth * ray);
      }),
      glowDisk(eyeX, cy + 0.003, 0.016, 0.018, 0.0161, pupil),
      glowDisk(eyeX - 0.01, cy + 0.0125, 0.007, 0.0062, 0.0202, reflection),
      glowDisk(eyeX + 0.01, cy - 0.0061, 0.0028, 0.0028, 0.02, reflection),
    );

    const upperLid = Array.from({ length: 11 }, (_, i) =>
      eyeContour((i / 10) * Math.PI, 1, 0.0046),
    );
    group.add(
      strand(
        upperLid,
        (time) => {
          const corner = side > 0 ? 1 - time : time;
          return [0.0015 + 0.0029 * taper(time, 0.18) * (0.6 + 0.5 * corner), 0.0021];
        },
        liner,
        { steps: 32, sides: 9 },
      ),
    );

    for (let lash = 0; lash < 2; lash++) {
      const outer = side > 0 ? 0.14 + lash * 0.24 : Math.PI - (0.14 + lash * 0.24);
      const origin = eyeContour(outer, 0.99, 0.0063);
      const distance = 0.0103 - lash * 0.0014;
      group.add(
        strand(
          [
            origin,
            [origin[0] + side * distance * 0.56, origin[1] + distance * 0.3, origin[2] + 0.001],
            [
              origin[0] + side * distance,
              origin[1] + distance * (0.39 + 0.23 * lash),
              origin[2] - 0.001,
            ],
          ],
          (time) => [0.0019 * (1 - 0.9 * time), 0.0015 * (1 - 0.85 * time)],
          liner,
          { steps: 9, sides: 7 },
        ),
      );
    }

    const brow = [
      facePoint(side * 0.045, 2.569, 0.004),
      facePoint(side * 0.079, 2.581, 0.0042),
      facePoint(side * 0.119, 2.582, 0.004),
      facePoint(side * 0.149, 2.576, 0.0038),
      facePoint(side * 0.163, 2.563, 0.0035),
    ];
    group.add(
      strand(
        brow,
        (time) => [0.0056 * (1 - time * 0.73) * taper(time, 0.29), 0.0031 * taper(time, 0.52)],
        brows,
        { steps: 19, sides: 9 },
      ),
    );
  }

  const lower = new THREE.Color(palette.lip).lerp(base, 0.54);
  const upper = new THREE.Color(palette.lip).lerp(base, 0.34);
  const seam = new THREE.Color(palette.lip).lerp(new THREE.Color("#6b3f45"), 0.46);
  const lipMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.62,
    side: THREE.DoubleSide,
  });
  const lipWidth = 0.056;
  const mouthY = (along: number) => 2.356 + 0.016 * Math.abs(along) ** 1.68;
  const curveDepth = (along: number) => Math.cos((Math.PI / 2) * along) ** 0.88;
  for (const lip of [-1, 1]) {
    group.add(
      new THREE.Mesh(
        surface(10, 36, (row, sweep) => {
          const shift = sweep * 2 - 1;
          const curve = curveDepth(shift);
          const bow = 1 - 0.35 * Math.exp(-((shift * 5) ** 2));
          const height = lip > 0 ? 0.0092 * bow : 0.0098;
          const tint = (lip > 0 ? upper : lower)
            .clone()
            .lerp(base, Math.min(0.88, row ** 1.9 * 0.53));
          tint.lerp(seam, 0.53 * Math.max(0, 1 - row * 7) * curve);
          return {
            point: facePoint(
              shift * lipWidth,
              mouthY(shift) + lip * row * height * curve,
              0.001 + curve * (0.006 * (1 - row) + 0.0023 * Math.sin(Math.PI * row)),
            ),
            color: tint,
          };
        }),
        lipMaterial,
      ),
    );
  }
}

export function createCharacter(appearance: CharacterAppearance) {
  const group = new THREE.Group();
  const material = porcelain(skinColors[appearance.skin].base);
  addBody(group, material);
  group.add(sculptHairstyle(headRings, appearance.hairStyle, appearance.hairColor));

  group.traverse((object) => {
    if (object instanceof THREE.Mesh) object.castShadow = true;
  });

  addFace(group, appearance, material);
  return group;
}
