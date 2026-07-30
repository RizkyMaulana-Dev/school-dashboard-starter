import { useState, useCallback } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "info";
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setOptions(options);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    resolveRef?.(false);
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    resolveRef?.(true);
  }, [resolveRef]);

  return {
    confirm,
    isOpen,
    options,
    handleClose,
    handleConfirm,
  };
}
