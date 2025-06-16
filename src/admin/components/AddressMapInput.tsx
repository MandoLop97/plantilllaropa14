import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface AddressMapInputProps {
  value?: string;
  onChange: (address: string) => void;
}

export default function AddressMapInput({ value, onChange }: AddressMapInputProps) {
  useEffect(() => {
    if (!value) return;
  }, [value]);

  const encodedAddress = value ? encodeURIComponent(value) : "";

  return (
    <div className="space-y-2">
      <Input
        value={value ?? ""}
        placeholder="Buscar dirección"
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <iframe
          title="Mapa"
          className="map-container"
          src={`https://maps.google.com/maps?q=${encodedAddress}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}
