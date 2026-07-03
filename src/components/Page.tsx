// Layout-primitiver för sidor. `Page` sätter bredd + padding (smal som standard,
// bred för sidor med rutnät). `Prose` slår på typografi för MDX-innehåll.

export function Page({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  // wide = 6xl (för rutnät t.ex. Läslistan). Standard = 2xl (behagliga textrader).
  wide?: boolean;
}) {
  // pt-16 lämnar plats åt den fixerade toggle-knappen längst upp
  return (
    <div
      className={
        "mx-auto px-6 pb-16 pt-16 md:px-10 " +
        (wide ? "max-w-6xl" : "max-w-2xl")
      }
    >
      {children}
    </div>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <article className="prose">{children}</article>;
}
