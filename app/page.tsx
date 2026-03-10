import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <span className="text-xl font-bold text-orange-600">GiftCircle</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-full transition-colors shadow-sm"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>✨</span> Free for everyone
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
          Gift exchanges,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            made magical
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Create a group, share wishlists, and coordinate the perfect gift exchange — whether it's Secret Santa, a birthday, or just because. No spreadsheets required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start your gift circle →
          </Link>
          <Link
            href="/login"
            className="border-2 border-orange-200 hover:border-orange-400 text-orange-600 font-bold px-8 py-4 rounded-full text-lg transition-colors"
          >
            I have an account
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How it works</h2>
          <p className="text-center text-gray-500 mb-16 text-lg">Four simple steps to gift exchange bliss</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '👥', step: '1', title: 'Create a group', desc: 'Set up your gift exchange circle — Secret Santa, birthday group, or any occasion.' },
              { icon: '📧', step: '2', title: 'Invite friends', desc: 'Send invites by email. Everyone joins with a single click, no app download needed.' },
              { icon: '🎀', step: '3', title: 'Build wishlists', desc: 'Each person adds the gifts they\'d love to receive — with links, prices, and notes.' },
              { icon: '🎉', step: '4', title: 'Claim & give', desc: 'Browse others\' wishlists, secretly claim items, and coordinate the perfect surprise.' },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:bg-orange-100 transition-colors">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-orange-500 mb-1">Step {item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Everything you need</h2>
          <p className="text-center text-gray-500 mb-16 text-lg">Built to make group gifting stress-free</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Secret claiming', desc: 'Claim gifts from others\' wishlists — they never see who\'s getting them what.' },
              { icon: '💰', title: 'Budget setting', desc: 'Set a spending limit for your group so everyone stays on the same page.' },
              { icon: '📋', title: 'Smart wishlists', desc: 'Add items with links, prices, and descriptions. Import from any website.' },
              { icon: '📅', title: 'Exchange dates', desc: 'Set a date for the exchange and everyone gets a gentle reminder.' },
              { icon: '🎯', title: 'Pledge tracking', desc: 'Track who\'s pitching in for group gifts and how much each person pledged.' },
              { icon: '📱', title: 'Mobile friendly', desc: 'Works beautifully on any device — no app install required.' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 py-24 px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to spread some joy? 🎄</h2>
        <p className="text-orange-100 text-xl mb-10 max-w-xl mx-auto">
          Join thousands of families and friend groups who use GiftCircle to make their gift exchanges unforgettable.
        </p>
        <Link
          href="/signup"
          className="bg-white text-orange-600 font-bold px-10 py-4 rounded-full text-lg hover:bg-orange-50 transition-colors shadow-lg inline-block"
        >
          Create your free account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🎁</span>
          <span className="text-white font-semibold">GiftCircle</span>
        </div>
        <p>Made with ❤️ for every occasion worth celebrating.</p>
      </footer>
    </div>
  )
}
