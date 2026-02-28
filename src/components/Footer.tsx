export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-white text-lg leading-none block">GovPhoto Resizer</span>
                <span className="text-xs text-slate-400">Government Job Form Tool</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-sm">
              India's fastest free photo & signature resizer for government job forms. Supports SSC, UPSC, Railway, Banking, and all major exam requirements.
            </p>
            <div className="flex gap-3">
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">🔒 No Storage</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">✅ Free Forever</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">🇮🇳 Made for India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#tool" className="hover:text-sky-400 transition-colors">Resize Tool</a></li>
              <li><a href="#exams" className="hover:text-sky-400 transition-colors">Exam Requirements</a></li>
              <li><a href="#how-it-works" className="hover:text-sky-400 transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-sky-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy-policy" className="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/disclaimer" className="hover:text-sky-400 transition-colors">Disclaimer</a></li>
              <li><a href="/terms" className="hover:text-sky-400 transition-colors">Terms of Use</a></li>
              <li><a href="mailto:contact@govphoto.in" className="hover:text-sky-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-800 pt-6 mb-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> GovPhoto Resizer is an independent utility tool and is not affiliated with, endorsed by, or connected to any government organization, SSC, UPSC, Railway Board, or any exam conducting authority. Photo and signature size requirements may change with each notification. Always verify the exact requirements from the official exam notification before submission.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} GovPhoto Resizer. All rights reserved.</p>
          <p>Built with ❤️ for Indian government job aspirants</p>
        </div>
      </div>
    </footer>
  );
}
