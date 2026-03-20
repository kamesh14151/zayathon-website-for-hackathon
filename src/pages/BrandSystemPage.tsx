import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import BrandWordmark from "@/components/BrandWordmark";
import SectionPageLayout from "@/components/SectionPageLayout";
import { Button } from "@/components/ui/button";

const colorTokens = [
  { name: "Background", varName: "--background", sample: "hsl(var(--background))" },
  { name: "Foreground", varName: "--foreground", sample: "hsl(var(--foreground))" },
  { name: "Primary", varName: "--primary", sample: "hsl(var(--primary))" },
  { name: "Primary Foreground", varName: "--primary-foreground", sample: "hsl(var(--primary-foreground))" },
  { name: "Secondary", varName: "--secondary", sample: "hsl(var(--secondary))" },
  { name: "Muted", varName: "--muted", sample: "hsl(var(--muted))" },
  { name: "Border", varName: "--border", sample: "hsl(var(--border))" },
  { name: "Accent", varName: "--accent", sample: "hsl(var(--accent))" },
];

const spacingTokens = [
  { label: "XS", className: "w-2", value: "8px" },
  { label: "S", className: "w-4", value: "16px" },
  { label: "M", className: "w-6", value: "24px" },
  { label: "L", className: "w-8", value: "32px" },
  { label: "XL", className: "w-12", value: "48px" },
  { label: "2XL", className: "w-16", value: "64px" },
];

const fullTokenBlock = `:root {
${colorTokens.map((token) => `  ${token.varName}: <set-value>;`).join("\n")}
}

/* Tailwind token usage */
${colorTokens.map((token) => `${token.name}: ${token.sample};`).join("\n")}

/* Typography */
display: font-display text-4xl;
body: font-body text-base text-muted-foreground;
label: text-xs uppercase tracking-[0.2em] text-muted-foreground;

/* Spacing */
${spacingTokens.map((token) => `${token.label}: ${token.className} /* ${token.value} */`).join("\n")}

/* Core UI */
button-primary: bg-primary text-primary-foreground rounded-full;
status-approved: bg-green-500/10 text-green-700 border border-green-500/40;
surface-card: rounded-[2rem] border bg-card text-card-foreground;`;

