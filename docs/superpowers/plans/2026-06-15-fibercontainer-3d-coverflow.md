# FiberContainer 3D Gadget Coverflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken `FiberContainer.tsx` WIP with a perf-isolated WebGL coverflow of top-ranked gadgets.

**Architecture:** `FiberContainer.tsx` (client wrapper) fetches top gadgets via the existing `GET_PROPERTIES` query, gates rendering by device + viewport, and dynamically imports the heavy `Coverflow.tsx` (`ssr:false`) so `three` stays out of the main bundle. `Coverflow.tsx` is a pure presentational r3f scene driven by `items` props, using the existing `util.ts` bent-plane geometry. Mobile gets a lightweight CSS scroll-snap fallback — no WebGL.

**Tech Stack:** Next.js 14 (pages router), `@react-three/fiber` 8.12, `@react-three/drei` 9.58, `three` 0.150, `maath` 0.5, Apollo Client.

**Verification note:** The frontend has no unit-test runner (none in `package.json`) and the scene is visual. Each task verifies with `npx tsc --noEmit` / `npm run build` (type + build gate) and, where stated, a dev-server visual check. Adding a test harness is out of scope (YAGNI).

---

### Task 1: Type the extended r3f elements in `util.ts`

`util.ts` already defines `BentPlaneGeometry` + `MeshSineMaterial` and calls `extend(...)`. TSX needs the lowercase JSX element names declared or `<bentPlaneGeometry>` won't typecheck.

**Files:**
- Modify: `libs/components/common/util.ts` (append module augmentation)

- [ ] **Step 1: Append the JSX augmentation to the bottom of `util.ts`** (after the existing `extend(...)` call)

```ts
declare module '@react-three/fiber' {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bentPlaneGeometry: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meshSineMaterial: any;
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no NEW errors referencing `util.ts`. (The broken `FiberContainer.tsx` still errors — fixed in Task 3.)

- [ ] **Step 3: Commit**

```bash
git add libs/components/common/util.ts
git commit -m "feat(showcase): type extended bent-plane r3f elements"
```

---

### Task 2: Create `Coverflow.tsx` (presentational WebGL scene)

**Files:**
- Create: `libs/components/common/Coverflow.tsx`

- [ ] **Step 1: Create `libs/components/common/Coverflow.tsx`**

```tsx
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
    // scroll rotates the ring; clock term gives a gentle idle auto-rotate
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `Coverflow.tsx`.

- [ ] **Step 3: Commit**

```bash
git add libs/components/common/Coverflow.tsx
git commit -m "feat(showcase): add r3f gadget coverflow scene"
```

---

### Task 3: Rewrite `FiberContainer.tsx` (data + device/viewport gate + dynamic import)

**Files:**
- Modify (full rewrite): `libs/components/common/FiberContainer.tsx`

- [ ] **Step 1: Replace the entire contents of `libs/components/common/FiberContainer.tsx`**

