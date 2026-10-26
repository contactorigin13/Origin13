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

- Origin 13 uses TanStack file routes in src/routes, shared website components in src/components/site, and semantic tokens in src/styles.css; the latest source replaces the legacy hash-switching application.
- Website content and portfolio edits use Lovable Cloud with public reads and database-enforced admin writes; admin roles live in a protected user_roles table to prevent client privilege escalation.
- Extended portfolio text uses shared field definitions and a portfolio-only resolver over the existing content store, keeping admin controls and public copy synchronized without changing the Services page.
- Brand kits and portfolio slides remain data-driven; normal unpublishing uses site_visibility without removing entries, while explicitly archived case studies stay in src/data/studio-archive.ts outside live imports.
- Shared editor fields and resolvers bind page copy, company details, featured stories, services, partners and media to the content store; admin reads raw storage references and public reads resolve them to prevent expiring URLs from being saved.
- Publishing uses site_visibility for pages, sections and bundled slides, with a fail-closed public render gate; uploaded projects additionally use a published column and separate public/admin read paths enforced by RLS.
- Search metadata reads only page-specific public content keys through a publishable server function, keeping private credentials out of the browser bundle.
- Team uploads use browser-only cropping and direct storage uploads with no image-generation server endpoint; keep runtime AI integrations out of the app to prevent automated credit spending.
- Admin-added portfolio work lives in the projects table with a kind (upload, story, brand_kit) and merges into the public Portfolio at render time; built-in work is toggled via site_visibility, so both share one list-and-publish workflow.
