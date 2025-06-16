
import { useState } from "react";
import { Check, ChevronsUpDown, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Negocio } from "@/lib/supabase";

interface NegocioSelectorProps {
  negocios: Negocio[];
  negocioActivo: Negocio | null;
  onSelect: (negocioId: string) => void;
  isLoading?: boolean;
}

export function NegocioSelector({ 
  negocios, 
  negocioActivo, 
  onSelect, 
  isLoading = false 
}: NegocioSelectorProps) {
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Building className="h-4 w-4" />
        <span>Cargando negocios...</span>
      </div>
    );
  }

  if (negocios.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Building className="h-4 w-4" />
        <span>No hay negocios disponibles</span>
      </div>
    );
  }

  if (negocios.length === 1) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <Building className="h-4 w-4 text-primary" />
        <span className="font-medium">{negocios[0].nombre}</span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-primary" />
            <span className="truncate">
              {negocioActivo?.nombre || "Seleccionar negocio..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Buscar negocio..." />
          <CommandList>
            <CommandEmpty>No se encontraron negocios.</CommandEmpty>
            <CommandGroup>
              {negocios.map((negocio) => (
                <CommandItem
                  key={negocio.id}
                  value={negocio.nombre}
                  onSelect={() => {
                    onSelect(negocio.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      negocioActivo?.id === negocio.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{negocio.nombre}</span>
                    {negocio.descripcion && (
                      <span className="text-xs text-muted-foreground truncate">
                        {negocio.descripcion}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
