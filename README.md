# «Кот Бродского» - markup

## Requirements

 * Node.js `.nvmrc`
 * Yarn `.yvmrc`

## Install

```
yarn
```

## Build

**Deploy script:**

```bash
srv.sh
```

**Production build:**

```bash
yarn production
```

- minified assets
- cachebuster

**Regular build:**

```
yarn build
```

- not minified assets
- requires development environment: `.env-dev` file

## Develop

`dev.sh` / `yarn watch`
