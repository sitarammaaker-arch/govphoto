export default function ExamPresets() {
  const exams = [
    {
      name: 'SSC',
      full: 'Staff Selection Commission',
      photo: '20–50 KB, JPEG, White BG',
      signature: '10–20 KB, JPEG',
      dims: '3.5×4.5 cm',
      color: 'bg-blue-50 border-blue-100',
      badge: 'bg-blue-500',
    },
    {
      name: 'UPSC',
      full: 'Union Public Service Commission',
      photo: '20–300 KB, JPEG',
      signature: '20–300 KB, JPEG',
      dims: '200×230 px',
      color: 'bg-purple-50 border-purple-100',
      badge: 'bg-purple-500',
    },
    {
      name: 'Railway',
      full: 'RRB / RRC Exams',
      photo: '20–50 KB, JPEG',
      signature: '10–20 KB, JPEG',
      dims: '3.5×4.5 cm',
      color: 'bg-orange-50 border-orange-100',
      badge: 'bg-orange-500',
    },
    {
      name: 'Banking',
      full: 'IBPS / SBI / RBI',
      photo: '20–50 KB, JPEG',
      signature: '10–20 KB, JPEG',
      dims: '200×230 px',
      color: 'bg-green-50 border-green-100',
      badge: 'bg-green-500',
    },
    {
      name: 'CET',
      full: 'Common Eligibility Test',
      photo: '20–50 KB, JPEG',
      signature: '10–20 KB, JPEG',
      dims: '3.5×4.5 cm',
      color: 'bg-teal-50 border-teal-100',
      badge: 'bg-teal-500',
    },
    {
      name: 'Police',
      full: 'State & Central Police',
      photo: '20–50 KB, JPEG',
      signature: '10–20 KB, JPEG',
      dims: '3.5×4.5 cm',
      color: 'bg-red-50 border-red-100',
      badge: 'bg-red-500',
    },
  ];

  return (
    <section id="exams" className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title">Photo Size Requirements by Exam</h2>
          <p className="section-sub">Quick reference guide for major Indian government examinations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <div key={exam.name} className={`rounded-2xl border p-5 ${exam.color} hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`${exam.badge} text-white text-sm font-bold px-3 py-1 rounded-lg`}>{exam.name}</span>
                <span className="text-sm text-slate-600 font-medium">{exam.full}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 mt-0.5">📷</span>
                  <div>
                    <span className="font-semibold text-slate-700">Photo: </span>
                    <span className="text-slate-600">{exam.photo}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 mt-0.5">✍️</span>
                  <div>
                    <span className="font-semibold text-slate-700">Signature: </span>
                    <span className="text-slate-600">{exam.signature}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 mt-0.5">📐</span>
                  <div>
                    <span className="font-semibold text-slate-700">Size: </span>
                    <span className="text-slate-600">{exam.dims}</span>
                  </div>
                </div>
              </div>

              <a
                href="#tool"
                className="mt-4 inline-block w-full text-center py-2 rounded-lg text-sm font-semibold text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 hover:border-sky-400 transition-colors"
              >
                Resize for {exam.name} →
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          * Requirements may vary by notification. Always verify with the official exam notification before submitting.
        </p>
      </div>
    </section>
  );
}
