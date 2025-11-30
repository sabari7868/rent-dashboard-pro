import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -260 }}
        animate={{ x: mobileMenuOpen ? 0 : -260 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 z-40 md:hidden"
      >
        <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
      </motion.div>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:block"
      >
        <TopNav onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </motion.main>

      {/* Mobile Main Content */}
      <div className="md:hidden">
        <TopNav onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
