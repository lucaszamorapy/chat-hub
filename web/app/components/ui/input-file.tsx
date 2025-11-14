import { useRef, useState } from "react";
import { Label } from "@/app/components/ui/label";
import CAvatar from "@/app/components/ui/c-avatar";
import { Input } from "./input";
import { Camera } from "lucide-react";

interface InputFileProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  style?: string;
  url?: string;
  width?: string;
  height?: string;
}

export default function InputFile({
  onChange,
  label,
  style,
  url,
  width,
  height,
}: InputFileProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(url || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
    }
    onChange(e);
  };

  return (
    <div className={`${style} flex flex-col justify-center items-start gap-3`}>
      <Label>{label ? label : null}</Label>

      <div
        className="relative group cursor-pointer w-fit"
        onClick={() => fileRef.current?.click()}
      >
        <CAvatar
          src={preview || ""}
          alt="preview"
          width={`${width ? width : "w-20"}`}
          height={`${height ? height : "h-20"}`}
        />

        <div className="absolute inset-0 rounded-full overflow-hidden bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Camera className="w-7 h-7 text-white" />
        </div>
      </div>

      <Input
        ref={fileRef}
        onChange={handleChange}
        id="picture"
        type="file"
        className="hidden"
      />
    </div>
  );
}
