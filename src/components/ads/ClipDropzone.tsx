import { useRef, useState } from "react";
import { Upload, Film, X } from "lucide-react";

interface Props {
  file: File | null;
  onChange: (f: File | null) => void;
}

const ACCEPT = ".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm";
const MAX_MB = 50;

const ClipDropzone = ({ file, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (f: File): string | null => {
    if (!f.type.startsWith("video/")) return "Please upload a video file";
    if (f.size > MAX_MB * 1024 * 1024) return `Max ${MAX_MB}MB (yours is ${(f.size / 1024 / 1024).toFixed(1)}MB)`;
    return null;
  };

  const handle = (f: File) => {
    const err = validate(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onChange(f);
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 p-3">
        <Film className="h-5 w-5 text-primary-v2" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-white">{file.name}</div>
          <div className="text-xs text-white/50">{(file.size / 1024 / 1024).toFixed(1)}MB</div>
        </div>
        <button
          onClick={() => onChange(null)}
          className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Remove clip"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handle(f);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? "border-primary-v2 bg-primary-v2/5" : "border-white/15 bg-black/40 hover:border-white/30"
        }`}
      >
        <Upload className="h-6 w-6 text-white/60" />
        <div className="text-sm font-medium text-white">Drop 15s clip here</div>
        <div className="text-xs text-white/50">.mp4, .mov, .webm — up to {MAX_MB}MB</div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.target.value = "";
          }}
        />
      </div>
      {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
    </div>
  );
};

export default ClipDropzone;
