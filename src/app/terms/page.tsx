import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Use | Sign Resizer',
};

export default function Terms() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Use</h1>
        <p className="text-slate-500 mb-8">Last updated: January 2025</p>

        <div className="space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance</h2>
            <p>By using Sign Resizer, you agree to these terms. The service is provided free of charge for personal, non-commercial use.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Permitted Use</h2>
            <p>You may use this tool to resize your own photos and signatures for government job applications. You must not use the service for any unlawful purpose or upload images of others without their consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Service Availability</h2>
            <p>We strive to maintain 99%+ uptime but do not guarantee uninterrupted access. The service may be temporarily unavailable for maintenance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Contact</h2>
            <p>For questions about these terms: <a href="mailto:legal@signresizer.com" className="text-sky-600 hover:underline">legal@signresizer.com</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