```tsx
import { useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { REACT_APP_API_URL } from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { T } from '../../types/common';
import { Gadget } from '../../types/gadget/gadget';
import type { CoverflowItem } from './Coverflow';

const Coverflow = dynamic(() => import('./Coverflow'), {
  ssr: false,
  loading: () => <CoverflowSkeleton />,
});

const INPUT = { page: 1, limit: 8, sort: 'gadgetRank', direction: 'DESC', search: {} };

function CoverflowSkeleton() {
  return (
    <div
      style={{
        height: 512,
        borderRadius: 16,
        background:
          'linear-gradient(100deg, rgba(120,120,120,0.06) 30%, rgba(120,120,120,0.14) 50%, rgba(120,120,120,0.06) 70%)',
        backgroundSize: '200% 100%',
        animation: 'fiberShimmer 1.4s ease-in-out infinite',
      }}
    >
      <style>{`@keyframes fiberShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function FallbackStrip({ items }: { items: CoverflowItem[] }) {
  const router = useRouter_();
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        padding: '8px 4px 16px',
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => router.push({ pathname: 'gadget/detail', query: { id: item.id } })}
          style={{
            flex: '0 0 70%',
            scrollSnapAlign: 'center',
            borderRadius: 14,
            height: 240,
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
}

// local import kept here to avoid a second top-level import block in the snippet
import { useRouter as useRouter_ } from 'next/router';

export default function FiberContainer() {
  const device = useDeviceDetect();
  const [items, setItems] = useState<CoverflowItem[]>([]);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useQuery(GET_PROPERTIES, {
    fetchPolicy: 'cache-and-network',
    variables: { input: INPUT },
    onCompleted: (data: T) => {
      const list: Gadget[] = data?.getGadgets?.list ?? [];
      setItems(
        list
          .filter((g) => g?.gadgetImages?.[0])
          .map((g) => ({
            id: g._id,
            title: g.gadgetTitle,
            image: `${REACT_APP_API_URL}/${g.gadgetImages[0]}`,
          })),
      );
    },
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <div ref={sectionRef} style={{ width: '100%', marginTop: 80 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ opacity: 0.6, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 13 }}>
          Eng saralangan
        </p>
        <h1 style={{ margin: '6px 0 0', fontSize: 32, fontWeight: 800 }}>Eng saralangan gadjetlar</h1>
      </div>
      {device === 'mobile' ? (
        <FallbackStrip items={items} />
      ) : (
        <div style={{ height: 512 }}>{inView ? <Coverflow items={items} /> : <CoverflowSkeleton />}</div>
      )}
    </div>
  );
}
```

> **Implementer note:** Move the `import { useRouter as useRouter_ } from 'next/router';` line up into the top import block (it is shown mid-file only for readability). All imports must sit at the top of the module.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS, no errors. Confirm `Gadget` has `_id`, `gadgetTitle`, `gadgetImages` (see `libs/types/gadget/gadget.ts`); adjust the `.map` field names only if the type differs.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds. Confirm `three` is split into its own chunk (dynamic import), not the main entry.

- [ ] **Step 4: Commit**

```bash
git add libs/components/common/FiberContainer.tsx
git commit -m "feat(showcase): data + device/viewport gate + dynamic 3D coverflow"
```

---

### Task 4: Visual verification + integration check

`FiberContainer` is already rendered in `libs/components/layout/LayoutHome.tsx:68` with no props — no wiring change needed.

**Files:**
- Verify only: `libs/components/layout/LayoutHome.tsx`

- [ ] **Step 1: Start dev server**

Run: `npm run dev`
Open: `http://localhost:3000`

- [ ] **Step 2: Desktop checks**
  - Coverflow renders top gadgets in a 3D ring.
  - Scroll/drag rotates the ring; it slowly auto-rotates when idle.
  - Hover scales a card up; click navigates to `/gadget/detail?id=...`.
  - Network tab: a separate `three`-heavy chunk loads only when the section scrolls into view.

- [ ] **Step 3: Mobile checks** (devtools responsive / real phone)
  - Fallback CSS scroll-snap strip renders, swipes horizontally.
  - No `three` chunk is downloaded on mobile.

- [ ] **Step 4: Empty-state check**
  - Temporarily point the query at an empty result (or confirm logic): section renders nothing when `items.length === 0`.

- [ ] **Step 5: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix(showcase): coverflow visual verification adjustments"
```

---

## Self-Review

**Spec coverage:**
- Wrapper / data / device+viewport gate / dynamic import → Task 3. ✓
- WebGL bent-plane scene reusing `util.ts` → Tasks 1–2. ✓
- Reuse `GET_PROPERTIES`, top-8 `gadgetRank` DESC → Task 3 `INPUT`. ✓
- Image path + detail route patterns (mirror `TopGadgetCard`) → Tasks 2–3. ✓
- Heading "Eng saralangan gadjetlar" → Task 3. ✓
- Mobile fallback, no WebGL → Task 3 `FallbackStrip` + device gate. ✓
- Empty list hides section → Task 3 `if (items.length === 0) return null`. ✓
- Perf isolation (lazy/desktop/in-view) → Tasks 3–4 + network check. ✓
- Vercel = explicitly out of this plan (spec follow-up). ✓

**Placeholder scan:** none — all steps carry full code/commands.

**Type consistency:** `CoverflowItem { id, title, image }` defined in Task 2, imported + produced identically in Task 3. `GET_PROPERTIES` → `data.getGadgets.list` matches `TopGadgets.tsx`. ✓

## Out of Scope
- No unit-test harness (none exists; YAGNI).
- No SCSS additions (inline styles only).
- Vercel deploy — separate follow-up (build-green + public backend URL + env vars).
