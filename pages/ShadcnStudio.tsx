import ButtonDemo from '@/components/shadcn-studio/button/button-01';
import CardDemo from '@/components/shadcn-studio/card/card-01';
import CardProductDemo from '@/components/shadcn-studio/card/card-12';

/**
 * Página que exibe as variantes shadcn-studio (button-01, card-01, card-12).
 * Acesse via /shadcn-studio
 */
export function ShadcnStudio() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shadcn Studio – Variantes</h1>
        <p className="mt-1 text-muted-foreground">
          Demonstrações dos componentes em <code className="rounded bg-muted px-1">components/shadcn-studio</code>.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Button (button-01)</h2>
        <div className="rounded-lg border bg-card p-6">
          <ButtonDemo />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Card Login (card-01)</h2>
        <div className="rounded-lg border bg-card p-6">
          <CardDemo />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Card Produto (card-12)</h2>
        <div className="rounded-lg border bg-card p-6">
          <CardProductDemo />
        </div>
      </section>
    </div>
  );
}
