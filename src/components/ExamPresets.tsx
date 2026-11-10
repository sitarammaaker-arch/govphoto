export default function ExamPresets() {
  const exams = [
    {
      name: 'SSC',
      full: 'Staff Selection Commission',
      photo: '20–50 KB, JPEG, White BG',
      signature: '10–20 KB, JPEG',
      dims: '3.5×4.5 cm',
    },
    {
      name: 'UPSC',
      full: 'Union Public Service Commission',
      photo: '20–300 KB, JPEG',
      signature: '20–300 KB, JPEG',
      dims: '200×230 px',
    },
    {
      name: 'Railway',
      full: 'RRB / RRC Exams',
      photo: '20–50 KB, JPEG',
      signature: '10–20 KB, JPEG',
      dims: '3.5×4.5 cm',
    },
    {
      name: 'Banking',
      full: 'IBPS / SBI / RBI',
      photo: '20–50 KB, JPEG',
      signature: '10–20 KB, JPEG',
      dims: '200×230 px',
    },
    {
      name: 'CET',
      full: 'Common Eligibility Test',
      photo: '20–50 KB, JPEG',
      signature: '10–20 KB, JPEG',
      dims: '3.5×4.5 cm',
    },
    {
      name: 'Police',
      full: 'State & Central Police',
      photo: '20–50 KB, JPEG',
      signature: '10–20 KB, JPEG',
      dims: '3.5×4.5 cm',
    },
  ];

  return (
    <section id="exams" className="py-14 sm:py-20 bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title">Photo Size Requirements by Exam</h2>
          <p className="section-sub">Quick reference guide for major Indian government examinations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <div key={exam.name} className="rounded-2xl border border-border bg-surface p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-on-primary text-sm font-bold px-3 py-1 rounded-lg">{exam.name}</span>
                <span className="text-sm text-muted font-medium">{exam.full}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-subtle mt-0.5">📷</span>
                  <div>
                    <span className="font-semibold text-text">Photo: </span>
                    <span className="text-muted">{exam.photo}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-subtle mt-0.5">✍️</span>
                  <div>
                    <span className="font-semibold text-text">Signature: </span>
                    <span className="text-muted">{exam.signature}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-subtle mt-0.5">📐</span>
                  <div>
                    <span className="font-semibold text-text">Size: </span>
                    <span className="text-muted">{exam.dims}</span>
                  </div>
                </div>
              </div>

              <a
                href="#tool"
                className="mt-4 inline-block w-full text-center py-2 rounded-lg text-sm font-semibold text-link bg-surface hover:bg-primary-soft border border-border hover:border-primary transition-colors"
              >
                Resize for {exam.name} →
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-subtle mt-6">
          * Requirements may vary by notification. Always verify with the official exam notification before submitting.
        </p>
      </div>
    </section>
  );
}
