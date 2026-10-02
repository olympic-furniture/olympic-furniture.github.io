import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  width?: number;
  height?: number;
};
export function BusinessImage({
  src,
  alt,
  className = '',
  eager = false,
  width = 1200,
  height = 900,
}: Props) {
  const [failedSource, setFailedSource] = useState<string>();
  return failedSource === src ? (
    <span
      role="img"
      aria-label={alt}
      className={`image-fallback ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <span>
        התמונה אינה זמינה כרגע
        <br />
        <small>{alt}</small>
      </span>
    </span>
  ) : (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      className={className}
      onError={() => setFailedSource(src)}
    />
  );
}
