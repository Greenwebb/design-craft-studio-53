<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public pages live under the pathless _public shell; /creator and /account own separate dashboard shells with Home leaves and management destinations, while /dashboard redirects to /creator, to preserve purposeful navigation and legacy links.
- Derive dashboard navigation, Create options and Home sections from one typed capability model; this keeps disciplines on the same adaptable experience.
- Dashboard preview data is isolated from marketplace and payment state, with no simulated persistence or live transaction claims; the current scope is presentation only.

- UI-only ecosystem previews use a single in-memory account context and shared project/conversation fixtures; no frontend state authorizes private data or claims live transactions.
- Global CSS is the sole source of color tokens; all three shells reuse shared controls, typography, motion constants and artwork data.
- Global radius tokens define surface rounding with a creator-shell surface scale, and shared button controls enforce pill rounding after caller classes, preserving consistency within each experience.
- Creator workflow modules share accessible tabs, drawers and capability-derived preview fixtures; distinct module layouts keep publishing, commerce, collaboration and earnings purposeful.
- Complex creator creation uses /creator/new/$kind full-page steps; drawers handle focused contextual actions, avoiding cramped multi-field creation overlays.
- Global client state lives in Zustand stores (src/stores, plus the bag and account stores); avoid new React context for app state so state handling stays consistent.
- Workflow state machines (commission, fulfilment, payouts, admin queues) are defined once in src/data/workflows.ts and rendered with the shared StageTracker, so every shell shows the same states.
- /admin is a fourth, separate operations shell; it must be gated by a server-checked staff role before handling real data.
