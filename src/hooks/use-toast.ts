
import { toast as sonnerToast } from "sonner";

// Minimum time between toast notifications in ms
const MIN_TOAST_INTERVAL = 3000;
let lastToastTime = 0;

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: unknown;
};

export function toast({ title, description, variant, ...props }: ToastProps) {
  const now = Date.now();
  if (now - lastToastTime < MIN_TOAST_INTERVAL) {
    return;
  }
  lastToastTime = now;
  return sonnerToast(title, {
    description,
    ...props,
  });
}

export function useToast() {
  return {
    toast,
  };
}
