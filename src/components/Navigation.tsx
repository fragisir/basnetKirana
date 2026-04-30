"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, CreditCard, FileText, UserPlus, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", nepali: "ड्यासबोर्ड", href: "/", icon: Home },
  { name: "Customers", nepali: "ग्राहक", href: "/customers", icon: Users },
  { name: "Transactions", nepali: "कारोबार", href: "/transactions", icon: CreditCard },
  { name: "Reports", nepali: "रिपोर्ट", href: "/reports", icon: FileText },
  { name: "Add Customer", nepali: "नयाँ ग्राहक", href: "/customers/new", icon: UserPlus },
];

export function Navigation() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-50 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary w-11 h-11 rounded-xl flex items-center justify-center text-white">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">Pasal Udhaar</h1>
              <p className="text-xs font-semibold text-slate-500">Basnet Khadnya</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[15px] font-semibold",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={20} />
                <span>{item.nepali}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-bottom">
        <div className="flex justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors min-w-[64px]",
                  isActive ? "text-primary" : "text-slate-400"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn(
                  "text-[11px]",
                  isActive ? "font-bold" : "font-medium"
                )}>
                  {item.nepali}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
