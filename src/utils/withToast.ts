import { toast } from "@/hooks/use-toast";

export const withToast = async <T>(
  callback: () => Promise<T>,
  messages: {
    success: { title: string; description?: string };
    error: { title: string; description?: string };
  }
): Promise<T | null> => {
  try {
    const result = await callback();
    toast({
      title: messages.success.title,
      description: messages.success.description,
    });
    return result;
  } catch (err) {
    console.error(err);
    toast({
      title: messages.error.title,
      description: messages.error.description,
      variant: "destructive",
    });
    return null;
  }
};
