/**
 * Footer untuk area publik
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-sm text-gray-600">School Management System</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; {currentYear} School Dashboard. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
