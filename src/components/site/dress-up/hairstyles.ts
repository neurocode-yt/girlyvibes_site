import * as THREE from "three";
import {
  bodySurface,
  ellipse,
  porcelain,
  profileAt,
  strand,
  surface,
  taper,
  type Point,
  type Ring,
} from "./sculpt";

export type HairStyle = "waves" | "bob" | "bun" | "wrap";
export type HairColor = "espresso" | "chestnut" | "rosewood" | "honey";

const colors = {
  espresso: ["#382b29", "#755851"],
  chestnut: ["#824731", "#b6704b"],
  rosewood: ["#784053", "#bb6c82"],
  honey: ["#a76b40", "#e6aa6b"],
} as const;

const scarfColors = {
  espresso: ["#4e394c", "#867087"],
  chestnut: ["#9b634e", "#ca9b79"],
  rosewood: ["#9c5470", "#db91ae"],
  honey: ["#ae8858", "#dfbf84"],
} as const;

const tau = Math.PI * 2;
const crown = 2.843;
const crownRings: readonly Ring[] = [
  [2.68, 0.218, 0.209, -0.015],
  [2.715, 0.199, 0.18, -0.019],
  [2.745, 0.178, 0.154, -0.024],
  [2.772, 0.151, 0.135, -0.028],
  [2.797, 0.119, 0.109, -0.026],
  [2.822, 0.08, 0.077, -0.021],
  [2.836, 0.042, 0.041, -0.02],
  [crown, 0.002, 0.003, -0.02],
];

const fallRings: readonly Ring[] = [
  [1.63, 0.157, 0.117, -0.006],
  [1.76, 0.201, 0.162, -0.012],
  [1.91, 0.258, 0.174, -0.025],
  [2.055, 0.246, 0.185, -0.039],
  [2.15, 0.235, 0.182, -0.045],
  [2.27, 0.259, 0.188, -0.046],
  [2.392, 0.241, 0.201, -0.031],
  [2.49, 0.221, 0.225, -0.014],
  [2.58, 0.215, 0.225, -0.006],
];

const forehead = 2.665;
const shellTop = 2.838;

