"use client";

import Link from "next/link";
import { ShoppingCart, PackageSearch, History, Menu, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Disclosure } from "@headlessui/react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

export const NavLink = ({ href, icon, label, badge }: NavLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        "relative flex items-center gap-1 transition-colors",
        pathname === href
          ? "text-custom-gray-lightest font-bold"
          : "text-custom-light font-semibold"
      )}
    >
      {icon}
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-2 -right-3 bg-custom-gray-dark text-custom-gray-lightest text-xs font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

export const Navbar = () => {
  const cartCount = useStore((s) => s.cart.reduce((n, i) => n + i.quantity, 0));

  return (
    <Disclosure
      as="nav"
      className="w-screen top-0 z-50 border-b border-custom-dark/10 bg-custom-dark backdrop-blur-md"
    >
      {({ open }) => (
        <>
          <div className="flex justify-between items-center py-5 px-10 ">
            {/* Brand */}
            <Link
              href="/"
              className="font-bold tracking-tight text-lg text-custom-gray-lightest hover:text-custom-accent-medium transition-colors"
            >
              NextStore
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <NavLink
                href="/"
                icon={<PackageSearch size={16} />}
                label="Products"
              />

              <NavLink
                href="/cart"
                icon={<ShoppingCart size={16} />}
                label="Cart"
                badge={cartCount}
              />
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <Disclosure.Button
                aria-label="button-mobile"
                className="p-2 rounded-md text-custom-gray-light hover:bg-custom-accent-cool/10 focus:outline-none"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </Disclosure.Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="md:hidden px-4 pb-4 space-y-2">
            <NavLink
              href="/"
              icon={<PackageSearch size={16} />}
              label="Products"
            />

            <NavLink
              href="/cart"
              icon={<ShoppingCart size={16} />}
              label="Cart"
              badge={cartCount}
            />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
