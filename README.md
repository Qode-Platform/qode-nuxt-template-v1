# Nuxt template

Provisioned from [`Qode-Platform/fleet-template-v1`](https://github.com/Qode-Platform/fleet-template-v1) — the fleet
lifecycle contract (`bin/`, `fleet.conf`, deploy workflows) with a
Nuxt starter laid on top.

## Origin

    npx nuxi@latest init nuxt -t v4 --no-install

Generated 2026-09-21 on Node v22.12.0 / Python 3.12.3. **Dependencies were
never installed and this has never been built or run.** Boot it once before
trusting it.

## Fleet lifecycle

`fleet.conf` drives every script in `bin/`:

| step | command |
|---|---|
| install | `npm install` |
| build | `npm run build` |
| start | `node .output/server/index.mjs` |

    ./bin/run       # install, build, start in the foreground
    ./bin/start     # start from existing build artifacts
    ./bin/restart   # rebuild and restart
    ./bin/stop      # stop whatever holds the port

Listens on `$PORT` (default `3000`); health check hits `/`.

## BASE_PATH

The fleet injects `BASE_PATH` (`/direct/<agent>:<port>`) and nginx forwards
that prefix **unchanged** — so this app serves every route and asset under
it. An empty or unset value means standalone mode: serve at the host root.

- Nuxt `app.baseURL` in nuxt.config.ts, baked at BUILD time.
- `HEALTH_PATH` in `fleet.conf` stays un-prefixed; the fleet prepends `$BASE_PATH` itself.
- A value like `direct/x:3000/` is normalised to `/direct/x:3000`.

## What differs from stock output

- Nitro's server entry reads $PORT from the environment.

---

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Rule: everything under BASE_PATH

This app is not served at the host root. The fleet ingress serves it under a
proxy prefix and forwards that prefix **unchanged**:

```
BASE_PATH=/direct/<agent>:<port>
```

**Every API call and every asset reference must carry that base path.** A bare
`"/..."` literal resolves against the host root, so it works on localhost and
404s in the fleet.

**What Nuxt rewrites for you:** `<NuxtLink>` hrefs, `~/assets` imports, and
Nuxt's own bundle and `public/` asset URLs - all via `app.baseURL`, which
`nuxt.config.ts` sets from `BASE_PATH`.

**What is NOT rewritten:** `$fetch`/`useFetch`/XHR URLs, plain `<a href>` and
`<img src>` string literals in templates, CSS `url(...)`, and any URL built
from a string in code.

**Use this framework's mechanism:** `useRuntimeConfig().app.baseURL` (it
already ends with a `/`):

```vue
<script setup lang="ts">
const { app } = useRuntimeConfig();
const { data } = await useFetch(`${app.baseURL}api/items`);
</script>
```

**Verify with:**

```bash
npm run check:base-path
```

A line that is genuinely framework-handled can be exempted with a trailing
`base-path-ok` comment (say why).
