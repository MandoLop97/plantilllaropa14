n# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1001f42b-5524-46cf-bf13-8d6918776a64

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1001f42b-5524-46cf-bf13-8d6918776a64) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Push Notifications

The app uses the `web-push` library together with Supabase Edge Functions to deliver browser push notifications.

Generate VAPID keys if you don't have them:

```bash
npm run generate:vapid
```

Set `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` in your Supabase project or `.env` file.

## Environment configuration
Create a `.env` file based on `.env.example` and set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_GOOGLE_MAPS_API_KEY` with your credentials.

Notifications can be sent using the `send-push` function by posting a payload like:

```bash
curl -X POST <SUPABASE_EDGE_URL>/send-push \
  -H 'Content-Type: application/json' \
  -d '{"subscription":{}, "payload": {"title":"Hola","body":"Mensaje","url":"https://example.com"}}'
```

The `url` field will be opened when the user taps the push notification.

If you only provide a relative path in the payload (e.g. `/admin/ordenes/1`),
send a message to the service worker after the admin logs in with the base URL
of the dashboard:

```js
navigator.serviceWorker.ready.then(r =>
  r.active?.postMessage({ type: 'SET_BASE_URL', baseUrl: 'https://gutix.site' })
);
```
The service worker will combine this base URL with any relative `url` before
opening it.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1001f42b-5524-46cf-bf13-8d6918776a64) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
