# Origin 13 website

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Runtime AI policy

The website has no runtime AI feature. Team photos are cropped in the browser and uploaded directly; they are not sent to an AI service. Previously created blue-background portraits and portfolio mockups remain ordinary image assets. No AI provider key is required for website operation.

## Local development and eventual GitHub handoff

Code export alone is **not** a complete offline or independent migration. The current app still uses Lovable Cloud for saved page content, publishing status, projects, team records, administrator sign-in, and uploaded media. Running the code locally with the current configuration still connects to those hosted services and can incur non-AI hosting/storage costs.

Before an independent handoff:

- Export current database records separately from source code; migration files describe the schema but do not contain every later admin edit.
- Copy all uploaded storage objects and externally hosted images, including media referenced by asset pointers. Preserve and remap references so existing content is not lost.
- Provide a local or independently hosted backend compatible with the app's database, authentication and storage interfaces, and apply the included schema, policies and role setup. A plain database alone does not replace authentication or file storage.
- Configure browser `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, and server `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for that backend. These are interface names, not instructions to obtain inaccessible Cloud credentials. Never commit private keys or production sessions.
- Verify independent startup and deployment: the current Vite configuration uses `@lovable.dev/vite-tanstack-config` with Nitro's default Cloudflare target. A different production host may require its own supported adapter/configuration.
- Test public pages, saved edits, publishing, administrator sign-in and photo uploads against the replacement backend; also check fonts and media with the network disconnected if offline use is required.

GitHub holds and synchronizes source code; it does not automatically migrate database records, accounts or uploaded photos, or run the admin services. Independent/offline operation has not yet been verified. No backend migration or Git connection has been performed by this AI-removal change.
