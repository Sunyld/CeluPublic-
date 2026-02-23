import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppButton } from '@/components/ui/app-button';
import { Loader2 } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  destructive?: boolean;
  loading?: boolean;
}

/**
 * Reusable confirmation dialog for destructive or important actions.
 * Supports async onConfirm; focus is managed by Radix Dialog.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  destructive = true,
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    console.log('[ConfirmDialog] handleConfirm chamado, onConfirm=', typeof onConfirm);
    try {
      await onConfirm();
      console.log('[ConfirmDialog] onConfirm completou, fechando dialog');
      onOpenChange(false);
    } catch (err) {
      console.error('[ConfirmDialog] onConfirm threw:', err);
      throw err;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!loading) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[400px]" onPointerDownOutside={(e) => {
        if (!loading) {
          e.preventDefault();
        }
      }} onEscapeKeyDown={(e) => {
        if (loading) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <AppButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </AppButton>
          <AppButton
            type="button"
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
            className="gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
