// src/components/layout/Sidebar.tsx
import {
  CurrencyDollarIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Clientes", href: "/clients", icon: UserGroupIcon },
  { name: "Negócios", href: "/deals", icon: CurrencyDollarIcon },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={clsx(
                      isActive
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
