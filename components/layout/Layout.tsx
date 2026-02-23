import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * Layout principal: header fixo, conteúdo central, footer.
 */
export function Layout() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-muted/30">
      <Header />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
