const footerLinks = [
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Syarat Layanan", href: "#" },
  { label: "Kontak", href: "#" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-sm text-gray-600 font-medium">School Management System</span>
          </div>

          <p className="text-sm text-gray-500">
            &copy; {currentYear} Sekolah Dashboard. Semua hak dilindungi.
          </p>

          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
