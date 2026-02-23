import { Link } from 'react-router-dom';
import { MessageCircle, Clock } from 'lucide-react';
import { LIMITS, APP_NAME } from '../lib/constants';
import { useApp } from '@/context/AppContext';
import { getAdminWhatsapp, getActivationFeeMzn } from '@/lib/settingsHelpers';

/**
 * Tela exibida quando o vendedor está com status PENDING.
 * Explica que deve pagar X MT ao admin via WhatsApp para ativar a conta.
 */
export function PendingApproval() {
  const { publicSettings } = useApp();
  const adminWa = getAdminWhatsapp(publicSettings);
  const feeMzn = getActivationFeeMzn(publicSettings);
  const whatsappUrl = `https://wa.me/${adminWa}?text=Olá! Criei conta no ${APP_NAME} e quero ativar. Pagamento de ${feeMzn} MT.`;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <Clock size={48} className="mx-auto text-amber-600" />
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Conta pendente de ativação</h1>
        <p className="mt-4 text-slate-700">
          Para ativar a sua conta e começar a publicar anúncios, é necessário pagar{' '}
          <strong>{feeMzn} MT</strong> directamente ao administrador via WhatsApp.
        </p>
        <p className="mt-4 text-slate-600 text-sm">
          Após o pagamento, o admin irá aprovar a sua conta e você terá acesso ao painel para criar até{' '}
          {LIMITS.MAX_PRODUCTS} produtos e {LIMITS.MAX_SERVICES} serviços.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          <MessageCircle size={22} />
          Contactar admin no WhatsApp
        </a>
      </div>
      <p className="mt-6 text-slate-500 text-sm">
        Já pagou? O admin pode demorar algumas horas para aprovar. Em caso de dúvida, use o botão acima.
      </p>
      <Link to="/" className="mt-4 inline-block text-emerald-600 hover:underline">
        Voltar ao início
      </Link>
    </div>
  );
}
