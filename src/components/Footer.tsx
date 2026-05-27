import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-cream">
      {/* Gold accent divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-gold mb-4">
              Amaka Fashion Atelier
            </h3>
            <p className="text-cream/70 text-sm leading-relaxed">
              Crafting the Modern Nigerian Gentleman. Luxury menswear that blends
              Nigerian heritage with contemporary elegance.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-cream/70 hover:text-gold transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-cream/70 hover:text-gold transition-colors text-sm"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/lookbook"
                  className="text-cream/70 hover:text-gold transition-colors text-sm"
                >
                  Lookbook
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-cream/70 hover:text-gold transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-cream/70 hover:text-gold transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-gold mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm text-cream/70">
              <p>Abakaliki, Ebonyi State, Nigeria</p>
              <a
                href="https://wa.me/2349131272407"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:text-gold transition-colors"
              >
                WhatsApp: +234 913 127 2407
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream/10 text-center">
          <p className="text-cream/50 text-sm">
            &copy; {new Date().getFullYear()} Amaka Fashion Atelier. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
