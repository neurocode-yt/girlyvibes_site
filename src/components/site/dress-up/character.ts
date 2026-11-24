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
  [2.26, 0.002, 0.003, 0.08],
  [2.267, 0.031, 0.043, 0.078],
  [2.281, 0.063, 0.086, 0.063],
  [2.301, 0.091, 0.123, 0.045],
  [2.327, 0.116, 0.15, 0.031],
  [2.36, 0.137, 0.175, 0.02],
  [2.404, 0.157, 0.19, 0.01],
  [2.446, 0.173, 0.197, 0.006],
  [2.49, 0.184, 0.202, 0.004],
  [2.537, 0.192, 0.205, 0.001],
  [2.585, 0.19, 0.206, 0],
  [2.641, 0.181, 0.194, -0.007],
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
  const ridge = THREE.MathUtils.smoothstep(y, 2.403, 2.45);
  const bridge = ridge * 0.022 * gaussian(x, y, 0, 2.454, 0.018, 0.052);
  const tip = 0.027 * gaussian(x, y, 0, 2.419, 0.0205, 0.019);
  const ala = 0.011 * gaussian(side, y, 0.021, 2.408, 0.0095, 0.0106);
  const nostril = 0.0038 * gaussian(side, y, 0.0175, 2.402, 0.0053, 0.004);
  const philtrum = 0.0045 * gaussian(x, y, 0, 2.384, 0.008, 0.014);
  const cheekbone = 0.009 * gaussian(side, y, 0.127, 2.452, 0.049, 0.04);
  const socket = 0.014 * gaussian(side, y, 0.088, 2.505, 0.052, 0.043);
  const brow = 0.003 * gaussian(side, y, 0.089, 2.551, 0.055, 0.02);
  const mouth = 0.005 * gaussian(x, y, 0, 2.35, 0.054, 0.023);
  return frontal * (bridge + tip + ala - nostril - philtrum + cheekbone - socket + brow + mouth);
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
  const headMaterial = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.68,
    clearcoat: 0.12,
    clearcoatRoughness: 0.68,
  });
  const noseShadow = base.clone().lerp(new THREE.Color("#8c574b"), 0.55);
  const skinAt = (x: number, y: number, facing: number) => {
    const side = Math.abs(x);
    const cheek = 0.5 * gaussian(side, y, 0.122, 2.447, 0.042, 0.039);
    const tip = 0.1 * gaussian(x, y, 0, 2.416, 0.017, 0.012);
    const lids = 0.23 * gaussian(side, y, 0.088, 2.521, 0.049, 0.021);
    const ala = 0.1 * gaussian(side, y, 0.029, 2.407, 0.006, 0.009);
    const nostril = 0.38 * gaussian(side, y, 0.017, 2.401, 0.0045, 0.0035);
    const forward = THREE.MathUtils.smoothstep(facing, 0.04, 0.63);
    return base
      .clone()
      .lerp(blush, (cheek + tip) * forward)
      .lerp(shadow, (lids + ala) * forward)
      .lerp(noseShadow, nostril * forward);
  };
  const head = new THREE.Mesh(
    surface(140, 184, (row, angle) => {
      const y = THREE.MathUtils.lerp(headRings[0][0], headRings[headRings.length - 1][0], row);
      const [, width, depth, center] = profileAt(headRings, y);
      const turn = angle * 2 * Math.PI + Math.PI;
      const x = Math.sin(turn) * width;
      const facing = Math.cos(turn);
      return {
        point: [x, y, center + facing * depth + faceRelief(x, y, facing)],
        color: skinAt(x, y, facing),
      };
    }),
    headMaterial,
  );
  // Diffuse the shadow directly under the tip without changing the nose silhouette.
  const positions = head.geometry.attributes.position;
  const normals = head.geometry.attributes.normal;
  const shapedNormal = new THREE.Vector3();
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    if (positions.getZ(index) < 0.17 || Math.abs(x) > 0.047 || y < 2.369 || y > 2.422) continue;

    shapedNormal.fromBufferAttribute(normals, index);
    if (shapedNormal.y >= 0) continue;
    shapedNormal.y *= 1 - 0.48 * gaussian(x, y, 0, 2.402, 0.033, 0.018);
    shapedNormal.normalize();
    normals.setXYZ(index, shapedNormal.x, shapedNormal.y, shapedNormal.z);
  }
  head.castShadow = true;
  group.add(head);

  const innerEar = porcelain(palette.shadow);
  const eyeMaterial = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.34,
    clearcoat: 0.26,
    clearcoatRoughness: 0.28,
    side: THREE.DoubleSide,
  });
  const lidMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.68,
    side: THREE.DoubleSide,
  });
  const lashes = porcelain("#503932");
  const brows = porcelain(browColors[appearance.hairColor]);
  const catchlight = new THREE.MeshBasicMaterial({ color: "#fffaf4", side: THREE.DoubleSide });
  const pupil = new THREE.Color("#202329");
  const limbalRing = new THREE.Color(appearance.skin === "porcelain" ? "#293740" : "#3b2324");
  const irisColor = new THREE.Color(
    appearance.skin === "porcelain"
      ? "#82a1ae"
      : appearance.hairColor === "honey"
        ? "#aa9360"
        : "#ad7b4e",
  );
  const ivory = new THREE.Color("#fffaf0");
  const tearDuct = base.clone().lerp(blush, 0.55);

  const eyes: THREE.Group[] = [];
  const eyeLevel = 2.498;
  for (const side of [-1, 1]) {
    if (appearance.hairStyle !== "wrap") {
      const ear = ellipse(material, [side * 0.174, 2.455, 0.012], [0.023, 0.042, 0.027]);
      ear.rotation.z = side * -0.16;
      group.add(ear, ellipse(innerEar, [side * 0.188, 2.453, 0.032], [0.0108, 0.021, 0.008]));
    }

    const eye = new THREE.Group();
    const cx = side * 0.0815;
    const irisX = cx - side * 0.0022;
    const irisY = eyeLevel + 0.0029;
    const aperture = (x: number) => {
      const along = THREE.MathUtils.clamp((x - cx) / 0.049, -1, 1);
      const arch = Math.max(0, 1 - along ** 2) ** 0.72;
      const center = eyeLevel + side * along * 0.0034;
      return { top: center + arch * 0.029, bottom: center - arch * 0.0215, arch };
    };
    const eyePoint = (x: number, y: number, offset = 0): Point => {
      const { top, bottom, arch } = aperture(x);
      const vertical = THREE.MathUtils.clamp((y - bottom) / Math.max(top - bottom, 0.00001), 0, 1);
      return facePoint(x, y, 0.0016 + Math.sin(Math.PI * vertical) * arch * 0.0085 + offset);
    };
    eye.add(
      new THREE.Mesh(
        surface(38, 88, (row, sweep) => {
          const x = cx + (sweep * 2 - 1) * 0.049;
          const { top, bottom, arch } = aperture(x);
          const y = THREE.MathUtils.lerp(bottom, top, row);
          const dx = (x - irisX) / 0.0268;
          const dy = (y - irisY) / 0.0268;
          const radius = Math.hypot(dx, dy);
          const theta = Math.atan2(dy, dx);
          const fibers = 0.66 + 0.12 * Math.cos(theta * 23) + 0.11 * Math.sin(theta * 43 + radius);
          const rim = 1 - THREE.MathUtils.smoothstep(radius, 0.83, 1.01);
          const irisShade = limbalRing.clone().lerp(irisColor, rim * fibers);
          irisShade.lerp(pupil, 1 - THREE.MathUtils.smoothstep(radius, 0.47, 0.53));
          const tissue = 0.5 * (1 - arch) + 0.22 * THREE.MathUtils.smoothstep(row, 0.64, 1);
          const color = ivory
            .clone()
            .lerp(tearDuct, tissue)
            .lerp(irisShade, 1 - THREE.MathUtils.smoothstep(radius, 0.98, 1.022));
          color.lerp(limbalRing, 0.18 * THREE.MathUtils.smoothstep(row, 0.72, 1));
          return { point: eyePoint(x, y), color };
        }),
        eyeMaterial,
      ),
    );

    for (const [x, y, size] of [
      [irisX - 0.0085, irisY + 0.0095, 0.0056],
      [irisX + 0.009, irisY - 0.007, 0.0022],
    ]) {
      eye.add(
        new THREE.Mesh(
          surface(6, 22, (radius, angle) => ({
            point: eyePoint(
              x + radius * size * Math.cos(angle * 2 * Math.PI),
              y + radius * size * 0.88 * Math.sin(angle * 2 * Math.PI),
              0.0014,
            ),
          })),
          catchlight,
        ),
      );
    }

    const lashPoint = (sweep: number) => {
      const x = cx + (sweep * 2 - 1) * 0.049;
      return eyePoint(x, aperture(x).top, 0.0009);
    };
    for (const upper of [true, false]) {
      eye.add(
        new THREE.Mesh(
          surface(9, 50, (row, sweep) => {
            const x = cx + (sweep * 2 - 1) * 0.049;
            const { top, bottom, arch } = aperture(x);
            const size = upper ? 0.009 : 0.0058;
            const y = (upper ? top : bottom) + (upper ? 1 : -1) * size * arch * row;
            const fold = arch * Math.sin(row * Math.PI) * (upper ? 0.0028 : 0.0018);
            const offset = 0.0005 + arch * (1 - row) * 0.0022 + fold;
            const color = skinAt(x, y, 1).lerp(
              shadow,
              arch * (1 - row) ** 2 * (upper ? 0.53 : 0.26),
            );
            color.lerp(blush, 12 * fold);
            return { point: facePoint(x, y, offset), color };
          }),
          lidMaterial,
        ),
      );
    }
    eye.add(
      strand(
        Array.from({ length: 15 }, (_, index) => lashPoint(index / 14)),
        (time) => {
          const outer = side > 0 ? time : 1 - time;
          return [0.0011 + 0.0015 * taper(time, 0.18) * outer, 0.0015];
        },
        lashes,
        { steps: 30, sides: 7 },
      ),
    );
    for (let lash = 0; lash < 6; lash++) {
      const sweep = side > 0 ? 0.53 + lash * 0.065 : 0.47 - lash * 0.065;
      const origin = lashPoint(sweep);
      const length = 0.0065 + lash * 0.0012;
      eye.add(
        strand(
          [
            origin,
            [origin[0] + side * length * 0.45, origin[1] + length * 0.44, origin[2]],
            [origin[0] + side * length * 0.72, origin[1] + length, origin[2] - 0.002],
          ],
          (time) => [0.0014 * (1 - 0.92 * time), 0.0011 * (1 - 0.86 * time)],
          lashes,
          { steps: 9, sides: 6 },
        ),
      );
    }

    // Keep the lid surfaces and catchlights registered with the aperture during a blink.
    eye.position.y = eyeLevel;
    for (const part of eye.children) part.position.y -= eyeLevel;
    eyes.push(eye);
    group.add(eye);

    const brow = [
      facePoint(side * 0.031, 2.55, 0.0032),
      facePoint(side * 0.06, 2.559, 0.0037),
      facePoint(side * 0.088, 2.563, 0.0037),
      facePoint(side * 0.12, 2.559, 0.0038),
      facePoint(side * 0.146, 2.545, 0.0033),
    ];
    group.add(
      strand(
        brow,
        (time) => [0.0056 * (1 - time * 0.73) * taper(time, 0.25), 0.0026 * taper(time, 0.48)],
        brows,
        { steps: 22, sides: 9 },
      ),
    );
  }

  const lipColor = new THREE.Color(palette.lip);
  const lower = lipColor.clone().lerp(base, 0.2);
  const upper = lipColor.clone().lerp(new THREE.Color("#883b43"), 0.13);
  const seam = lipColor.clone().lerp(new THREE.Color("#69363c"), 0.46);
  const sheen = lipColor.clone().lerp(base, 0.65);
  const lipMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.61,
    side: THREE.DoubleSide,
  });
  const lipWidth = 0.056;
  const mouthCenter = 2.351;
  for (const lip of [-1, 1]) {
    group.add(
      new THREE.Mesh(
        surface(16, 48, (row, sweep) => {
          const shift = sweep * 2 - 1;
          const side = Math.abs(shift);
          const curve = Math.max(0, 1 - side ** 2) ** 1.08;
          const bow = Math.exp(-(((side - 0.36) / 0.23) ** 2));
          const height = lip > 0 ? 0.012 + 0.007 * bow : 0.0215;
          const mouthLine =
            mouthCenter +
            0.0065 * THREE.MathUtils.smoothstep(side, 0.36, 1) -
            0.0015 * Math.exp(-((shift / 0.22) ** 2));
          const tint = (lip > 0 ? upper : lower).clone();
          const softEdge = THREE.MathUtils.smoothstep(row, 0.8, 1);
          const softCorner = THREE.MathUtils.smoothstep(side, 0.79, 1);
          tint.lerp(seam, 0.88 * Math.max(0, 1 - row * 7) * curve);
          if (lip < 0) {
            tint.lerp(sheen, 0.32 * gaussian(shift, row, -0.08, 0.49, 0.46, 0.24));
          }
          tint.lerp(base, Math.min(1, softEdge * 0.94 + softCorner));
          return {
            point: facePoint(
              shift * lipWidth,
              mouthLine + lip * row * height * curve,
              0.0005 + curve * (0.0022 * (1 - row) + 0.007 * Math.sin(Math.PI * row)),
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
