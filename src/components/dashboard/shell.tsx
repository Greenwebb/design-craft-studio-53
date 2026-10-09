import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Image,
  Plus,
  Briefcase,
  User,
  Search,
  Bell,
  ArrowUpRight,
  Menu,
  MessageSquare,
  Settings,
  ChevronDown,
  Layers,
  Calendar,
  Check,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Logo, SiteButton, IconButton } from "@/components/site";
import {
  getStudio,
  navigation,
  createOptions,
  previewStates,
  type PreviewState,
} from "@/data/creator";
import { AccountMenu } from "@/components/ecosystem/account-menu";
import { useEcosystem } from "@/components/ecosystem/context";
import { StudioContext } from "./context";
import { StudioLink } from "./controls";
export function StudioShell({ state }: { state: PreviewState }) {
  const { user } = useEcosystem();
  const studio = getStudio(state);
  const nav = navigation(studio.capabilities);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const section = pathname.split("/")[2] ?? "home";
  const [create, setCreate] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [read, setRead] = useState(false);
  const options = createOptions(studio.capabilities);
  const title =
    nav.find((n) => n.id === section)?.label ??
    { work: "Your work", messages: "Messages", settings: "Settings", availability: "Availability" }[
      section as "work"
    ] ??
    "Studio";
  const go = (s: string) => {
    setCreate(false);
    setDrawer(false);
    setSearch(false);
    setNotifications(false);
    void navigate({ to: "/creator/$section", params: { section: s }, search: { artist: state } });
  };
  const navBody = (
    <>
      <Link to="/" aria-label="I Am An Artist home">
        <Logo className="h-12" />
      </Link>
      <div className="mb-9 mt-9 flex items-center gap-3">
        <img src={studio.artist.portrait} alt="" className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold">{user.displayName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {studio.artist.disciplines.join(" · ")}
          </p>
        </div>
      </div>
      <nav aria-label="Studio navigation" className="space-y-1">
        {nav.map((n) => (
          <Link
            key={n.id}
            to={n.id === "home" ? "/creator" : "/creator/$section"}
            params={{ section: n.id }}
            search={{ artist: state }}
            onClick={() => setDrawer(false)}
            aria-current={section === n.id ? "page" : undefined}
            className={`flex h-[42px] items-center gap-3 rounded-full px-3 text-sm font-medium ${section === n.id ? "bg-ink text-paper" : "hover:bg-foreground/[0.035]"}`}
          >
            {n.id === "home" ? <Home size={17} /> : <span className="w-[17px]" />}
            {n.label}
          </Link>
        ))}
      </nav>
      <nav aria-label="Studio account" className="mt-auto space-y-1 pt-12">
        {[
          { id: "messages", label: "Messages", icon: MessageSquare },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((n) => (
          <Link
            key={n.id}
            to="/creator/$section"
            params={{ section: n.id }}
            search={{ artist: state }}
            onClick={() => setDrawer(false)}
            className={`flex h-[42px] items-center gap-3 rounded-full px-3 text-sm ${section === n.id ? "bg-ink text-paper" : "hover:bg-foreground/[0.035]"}`}
          >
            <n.icon size={17} />
            {n.label}
          </Link>
        ))}
        <Link
          to="/artists/$slug"
          params={{ slug: studio.artist.slug }}
          className="mt-6 flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground"
        >
          View public profile
          <ArrowUpRight size={14} />
        </Link>
      </nav>
    </>
  );
  return (
    <StudioContext.Provider value={{ ...studio, state, openCreate: () => setCreate(true) }}>
      <div className="studio min-h-screen bg-studio text-foreground">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-border bg-studio-surface px-6 py-8 lg:flex">
          {navBody}
        </aside>
        <div className="lg:ml-[244px]">
          <header className="flex h-[92px] items-center justify-between gap-2 border-b border-border px-[18px] sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <IconButton
                ariaLabel="Open studio navigation"
                onClick={() => setDrawer(true)}
                className="h-9 w-9 border-0 lg:hidden"
              >
                <Menu size={18} />
              </IconButton>
              <span className="text-sm font-medium">{title}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <IconButton
                ariaLabel="Search studio"
                title="Search studio"
                onClick={() => setSearch(true)}
                className="h-9 w-9 border-0"
              >
                <Search size={18} />
              </IconButton>
              <IconButton
                ariaLabel="Notifications"
                title="Notifications"
                onClick={() => {
                  setNotifications(true);
                  setRead(true);
                }}
                className="relative h-9 w-9 border-0"
              >
                <Bell size={18} />
                {studio.data.attention.length > 0 && !read && (
                  <span className="absolute right-2 top-1 h-1.5 w-1.5 rounded-full bg-studio-copper" />
                )}
              </IconButton>
              <AccountMenu context="creator" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    ariaLabel="Creative discipline previews"
                    className="h-9 w-9 overflow-hidden border-0"
                  >
                    <img
                      src={studio.artist.portrait}
                      alt="Creative discipline"
                      className="h-full w-full object-cover"
                    />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 bg-studio-surface">
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    Artist preview · Sample data
                  </p>
                  {previewStates.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onSelect={() => {
                        setRead(false);
                        void navigate({ to: "/creator", search: { artist: s } });
                      }}
                      className="capitalize"
                    >
                      {s === "portfolio" ? "Portfolio only" : s === "new" ? "New artist" : s}
                      {state === s && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SiteButton className="h-10 rounded-full px-4 py-0">
                      <Plus size={17} />
                      Create
                      <ChevronDown size={13} />
                    </SiteButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-80 bg-studio-surface p-2"
                  >
                    {options.map((o, i) => (
                      <DropdownMenuItem
                        key={o.section}
                        onSelect={() => go(o.section)}
                        className="items-start gap-3 p-3"
                      >
                        <span className="mt-1 text-studio-green">
                          {i === 0 ? (
                            <Image />
                          ) : o.section === "availability" ? (
                            <Calendar />
                          ) : (
                            <Layers />
                          )}
                        </span>
                        <span>
                          <span className="block font-medium">{o.title}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {o.description}
                          </span>
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main
            id="studio-main"
            className="mx-auto max-w-[1440px] px-[18px] pb-32 pt-8 sm:px-7 lg:px-10 lg:pb-20"
          >
            <Outlet />
          </main>
        </div>
        <nav
          aria-label="Mobile studio navigation"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-flow-col auto-cols-fr border-t border-border bg-studio-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "work", label: "Work", icon: Image },
            { id: "create", label: "Create", icon: Plus },
            { id: "projects", label: "Projects", icon: Briefcase },
            { id: "profile", label: "Profile", icon: User },
          ].filter(n => n.id !== "projects" || nav.some(item => item.id === "projects")).map((n) =>
            n.id === "create" ? (
              <IconButton
                key={n.id}
                ariaLabel="Create"
                aria-expanded={create}
                onClick={() => setCreate(true)}
                className="my-2 h-12 w-12 justify-self-center border-0 bg-ink text-paper"
              >
                <Plus size={23} />
              </IconButton>
            ) : (
              <Link
                key={n.id}
                to={n.id === "home" ? "/creator" : "/creator/$section"}
                params={{ section: n.id }}
                search={{ artist: state }}
                aria-current={section === n.id ? "page" : undefined}
                className={`flex min-h-[68px] flex-col items-center justify-center gap-1 text-[10px] ${section === n.id ? "text-foreground" : "text-muted-foreground"}`}
              >
                <n.icon size={19} />
                {n.label}
              </Link>
            ),
          )}
        </nav>
        <Dialog.Root open={create} onOpenChange={setCreate}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35" />
            <Dialog.Content className="studio fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-studio-surface p-6 outline-none md:bottom-auto md:left-1/2 md:top-1/3 md:max-w-sm md:-translate-x-1/2 md:rounded-md">
              <Dialog.Title className="text-xl font-semibold">Create</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Make your next creative move.
              </Dialog.Description>
              <Dialog.Close asChild>
                <IconButton
                  ariaLabel="Close Create"
                  className="absolute right-4 top-3 h-8 w-8 border-0"
                >
                  <X size={17} />
                </IconButton>
              </Dialog.Close>
              <div className="mt-5 divide-y divide-border">
                {options.map((o) => (
                  <SiteButton
                    key={o.section}
                    variant="outline"
                    onClick={() => go(o.section)}
                    className="w-full justify-start rounded-full border-0 px-0 py-5 text-left"
                  >
                    <Plus size={19} className="mr-2 text-studio-green" />
                    <span>
                      <span className="block">{o.title}</span>
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        {o.description}
                      </span>
                    </span>
                  </SiteButton>
                ))}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Dialog.Root open={drawer} onOpenChange={setDrawer}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35" />
            <Dialog.Content className="studio fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-y-auto bg-studio-surface p-6">
              <Dialog.Title className="sr-only">Studio navigation</Dialog.Title>
              <Dialog.Description className="sr-only">Your creative workspace</Dialog.Description>
              <Dialog.Close asChild>
                <IconButton
                  ariaLabel="Close navigation"
                  className="absolute right-3 top-3 h-8 w-8 border-0"
                >
                  <X size={16} />
                </IconButton>
              </Dialog.Close>
              {navBody}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Dialog.Root open={search} onOpenChange={setSearch}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35" />
            <Dialog.Content className="studio fixed left-1/2 top-[15%] z-50 w-[calc(100%-36px)] max-w-lg -translate-x-1/2 rounded-md bg-studio-surface p-6">
              <Dialog.Title className="text-xl font-semibold">Search your studio</Dialog.Title>
              <Dialog.Description className="sr-only">
                Find your workspace or published work
              </Dialog.Description>
              <input
                aria-label="Search work and destinations"
                placeholder="Search work, projects, earnings…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="my-5 h-12 w-full border-b border-border bg-transparent text-sm outline-none"
              />
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {[
                  ...nav.map((n) => ({ title: n.label, section: n.id })),
                  ...studio.data.recentWork.map((w) => ({ title: w.title, section: "portfolio" })),
                ]
                  .filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
                  .map((n) => (
                    <div key={n.title}>
                      <StudioLink
                        section={n.section}
                        onClick={() => setSearch(false)}
                        className="w-full justify-between py-2"
                      >
                        {n.title}
                      </StudioLink>
                    </div>
                  ))}
                {query &&
                  !nav.some((n) => n.label.toLowerCase().includes(query.toLowerCase())) &&
                  !studio.data.recentWork.some((w) =>
                    w.title.toLowerCase().includes(query.toLowerCase()),
                  ) && (
                    <p className="text-sm text-muted-foreground">
                      No matching work or destinations.
                    </p>
                  )}
              </div>
              <Dialog.Close asChild>
                <IconButton
                  ariaLabel="Close search"
                  className="absolute right-4 top-4 h-8 w-8 border-0"
                >
                  <X size={16} />
                </IconButton>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Dialog.Root open={notifications} onOpenChange={setNotifications}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/20" />
            <Dialog.Content className="studio fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm overflow-y-auto bg-studio-surface p-7">
              <Dialog.Title className="text-xl font-semibold">Notifications</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                The important things around your work.
              </Dialog.Description>
              <Dialog.Close asChild>
                <IconButton
                  ariaLabel="Close notifications"
                  className="absolute right-3 top-3 h-8 w-8 border-0"
                >
                  <X size={16} />
                </IconButton>
              </Dialog.Close>
              <h3 className="mb-2 mt-10 text-xs text-muted-foreground">Today</h3>
              {studio.data.attention.length ? (
                studio.data.attention.map((item) => (
                  <div className="border-t border-border py-5" key={item.id}>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mb-3 mt-1 text-xs text-muted-foreground">{item.createdAt}</p>
                    <SiteButton
                      variant="outline"
                      onClick={() => go(item.action.href)}
                      className="rounded-full border-0 p-0 text-xs"
                    >
                      {item.action.label}
                      <ArrowUpRight size={14} />
                    </SiteButton>
                  </div>
                ))
              ) : (
                <p className="py-6 text-sm">You’re all caught up.</p>
              )}
              <h3 className="mb-4 mt-8 text-xs text-muted-foreground">Earlier</h3>
              <p className="text-sm text-muted-foreground">No earlier notifications.</p>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </StudioContext.Provider>
  );
}
