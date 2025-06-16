import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultCode?: string;
  onCodeChange?: (code: string) => void;
}

export default function PhoneInput({
  defaultCode = "+52",
  onCodeChange,
  className,
  ...props
}: PhoneInputProps) {
  const [code, setCode] = useState(defaultCode);

  const handleCodeChange = (value: string) => {
    setCode(value);
    onCodeChange?.(value);
  };

  return (
    <div className="flex gap-2">
      <Select defaultValue={code} onValueChange={handleCodeChange}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Código" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="+52">+52 MX</SelectItem>
          <SelectItem value="+1">+1 US</SelectItem>
          <SelectItem value="+44">+44 UK</SelectItem>
          <SelectItem value="+34">+34 ES</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="tel"
        pattern="[0-9]{10}"
        maxLength={10}
        className={cn("flex-1", className)}
        {...props}
      />
    </div>
  );
}
