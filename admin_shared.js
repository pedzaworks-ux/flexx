// admin_shared.js

export function loadAdminMobileNav(activePage = "") {
  const nav = document.createElement("nav");
  nav.className = "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-md lg:hidden z-50";

  const pages = [
    { href: "admin_dashboard.html", label: "Dashboard", icon: homeIcon() },
    { href: "admin_orders.html", label: "Orders", icon: ordersIcon() },
    { href: "admin_users.html", label: "Users", icon: usersIcon() },
    { href: "admin_products.html", label: "Products", icon: productsIcon() },
    { href: "admin_categories.html", label: "Categories", icon: categoriesIcon() },
    { href: "admin_stock.html", label: "Stock", icon: stockIcon() },
  ];

  nav.innerHTML = pages.map(p => `
    <a href="${p.href}" class="flex flex-col items-center text-xs ${activePage === p.href ? 'text-blue-700 font-semibold' : 'text-gray-700 hover:text-blue-700'}">
      ${p.icon}
      ${p.label}
    </a>
  `).join("");

  document.body.appendChild(nav);
}



// Icon functions
function homeIcon() {
  return `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2"
    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" 
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-4a2 2 0 01-2-2H9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
  </svg>`;
}

function ordersIcon() {
  return `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2"
    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" 
      d="M9 17v-6h13v6M9 10V7a2 2 0 012-2h4a2 2 0 012 2v3"/>
  </svg>`;
}

function usersIcon() {
  return `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2"
    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" 
      d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"/>
  </svg>`;
}

function productsIcon() {
  return `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2"
    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" 
      d="M20 13V6a2 2 0 00-2-2h-5.586A2 2 0 0011 3.414L9.414 5H6a2 2 0 00-2 2v7"/>
    <path stroke-linecap="round" stroke-linejoin="round" 
      d="M3 13h18v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z"/>
  </svg>`;
}

function categoriesIcon() {
  return `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2"
    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M4 6h16M4 12h16M4 18h7"/>
  </svg>`;
}

function stockIcon() {
  return `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2"
    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M4 4h16v16H4V4z"/>
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M4 9h16M9 4v16"/>
  </svg>`;
}