const BrandSystemPage = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToken = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1200);
    } catch {
      setCopiedKey(null);
    }
  };

  return (
    <SectionPageLayout>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Design Documentation</p>
            <h1 className="font-display text-5xl md:text-6xl text-foreground tracking-tight mb-4">Brand System</h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              A dedicated reference for the visual language used across the ZayaThon website,
              including palette, typography, spacing rhythm, and core UI tokens.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glow-card p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Wordmark</p>
            <div className="flex flex-wrap items-center gap-6">
              <BrandWordmark className="text-4xl md:text-6xl font-black" />
              <p className="text-sm text-muted-foreground max-w-xl">
                Brand wordmark uses custom Orenza style with split emphasis:
                <span className="text-[#f97316] font-semibold"> Zaya</span>
                <span className="text-foreground font-semibold">Thon</span>.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glow-card p-8"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Color Palette Tokens</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => copyToken("all-tokens", fullTokenBlock)}
              >
                {copiedKey === "all-tokens" ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {copiedKey === "all-tokens" ? "Copied All Tokens" : "Copy All Tokens"}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {colorTokens.map((token) => (
                <div key={token.name} className="rounded-xl border border-border/70 bg-card p-3">
                  <div className="h-20 rounded-md border border-border/60" style={{ background: token.sample }} />
                  <p className="mt-3 text-sm font-semibold text-foreground">{token.name}</p>
                  <p className="text-xs text-muted-foreground">{token.varName}</p>
                  <div className="mt-2 rounded-md bg-muted/50 px-2 py-1 flex items-center justify-between gap-2">
                    <code className="text-[11px] text-foreground/90 truncate">{token.sample}</code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => copyToken(`color-${token.varName}`, `${token.varName}: ${token.sample};`)}
                    >
                      {copiedKey === `color-${token.varName}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glow-card p-8"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Typography</p>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Display</p>
                  <p className="font-display text-4xl text-foreground">Aa Bb Cc 123</p>
                  <div className="mt-2 rounded-md bg-muted/50 px-2 py-1 flex items-center justify-between gap-2">
                    <code className="text-[11px] text-foreground/90">font-display text-4xl</code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => copyToken("typo-display", "font-display text-4xl")}
                    >
                      {copiedKey === "typo-display" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Body</p>
                  <p className="font-body text-base text-muted-foreground">
                    This is the standard body copy style used for descriptions, long text, and guidance.
                  </p>
                  <div className="mt-2 rounded-md bg-muted/50 px-2 py-1 flex items-center justify-between gap-2">
                    <code className="text-[11px] text-foreground/90">font-body text-base text-muted-foreground</code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => copyToken("typo-body", "font-body text-base text-muted-foreground")}
                    >
                      {copiedKey === "typo-body" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Overline / Label</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Section label token</p>
                  <div className="mt-2 rounded-md bg-muted/50 px-2 py-1 flex items-center justify-between gap-2">
                    <code className="text-[11px] text-foreground/90">text-xs uppercase tracking-[0.2em] text-muted-foreground</code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => copyToken("typo-label", "text-xs uppercase tracking-[0.2em] text-muted-foreground")}
                    >
                      {copiedKey === "typo-label" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glow-card p-8"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Spacing Scale</p>
              <div className="space-y-4">
                {spacingTokens.map((token) => (
                  <div key={token.label} className="flex items-center gap-3">
                    <p className="w-10 text-xs text-muted-foreground">{token.label}</p>
                    <div className={`h-2 rounded-full bg-foreground/70 ${token.className}`} />
                    <p className="text-xs text-muted-foreground">{token.value}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 ml-auto"
                      onClick={() => copyToken(`space-${token.label}`, `${token.className} /* ${token.value} */`)}
                    >
                      {copiedKey === `space-${token.label}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glow-card p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Core UI Tokens</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border/70 bg-card p-5">
                <p className="text-sm font-semibold mb-3">Buttons</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs">Primary</span>
                  <span className="inline-flex px-3 py-1.5 rounded-full border border-border text-foreground text-xs">Outline</span>
                </div>
                <div className="mt-3 rounded-md bg-muted/50 px-2 py-1 flex items-center justify-between gap-2">
                  <code className="text-[11px] text-foreground/90">bg-primary text-primary-foreground rounded-full</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => copyToken("ui-button", "bg-primary text-primary-foreground rounded-full")}
                  >
                    {copiedKey === "ui-button" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-5">
                <p className="text-sm font-semibold mb-3">Status</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/40">Approved</span>
                  <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/40">Pending</span>
                  <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-700 border border-red-500/40">Rejected</span>
                </div>
                <div className="mt-3 rounded-md bg-muted/50 px-2 py-1 flex items-center justify-between gap-2">
                  <code className="text-[11px] text-foreground/90">bg-green-500/10 text-green-700 border-green-500/40</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => copyToken("ui-status", "bg-green-500/10 text-green-700 border border-green-500/40")}
                  >
                    {copiedKey === "ui-status" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-5">
                <p className="text-sm font-semibold mb-3">Surface</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Elevated cards use soft borders, high radius, and low-contrast shadow for clean depth.
                </p>
                <div className="mt-3 rounded-md bg-muted/50 px-2 py-1 flex items-center justify-between gap-2">
                  <code className="text-[11px] text-foreground/90">rounded-[2rem] border bg-card shadow-card-glow</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => copyToken("ui-surface", "rounded-[2rem] border bg-card text-card-foreground")}
                  >
                    {copiedKey === "ui-surface" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </SectionPageLayout>
  );
};

export default BrandSystemPage;