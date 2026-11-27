import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileImage,
  Headphones,
  HelpCircle,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { Logo, SiteButton } from "@/components/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { simulate } from "@/components/auth/kit";
import { supabase } from "@/integrations/supabase/client";
import {
  artistVerificationStatuses,
  useArtistVerificationStore,
  type ArtistApplication,
  type ArtistVerificationStatus,
} from "@/stores/artist-verification";

const statusContent: Record<
  ArtistVerificationStatus,
  {
    label: string;
    title: string;
    lede: string;
    note: string;
    icon: typeof Clock3;
    tone: string;
  }
> = {
  pending: {
    label: "Under review",
    title: "Your artist application is under review.",
    lede: "Thank you for joining our creative community. We’ve received your verification details and our team is reviewing your application.",
    note: "good things are being carefully checked",
    icon: Clock3,
    tone: "bg-studio-info/10 text-studio-info",
  },
  approved: {
    label: "Approved",
    title: "You’re officially part of the community!",
    lede: "Your artist account has been approved. You can now access your dashboard, showcase your work and start receiving opportunities.",
    note: "your creative space is waiting",
    icon: BadgeCheck,
    tone: "bg-studio-success/10 text-studio-success",
  },
  requires_action: {
    label: "Information needed",
    title: "We need a little more information.",
    lede: "Your application is nearly ready. Please review the notes from our verification team and update the requested details so we can continue.",
    note: "a small update, then we’ll take another look",
    icon: CircleAlert,
    tone: "bg-studio-warning/10 text-studio-warning",
  },
  rejected: {
    label: "Not approved",
    title: "Your application wasn’t approved this time.",
    lede: "We know this may be disappointing. You can read the verification team’s reason below, ask for support or submit an appeal for another review.",
    note: "there is still a way forward",
    icon: XCircle,
    tone: "bg-studio-danger/10 text-studio-danger",
  },
};

const previewLabels: Record<ArtistVerificationStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  requires_action: "Needs information",
  rejected: "Rejected",
};

