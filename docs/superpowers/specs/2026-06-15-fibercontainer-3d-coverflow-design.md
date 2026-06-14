# FiberContainer → 3D Gadget Coverflow — Design

**Date:** 2026-06-15
**Status:** Approved (design), pending implementation plan
**Component:** `libs/components/common/FiberContainer.tsx` (homepage showcase, rendered in `libs/components/layout/LayoutHome.tsx:68`)

## Problem

Current `FiberContainer.tsx` is broken uncommitted WIP: pasted static CodePen HTML with no `return`, raw `class=`/`id=` attributes (invalid TSX), a non-executing `<script>` tag, and all imports unused. It renders nothing and breaks `next build`. The orphaned helper `libs/components/common/util.ts` (`BentPlaneGeometry`, `MeshSineMaterial`) is registered via `extend()` but no longer consumed.

## Goal

Replace with a modern **3D coverflow** showcase of top-ranked gadgets — premium WebGL "wow" — while keeping it perf-isolated so it never blocks initial load, SSR, or mobile.

## Approach (chosen: C — optimized r3f, live data)

Keep the WebGL bent-plane carousel but make it pay-for-what-you-use:
- `three` / `@react-three/*` bundle (~600KB) excluded from the main bundle via dynamic import.
- Rendered desktop-only; mobile gets a lightweight fallback.
- Mounted only when scrolled into viewport.

## Architecture

Two files (split for isolation):

### 1. `FiberContainer.tsx` — wrapper (data + gating)
- `'use client'`-style client component (pages router; renders only client-side anyway).
- `useDeviceDetect()` → desktop renders 3D, mobile renders fallback.
- IntersectionObserver (or drei-level lazy): mount the 3D canvas only once the section enters viewport.
- Dynamic import of the heavy child:
  ```ts
  const Coverflow = dynamic(() => import('./Coverflow'), {
    ssr: false,
    loading: () => <CoverflowSkeleton />,
  });
  ```
- Apollo query `GET_PROPERTIES` (resolves to `getGadgets`) with input:
  ```ts
  { page: 1, limit: 8, sort: 'gadgetRank', direction: 'DESC', search: {} }
  ```
- Maps `data.getGadgets.list: Gadget[]` → coverflow items `{ id, title, image }`.
  - `image = ${REACT_APP_API_URL}/${gadget.gadgetImages[0]}` (pattern from `TopGadgetCard.tsx:98`, `REACT_APP_API_URL` from `libs/config`).
- Section heading: "Eng saralangan gadjetlar" (replaces "Behind creativity").
- Empty `list` → render nothing (hide section). Loading → `CoverflowSkeleton` shimmer.

### 2. `Coverflow.tsx` — the WebGL scene
- Consumes existing `util.ts` (`import './util'` triggers `extend({ MeshSineMaterial, BentPlaneGeometry })`).
- `<Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>` containing:
  - drei `<ScrollControls infinite horizontal damping={4} pages={4} distance={1}>`.
  - A rotating `<group>` placing N bent-plane `<Image>` planes evenly around a cylinder (coverflow ring).
  - Idle slow auto-rotation via `useFrame` (rotation advances when user not scrolling).
  - Hover → ease plane scale up + lift (`maath/easing`, already a dep via `util.ts`'s neighbor `easing`).
  - drei `<Environment preset="city" />` for reflections.
- Click a plane → `router.push({ pathname: 'gadget/detail', query: { id } })` (pattern from `TopGadgetCard.tsx:27`).
- Receives `items: { id, title, image }[]` as props (no data fetching here — pure presentational).

### Mobile fallback
- Reuse the existing lightweight pattern: a Swiper row (as `TopGadgets.tsx`) or a CSS scroll-snap strip of the same gadget images. No WebGL, no `three` import on mobile (it's behind the dynamic import + device gate).

## Data Flow

```
FiberContainer
  ├─ useQuery(GET_PROPERTIES, { input })  →  getGadgets.list: Gadget[]
  ├─ map → items: { id, title, image }[]
  ├─ desktop + in-view → <Coverflow items={items} />   (dynamic, ssr:false)
  └─ mobile           → <FallbackStrip items={items} />
Coverflow
  └─ per item → bent-plane <Image>  → onClick → router push /gadget/detail?id
```

## Error / Edge Handling
- Query error → log + hide section (no blocking alert; showcase is non-critical).
- Empty list → hide section.
- Missing `gadgetImages[0]` → fallback placeholder image (`/img/fiber/img1.jpg` or a neutral asset).
- WebGL unsupported → device/dynamic gate + drei fallback; worst case section hidden.

## Performance Guarantees
- `three`/`@react-three/*` not in main bundle (dynamic `ssr:false`).
- Mobile never loads the 3D chunk.
- Canvas mounts only when section scrolled into view.
- This is the single answer to "does the design slow the project?": no — weight is lazy + desktop-only.

## Out of Scope (YAGNI)
- No like/favorite buttons on the 3D cards (keep it a clean showcase; likes live in `TopGadgets`).
- No new GraphQL query (reuse `GET_PROPERTIES`).
- No CMS / admin control of which gadgets appear (driven purely by `gadgetRank`).

## Verification
- `next build` succeeds (current WIP breaks it).
- Desktop: coverflow renders, rotates on scroll/drag, auto-rotates idle, click → gadget detail.
- Mobile: fallback strip renders, no `three` chunk loaded (check network).
- Lighthouse: no regression to homepage LCP vs. baseline.

## Follow-ups (separate from this redesign)
- **Vercel deploy blockers:** (1) build must be green first; (2) `REACT_APP_API_GRAPHQL_URL` points at `localhost:3007` — backend `nest-gadget` must be publicly hosted and the frontend env vars set in Vercel before the deployed site has a working API.
