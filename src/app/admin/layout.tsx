'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, DollarSign, CreditCard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/job-validation', label: 'Job Validation', icon: LayoutDashboard },
    { href: '/admin/credit-management', label: 'Credit Management', icon: CreditCard },
    { href: '/admin/financial-metrics', label: 'Financial Metrics', icon: DollarSign },
  ];

  return (
    <div className='h-screen flex flex-col bg-gray-50'>
      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between'>
        <h1 className='text-xl font-bold font-roboto text-gray-900'>Admin Dashboard</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className='p-2 rounded-lg hover:bg-gray-100'>
          {sidebarOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar - Desktop & Mobile */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-white border-r border-gray-200
            flex flex-col
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Header - Desktop Only */}
          <div className='hidden lg:block px-6 py-6 border-b border-gray-200 shrink-0'>
            <h1 className='text-2xl font-bold font-roboto text-gray-900'>Admin Dashboard</h1>
            <p className='text-sm font-inter text-gray-500 mt-1'>Internal Tools</p>
          </div>

          {/* Navigation Menu - Scrollable if needed */}
          <nav className='p-4 space-y-2 overflow-y-auto flex-1'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    font-inter text-sm transition-colors
                    ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <Icon className='h-5 w-5' />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && <div className='fixed inset-0 bg-black/50 z-30 lg:hidden' onClick={() => setSidebarOpen(false)} />}

        {/* Main Content - Independently Scrollable */}
        <main className='flex-1 overflow-y-auto'>
          <div className='p-4 lg:p-8'>{children}</div>
        </main>
      </div>
    </div>
  );
}
