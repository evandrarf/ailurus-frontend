export function InputLabel({
  value,
  label,
  textarea,
}: {
  value: string;
  label: string;
  textarea?: boolean;
}) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      {textarea ? (
        <textarea className="textarea textarea-bordered">{value}</textarea>
      ) : (
        <input
          type="text"
          value={value}
          readOnly
          className="input input-bordered"
        />
      )}
    </div>
  );
}
