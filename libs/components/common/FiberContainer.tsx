import { useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
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
  const router = useRouter();
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
