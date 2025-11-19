# Agent Guidelines

## Build & Lint
- Dev: `npm run dev`
- Build: `npm run build` (run this to verify types/build)
- Lint: `npm run lint`
- No test runner is currently configured.

## Code Style & Conventions
- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS.
- **UI Components**: Use shadcn/ui patterns in `src/components/ui`. Use `cn()` for class merging.
- **Imports**: Use `@/` alias for `src` directory (e.g., `import { Button } from "@/components/ui/button"`).
- **Naming**: PascalCase for components (`Board.tsx`), camelCase for utils/hooks.
- **State**: Prefer React hooks. Use `useCallback` for handlers passed to children or React Flow.
- **React Flow**: Custom nodes go in `src/components/board`. Type nodes explicitly (e.g., `Node<CardNodeData>`).
- **Type Safety**: Avoid `any`. Define interfaces for props and data structures.
- **File Structure**:
  - `src/app`: Pages and global layout.
  - `src/components`: UI and feature components.
  - `src/lib`: Utilities (`utils.ts`).
