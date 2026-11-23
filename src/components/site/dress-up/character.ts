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
  porcelain: { base: "#f7cbb4", blush: "#ef9d92", shadow: "#d49a90", lip: "#d17469" },
  honey: { base: "#c78c63", blush: "#b95461", shadow: "#9e6659", lip: "#a74960" },
  umber: { base: "#895443", blush: "#b75b68", shadow: "#693e45", lip: "#a64d65" },
} as const;

const browColors: Record<HairColor, string> = {
  espresso: "#45322b",
  chestnut: "#62392d",
  rosewood: "#5d3345",
  honey: "#77513b",
};

const headRings: readonly Ring[] = [
  [2.223, 0.002, 0.002, 0.078],
  [2.225, 0.024, 0.03, 0.078],
  [2.236, 0.058, 0.073, 0.068],
  [2.256, 0.082, 0.111, 0.054],
  [2.284, 0.099, 0.148, 0.036],
  [2.322, 0.119, 0.169, 0.025],
  [2.361, 0.135, 0.182, 0.016],
  [2.406, 0.151, 0.192, 0.01],
  [2.45, 0.163, 0.196, 0.008],
  [2.493, 0.174, 0.202, 0.005],
  [2.538, 0.18, 0.207, 0.002],
  [2.585, 0.181, 0.207, 0],
  [2.641, 0.174, 0.194, -0.007],
  [2.69, 0.155, 0.173, -0.017],
  [2.736, 0.121, 0.141, -0.025],
  [2.774, 0.072, 0.089, -0.031],
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
  const crest = THREE.MathUtils.smoothstep(y, 2.365, 2.419);
  const bridge = crest * 0.014 * gaussian(x, y, 0, 2.432, 0.016, 0.034);
  const tip = 0.023 * gaussian(x, y, 0, 2.393, 0.017, 0.022);
  const ala = 0.007 * gaussian(side, y, 0.016, 2.385, 0.0068, 0.011);
  const nostril = 0.0025 * gaussian(side, y, 0.014, 2.381, 0.0048, 0.0039);
  const cheekbone = 0.007 * gaussian(side, y, 0.116, 2.431, 0.044, 0.034);
  const socket = 0.012 * gaussian(side, y, 0.083, 2.493, 0.053, 0.034);
  const mouth = 0.0045 * gaussian(x, y, 0, 2.321, 0.051, 0.025);
  return frontal * (bridge + tip + ala - nostril + cheekbone - socket + mouth);
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
  const headMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.71 });
  const head = new THREE.Mesh(
    surface(122, 160, (row, angle) => {
      const y = THREE.MathUtils.lerp(headRings[0][0], headRings[headRings.length - 1][0], row);
      const [, width, depth, center] = profileAt(headRings, y);
      const turn = angle * 2 * Math.PI + Math.PI;
      const x = Math.sin(turn) * width;
      const facing = Math.cos(turn);
      const side = Math.abs(x);
      const cheek =
        (appearance.skin === "porcelain" ? 0.52 : 0.37) *
        gaussian(side, y, 0.109, 2.432, 0.041, 0.044);
      const tip = 0.04 * gaussian(x, y, 0, 2.392, 0.017, 0.012);
      const lid = 0.17 * gaussian(side, y, 0.087, 2.523, 0.051, 0.024);
      const nostril = 0.43 * gaussian(side, y, 0.014, 2.381, 0.0048, 0.004);
      const forward = THREE.MathUtils.smoothstep(facing, 0.04, 0.63);
      return {
        point: [x, y, center + facing * depth + faceRelief(x, y, facing)],
        color: base
          .clone()
          .lerp(blush, (cheek + tip) * forward)
          .lerp(shadow, (lid + nostril) * forward),
      };
    }),
    headMaterial,
  );
  // Soften the stylized nose's underside so a tiny contour keeps definition in close-up.
  const position = head.geometry.attributes.position;
  const normal = head.geometry.attributes.normal;
  const softened = new THREE.Vector3();
  for (let index = 0; index < position.count; index++) {
    const x = position.getX(index);
    const y = position.getY(index);
    if (position.getZ(index) < 0.16 || Math.abs(x) > 0.044 || y < 2.346 || y > 2.415) continue;

    softened.fromBufferAttribute(normal, index);
    if (softened.y >= 0) continue;

    softened.y *= 1 - 0.79 * gaussian(x, y, 0, 2.378, 0.03, 0.022);
    softened.normalize();
    normal.setXYZ(index, softened.x, softened.y, softened.z);
  }
  head.castShadow = true;
  group.add(head);

  const innerEar = porcelain(palette.shadow);
  const white = new THREE.MeshStandardMaterial({
    color: "#fff8ef",
    roughness: 0.46,
    side: THREE.DoubleSide,
  });
  const liner = porcelain("#58413a");
  const lowerLidMaterial = new THREE.MeshStandardMaterial({
    color: base.clone().lerp(shadow, 0.63),
    roughness: 0.76,
  });
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
  const darkIris = new THREE.Color(appearance.skin === "porcelain" ? "#253746" : "#3b2324");
  const irisColor = new THREE.Color(
    appearance.skin === "porcelain"
      ? "#7e9dab"
      : appearance.hairColor === "honey"
        ? "#968254"
        : "#ad7b4e",
  );

  const eyes: THREE.Group[] = [];
  const eyeLevel = 2.487;
  for (const side of [-1, 1]) {
    if (appearance.hairStyle !== "wrap") {
      const ear = ellipse(material, [side * 0.157, 2.445, 0.016], [0.025, 0.042, 0.027]);
      ear.rotation.z = side * -0.16;
      group.add(ear, ellipse(innerEar, [side * 0.172, 2.443, 0.036], [0.0108, 0.021, 0.008]));
    }

    const eye = new THREE.Group();
    const cx = side * 0.082;
    const cy = eyeLevel;
    const eyeContour = (angle: number, radius: number, offset: number): Point => {
      const x = radius * Math.cos(angle) * 0.052;
      const sine = Math.sin(angle);
      const width = sine >= 0 ? 0.035 : 0.028;
      const y = radius * width * sine * (0.76 + 0.24 * Math.abs(sine)) + side * x * 0.065;
      return facePoint(cx + x, cy + y, offset + 0.007 * (1 - radius ** 2));
    };
    eye.add(
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
    eye.add(
      glowDisk(eyeX, cy + 0.002, 0.0315, 0.0296, 0.012, iris, (radial, arc) => {
        const rim = 1 - THREE.MathUtils.smoothstep(radial, 0.7, 1);
        const ray =
          0.68 + 0.13 * Math.cos(arc * Math.PI * 38) + 0.15 * Math.sin(arc * Math.PI * 82);
        const warmth = THREE.MathUtils.smoothstep(radial, 0.4, 0.61);
        return darkIris.clone().lerp(irisColor, rim * warmth * ray);
      }),
      glowDisk(eyeX, cy + 0.003, 0.016, 0.018, 0.0161, pupil),
      glowDisk(eyeX - 0.01, cy + 0.0125, 0.007, 0.0062, 0.0202, reflection),
      glowDisk(eyeX + 0.01, cy - 0.0061, 0.0028, 0.0028, 0.02, reflection),
    );

    const upperLid = Array.from({ length: 11 }, (_, i) =>
      eyeContour((i / 10) * Math.PI, 1, 0.0046),
    );
    eye.add(
      strand(
        upperLid,
        (time) => {
          const corner = side > 0 ? 1 - time : time;
          return [0.00145 + 0.0036 * taper(time, 0.18) * (0.6 + 0.5 * corner), 0.0021];
        },
        liner,
        { steps: 32, sides: 9 },
      ),
    );

    for (let lash = 0; lash < 4; lash++) {
      const outer = side > 0 ? 0.15 + lash * 0.22 : Math.PI - (0.15 + lash * 0.22);
      const origin = eyeContour(outer, 0.99, 0.0063);
      const distance = 0.014 - lash * 0.0016;
      eye.add(
        strand(
          [
            origin,
            [origin[0] + side * distance * 0.56, origin[1] + distance * 0.3, origin[2] + 0.001],
            [
              origin[0] + side * distance,
              origin[1] + distance * (0.41 + 0.19 * lash),
              origin[2] - 0.001,
            ],
          ],
          (time) => [0.0019 * (1 - 0.9 * time), 0.0015 * (1 - 0.85 * time)],
          liner,
          { steps: 9, sides: 7 },
        ),
      );
    }

    const lowerLid = Array.from({ length: 9 }, (_, i) =>
      eyeContour((1 + i / 8) * Math.PI, 1, 0.004),
    );
    eye.add(
      strand(lowerLid, (time) => [0.0018 * taper(time, 0.2), 0.0013], lowerLidMaterial, {
        steps: 20,
        sides: 7,
      }),
    );

    // Set the pivot at the eye line so the lashes and catchlights follow the lid.
    eye.position.y = eyeLevel;
    for (const part of eye.children) part.position.y -= eyeLevel;
    eyes.push(eye);
    group.add(eye);

    const brow = [
      facePoint(side * 0.035, 2.546, 0.004),
      facePoint(side * 0.063, 2.555, 0.004),
      facePoint(side * 0.095, 2.558, 0.0039),
      facePoint(side * 0.119, 2.555, 0.0038),
      facePoint(side * 0.143, 2.542, 0.0036),
    ];
    group.add(
      strand(
        brow,
        (time) => [0.0061 * (1 - time * 0.73) * taper(time, 0.29), 0.0031 * taper(time, 0.52)],
        brows,
        { steps: 19, sides: 9 },
      ),
    );
  }

  const lipColor = new THREE.Color(palette.lip);
  const lower = lipColor.clone().lerp(base, 0.28);
  const upper = lipColor.clone().lerp(new THREE.Color("#883b43"), 0.13);
  const seam = lipColor.clone().lerp(new THREE.Color("#69363c"), 0.61);
  const sheen = lipColor.clone().lerp(base, 0.65);
  const lipMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.53,
    side: THREE.DoubleSide,
  });
  const lipWidth = 0.0565;
  const mouthCenter = 2.323;
  for (const lip of [-1, 1]) {
    group.add(
      new THREE.Mesh(
        surface(16, 48, (row, sweep) => {
          const shift = sweep * 2 - 1;
          const side = Math.abs(shift);
          const curve = Math.max(0, 1 - side ** 2) ** 1.08;
          const bow = Math.exp(-(((side - 0.36) / 0.23) ** 2));
          const height = lip > 0 ? 0.012 + 0.0095 * bow : 0.027;
          const mouthLine =
            mouthCenter +
            0.009 * THREE.MathUtils.smoothstep(side, 0.25, 1) -
            0.0015 * Math.exp(-((shift / 0.22) ** 2));
          const tint = (lip > 0 ? upper : lower).clone();
          const softEdge = THREE.MathUtils.smoothstep(row, 0.8, 1);
          const softCorner = THREE.MathUtils.smoothstep(side, 0.79, 1);
          tint.lerp(seam, 0.88 * Math.max(0, 1 - row * 7) * curve);
          if (lip < 0) {
            tint.lerp(sheen, 0.32 * gaussian(shift, row, -0.08, 0.49, 0.46, 0.24));
          }
          tint.lerp(base, Math.min(1, softEdge * 0.72 + softCorner));
          return {
            point: facePoint(
              shift * lipWidth,
              mouthLine + lip * row * height * curve,
              0.0007 + curve * (0.0037 * (1 - row) + 0.0045 * Math.sin(Math.PI * row)),
            ),
            color: tint,
          };
        }),
        lipMaterial,
      ),
    );
  }

  return (openness: number) => {
    for (const eye of eyes) {
      eye.scale.y = openness;
      eye.position.y = eyeLevel - (1 - openness) * 0.009;
    }
  };
}

export function createCharacter(appearance: CharacterAppearance) {
  const group = new THREE.Group();
  const material = porcelain(skinColors[appearance.skin].base);
  addBody(group, material);
  group.add(sculptHairstyle(headRings, appearance.hairStyle, appearance.hairColor));

  group.traverse((object) => {
    if (object instanceof THREE.Mesh) object.castShadow = true;
  });

  const setEyeOpenness = addFace(group, appearance, material);
  return { group, setEyeOpenness };
}
