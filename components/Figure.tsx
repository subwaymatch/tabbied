import imageManifest from 'lib/generated/images';

/** Where an image lives when its manifest entry predates the `base` field. */
const DEFAULT_BASE = '/images/sites';

interface FigureProps {
  /** Committed filename without its extension - include `-cutout` for cut-outs. */
  slug: string;
  alt: string;
  /** Cut-outs get a CSS shadow to seat them on the pattern; scenes don't. */
  cutout?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Editable-slot id (see docs/editable-templates.md). Only emitted on the
   * branch that renders a real <img>: the pending-image placeholder has
   * nothing to replace, and annotating one would put a slot in the spec that
   * resolves to nothing and fails the build gate.
   */
  editId?: string;
}

/**
 * A generated image from public/images/sites/, with intrinsic dimensions read
 * from the committed manifest so the page reserves layout space (no CLS).
 *
 * A plain <img>, not next/image: the promoted WebP is already the exact bytes
 * to serve, and re-encoding it at request time would be a second lossy pass.
 * The hash query string cache-busts a regenerated image behind a stable slug.
 */
export function Figure({
  slug,
  alt,
  cutout = false,
  priority = false,
  className,
  style,
  editId,
}: FigureProps) {
  const entry = imageManifest[slug];

  // A slug with no image yet: surface it in dev, render nothing in production,
  // so a layout can be built before its pattern exists.
  if (!entry) {
    if (process.env.NODE_ENV !== 'development') return null;
    return (
      <span role="img" aria-label={`Image pending: ${slug}`}>
        Image <code>{slug}</code> pending
      </span>
    );
  }

  const classes = [cutout ? 'figure figure--cutout' : 'figure', className]
    .filter(Boolean)
    .join(' ');

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${entry.base ?? DEFAULT_BASE}/${slug}.webp?v=${entry.hash.slice(0, 8)}`}
      width={entry.width}
      height={entry.height}
      alt={alt}
      className={classes}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      {...(editId ? { 'data-edit-image': editId } : {})}
    />
  );
}
