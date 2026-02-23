import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { MessageCircle, Shield, FileText, AlertCircle } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useApp } from '@/context/AppContext';
import { getAdminWhatsapp } from '@/lib/settingsHelpers';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setPageTitleAndDescription } from '@/lib/seo';

export function Help() {
  const { publicSettings } = useApp();
  const adminWa = `https://wa.me/${getAdminWhatsapp(publicSettings)}`;

  useEffect(() => {
    setPageTitleAndDescription(
      'Ajuda – CeluPublic',
      `Saiba como funciona o ${APP_NAME} e veja dicas de segurança.`
    );
  }, []);

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Ajuda
      </h1>
      <p className="mt-2 text-muted-foreground">
        Como funciona o {APP_NAME} e o que deve saber antes de usar.
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <FileText className="h-5 w-5" />
            Como funciona
          </h2>
          <p className="mt-3 text-muted-foreground">
            O {APP_NAME} é um site de divulgação de anúncios. Vendedores e prestadores de serviços
            publicam ofertas; os interessados entram em contacto directamente por WhatsApp. Não há
            pagamentos nem transacções dentro da plataforma — tudo é combinado entre si.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Shield className="h-5 w-5" />
            Dicas de segurança
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Combine encontros em locais movimentados quando for levantar ou entregar.</li>
            <li>Confirme o estado do produto ou o valor do serviço antes de pagar.</li>
            <li>Não partilhe dados bancários ou códigos com desconhecidos.</li>
            <li>Em caso de dúvida, contacte o administrador.</li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <AlertCircle className="h-5 w-5" />
            Regras
          </h2>
          <p className="mt-3 text-muted-foreground">
            É proibido publicar conteúdo ilegal, ofensivo, enganoso ou que viole direitos de
            terceiros. Anúncios inadequados podem ser removidos e as contas bloqueadas. O
            administrador reserva-se o direito de aprovar ou rejeitar contas e anúncios.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Documentos</h2>
          <p className="mt-3 text-muted-foreground">
            Para termos de uso e aviso legal, consulte a página{' '}
            <Link to="/termos" className="font-medium text-primary hover:underline">
              Termos e aviso legal
            </Link>
            .
          </p>
        </section>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Contacto do administrador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Dúvidas, reclamações ou denúncias de anúncios? Fale com o administrador pelo WhatsApp.
            </p>
            <AppButton asChild className="gap-2">
              <a href={adminWa} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Falar com o Admin no WhatsApp
              </a>
            </AppButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