export function ArtistVerificationPage({ mode }: { mode: "update" | undefined }) {
  const navigate = useNavigate();
  const application = useArtistVerificationStore((state) => state.application);
  const setPreviewStatus = useArtistVerificationStore((state) => state.setPreviewStatus);
  const [appealOpen, setAppealOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const content = statusContent[application.status];
  const StatusIcon = content.icon;
  const correcting = mode === "update" && application.status === "requires_action";

  const signOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut().catch(() => undefined);
    void navigate({ to: "/login", replace: true });
  };

  const chooseStatus = (status: ArtistVerificationStatus) => {
    setPreviewStatus(status);
    if (mode) void navigate({ to: "/artist-verification", search: {} });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="container-x grid min-h-[80px] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-3">
          <Link to="/" aria-label="I Am An Artist home" className="shrink-0"><Logo className="h-10 sm:h-11" /></Link>
          <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex h-11 min-w-0 max-w-[150px] items-center gap-2 rounded-full border border-border px-3 text-[13px] font-medium transition-colors hover:bg-secondary sm:max-w-none sm:px-4 sm:text-sm" aria-label="Choose application preview state">
                  <span className="hidden shrink-0 text-muted-foreground md:inline">Preview:</span>
                  <span className="min-w-0 truncate">{previewLabels[application.status]}</span>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-2xl bg-background p-2">
                <DropdownMenuLabel className="px-3 py-2">Design preview</DropdownMenuLabel>
                <p className="px-3 pb-2 text-xs leading-relaxed text-muted-foreground">Sample states only. No real verification decision is made here.</p>
                <DropdownMenuSeparator />
                {artistVerificationStatuses.map((status) => (
                  <DropdownMenuItem key={status} onSelect={() => chooseStatus(status)} className="min-h-11 px-3">
                    {previewLabels[status]}
                    {application.status === status && <Check className="ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="mailto:support@iamanartist.art" className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors hover:bg-secondary sm:inline-flex">
              <HelpCircle className="h-[18px] w-[18px]" /> Support
            </a>
            <button onClick={signOut} disabled={signingOut} aria-label="Sign out of artist application" className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50">
              {signingOut ? <LoaderCircle className="h-[18px] w-[18px] animate-spin" /> : <LogOut className="h-[18px] w-[18px]" />}
              <span className="hidden min-[360px]:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>
        </div>
      </header>

      {correcting ? (
        <CorrectionForm application={application} onCancel={() => void navigate({ to: "/artist-verification", search: {} })} />
      ) : (
        <main>
          <section className="container-x grid gap-8 py-8 sm:py-12 min-[900px]:grid-cols-[minmax(0,1fr)_340px] min-[900px]:items-center min-[900px]:gap-10 min-[900px]:py-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-20 lg:py-20">
            <div className="min-w-0 max-w-3xl">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl sm:h-16 sm:w-16 ${content.tone}`}>
                <StatusIcon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.5} />
              </div>
              <p className="note mt-5 -rotate-1 sm:mt-7">{content.note}</p>
              <h1 className="mt-3 max-w-3xl text-[38px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[50px] lg:text-[64px]">{content.title}</h1>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">{content.lede}</p>
              <MobileApplicationSummary application={application} />
              <div className={`mt-6 flex-wrap gap-3 sm:mt-8 ${application.status === "pending" ? "flex" : "hidden sm:flex"}`}>
                {application.status === "approved" && (
                  <SiteButton onClick={() => void navigate({ to: "/creator", search: { artist: "new" } })}>
                    Go to Artist Dashboard <ArrowRight className="h-[18px] w-[18px]" />
                  </SiteButton>
                )}
                {application.status === "requires_action" && (
                  <SiteButton onClick={() => void navigate({ to: "/artist-verification", search: { mode: "update" } })}>
                    Update My Information <ArrowRight className="h-[18px] w-[18px]" />
                  </SiteButton>
                )}
                {application.status === "rejected" && (
                  <>
                    <SiteButton onClick={() => setAppealOpen(true)}>Submit an appeal <ArrowRight className="h-[18px] w-[18px]" /></SiteButton>
                    <SiteButton variant="outline" href="mailto:support@iamanartist.art?subject=Artist%20application%20support">Contact support</SiteButton>
                  </>
                )}
                {application.status === "pending" && (
                  <SiteButton variant="outline" href="mailto:support@iamanartist.art?subject=Artist%20application%20support">
                    <Mail className="h-[18px] w-[18px]" /> Ask us a question
                  </SiteButton>
                )}
              </div>
            </div>
            <ApplicationCard application={application} />
          </section>

          <ProgressTracker status={application.status} />

          <section className="container-x grid gap-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:gap-10">
            <div className="rounded-3xl border border-border bg-background p-6 sm:p-8">
              {application.status === "requires_action" ? (
                <>
                  <p className="eyebrow text-studio-copper">What needs your attention</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">Two details to update</h2>
                  <ol className="mt-6 space-y-5">
                    {application.issues.map((issue, index) => (
                      <li key={issue} className="flex gap-4 text-[16px] leading-relaxed">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-studio-warning/10 text-sm font-semibold text-studio-warning">{index + 1}</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ol>
                </>
              ) : application.status === "rejected" ? (
                <>
                  <p className="eyebrow text-studio-copper">Verification team’s note</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">Why we couldn’t approve this application</h2>
                  <blockquote className="mt-6 border-l-2 border-studio-danger pl-5 text-[17px] leading-relaxed text-muted-foreground">{application.rejectionReason}</blockquote>
                </>
              ) : application.status === "approved" ? (
                <>
                  <p className="eyebrow text-studio-green">Your next chapter</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">Make your creative space your own</h2>
                  <div className="mt-6 grid gap-5 sm:grid-cols-3">
                    {["Add your strongest work", "Complete your public profile", "Choose how you want to earn"].map((item, index) => (
                      <div key={item} className="border-t border-border pt-4"><span className="text-sm text-studio-copper">0{index + 1}</span><p className="mt-2 font-medium leading-snug">{item}</p></div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="eyebrow text-studio-green">What happens next</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">A careful review by a real person</h2>
                  <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">Our verification team checks your details and supporting documents. If anything needs clarification, we’ll show exactly what to update here and email you.</p>
                  <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary p-4 text-[15px] leading-relaxed"><LockKeyhole className="mt-0.5 h-5 w-5 text-studio-green" /><span>Your dashboard stays locked until approval. Refreshing or signing in again will not change your application status.</span></div>
                </>
              )}
            </div>
            <aside className="rounded-3xl bg-ink p-6 text-ink-foreground sm:p-8">
              <Headphones className="h-7 w-7" strokeWidth={1.5} />
              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.025em]">Need a human?</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-foreground/70">Our artist support team can explain the process and help with your next step.</p>
              <a href="mailto:support@iamanartist.art" className="link-line mt-6 inline-flex items-center gap-2 text-[15px] font-medium">support@iamanartist.art <ArrowRight className="h-4 w-4" /></a>
              <p className="mt-8 border-t border-ink-foreground/15 pt-5 text-sm text-ink-foreground/60">Monday–Friday · 09:00–17:00 CAT</p>
            </aside>
          </section>
        </main>
      )}

      {!correcting && application.status !== "pending" && (
        <MobileActionBar status={application.status} onAppeal={() => setAppealOpen(true)} />
      )}

      <footer className={`border-t border-border ${!correcting && application.status !== "pending" ? "pb-20 sm:pb-0" : ""}`}>
        <div className="container-x flex flex-col gap-2 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Frontend preview · Sample application data</p>
          <p>Files and decisions are not sent to a server.</p>
        </div>
      </footer>

      <AppealDialog open={appealOpen} onOpenChange={setAppealOpen} />
    </div>
  );
}

function MobileApplicationSummary({ application }: { application: ArtistApplication }) {
  const content = statusContent[application.status];
  const nextLabel = application.status === "requires_action" ? "Next step" : application.status === "approved" ? "Dashboard access" : application.status === "rejected" ? "Available option" : "Review timeframe";
  const nextValue = application.status === "requires_action" ? "2 updates needed" : application.status === "approved" ? "Unlocked" : application.status === "rejected" ? "Appeal or support" : application.reviewTimeframe;
  return (
    <aside className="mt-6 rounded-2xl border border-border bg-studio-surface p-4 sm:hidden" aria-label="Application summary">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-sm text-muted-foreground">{application.reference}</span>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${content.tone}`}>{content.label}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <Detail label="Submitted" value={application.submittedAt} />
        <Detail label={nextLabel} value={nextValue} />
      </dl>
    </aside>
  );
}

function MobileActionBar({ status, onAppeal }: { status: ArtistVerificationStatus; onAppeal: () => void }) {
  const navigate = useNavigate();
  const action = () => {
    if (status === "approved") void navigate({ to: "/creator", search: { artist: "new" } });
    else if (status === "requires_action") void navigate({ to: "/artist-verification", search: { mode: "update" } });
    else onAppeal();
  };
  const label = status === "approved" ? "Go to Artist Dashboard" : status === "requires_action" ? "Update My Information" : "Appeal this decision";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
      <SiteButton onClick={action} className="w-full">{label}<ArrowRight className="h-[18px] w-[18px]" /></SiteButton>
    </div>
  );
}

function ApplicationCard({ application }: { application: ArtistApplication }) {
  const content = statusContent[application.status];
  return (
    <aside className="hidden overflow-hidden rounded-3xl border border-border bg-studio-surface shadow-sm sm:block" aria-label="Application details">
      <div className="flex items-center justify-between gap-4 border-b border-border p-6 sm:p-7">
        <div><p className="eyebrow text-muted-foreground">Artist application</p><p className="mt-2 text-xl font-semibold">{application.artistName}</p></div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${content.tone}`}>{content.label}</span>
      </div>
      <dl className="space-y-5 p-6 sm:p-7">
        <Detail label="Application reference" value={application.reference} />
        <Detail label={application.submittedAt === "Just now" ? "Last submitted" : "Submission date"} value={application.submittedAt} />
        <Detail label="Expected review timeframe" value={application.reviewTimeframe} />
        <Detail label="Latest update" value={application.lastUpdate} />
      </dl>
      <div className="flex items-center gap-3 border-t border-border px-6 py-5 text-sm text-muted-foreground sm:px-7"><ShieldCheck className="h-5 w-5 text-studio-green" /><span>Your information is handled with care.</span></div>
    </aside>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-[15px] font-medium leading-relaxed">{value}</dd></div>;
}

function ProgressTracker({ status }: { status: ArtistVerificationStatus }) {
  const steps = ["Account created", "Documents submitted", "Verification review", "Approved"];
  const current = status === "approved" ? 4 : 3;
  return (
    <section className="border-y border-border bg-secondary/55" aria-labelledby="application-progress-title">
      <div className="container-x py-9 sm:py-11">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow text-muted-foreground">Your progress</p><h2 id="application-progress-title" className="mt-2 text-xl font-semibold">From account to creative community</h2></div><p className="hidden text-sm text-muted-foreground sm:block">{status === "approved" ? "All steps complete" : "Step 3 of 4"}</p></div>
        <ol className="mt-8 grid gap-6 sm:grid-cols-4 sm:gap-0">
          {steps.map((step, index) => {
            const number = index + 1;
            const complete = number < current || status === "approved";
            const active = number === current && status !== "approved";
            return (
              <li key={step} aria-current={active ? "step" : undefined} className="relative flex items-start gap-3 sm:block sm:pr-5">
                {index < steps.length - 1 && <span className={`absolute left-[17px] top-9 h-[calc(100%-12px)] w-px sm:left-9 sm:right-0 sm:top-[17px] sm:h-px sm:w-auto ${complete ? "bg-studio-green/45" : "bg-border"}`} />}
                <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold ${complete ? "border-studio-green bg-studio-green text-paper" : active ? "border-studio-copper bg-background text-studio-copper" : "border-border bg-background text-muted-foreground"}`}>
                  {complete ? <Check className="h-4 w-4" /> : number}
                </span>
                <div className="pt-1.5 sm:mt-3 sm:pt-0"><p className={`text-[15px] font-medium ${active ? "text-foreground" : complete ? "text-foreground" : "text-muted-foreground"}`}>{step}</p>{active && <p className="mt-1 text-sm text-studio-copper">{status === "pending" ? "In progress" : status === "requires_action" ? "Action needed" : "Not approved"}</p>}</div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function CorrectionForm({ application, onCancel }: { application: ArtistApplication; onCancel: () => void }) {
  const navigate = useNavigate();
  const submitCorrection = useArtistVerificationStore((state) => state.submitCorrection);
  const [legalName, setLegalName] = useState(application.artistName);
  const [address, setAddress] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [errors, setErrors] = useState<{ legalName?: string; address?: string; document?: string }>({});
  const [busy, setBusy] = useState(false);
  const clearError = (key: keyof typeof errors) => setErrors((current) => {
    const next = { ...current };
    delete next[key];
    return next;
  });

  const chooseFile = (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setErrors((current) => ({ ...current, document: "Use a JPG, PNG or PDF file." }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((current) => ({ ...current, document: "Choose a file smaller than 10 MB." }));
      return;
    }
    setDocumentName(file.name);
    clearError("document");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (legalName.trim().length < 2) next.legalName = "Enter your full legal name.";
    if (address.trim().length < 8) next.address = "Enter your street, city and country.";
    if (!documentName) next.document = "Upload a clearer identity document.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    await simulate(650);
    submitCorrection({ legalName: legalName.trim(), address: address.trim(), documentName });
    setBusy(false);
    void navigate({ to: "/artist-verification", search: {} });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container-x py-10 sm:py-14">
      <button onClick={onCancel} className="inline-flex items-center gap-2 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-[18px] w-[18px]" /> Back to application</button>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
        <aside>
          <p className="note -rotate-1">let’s get this sorted</p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.03] tracking-[-0.04em] sm:text-5xl">Update your information.</h1>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">Only update the details requested by our verification team. Your application will return to review after this preview submission.</p>
          <div className="mt-8 rounded-2xl bg-secondary p-5"><p className="eyebrow text-studio-copper">Application</p><p className="mt-2 font-medium">{application.reference}</p><p className="mt-1 text-sm text-muted-foreground">{application.reviewTimeframe} after resubmission</p></div>
          <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><LockKeyhole className="mt-0.5 h-4 w-4" /> Preview only: your file stays on this device and is not uploaded.</p>
        </aside>
        <form onSubmit={submit} noValidate className="rounded-3xl border border-border bg-studio-surface p-5 sm:p-8">
          <div className="border-b border-border pb-7"><p className="eyebrow text-muted-foreground">01 · Identity details</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">Confirm your legal information</h2></div>
          <div className="mt-7 space-y-6">
            <Field label="Full legal name" error={errors.legalName}><input value={legalName} onChange={(event) => { setLegalName(event.target.value); clearError("legalName"); }} autoComplete="name" className="studio-input bg-background" aria-invalid={!!errors.legalName} /></Field>
            <Field label="Current residential address" hint="Street, city and country" error={errors.address}><div className="relative"><MapPin className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-muted-foreground" /><input value={address} onChange={(event) => { setAddress(event.target.value); clearError("address"); }} autoComplete="street-address" placeholder="e.g. 12 Kabulonga Road, Lusaka, Zambia" className="studio-input bg-background pl-12" aria-invalid={!!errors.address} /></div></Field>
          </div>
          <div className="mt-9 border-b border-border pb-7"><p className="eyebrow text-muted-foreground">02 · Supporting document</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">Replace the unclear document</h2><p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">Use good light, avoid glare and make sure all four corners are visible.</p></div>
          <DocumentPicker fileName={documentName} error={errors.document} onFile={chooseFile} />
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">JPG, PNG or PDF · maximum 10 MB</p>
            <SiteButton type="submit" disabled={busy} className="w-full sm:w-auto">{busy ? <LoaderCircle className="h-[18px] w-[18px] animate-spin" /> : <RefreshCw className="h-[18px] w-[18px]" />}{busy ? "Submitting preview…" : "Resubmit for review"}</SiteButton>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error: string | undefined; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[15px] font-medium">{label}</span>{children}{error ? <span role="alert" className="mt-2 block text-sm text-destructive">{error}</span> : hint ? <span className="mt-2 block text-sm text-muted-foreground">{hint}</span> : null}</label>;
}

function DocumentPicker({ fileName, error, onFile }: { fileName: string; error: string | undefined; onFile: (file: File | undefined) => void }) {
  const id = useId();
  return (
    <div className="mt-7">
      <input id={id} type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
      <label htmlFor={id} className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-background p-6 text-center transition-colors hover:border-studio-green ${error ? "border-destructive" : "border-foreground/25"}`}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-studio-green">{fileName ? <FileCheck2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}</span>
        <span className="mt-4 text-[16px] font-medium">{fileName || "Choose a clearer document"}</span>
        <span className="mt-1 text-sm text-muted-foreground">{fileName ? "Choose another file to replace it" : "Tap to browse your files"}</span>
      </label>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      {fileName && <p className="mt-3 flex items-center gap-2 text-sm text-studio-success"><FileImage className="h-4 w-4" /> Ready for preview submission</p>}
    </div>
  );
}

function AppealDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const submitAppeal = useArtistVerificationStore((state) => state.submitAppeal);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (reason.trim().length < 20) return setError("Tell us a little more — use at least 20 characters.");
    setBusy(true);
    await simulate(650);
    if (submitAppeal(reason)) onOpenChange(false);
    setBusy(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[90svh] overflow-y-auto rounded-t-3xl bg-background p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(560px,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-8 sm:shadow-2xl">
          <Dialog.Close className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-secondary" aria-label="Close appeal form"><X className="h-5 w-5" /></Dialog.Close>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-studio-copper/10 text-studio-copper"><FileCheck2 className="h-6 w-6" /></div>
          <Dialog.Title className="mt-5 pr-10 text-3xl font-semibold tracking-[-0.035em]">Ask for another look.</Dialog.Title>
          <Dialog.Description className="mt-3 text-[16px] leading-relaxed text-muted-foreground">Tell the verification team what they should reconsider. This preview does not send a real appeal.</Dialog.Description>
          <form onSubmit={submit} className="mt-6">
            <label htmlFor="appeal-reason" className="text-[15px] font-medium">Why should we review this decision?</label>
            <textarea id="appeal-reason" value={reason} onChange={(event) => { setReason(event.target.value); setError(""); }} rows={5} maxLength={800} placeholder="Share any context or details that may help…" className="studio-input mt-2 min-h-32 resize-none bg-background" />
            <div className="mt-2 flex justify-between gap-4 text-sm"><span role="alert" className="text-destructive">{error}</span><span className="ml-auto text-muted-foreground">{reason.length}/800</span></div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Dialog.Close asChild><SiteButton variant="outline">Cancel</SiteButton></Dialog.Close><SiteButton type="submit" disabled={busy}>{busy ? "Submitting preview…" : "Submit appeal preview"}<ArrowRight className="h-[18px] w-[18px]" /></SiteButton></div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ArtistVerificationSkeleton() {
  return (
    <div className="min-h-screen bg-background" aria-label="Loading artist application">
      <div className="container-x flex h-20 items-center border-b border-border"><div className="h-10 w-44 animate-pulse rounded-full bg-secondary" /></div>
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_400px]"><div><div className="h-16 w-16 animate-pulse rounded-2xl bg-secondary" /><div className="mt-8 h-14 max-w-xl animate-pulse rounded-2xl bg-secondary" /><div className="mt-4 h-14 max-w-lg animate-pulse rounded-2xl bg-secondary" /><div className="mt-8 h-24 max-w-2xl animate-pulse rounded-2xl bg-secondary" /></div><div className="h-96 animate-pulse rounded-3xl bg-secondary" /></div>
    </div>
  );
}
