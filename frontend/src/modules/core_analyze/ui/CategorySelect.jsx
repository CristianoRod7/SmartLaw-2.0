export default function CategorySelect({ value, setValue, options }) {
  return (
    <select value={value} onChange={(e) => setValue(e.target.value)}>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}