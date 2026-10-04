# LogicLab

Interactive Digital Logic & Combinational Circuit Simulator. Learn Boolean logic by changing inputs and watching gates, wires, outputs, and truth tables update instantly.

## What's new in v1.1

- Each gate, circuit, and application has its own shareable page, selected from the navigation.
- Compact workbenches keep inputs and outputs together above the diagram. Long truth tables scroll inside their panel.
- Tablets and phones use a navigation drawer and Circuit / Truth table / Explanation tabs.
- Light educational colors, frosted-glass panels, and a dark-mode button with a saved preference.
- The playground keeps its input controls visible while a focused inspector handles component connections.

## Run locally

Install Node.js 20.19+ or 22.12+ and run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. All simulation runs in your browser with no backend or API keys. Once dependencies are installed, the app does not need the internet for its simulations.

## Build and check

```sh
npm test
npm run build
npm run preview
```

## Included

- Seven gate reference cards, SVG symbols, comparison table, and interactive gate simulator.
- Eight circuits: half/full adders, half/full subtractors, 4:1 MUX, 1:4 DEMUX, 2-to-4 decoder, and one-bit comparator.
- Live LEDs, signal paths, intermediate values, Boolean calculations, and full truth tables.
- A 20-component node builder with input switches, seven gate types, LEDs, pin selectors, deletion, reset, and cycle prevention.
- Traffic, elevator, alarm, water tank, and combination-lock models.
- Eight introductory lessons and a seven-question quiz generated from real truth tables.
- Responsive frosted-glass interface, accessible controls, and reduced-motion support.

## Structure

- `src/engine.js`: shared Boolean operations, circuit definitions, graph evaluation, and validation.
- `src/components/UI.jsx`: switches, LEDs, symbols, wires, tables, and shared panels.
- `src/components/Networks.jsx`: acyclic SVG network layout and data-routing diagrams.
- `src/pages/`: separate home, gate, circuit, playground, application, and learning pages.
- `src/main.jsx`: navigation and optional browser WebMCP integration.
- `src/navigation.js`: dedicated experiment routes and safe route fallbacks.
- `src/components/ExperimentFrame.jsx`: compact workbench and responsive reference tabs.
- `src/styles.css`, `src/workbench.css`, `src/themes.css`: design system, responsive layout, and themes.
- `tests/`: exhaustive truth-table, arithmetic invariant, and route tests.

## Publish with GitHub and Vercel

Create an empty GitHub repository named `logiclab`. Do not initialize it with a README, license, or .gitignore. Push the contents of this folder to the repository root, so `package.json` is at the top level.

In Vercel, choose **Add New > Project**, import the GitHub repository, and use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | Repository root (`./`) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | None |

Click **Deploy**. The included `vercel.json` supplies the build settings. Navigation uses hash routes such as `/#gates/XOR`, so these pages work on a static host without server rewrites. Future pushes to the connected production branch trigger Vercel deployments.

Official guides: [GitHub import](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github) · [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## Simulation conventions

All engine inputs are numeric 0 or 1. A missing playground connection produces X (unresolved); it never silently becomes zero. Feedback loops and output-to-output connections are prohibited. Fan-out is allowed.

MUX/DEMUX selection index is `2*S1 + S0`. Decoder index is `2*A + B`.

Applications are educational combinational models. The traffic timer is an external Boolean input, not a running sequence. Pump hysteresis requires memory and is intentionally explained rather than simulated as combinational logic. Elevator control is an illustrative interlock model, not an implementation for real equipment.

Experiment inputs and playground edits survive navigation within the current tab; refreshing starts a new session. Quiz progress lasts while the learning page is open. Theme preference is saved locally in the browser.

## Verification

The 23-test Node suite covers every gate truth table, all adder/subtractor arithmetic identities, all 64 MUX states, routing, comparator behavior, application safety conditions, missing connections, cycle prevention, malformed inputs, and dedicated page routes. Browser checks cover navigation and Back behavior, restored input values, theme persistence, live table updates, component addition/connection/deletion, and compact layouts from small phones to laptops.

On very short screens (under 560px high), the workbench allows page scrolling so controls remain accessible. Complex diagrams have an enlarge button for closer inspection.