function curtainHair(profile: readonly Ring[], color: HairColor) {
  const [base, sheen] = colors[color].map((value) => new THREE.Color(value));
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.61,
    specularIntensity: 0.35,
    sheen: 0.06,
    sheenColor: sheen,
    sheenRoughness: 0.75,
  });

  const rows = 169;
  const sides = 176;
  const geometry = surface(rows, sides, (row, turn) => {
    const distanceFromPart = Math.min(turn, 1 - turn);
    const separation = Math.sin(turn * Math.PI);
    const frontLength = 1 - THREE.MathUtils.smoothstep(distanceFromPart, 0, 0.13);
    const hem =
      1.79 +
      0.051 * separation ** 1.3 -
      0.126 * frontLength +
      0.027 * Math.sin(turn * tau * 2.8 - 0.34) * (1 - frontLength);
    const hemFade = 1 - THREE.MathUtils.smoothstep(row, 0, 0.46);
    const y = THREE.MathUtils.lerp(1.79, shellTop, row) + (hem - 1.79) * hemFade;
    const [, fallWidth, fallDepth, fallCenter] = profileAt(fallRings, y);
    const [, skullWidth, skullDepth, skullCenter] = profileAt(profile, y);
    const crownHeight = THREE.MathUtils.clamp((y - 2.61) / (shellTop - 2.61), 0, 1);
    const dome = Math.sqrt(Math.max(0, 1 - crownHeight ** 2));
    const crownBlend = THREE.MathUtils.smoothstep(y, 2.52, 2.648);
    const width = THREE.MathUtils.lerp(fallWidth, Math.max(0.001, 0.216 * dome), crownBlend);
    const depth = THREE.MathUtils.lerp(fallDepth, Math.max(0.001, 0.203 * dome), crownBlend);
    const center = THREE.MathUtils.lerp(fallCenter, -0.015 - 0.034 * crownHeight, crownBlend);

    // An elliptical opening leaves a rounded hairline around the center part.
    const gap = THREE.MathUtils.clamp((forehead - y) / 0.1, 0, 1);
    const opening =
      (Math.sqrt(0.036 + gap * (2 - gap)) - Math.sqrt(0.036)) *
      (0.84 / (Math.sqrt(1.036) - Math.sqrt(0.036))) *
      THREE.MathUtils.smoothstep(gap, 0, 0.061);
    const fall = 1 - THREE.MathUtils.smoothstep(y, 2.06, 2.36);
    const shoulder = 0.22 * fall + 0.125 * fall * Math.sin((y - 1.69) * 13);
    const temple = -0.149 * Math.exp(-(((y - 2.413) / 0.078) ** 2));
    const start = Math.max(0, opening - shoulder + temple);
    const sweep = 0.13 * Math.sin((y - 1.66) * 10.8) * (1 - crownBlend);
    const curve = turn + Math.sin(turn * tau) * sweep * 0.19;
    const angle = start + curve * (tau - 2 * start);
    const sine = Math.sin(angle);
    const cosine = Math.cos(angle);
    const forward = Math.max(0, cosine);
    const root = THREE.MathUtils.smoothstep(y, forehead - 0.01, 2.778);
    const striation = curve * tau + 0.71 * root * sine + 0.14 * fall * Math.sin(14 * y) * sine;
    const lock = 0.5 + 0.5 * Math.sin(striation * 11 + Math.sin(striation * 3) * 1.7);
    const rib = 0.5 + 0.5 * Math.sin(striation * 49 + 1.2 * Math.sin(striation * 17));
    const grain = 0.5 + 0.5 * Math.sin(striation * 76 + Math.sin(striation * 45) * 0.8);
    const leftRight = Math.sin(turn * tau);
    const asymmetricLength = (1 - THREE.MathUtils.smoothstep(y, 2.16, 2.38)) * leftRight;
    const shape = 1 - THREE.MathUtils.smoothstep(y, 2.8, shellTop);
    const relief = shape * (0.0036 * lock ** 2 + 0.00065 * rib + 0.00023 * grain);
    const frontWave = forward * sine * (0.036 * fall * Math.sin((2.36 - y) * 15 - 0.5));
    const x =
      sine * (width + relief) + frontWave + 0.016 * asymmetricLength * Math.sin((y - 1.63) * 12);
    const shoulderLine = Math.acos(THREE.MathUtils.clamp(cosine, -1, 1));
    const sweepOverShoulder =
      0.081 * Math.exp(-(((y - 2.064) / 0.11) ** 2 + ((shoulderLine - 1.12) / 0.488) ** 2));
    const looseDepth =
      center + cosine * (depth + relief) + 0.014 * forward * fall + sweepOverShoulder;
    const skullX = x / skullWidth;
    const scalpFront = skullCenter + Math.sqrt(Math.max(0, 1 - skullX ** 2)) * skullDepth;
    const hairlineFit =
      Math.exp(-(((y - forehead) / 0.067) ** 2)) *
      THREE.MathUtils.smoothstep(forward, 0.4, 0.86) *
      (1 - THREE.MathUtils.smoothstep(Math.abs(skullX), 0.51, 0.94));
    const z = THREE.MathUtils.lerp(looseDepth, scalpFront + 0.0085 + relief * 0.24, hairlineFit);
    const seam =
      forward ** 14 *
      Math.exp(-((x / 0.0095) ** 2)) *
      THREE.MathUtils.smoothstep(y, forehead - 0.009, forehead + 0.016) *
      (1 - THREE.MathUtils.smoothstep(y, shellTop - 0.019, shellTop));
    const dark = forward * (1 - THREE.MathUtils.smoothstep(y, 2.02, 2.24)) * (1 - lock) * 0.08;
    const tinted = base
      .clone()
      .lerp(sheen, 0.19 + 0.1 * lock + 0.057 * rib + 0.025 * grain - dark)
      .multiplyScalar(1 - 0.36 * seam);

    return {
      point: [x, y, z - 0.0035 * seam],
      color: tinted,
    };
  });

  const mesh = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(mesh);
  return group;
}

