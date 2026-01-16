export default function ScanReceipt() {
  return (
    <div className="scan-box">
      <input type="file" accept="image/*" />
      <p>Upload receipt to auto-extract data</p>
    </div>
  );
}
