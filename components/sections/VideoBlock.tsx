// Office/team video, placed before the blog on a white surface (no heading —
// just the clip). TEMPORARY: embeds the crauch.ru Kinescope clip as a stand-in
// until Vadim supplies the studio's own footage — swap the iframe src (or replace
// with a self-hosted <video>) then.
export function VideoBlock() {
  return (
    <section id="studio" className="bg-white py-[72px] lg:py-[120px]">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-[80px]">
        <div className="relative aspect-video w-full overflow-hidden rounded-card border border-black/10">
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
