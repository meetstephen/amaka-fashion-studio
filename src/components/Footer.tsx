import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="relative bg-black text-cream grain-overlay">
      {/* Gold hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Logo wordmarkClass="text-gold-light" showWordmark showSubtitle />
            <p className="mt-6 max-w-md text-sm text-cream/65 leading-relaxed">
              Bespoke menswear hand-finished in Abakaliki. We craft for the
              gentleman who walks between worlds with quiet authority.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "Italian wool",
                "Egyptian cotton",
                "Aso-Oke",
                "French linen",
                "Hand-finished",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full border border-gold/25 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold/85"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.32em] text-gold mb-5">
              Atelier
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/collections", label: "Collections" },
                { href: "/lookbook", label: "Lookbook" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-cream/65 hover:text-gold transition-colors text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.32em] text-gold mb-5">
              Find Us
            </h4>
            <address className="not-italic space-y-3 text-sm text-cream/65">
              <p>Abakaliki, Ebonyi State, Nigeria</p>
              <a
                href="https://wa.me/2349131272407"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-gold transition-colors"
              >
                WhatsApp · +234 913 127 2407
              </a>
              <a
                href="tel:+2349131272407"
                className="block hover:text-gold transition-colors"
              >
                Phone · +234 913 127 2407
              </a>
              <p className="text-xs text-cream/45 pt-3">
                Mon - Fri · 9:00 AM - 6:00 PM
                <br />
                Sat · 10:00 AM - 4:00 PM
                <br />
                Sun · By appointment
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-cream/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[10px] uppercase tracking-[0.32em] text-cream/45">
          <p>
            &copy; {new Date().getFullYear()} Amaka Fashion Atelier · All rights
            reserved.
          </p>
          <p className="italic font-heading text-cream/65 normal-case tracking-normal">
            Where heritage meets distinction.
          </p>
        </div>
      </div>
    </footer>
  );
}
