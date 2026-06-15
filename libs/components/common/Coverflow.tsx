import * as THREE from 'three';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, ScrollControls, useScroll, Environment } from '@react-three/drei';
import { easing } from 'maath';
import './util';

export type CoverflowItem = { id: string; title: string; image: string };

function Card({ item, ...props }: { item: CoverflowItem } & Record<string, any>) {
  const ref = useRef<any>();
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useFrame((_, delta) => {
    if (!ref.current) return;
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta);
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta);
  });

  return (
    // @ts-ignore - drei Image accepts geometry children + material props
    <Image
      ref={ref}
      url={item.image}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={(e: any) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={() => router.push({ pathname: 'gadget/detail', query: { id: item.id } })}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}

function Carousel({ items, radius = 1.6 }: { items: CoverflowItem[]; radius?: number }) {
  const count = items.length || 1;
  return (
    <>
      {items.map((item, i) => (
        <Card
          key={item.id}
          item={item}
          position={[
            Math.sin((i / count) * Math.PI * 2) * radius,
            0,
            Math.cos((i / count) * Math.PI * 2) * radius,
          ]}
          rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
        />
      ))}
    </>
  );
}

function Rig(props: Record<string, any>) {
  const ref = useRef<any>();
  const scroll = useScroll();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2) + state.clock.elapsedTime * 0.04;
    state.events.update?.();
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 9], 0.3, delta);
    state.camera.lookAt(0, 0, 0);
  });
  return <group ref={ref} {...props} />;
}

export default function Coverflow({ items }: { items: CoverflowItem[] }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 9], fov: 15 }}>
      <fog attach="fog" args={['#000000', 8.5, 12]} />
      <ScrollControls pages={4} infinite>
        <Rig rotation={[0, 0, 0.12]}>
          <Carousel items={items} />
        </Rig>
        <Environment preset="city" />
      </ScrollControls>
    </Canvas>
  );
}
