import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Search, User, Menu, X } from "lucide-react";

export const SITE = "https://www.iamanartist.art";
export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Cursor() {
  const [active, setActive] = useState(false);
  const [fine, setFine] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setFine(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setActive(!!(e.target as Element | null)?.closest?.("[data-cursor]"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  if (!fine) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[80] -ml-10 -mt-10"
    >
      <motion.div
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="grid h-20 w-20 place-items-center rounded-full bg-ink text-[11px] font-medium uppercase tracking-[0.12em] text-ink-foreground mix-blend-difference"
      >
        View
      </motion.div>
    </motion.div>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-2 text-[15px] font-medium ${className}`}>
      <span className="link-line pb-0.5">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 60);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [
    ["Shop", `${SITE}/shop`],
    ["View Artists", `${SITE}/artists`],
    ["Join as Artist", "/join"],
  ];
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-border bg-background/90 py-4 backdrop-blur-xl" : "border-b border-transparent py-6"
        }`}
      >
        <div className="container-x flex items-center justify-between">
          <a href="/" className="text-[13px] font-semibold tracking-[0.14em]">I AM AN ARTIST</a>
          <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
            {links.map(([l, h], i) => (
              <a key={l} href={h} className={`link-line text-sm font-medium hover:opacity-70 ${i === 2 ? "inline-flex items-center gap-1" : ""}`}>
                {l}
                {i === 2 && <ArrowUpRight className="h-3.5 w-3.5" />}
              </a>
            ))}
            <button aria-label="Search" className="opacity-80 transition-opacity hover:opacity-100"><Search className="h-[18px] w-[18px]" /></button>
            <button aria-label="Account" className="opacity-80 transition-opacity hover:opacity-100"><User className="h-[18px] w-[18px]" /></button>
          </nav>
          <button className="md:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu className="h-6 w-6" /></button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-x flex items-center justify-between py-6">
              <span className="text-[13px] font-semibold tracking-[0.14em]">I AM AN ARTIST</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-6 w-6" /></button>
            </div>
            <nav className="container-x mt-12 flex flex-col">
              {[...links, ["Art for Spaces", "#spaces"]].map(([l, h], i) => (
                <motion.a
                  key={l}
                  href={h}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 border-b border-border py-4"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.6, ease: EASE }}
                >
                  <span className="eyebrow text-muted-foreground">0{i + 1}</span>
                  <span className="text-[44px] font-semibold leading-none tracking-[-0.04em] transition-transform duration-300 group-hover:translate-x-2">
                    {l}
                  </span>
                </motion.a>
              ))}
            </nav>
            <p className="eyebrow container-x mt-auto pb-10 text-muted-foreground">Lusaka, Zambia</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const col = "flex flex-col gap-3 text-sm";
  return (
    <footer className="border-t border-border">
      <div className="container-x grid gap-12 py-20 md:grid-cols-4">
        <p className="text-[13px] font-semibold tracking-[0.14em]">I AM AN ARTIST</p>
        <nav className={col} aria-label="Footer">
          <a className="link-line w-fit" href={`${SITE}/shop`}>Shop</a>
          <a className="link-line w-fit" href={`${SITE}/artists`}>Artists</a>
          <a className="link-line w-fit" href={"/join"}>Join as Artist</a>
          <a className="link-line w-fit" href="#spaces">Art for Spaces</a>
          <a className="link-line w-fit" href={SITE}>About</a>
        </nav>
        <div className={col}>
          <a className="link-line w-fit" href="https://instagram.com">Instagram</a>
          <a className="link-line w-fit" href={SITE}>Contact</a>
        </div>
        <div className="text-sm text-muted-foreground md:text-right">
          <p>Zambia</p>
          <p className="mt-3">© 2026 I Am An Artist</p>
        </div>
      </div>
    </footer>
  );
}

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.05] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
