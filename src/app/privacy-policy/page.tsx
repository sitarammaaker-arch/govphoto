import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | SignResizer',
  description: 'Privacy policy for SignResizer — how we handle your data.',
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. No Image Storage</h2>
            <p>SignResizer processes all uploaded images <strong>entirely in server memory</strong>. We do not write any images to disk, database, or storage systems. Images are permanently deleted from memory immediately after processing and delivering the response to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Data We Collect</h2>
            <p>We collect minimal technical data to operate the service:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Anonymous usage statistics (page views, feature usage)</li>
              <li>Technical logs for debugging (no personal data)</li>
              <li>Standard server logs (IP addresses, anonymized after 24 hours)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Cookies</h2>
            <p>We use minimal, essential cookies for site functionality. If Google AdSense is enabled, third-party advertising cookies may be set by Google. You can opt out via Google's Ad Settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Third-Party Services</h2>
            <p>We may use Google Analytics for anonymous traffic analysis and Google AdSense for advertising. These services have their own privacy policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Contact</h2>
            <p>For privacy concerns, contact us at: <a href="mailto:privacy@signresizer.com" className="text-sky-600 hover:underline">privacy@signresizer.com</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
