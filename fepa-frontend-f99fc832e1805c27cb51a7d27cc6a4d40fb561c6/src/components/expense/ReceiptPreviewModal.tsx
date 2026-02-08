interface Props {
  image: string;
  onClose: () => void;
}

export default function ReceiptPreviewModal({ image, onClose }: Props) {
  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        <button className="receipt-close" onClick={onClose}>
          ✕
        </button>

        <img src={image} alt="Receipt" />
      </div>
    </div>
  );
}
