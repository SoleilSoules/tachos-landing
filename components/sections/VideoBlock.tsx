// Office/team video, placed before the blog. TEMPORARY: embeds the crauch.ru
// Kinescope clip as a stand-in until Vadim supplies the studio's own footage —
// just swap the iframe src (or replace with a self-hosted <video>) then.
export function VideoBlock() {
  return (
    <section id="studio" className="bg-bg py-[120px] text-inverted">
      <div className="mx-auto max-w-page px-[80px]">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="text-[52px] font-semibold leading-[1.0] tracking-[-0.02em]">Студия изнутри</h2>
          <p className="mx-auto mt-[20px] max-w-[520px] text-[19px] leading-[1.4] text-inverted/55">
            Как устроена работа в Tachos — команда, процессы и атмосфера в одном ролике.
          </p>
        </div>
        <div className="relative mt-[48px] aspect-video w-full overflow-hidden rounded-card border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
          <iframe
            src="https://kinescope.io/embed/nGzuTWL7hcR9SSZHhk1e2i?autoplay=1&muted=1&loop=1"
            title="Студия Tachos изнутри"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
