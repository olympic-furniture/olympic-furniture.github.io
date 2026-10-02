import { useEffect, useId, useRef } from 'react';
import { XIcon } from '@phosphor-icons/react';
import type { Product } from '../content';
import { BusinessImage } from './BusinessImage';

export function ImageDialog({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current!;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="image-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <button
        className="dialog-close icon-button"
        ref={closeButton}
        aria-label="סגירת תמונה"
        onClick={onClose}
      >
        <XIcon size={25} />
      </button>
      <BusinessImage
        src={product.image}
        alt={product.title}
        className="dialog-image"
        eager
      />
      <div className="dialog-caption">
        <h2 id={titleId}>{product.title}</h2>
        <p>{product.description}</p>
      </div>
    </dialog>
  );
}
