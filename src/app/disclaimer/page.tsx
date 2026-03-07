import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Disclaimer | SignResizer',
  description: 'Disclaimer for SignResizer — important information about usage.',
};

export default function Disclaimer() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Disclaimer</h1>
        <p className="text-slate-500 mb-8">Last updated: January 2025</p>

        <div className="space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">No Official Affiliation</h2>
            <p>SignResizer is an independent utility tool. We are <strong>not affiliated with, endorsed by, or connected to</strong> any government organization including SSC, UPSC, Railway Recruitment Board, IBPS, SBI, NTA, or any other exam conducting authority in India.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Accuracy of Requirements</h2>
            <p>Photo and signature size requirements may change with each exam notification. The specifications shown on this website are based on commonly used requirements as of the last update. <strong>Always verify the exact requirements from the official exam notification</strong> before uploading your application.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Limitation of Liability</h2>
            <p>SignResizer shall not be held liable for any rejection of applications due to incorrect photo or signature specifications. It is the user's responsibility to verify the requirements from official sources.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Contact</h2>
            <p>Questions? Email us at: <a href="mailto:contact@signresizer.com" className="text-sky-600 hover:underline">contact@signresizer.com</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
