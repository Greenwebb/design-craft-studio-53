import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
} from "@/data/dashboard";
import { AccountMenu } from "@/components/ecosystem/account-menu";
import { useEcosystem } from "@/components/ecosystem/context";
import { StudioContext } from "./context";
import { StudioLink } from "./controls";
import { StudioNotifications } from "./notifications";
import { StudioCommandSearch } from "./command-search";
import { ContextSwitch } from "@/components/ecosystem/context-switch";
import { DashboardTopBar, SearchButton, NotificationButton } from "@/components/ecosystem/top-bar";
import { FloatingNav, floatingNavItem, floatingNavAction } from "@/components/ecosystem/floating-nav";
export function StudioShell({ state }: { state: PreviewState }) {
  const { user, setContext } = useEcosystem();
  useEffect(() => { setContext("creator"); }, []);
  const studio = getStudio(state);
  const nav = navigation(studio.capabilities);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const section = pathname.split("/")[2] ?? "home";
  const [create, setCreate] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [read, setRead] = useState(false);
  const options = createOptions(studio.capabilities);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      const target = event.target;
      const editing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearch(v => !v); }
      if (!editing && !event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === "c") { event.preventDefault(); setCreate(true); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
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
  const createNew = (section: string) => {
    if (["portfolio","sell","services"].includes(section)) {
      setCreate(false);
      void navigate({to:"/creator/new/$kind", params:{kind:section==="sell"?"work":section==="services"?"service":"portfolio"}, search:{artist:state}});
    } else go(section);
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
            {n.id === "home" ? <Home size={19} /> : n.id === "profile" ? <User size={19}/> : n.id === "projects" ? <Briefcase size={19}/> : n.id === "earnings" ? <Layers size={19}/> : n.id === "services" ? <Calendar size={19}/> : <Image size={19}/>}
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
            <n.icon size={19} />
            {n.label}
          </Link>
        ))}
        <Link
          to="/artists/$slug"
          params={{ slug: studio.artist.slug }}
          className="mt-6 flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground"
        >
          View public profile
          <ArrowUpRight size={16} />
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
          <DashboardTopBar back={{ visible: pathname.split("/").filter(Boolean).length >= 3 }} title={title} eyebrow="Creating" leading={
              <IconButton
                ariaLabel="Open studio navigation"
                onClick={() => setDrawer(true)}
                className="h-9 w-9 border-0 lg:hidden"
              >
                <Menu size={20} />
              </IconButton>}>
              <SearchButton label="Search studio" onClick={() => setSearch(true)} />
              <NotificationButton unread={studio.data.attention.length > 0 && !read} onClick={() => { setNotifications(true); setRead(true); }} />
              <AccountMenu context="creator" artist={state} />
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
              <div className="hidden md:block"><SiteButton onClick={() => setCreate(true)} className="h-10 px-4 py-0"><Plus size={19}/>Create<ChevronDown size={15}/></SiteButton></div>
          </DashboardTopBar>
          <main
            id="studio-main"
            className="mx-auto max-w-[1440px] px-[18px] pb-32 pt-5 sm:px-7 sm:pt-7 lg:px-10 lg:pb-20"
          >
            <Outlet />
          </main>
        </div>
        <FloatingNav label="Mobile studio navigation" className="lg:hidden">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "work", label: "Work", icon: Image },
            { id: "create", label: "Create", icon: Plus },
            { id: "projects", label: "Projects", icon: Briefcase },
            { id: "settings", label: "Profile", icon: User },
          ].filter(n => n.id !== "projects" || nav.some(item => item.id === "projects")).map((n) =>
            n.id === "create" ? (
              <button
                key={n.id}
                type="button"
                aria-label="Create"
                aria-expanded={create}
                onClick={() => setCreate(true)}
                className={floatingNavAction}
              >
                <Plus size={24} />
              </button>
            ) : (
              <Link
                key={n.id}
                to={n.id === "home" ? "/creator" : "/creator/$section"}
                params={{ section: n.id }}
                search={{ artist: state }}
                aria-current={section === n.id ? "page" : undefined}
                className={floatingNavItem(section === n.id)}
              >
                <n.icon size={20} />
                {n.label}
              </Link>
            ),
          )}
        </FloatingNav>
        <Dialog.Root open={create} onOpenChange={setCreate}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35" />
            <Dialog.Content className="studio fixed inset-x-0 bottom-0 z-50 max-h-[90svh] overflow-y-auto rounded-t-lg bg-studio-surface p-6 outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(520px,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[86svh] sm:rounded-lg sm:p-8 sm:shadow-2xl">
              <Dialog.Title className="text-xl font-semibold">Create</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Make your next creative move.
              </Dialog.Description>
              <Dialog.Close asChild>
                <IconButton
                  ariaLabel="Close Create"
                  className="absolute right-4 top-3 h-8 w-8 border-0"
                >
                  <X size={19} />
                </IconButton>
              </Dialog.Close>
              <div className="mt-5 divide-y divide-border">
                {options.map((o) => (
                  <SiteButton
                    key={o.section}
                    variant="outline"
                    onClick={() => createNew(o.section)}
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
            <Dialog.Content className="studio fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-y-auto rounded-r-lg bg-studio-surface p-6">
              <Dialog.Title className="sr-only">Studio navigation</Dialog.Title>
              <Dialog.Description className="sr-only">Your creative workspace</Dialog.Description>
              <Dialog.Close asChild>
                <IconButton
                  ariaLabel="Close navigation"
                  className="absolute right-3 top-3 h-8 w-8 border-0"
                >
                  <X size={18} />
                </IconButton>
              </Dialog.Close>
              {navBody}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <ContextSwitch context="creator"/>
        <StudioCommandSearch open={search} onClose={()=>setSearch(false)} state={state}/>
        <StudioNotifications open={notifications} onClose={()=>setNotifications(false)} onNavigate={go}/>
      </div>
    </StudioContext.Provider>
  );
}
