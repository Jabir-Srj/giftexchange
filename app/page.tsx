import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-900 text-cream-100 overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🎁</span>
            <span
              className="text-xl font-bold font-display"
              style={{ color: '#f5c842', textShadow: '0 0 20px rgba(245,200,66,0.4)' }}
            >
              GiftCircle
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-cream-200 hover:text-gold-400 font-medium text-sm px-4 py-2 rounded-full transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-primary-900 font-semibold text-sm px-5 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #f5c842 0%, #e8b020 100%)', boxShadow: '0 4px 20px rgba(245,200,66,0.3)' }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Background blobs */}
        <div
          className="absolute top-20 left-10 w-96 h-96 blob pointer-events-none"
          style={{ background: '#f5c842', opacity: 0.12 }}
        />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 blob pointer-events-none"
          style={{ background: '#ff6b6b', opacity: 0.1 }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blob pointer-events-none"
          style={{ background: '#1e1e55', opacity: 0.6, filter: 'blur(80px)' }}
        />

        {/* Floating decorative cards */}
        <div
          className="absolute top-32 right-8 md:right-20 w-52 glass rounded-2xl p-4 hidden md:block"
          style={{ animation: 'float 6s ease-in-out infinite', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        >
          <div className="text-xs text-gold-400 font-semibold mb-1 uppercase tracking-wider">Family Wishlist</div>
          <div className="text-cream-100 text-sm font-medium">🎸 Guitar Lessons</div>
          <div className="text-cream-300 text-xs mt-1">$120 · Claimed ✓</div>
        </div>

        <div
          className="absolute bottom-40 right-4 md:right-32 w-48 glass rounded-2xl p-4 hidden md:block"
          style={{ animation: 'float 9s ease-in-out infinite 1s', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        >
          <div className="text-xs text-coral-400 font-semibold mb-1 uppercase tracking-wider">Secret Santa 🎅</div>
          <div className="text-cream-100 text-sm font-medium">4 gifts claimed</div>
          <div className="flex gap-1 mt-2">
            {['S','J','M','A'].map(i => (
              <div key={i} className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center text-primary-900 text-xs font-bold">{i}</div>
            ))}
          </div>
        </div>

        <div
          className="absolute top-48 left-4 md:left-24 w-44 glass rounded-2xl p-4 hidden md:block"
          style={{ animation: 'float 7s ease-in-out infinite 0.5s', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        >
          <div className="text-xs text-gold-400 font-semibold mb-2">Budget reached 🎉</div>
          <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full gradient-gold" style={{ width: '80%' }} />
          </div>
          <div className="text-xs text-cream-300 mt-1">$80 / $100</div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-8 glass-gold"
            style={{ color: '#f5c842' }}
          >
            <span>✦</span> Free for everyone · No credit card required
          </div>

          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05]"
            style={{ color: '#fdf6ec' }}
          >
            The art of{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, #f5c842 0%, #fdf6ec 50%, #ff6b6b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              giving,
            </em>
            <br />
            together.
          </h1>

          <p className="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Create a group, share wishlists, and coordinate the perfect gift exchange —
            Secret Santa, birthdays, or just because. No spreadsheets, no stress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 text-primary-900"
              style={{
                background: 'linear-gradient(135deg, #f5c842 0%, #e8b020 100%)',
                boxShadow: '0 8px 32px rgba(245,200,66,0.35)',
              }}
            >
              Start your gift circle →
            </Link>
            <Link
              href="/login"
              className="glass font-bold px-8 py-4 rounded-full text-lg hover:border-gold-400 transition-all"
              style={{ color: '#fdf6ec' }}
            >
              I have an account
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-14 text-sm text-cream-300">
            <div className="flex -space-x-2">
              {['A','B','C','D','E'].map((l, i) => (
                <div
                  key={l}
                  className="w-8 h-8 rounded-full border-2 border-primary-900 flex items-center justify-center text-xs font-bold text-primary-900"
                  style={{ background: ['#f5c842','#ff6b6b','#f5c842','#fdf6ec','#ff6b6b'][i] }}
                >
                  {l}
                </div>
              ))}
            </div>
            <span>Loved by <strong className="text-cream-100">10,000+</strong> families & friend groups</span>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(30,30,85,0.6) 0%, transparent 70%)' }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple by design</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-4">How it works</h2>
            <p className="text-cream-300 text-lg max-w-xl mx-auto">Four elegant steps to gift exchange bliss</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '👥', step: '01', title: 'Create a group', desc: 'Set up your gift exchange circle — Secret Santa, birthday, or any occasion.' },
              { icon: '📧', step: '02', title: 'Invite friends', desc: 'Send invites by email. Everyone joins with a single click.' },
              { icon: '🎀', step: '03', title: 'Build wishlists', desc: 'Each person adds the gifts they\'d love — with links, prices, and notes.' },
              { icon: '🎉', step: '04', title: 'Claim & give', desc: 'Browse wishlists, secretly claim items, coordinate the perfect surprise.' },
            ].map((item, idx) => (
              <div key={item.step} className="relative group">
                {idx < 3 && (
                  <div
                    className="hidden md:block absolute top-8 left-full w-full h-px z-0"
                    style={{ background: 'linear-gradient(90deg, rgba(245,200,66,0.4) 0%, transparent 100%)' }}
                  />
                )}
                <div className="glass rounded-2xl p-6 hover:glass-gold transition-all duration-300 hover:-translate-y-1 relative z-10">
                  <div
                    className="text-3xl font-display font-bold mb-4"
                    style={{ color: 'rgba(245,200,66,0.3)', fontSize: '2.5rem' }}
                  >
                    {item.step}
                  </div>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold text-cream-100 mb-2">{item.title}</h3>
                  <p className="text-cream-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-coral-400 text-sm font-semibold uppercase tracking-widest mb-3">Built for joy</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-4">Everything you need</h2>
            <p className="text-cream-300 text-lg max-w-xl mx-auto">Thoughtfully crafted to make group gifting stress-free</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '🔒', title: 'Secret claiming', desc: 'Claim gifts from others\' wishlists — they never see who\'s getting them what. Pure magic.' },
              { icon: '💰', title: 'Budget setting', desc: 'Set a spending limit for your group so everyone stays on the same page effortlessly.' },
              { icon: '📋', title: 'Smart wishlists', desc: 'Add items with links, prices, and descriptions. Import from any website instantly.' },
              { icon: '📅', title: 'Exchange dates', desc: 'Set a date for the exchange and everyone gets a gentle, timely reminder.' },
              { icon: '🎯', title: 'Pledge tracking', desc: 'Track who\'s pitching in for group gifts and how much each person has pledged.' },
              { icon: '📱', title: 'Mobile-first', desc: 'Works beautifully on any device. Elegant, fast, and always accessible.' },
            ].map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 group hover:glass-gold transition-all duration-300 hover:-translate-y-1"
                style={{ cursor: 'default' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.2)' }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-cream-100 mb-2">{f.title}</h3>
                <p className="text-cream-300 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom, rgba(255,107,107,0.05) 0%, transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">Loved by thousands</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-4">Real joy, real stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah M.',
                role: 'Organized 4 Secret Santas',
                initials: 'SM',
                color: '#f5c842',
                stars: 5,
                text: '"GiftCircle completely transformed our family Christmas. Everyone knew exactly what to get — no awkward duplicates, no last-minute panic. Absolute game-changer."',
              },
              {
                name: 'James K.',
                role: 'Birthday Group Coordinator',
                initials: 'JK',
                color: '#ff6b6b',
                stars: 5,
                text: '"I\'ve tried spreadsheets, group chats, everything. GiftCircle is the only thing that actually works. Beautiful interface, dead simple to use. 10/10."',
              },
              {
                name: 'Priya L.',
                role: 'Office Party Organizer',
                initials: 'PL',
                color: '#fdf6ec',
                stars: 5,
                text: '"Our team of 30 used GiftCircle for our office exchange and it went flawlessly. The secret claiming feature kept all the surprises intact. Magical!"',
              },
            ].map((t) => (
              <div key={t.name} className="glass rounded-2xl p-7 flex flex-col gap-5">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} style={{ color: '#f5c842' }}>★</span>
                  ))}
                </div>
                <p className="text-cream-200 text-sm leading-relaxed italic flex-1">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-900 flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-cream-100 font-semibold text-sm">{t.name}</div>
                    <div className="text-cream-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1e1e55 0%, #0f0f1a 50%, #2a1a2e 100%)' }}
        />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 blob pointer-events-none"
          style={{ background: '#f5c842', opacity: 0.08 }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 blob pointer-events-none"
          style={{ background: '#ff6b6b', opacity: 0.07 }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="text-5xl mb-6">🎄</div>
          <h2
            className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ color: '#fdf6ec' }}
          >
            Ready to spread{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f5c842, #ff6b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              some joy?
            </span>
          </h2>
          <p className="text-cream-300 text-xl mb-10 leading-relaxed">
            Join thousands of families and friend groups who make their gift exchanges unforgettable with GiftCircle.
          </p>
          <Link
            href="/signup"
            className="inline-block font-bold px-12 py-5 rounded-full text-lg transition-all hover:scale-105 text-primary-900"
            style={{
              background: 'linear-gradient(135deg, #f5c842 0%, #e8b020 100%)',
              boxShadow: '0 12px 40px rgba(245,200,66,0.4)',
            }}
          >
            Create your free account →
          </Link>
          <p className="text-cream-400 text-sm mt-5">No credit card · Takes 30 seconds</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-16" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#08080e' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎁</span>
                <span
                  className="text-xl font-bold font-display"
                  style={{ color: '#f5c842' }}
                >
                  GiftCircle
                </span>
              </div>
              <p className="text-cream-400 text-sm leading-relaxed">
                Making every occasion worth celebrating. Built with love for families, friends, and coworkers everywhere.
              </p>
            </div>
            <div className="flex gap-16 text-sm">
              <div>
                <div className="text-cream-100 font-semibold mb-4">Product</div>
                <div className="flex flex-col gap-2 text-cream-400">
                  <Link href="/signup" className="hover:text-gold-400 transition-colors">Get started</Link>
                  <Link href="/login" className="hover:text-gold-400 transition-colors">Sign in</Link>
                  <a href="#" className="hover:text-gold-400 transition-colors">How it works</a>
                </div>
              </div>
              <div>
                <div className="text-cream-100 font-semibold mb-4">Company</div>
                <div className="flex flex-col gap-2 text-cream-400">
                  <a href="#" className="hover:text-gold-400 transition-colors">About</a>
                  <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
                </div>
              </div>
              <div>
                <div className="text-cream-100 font-semibold mb-4">Connect</div>
                <div className="flex flex-col gap-2 text-cream-400">
                  <a href="#" className="hover:text-gold-400 transition-colors">Twitter</a>
                  <a href="#" className="hover:text-gold-400 transition-colors">Instagram</a>
                  <a href="#" className="hover:text-gold-400 transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </div>
          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-cream-500 text-xs"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span>© 2026 GiftCircle. Made with ❤️ for every occasion worth celebrating.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
