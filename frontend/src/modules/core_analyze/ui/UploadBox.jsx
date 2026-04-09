export default function UploadBox({ file, setFile }) {
  return (
    <div
      onClick={() => document.getElementById("file").click()}
      className="border-2 border-dashed p-10 text-center cursor-pointer"
    >
      <input
        id="file"
        type="file"
        hidden
        onChange={(e) => setFile(e.target.files[0])}
      />
      {file ? file.name : "파일 업로드"}
    </div>
  );
}