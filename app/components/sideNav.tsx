'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';
import { Home, PlusCircle, Clock, TreesIcon } from 'lucide-react';

const navItems = [
  { href: '/', label: '概况', icon: Home },
  { href: '/new', label: '编辑新记录', icon: PlusCircle },
  { href: '/history', label: '历史记录', icon: Clock },
  { href: '/treehole', label: '树洞', icon: TreesIcon },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-56 bg-white shadow-sm p-4 flex flex-col gap-2">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-sky-100 hover:text-blue-600',
            {
              'bg-sky-100 text-blue-600 font-semibold': pathname === href,
            }
          )}
        >
          <Icon size={18} />
          <span className="text-base">{label}</span>
        </Link>
      ))}
    </div>
  );
}