export function sculptHairstyle(profile: readonly Ring[], style: HairStyle, color: HairColor) {
  if (style === "waves") return curtainHair(profile, color);

  const group = new THREE.Group();
  const wrapped = style === "wrap";
  const [base, highlight] = (wrapped ? scarfColors : colors)[color];
  const tint: [THREE.Color, THREE.Color] = [new THREE.Color(base), new THREE.Color(highlight)];
  const hair = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: wrapped ? 0.82 : 0.48,
  });

  const lock = (points: Point[], width: number, depth: number, falloff = 0.1, brightness = 0) => {
    const shades: [THREE.Color, THREE.Color] = [tint[0].clone().lerp(tint[1], brightness), tint[1]];
    const fitted = points.map<Point>(([x, y, z]) => {
      const headFit =
        THREE.MathUtils.smoothstep(y, 2.25, 2.47) * (1 - THREE.MathUtils.smoothstep(y, 2.58, 2.82));
      return [x * (1 - (wrapped ? 0.115 : 0.09) * headFit), y, z];
    });
    group.add(
      strand(fitted, (time) => [width * taper(time, falloff), depth * taper(time, falloff)], hair, {
        steps: 28,
        sides: 18,
        grooves: wrapped ? 0.025 : 0.095,
        tint: shades,
      }),
    );
  };

  // Shape the hairline independently at the temple and the back of the head.
  const cap = surface(45, 88, (row, rotation) => {
    const angle = rotation * tau + Math.PI;
    const sine = Math.sin(angle);
    const cosine = Math.cos(angle);
    const forward = Math.max(0, cosine);
    const hairline = wrapped
      ? 2.33 + 0.271 * forward ** 0.76
      : 2.465 + 0.192 * forward ** 0.93 + 0.026 * Math.sin(angle * 2) * forward;
    const nape = style === "bun" ? Math.max(0, -cosine) * 0.105 : 0;
    const y = THREE.MathUtils.lerp(hairline - nape, crown, row);
    const [, headWidth, headDepth, headCenter] = profileAt(profile, y);
    const [, crownWidth, crownDepth, crownCenter] = profileAt(crownRings, y);
    const capBlend = THREE.MathUtils.smoothstep(y, 2.68, 2.734);
    const part = angle + (wrapped ? 0.1 : 0.46) * Math.sin(row * Math.PI * 0.91);
    const wave = Math.cos(part * 15 + row * 2.9);
    const tipFade = 1 - THREE.MathUtils.smoothstep(y, 2.813, crown);
    const emboss = (wrapped ? 0.0022 : 0.0038) * wave * tipFade;
    const width = THREE.MathUtils.lerp(headWidth + 0.025, crownWidth, capBlend) + emboss;
    const depth = THREE.MathUtils.lerp(headDepth + 0.025, crownDepth, capBlend) + emboss;
    const center = THREE.MathUtils.lerp(headCenter, crownCenter, capBlend);
    const gloss = 0.29 + (wrapped ? 0.023 : 0.075) * wave + 0.08 * forward;
    return {
      point: [sine * width, y, center + cosine * depth - (1 - forward) * 0.009],
      color: tint[0].clone().lerp(tint[1], gloss),
    };
  });
  group.add(new THREE.Mesh(cap, hair));

  if (wrapped) {
    group.add(
      bodySurface(
        [
          [2.092, 0.081, 0.061, -0.007],
          [2.169, 0.096, 0.079, 0.009],
          [2.23, 0.125, 0.093, 0.016],
          [2.281, 0.173, 0.11, 0.004],
          [2.338, 0.198, 0.127, -0.027],
          [2.38, 0.212, 0.146, -0.029],
          [2.422, 0.22, 0.146, -0.027],
          [2.468, 0.211, 0.148, -0.027],
          [2.511, 0.187, 0.14, -0.032],
        ],
        porcelain(base, 0.85),
      ),
    );
    // Two overlapping lengths of cloth trace the face and cross under the chin.
    lock(
      [
        [-0.195, 2.53, 0.153],
        [-0.154, 2.623, 0.206],
        [-0.034, 2.669, 0.218],
        [0.131, 2.625, 0.197],
        [0.218, 2.49, 0.126],
        [0.191, 2.34, 0.145],
        [0.099, 2.245, 0.137],
        [-0.012, 2.181, 0.103],
      ],
      0.038,
      0.021,
      0.28,
      0.2,
    );
    lock(
      [
        [0.165, 2.634, 0.159],
        [0.023, 2.692, 0.206],
        [-0.163, 2.609, 0.172],
        [-0.218, 2.458, 0.122],
        [-0.19, 2.3, 0.091],
        [-0.094, 2.199, 0.103],
        [0.092, 2.116, 0.104],
        [0.183, 2.055, 0.074],
      ],
      0.041,
      0.02,
      0.18,
      0.08,
    );
    lock(
      [
        [-0.242, 2.487, 0.056],
        [-0.232, 2.338, 0.055],
        [-0.166, 2.211, 0.109],
        [-0.04, 2.122, 0.102],
        [0.127, 2.06, 0.076],
      ],
      0.052,
      0.019,
      0.16,
      0.1,
    );
    lock(
      [
        [0.238, 2.52, 0.07],
        [0.233, 2.374, 0.039],
        [0.169, 2.242, 0.037],
        [0.058, 2.156, 0.099],
        [-0.116, 2.112, 0.108],
        [-0.2, 2.062, 0.082],
      ],
      0.052,
      0.027,
      0.22,
      0.06,
    );
    lock(
      [
        [0.18, 2.56, -0.148],
        [0.192, 2.31, -0.118],
        [0.141, 2.155, -0.097],
        [0.201, 1.986, -0.096],
        [0.209, 1.837, -0.144],
      ],
      0.068,
      0.029,
      0.3,
    );
    lock(
      [
        [-0.17, 2.56, -0.146],
        [-0.194, 2.315, -0.132],
        [-0.133, 2.147, -0.092],
        [-0.201, 1.99, -0.11],
      ],
      0.075,
      0.031,
      0.21,
    );
    return group;
  }

  // Different lock thicknesses and tapered ends break up the cap silhouette.
  // Two overlapping groups follow the side part while keeping the eyes clear.
  lock(
    [
      [-0.035, 2.822, 0.032],
      [-0.061, 2.802, 0.106],
      [-0.11, 2.744, 0.161],
      [-0.161, 2.679, 0.186],
      [-0.199, 2.59, 0.17],
      [-0.218, 2.478, 0.112],
    ],
    0.061,
    0.019,
    0.17,
    0.23,
  );
  lock(
    [
      [-0.067, 2.829, 0.001],
      [-0.128, 2.795, 0.095],
      [-0.191, 2.722, 0.136],
      [-0.223, 2.621, 0.133],
      [-0.248, 2.505, 0.059],
    ],
    0.05,
    0.018,
    0.16,
    0.14,
  );
  lock(
    [
      [-0.042, 2.825, 0.044],
      [0.031, 2.795, 0.116],
      [0.121, 2.734, 0.184],
      [0.185, 2.642, 0.178],
      [0.211, 2.54, 0.154],
      [0.226, 2.463, 0.079],
    ],
    0.056,
    0.026,
    0.13,
    0.29,
  );
  lock(
    [
      [-0.012, 2.84, -0.026],
      [0.089, 2.802, 0.045],
      [0.184, 2.727, 0.088],
      [0.233, 2.616, 0.111],
      [0.247, 2.497, 0.064],
    ],
    0.062,
    0.026,
    0.15,
    0.15,
  );
  lock(
    [
      [0.001, 2.842, -0.048],
      [0.143, 2.79, -0.028],
      [0.224, 2.69, -0.027],
      [0.25, 2.568, -0.01],
      [0.23, 2.466, -0.034],
    ],
    0.048,
    0.024,
    0.18,
    0.04,
  );

  if (style === "bun") {
    const center = ellipse(porcelain(base, 0.55), [0.03, 2.772, -0.192], [0.158, 0.151, 0.122]);
    center.rotation.z = -0.18;
    group.add(center);
    for (let layer = 0; layer < 7; layer++) {
      const rate = layer / 6;
      const height = 2.693 + rate * 0.185;
      lock(
        [
          [-0.109 + 0.078 * rate, height, -0.156],
          [-0.054, height + 0.046 * (1 - rate), -0.252],
          [0.053, height + 0.031, -0.311 + 0.036 * rate],
          [0.135 - 0.058 * rate, height - 0.004, -0.249],
          [0.152 - 0.103 * rate, height - 0.042, -0.177],
        ],
        0.03 + 0.006 * rate,
        0.021,
        0.39,
        0.11,
      );
    }
    lock(
      [
        [-0.178, 2.697, 0.176],
        [-0.223, 2.594, 0.161],
        [-0.239, 2.465, 0.101],
        [-0.22, 2.396, 0.071],
      ],
      0.021,
      0.016,
      0.04,
      0.24,
    );
    lock(
      [
        [0.2, 2.676, 0.174],
        [0.239, 2.533, 0.114],
        [0.228, 2.421, 0.075],
      ],
      0.023,
      0.018,
      0.03,
      0.19,
    );
    return group;
  }

  for (let column = 0; column < 11; column++) {
    const cross = (column - 5) / 5;
    const shell = Math.sqrt(Math.max(0, 1 - cross ** 2));
    const dx = cross * 0.228;
    const sway = Math.sin(column * 1.74);
    lock(
      [
        [dx * 0.68, 2.716, -0.143 - 0.08 * shell],
        [dx, 2.544, -0.106 - 0.128 * shell],
        [dx * 1.13 + 0.016 * sway, 2.412, -0.083 - 0.135 * shell],
        [dx * 1.18 - 0.018 * sway, 2.305, -0.093 - 0.115 * shell],
        [dx * 0.95 + 0.017 * sway, 2.274, -0.096 - 0.09 * shell],
        [dx * 0.72 + 0.024 * sway, 2.278, -0.113 - 0.07 * shell],
      ],
      0.057 + 0.009 * shell,
      0.037 + 0.013 * shell,
      0.23,
      0.04 + 0.09 * ((column + 1) % 3),
    );
  }

  for (const side of [-1, 1]) {
    lock(
      [
        [side * 0.198, 2.69, 0.126],
        [side * 0.248, 2.534, 0.064],
        [side * 0.242, 2.419, 0.061],
        [side * 0.222, 2.33, 0.076],
        [side * 0.199, 2.307, 0.046],
      ],
      0.048,
      0.026,
      0.13,
      0.17,
    );
    lock(
      [
        [side * 0.228, 2.616, 0.004],
        [side * 0.248, 2.498, 0.024],
        [side * 0.261, 2.4, -0.02],
        [side * 0.215, 2.29, -0.053],
        [side * 0.176, 2.275, -0.065],
      ],
      0.048,
      0.032,
      0.16,
      0.08,
    );
  }

  return group;
}
