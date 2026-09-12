import type { CSSProperties } from 'react';

// The Tabbied mark: two mirrored strokes, each a stem that turns through a
// half-round bowl and doubles back on itself. One continuous path per half,
// drawn in `currentColor` so the parent decides whether it is ink on paper or
// paper on ink - the mastheads are light, the homepage's is dark, and the mark
// is the same file in both.
//
// The stroke is authored at 17 units in a 391-unit box, which is what keeps it
// hairline-thin at the ~20px the navs draw it at. Scaling the box rather than
// the stroke is deliberate: the weight is part of the drawing.
const VIEW_BOX = '107 92 391 391';

const LEFT = 'M191 261 H277 C277 172.6 205.4 101 116 101 V311 C116 401.1 188.7 474 277 474 V312 H221';
const RIGHT = 'M414 261 H328 C328 172.6 399.6 101 489 101 V311 C489 401.1 416.3 474 328 474 V312 H391';

export default function LogoMark({
  size = 20,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox={VIEW_BOX}
      width={size}
      height={size}
      className={className}
      style={{ display: 'block', flex: 'none', ...style }}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="17"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        <path d={LEFT} />
        <path d={RIGHT} />
      </g>
    </svg>
  );
}
