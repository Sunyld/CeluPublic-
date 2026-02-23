import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AppButton } from '@/components/ui/app-button';

interface LoginToLikeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

export function LoginToLikeDialog({ open, onOpenChange, onLogin }: LoginToLikeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Entrar para curtir</DialogTitle>
          <DialogDescription>
            Para curtir anúncios, precisa entrar na sua conta.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex gap-2 justify-end">
          <AppButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </AppButton>
          <AppButton
            onClick={() => {
              onOpenChange(false);
              onLogin();
            }}
          >
            Entrar
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

