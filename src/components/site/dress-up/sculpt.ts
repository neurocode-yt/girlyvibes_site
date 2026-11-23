import * as THREE from "three";

export type Point = [number, number, number];
export type Ring = [y: number, width: number, depth: number, center: number];

const tau = Math.PI * 2;
const front = new THREE.Vector3(0, 0, 1);

export function porcelain(color: string, roughness = 0.67) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

export function ellipse(material: THREE.Material, position: Point, scale: Point) {
  const object = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 16), material);
  object.position.set(...position);
  object.scale.set(...scale);
  return object;
}

export function profileAt(profile: readonly Ring[], y: number): Ring {
  let row = 0;
  while (row + 1 < profile.length - 1 && y > profile[row + 1][0]) row++;

  const before = profile[Math.max(row - 1, 0)];
  const lower = profile[row];
  const upper = profile[row + 1];
  const after = profile[Math.min(row + 2, profile.length - 1)];
  const interval = upper[0] - lower[0];
  const mix = THREE.MathUtils.clamp((y - lower[0]) / interval, 0, 1);
  const mix2 = mix * mix;
  const mix3 = mix2 * mix;

  const interpolate = (column: 1 | 2 | 3) => {
    const startTangent = ((upper[column] - before[column]) / (upper[0] - before[0])) * interval;
    const endTangent = ((after[column] - lower[column]) / (after[0] - lower[0])) * interval;
    return (
      (2 * mix3 - 3 * mix2 + 1) * lower[column] +
      (mix3 - 2 * mix2 + mix) * startTangent +
      (-2 * mix3 + 3 * mix2) * upper[column] +
      (mix3 - mix2) * endTangent
    );
  };

  return [y, Math.max(0.001, interpolate(1)), Math.max(0.001, interpolate(2)), interpolate(3)];
}

export function surface(
  rows: number,
  sides: number,
  sample: (u: number, v: number) => { point: Point; color?: THREE.Color },
) {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const stride = sides + 1;

  for (let row = 0; row <= rows; row++) {
    for (let side = 0; side <= sides; side++) {
      const { point, color } = sample(row / rows, side / sides);
      positions.push(...point);
      if (color) colors.push(color.r, color.g, color.b);

      if (row < rows && side < sides) {
        const index = row * stride + side;
        indices.push(
          index,
          index + 1,
          index + stride,
          index + 1,
          index + stride + 1,
          index + stride,
        );
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  if (colors.length) geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function bodySurface(
  profile: readonly Ring[],
  material: THREE.Material,
  relief: (x: number, y: number, frontness: number) => number = () => 0,
  shade?: (x: number, y: number, frontness: number) => THREE.Color,
) {
  const first = profile[0][0];
  const last = profile[profile.length - 1][0];
  return new THREE.Mesh(
    surface(76, 88, (row, angle) => {
      const y = THREE.MathUtils.lerp(first, last, row);
      const [, width, depth, center] = profileAt(profile, y);
      const turn = angle * tau + Math.PI;
      const x = Math.sin(turn) * width;
      const facing = Math.cos(turn);
      return {
        point: [x, y, center + facing * depth + relief(x, y, facing)],
        color: shade?.(x, y, facing),
      };
    }),
    material,
  );
}

type StrandSize = (time: number) => [width: number, depth: number];

export function strand(
  points: readonly Point[],
  size: StrandSize,
  material: THREE.Material,
  options: {
    steps?: number;
    sides?: number;
    grooves?: number;
    tint?: [THREE.Color, THREE.Color];
  } = {},
) {
  const { steps = 24, sides = 12, grooves = 0, tint } = options;
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const frames = Array.from({ length: steps + 1 }, (_, row) => {
    const time = row / steps;
    const direction = curve.getTangent(time);
    const across = new THREE.Vector3().crossVectors(front, direction);
    if (across.lengthSq() < 0.01) across.set(1, 0, 0);
    across.normalize();

    return {
      center: curve.getPoint(time),
      across,
      facing: new THREE.Vector3().crossVectors(direction, across).normalize(),
      size: size(time),
    };
  });

  return new THREE.Mesh(
    surface(steps, sides, (time, angle) => {
      const frame = frames[Math.round(time * steps)];
      const wave = Math.cos(tau * (angle * 5 + 0.1 * time));
      const corrugation = 1 + grooves * wave;
      const point = frame.center
        .clone()
        .addScaledVector(frame.across, frame.size[0] * Math.cos(angle * tau) * corrugation)
        .addScaledVector(frame.facing, frame.size[1] * Math.sin(angle * tau) * corrugation);
      return {
        point: [point.x, point.y, point.z],
        color: tint?.[0].clone().lerp(tint[1], 0.1 + 0.2 * Math.max(0, wave) + 0.1 * time),
      };
    }),
    material,
  );
}

export function taper(time: number, floor = 0.08) {
  return (
    floor + (1 - floor) * Math.pow(Math.sin(Math.PI * THREE.MathUtils.clamp(time, 0, 1)), 0.65)
  );
}

export function gaussian(x: number, y: number, cx: number, cy: number, sx: number, sy: number) {
  return Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));
}
