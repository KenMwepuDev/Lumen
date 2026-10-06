# lumen-ds

Lumen Design System v2 — React component library for dense business workspaces (Dynamics 365–inspired + modern shell).

## Install

```bash
npm install lumen-ds
```

Local / monorepo (before publishing):

```bash
npm install ../path-to-Lumen
# or
npm pack && npm install ./lumen-ds-2.0.0.tgz
```

Peer dependencies: `react` and `react-dom` ≥ 18.

## Quick start

```tsx
import { LumenProvider, Button, Badge, ToastProvider } from 'lumen-ds';
import 'lumen-ds/styles.css';

export function App() {
  return (
    <LumenProvider style="d365" theme="auto" density="standard">
      <ToastProvider>
        <Button variant="primary">Enregistrer</Button>
        <Badge variant="ok">✓ Actif</Badge>
      </ToastProvider>
    </LumenProvider>
  );
}
```

Import `lumen-ds/styles.css` once at the app root. Styles are scoped under `.lumen` (the provider root) so they do not restyle the host page.

## Provider props

| Prop | Values | Default |
|------|--------|---------|
| `theme` | `auto` \| `light` \| `dark` | `auto` |
| `style` | `modern` \| `d365` | `modern` |
| `density` | `comfortable` \| `standard` \| `compact` | `standard` |

Controlled updates: pass `onThemeChange`, `onStyleChange`, `onDensityChange`.

## Components

**Actions:** `Button`, `IconButton`, `ImageButton`, `Chip`, `Dropdown`  
**Status:** `Badge`, `Kpi`, `Progress`, `Skeleton`, `Spinner`  
**Forms:** `Field`, `Input`, `Select`, `Textarea`, `SearchField`, `Checkbox`, `Radio`, `Switch`, `Range`, `InputGroup`, `FloatingLabel`, `FloatingSelect`, `Form` / `FormRow` / `FormActions`  
**Chrome:** `Card`, `Tabs`, `Banner`, `Dialog`, `Offcanvas`, `ToastProvider` / `useToast`, `Popover`, `Tooltip`  
**Navigation / content:** `Breadcrumb`, `Accordion`, `Carousel`, `Collapse`, `ListGroup`, `Scrollspy`  
**Data:** `Table` + `Pagination`, `DataGrid`, `ListHeader`  
**Layouts:** `AppShell`, `SplitLayout`, `SideNav`, `RecordHeader`, `ProcessStepper`

### List + editable grid

```tsx
import { ListHeader, DataGrid, useToast } from 'lumen-ds';

function Invoices() {
  const { toast } = useToast();
  return (
    <>
      <ListHeader
        title="Factures"
        commands={[
          { id: 'new', label: '＋ Créer', variant: 'primary' },
          { id: 'del', label: '🗑 Supprimer', variant: 'danger' },
        ]}
        onCommand={(id) => toast(id)}
        stats={[{ label: 'Total', value: '12' }]}
      />
      <DataGrid
        columns={[
          { key: 'n', label: 'N°', type: 'text' },
          { key: 'q', label: 'Qté', type: 'num' },
          { key: 'p', label: 'Prix', type: 'num' },
          { key: 'tot', label: 'Total', type: 'calc', compute: (r) => r.q * r.p },
        ]}
        rows={rows}
        onRowsChange={setRows}
      />
    </>
  );
}
```

`DataGrid` supports spreadsheet navigation: arrows, Enter/F2 to edit, Escape, Tab, Delete, and Ctrl/Cmd multi-row select.

## Develop

```bash
npm install
npm run dev      # showcase at http://localhost:5173
npm run build    # library → dist/
```

The original HTML reference remains at `Lumen Design System v2.html`.

## License

MIT
