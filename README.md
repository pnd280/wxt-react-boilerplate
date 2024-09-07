# WXT-React Boilerplate

This is a personal boilerplate for quickly bootstrapping browser extension projects with modern tools and better workflow.

## What's included

### Main Dependencies

- [`wxt`](https://wxt.dev/) framework (browser-agnostic, TS-first, built on top of the goat `Vite`).
- `React` + `TailwindCSS` for internal UI.
- `jQuery` for easier DOM manipulation on the host page.

### DX

- An opinionated ESLint config (v8).
- Pre-configured color scheme (from [shadcn/ui](https://ui.shadcn.com/)) & tailwind configs (+ prettier plugin for class sorting, tailwindcss-animate).
- A few useful utils for messaging, script injection, etc.
- Want more abstraction? Check out:

  - [`@webext-core`](https://github.com/aklinker1/webext-core): messaging, storage, testing, etc. (**Highly Recommended**)
  - More from [@aklinker1](https://github.com/aklinker1) (author of `wxt`).

- Recommended VSCode extensions for better experience:
  - `ghmcadams.lintlens`: Lint eslint config.
  - `MylesMurphy.prettify-ts`: Better type preview.
  - `YoavBls.pretty-ts-errors`: Make typescript errors more readable.

## Side Notes

- `wxt` in this repo is patched to gain full control over auto-imports: Default directories (`components`, `utils`, etc.) will not be scanned by default (Thanks for the guide [@aklinker1](https://github.com/aklinker1)).
- No HMR for Integrated UI (content script): It is **NOT** recommended to use `wxt` if the extension **heavily** makes use of Integrated UI. `@crxjs/vite-plugin` is a better alternative in that case (if use React). See [this issue](https://github.com/wxt-dev/wxt/issues/357) for more information.
