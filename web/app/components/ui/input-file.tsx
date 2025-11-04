import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface InputFileProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export function InputFile({ onChange, label }: InputFileProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="picture">{label ? label : "Arquivo"}</Label>
      <Input onChange={onChange} id="picture" type="file" />
    </div>
  );
}
