import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, RefreshCw, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { APP_NAME } from '@/lib/constants';
import { getAdminWhatsapp, getActivationFeeMzn } from '@/lib/settingsHelpers';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BrandLogo } from '@/components/BrandLogo';
import { setPageTitleAndDescription } from '@/lib/seo';

/**
 * Tela de ativação: aguardar pagamento de 20 MT e aprovação do admin.
 * "Verificar status" actualiza o estado; se aprovado, redirecciona para o painel.
 */
export function Activation() {
  const { user, isApprovedSeller, isRejected, isBlocked, logout, refreshProfile } = useAuth();
  const { refreshUsers, publicSettings } = useApp();
  const navigate = useNavigate();
  const adminWa = getAdminWhatsapp(publicSettings);
  const feeMzn = getActivationFeeMzn(publicSettings);

  useEffect(() => {
    setPageTitleAndDescription(
      'Ativação de conta – CeluPublic',
      `Acompanhe o estado de ativação da sua conta no ${APP_NAME}.`
    );
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/entrar', { replace: true });
      return;
    }
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    if (isApprovedSeller) {
      navigate('/vendedor', { replace: true });
      return;
    }
  }, [user, isApprovedSeller, navigate]);

  const handleVerifyStatus = async () => {
    await refreshProfile?.();
    await refreshUsers();
    // Após re-render, useEffect fará o redirect se status === 'approved'
  };

  const whatsappUrl = `https://wa.me/${adminWa}?text=Olá! Criei conta no ${APP_NAME} e quero ativar. Pagamento de ${feeMzn} MT.`;

  if (!user) return null;

  if (isRejected) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center bg-muted/50 px-4 py-12">
        <div className="mb-6 flex justify-center">
          <BrandLogo variant="auth" linkToHome />
        </div>
        <div className="w-full min-w-0 max-w-md">
          <Card className="border-destructive/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span className="font-semibold">Conta rejeitada</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              A sua solicitação de ativação foi rejeitada. Para mais informações, contacte o administrador.
            </p>
            <AppButton asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Falar com o Admin no WhatsApp
              </a>
            </AppButton>
            <AppButton variant="outline" onClick={logout} asChild>
              <Link to="/">Sair e voltar ao início</Link>
            </AppButton>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center bg-muted/50 px-4 py-12">
        <div className="mb-6 flex justify-center">
          <BrandLogo variant="auth" linkToHome />
        </div>
        <div className="w-full min-w-0 max-w-md">
          <Card className="border-destructive/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span className="font-semibold">Conta bloqueada</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              A sua conta foi bloqueada. Contacte o administrador para mais informações.
            </p>
            <AppButton asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Falar com o Admin no WhatsApp
              </a>
            </AppButton>
            <AppButton variant="outline" onClick={logout} asChild>
              <Link to="/">Sair</Link>
            </AppButton>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center bg-muted/50 px-4 py-12">
      <div className="mb-6 flex justify-center">
        <BrandLogo variant="auth" linkToHome />
      </div>
      <div className="w-full min-w-0 max-w-md">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Aguardando ativação</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground">
            Para ativar a sua conta, pague <strong>{feeMzn} MT</strong> ao administrador.
          </p>
          <p className="text-sm text-muted-foreground">
            Após o pagamento, o admin irá aprovar a sua conta e terá acesso ao painel para publicar anúncios.
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            Aguardando confirmação...
          </div>
          <div className="flex flex-col gap-3">
            <AppButton asChild className="gap-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Falar com o Admin no WhatsApp
              </a>
            </AppButton>
            <AppButton variant="outline" onClick={handleVerifyStatus} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Verificar status
            </AppButton>
          </div>
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já pagou? O admin pode demorar algumas horas para aprovar.
      </p>
      <div className="mt-4 flex justify-center">
        <AppButton variant="ghost" asChild>
          <Link to="/">Voltar ao início</Link>
        </AppButton>
      </div>
      </div>
    </div>
  );
}
