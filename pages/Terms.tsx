import { useEffect } from 'react';
import { APP_NAME } from '../lib/constants';
import { setPageTitleAndDescription } from '@/lib/seo';

export function Terms() {
  useEffect(() => {
    setPageTitleAndDescription(
      'Termos e aviso legal – CeluPublic',
      `Termos de uso e aviso legal do ${APP_NAME}.`
    );
  }, []);
  return (
    <div className="mx-auto min-w-0 max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Termos e aviso legal
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última atualização: {new Date().toLocaleDateString('pt-MZ')}
      </p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Sobre o {APP_NAME}</h2>
          <p className="mt-2 text-muted-foreground">
            O {APP_NAME} é uma plataforma de divulgação que liga vendedores e prestadores de serviços a
            potenciais clientes. O contacto é feito directamente via WhatsApp. Não realizamos vendas
            nem pagamentos na plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Utilização</h2>
          <p className="mt-2 text-muted-foreground">
            Ao usar o {APP_NAME}, concorda em utilizar o serviço de forma legal e ética. Não nos
            responsabilizamos por transacções entre utilizadores fora da plataforma. Recomendamos
            cautela e verificação antes de qualquer acordo ou pagamento.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Vendedores e prestadores</h2>
          <p className="mt-2 text-muted-foreground">
            Para anunciar, é necessário criar conta e aguardar aprovação. A ativação pode envolver
            taxa única conforme indicado. O administrador reserva-se o direito de aprovar ou
            rejeitar contas e anúncios.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Conteúdo</h2>
          <p className="mt-2 text-muted-foreground">
            Os anúncios são da responsabilidade dos anunciantes. O {APP_NAME} não garante a
            veracidade das informações. Em caso de conteúdo inadequado ou ilegal, contacte o
            administrador.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Contacto</h2>
          <p className="mt-2 text-muted-foreground">
            Dúvidas ou reclamações: contacte o administrador via WhatsApp, conforme indicado no site.
          </p>
        </section>
      </div>
    </div>
  );
}
