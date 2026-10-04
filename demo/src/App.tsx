import { useEffect, useMemo, useState } from 'react';
import {
  AppShell,
  Badge,
  Banner,
  Button,
  Card,
  Chip,
  DataGrid,
  Dialog,
  Field,
  IconButton,
  Input,
  Kpi,
  ListHeader,
  LumenProvider,
  ProcessStepper,
  Progress,
  RecordHeader,
  SearchField,
  Select,
  SideNav,
  Skeleton,
  SplitLayout,
  Tabs,
  ToastProvider,
  useLumen,
  useToast,
  type DataGridColumn,
  type LumenDensity,
  type LumenStyle,
  type LumenTheme,
  type ProcessStep,
} from 'lumen-ds';
import { PALETTE_BASES, buildScale } from './palette';

const SECTIONS = [
  'Principes',
  'Tokens',
  'App Shell',
  'Composants',
  'Accessibilité',
  'Formulaires',
  'Volet IA',
  'Retours',
  'Archétypes',
  'Carte processus',
  'En-tête de liste',
  'Tableau éditable',
];

const PRINCIPLES: Array<[string, string]> = [
  ['Calme autour, précis dedans', 'Coques arrondies autour, grilles nettes à l\'intérieur.'],
  ['Densité à la demande', 'Confortable, Standard ou Compact.'],
  ['Accessibilité par défaut', 'Contraste AA, focus visible, jamais la couleur seule.'],
  ['Un seul primaire par zone', 'Le reste est tonal, outlined ou texte.'],
  ['Contexte permanent', 'Fil d\'Ariane, statut et filtres toujours visibles.'],
  ['Divulgation progressive', 'Menus ⋮, panneaux qui poussent le contenu.'],
];

const A11Y: Array<[string, string, string]> = [
  ['Contraste texte', '≥ 4,5:1, visé 7:1', '1.4.3 / 1.4.6'],
  ['Focus visible', 'Anneau 2 px, décalage 2 px', '2.4.7 / 2.4.11'],
  ['Cibles tactiles', '24 px mini, 40 px conseillé', '2.5.8'],
  ['Couleur non exclusive', 'Icône ou texte en plus', '1.4.1'],
  ['Clavier', 'Tout atteignable, Échap ferme', '2.1.1'],
  ['Mouvement réduit', 'prefers-reduced-motion respecté', '2.3.3'],
];

type Invoice = {
  id: number;
  n: string;
  cl: string;
  dt: string;
  st: string;
  q: number;
  p: number;
  e: string;
};

function isoOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function euro(v: number): string {
  return v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

const INITIAL_INVOICES: Invoice[] = (
  [
    ['Alpine Ski House', -6, 'En retard', 3, 1200, 'B1'],
    ['Coho Winery', 3, 'Ouverte', 10, 340, 'B1'],
    ['Fabrikam, Inc.', -20, 'Payée', 1, 9800, 'B1'],
    ['Northwind Traders', 5, 'Ouverte', 24, 75.5, 'B2'],
    ['Tailspin Toys', 30, 'Ouverte', 6, 420, 'B1'],
    ['Litware', -2, 'En retard', 2, 640, 'B1'],
  ] as const
).map((r, i) => ({
  id: i + 1,
  n: `F-2026-${String(i + 1).padStart(3, '0')}`,
  cl: r[0],
  dt: isoOffset(r[1]),
  st: r[2],
  q: r[3],
  p: r[4],
  e: r[5],
}));

const PROCESS_FIELDS = [
  { label: 'Contact existant ?', value: 'Adrian Dumitrascu', href: '#s10', complete: true },
  { label: 'Compte existant ?', value: 'Adventure Works', href: '#s10', complete: true },
  { label: "Délai d'achat", value: 'Cette année', complete: false },
  { label: 'Budget estimé', value: '5 116 000,00 €', complete: true },
  { label: "Processus d'achat", value: 'Comité', complete: true },
  { label: 'Décideur identifié', value: 'Complété', complete: false },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'q',
    label: 'Qualifier',
    requiredCount: 3,
    fields: PROCESS_FIELDS.map((f, i) => ({ ...f, complete: i < 3 })),
    daysInStep: 5,
    daysInProcess: 5,
    help: 'Identifiez le contact et le compte.',
  },
  {
    id: 'd',
    label: 'Développer',
    requiredCount: 4,
    fields: PROCESS_FIELDS.map((f, i) => ({ ...f, complete: i < 4 })),
    daysInStep: 3,
    daysInProcess: 8,
    help: 'Précisez le budget et le délai.',
  },
  {
    id: 'p',
    label: 'Proposer',
    requiredCount: 6,
    fields: PROCESS_FIELDS.map((f, i) => ({ ...f, complete: i < 6 && f.complete !== false ? f.complete : i < 4 })),
    daysInStep: 2,
    daysInProcess: 22,
    help: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit amet.',
  },
  {
    id: 'r',
    label: 'Remise',
    requiredCount: 6,
    fields: PROCESS_FIELDS.map((f) => ({ ...f, complete: true })),
    daysInStep: 4,
    daysInProcess: 26,
    help: 'Validez la remise avec le comité.',
  },
  {
    id: 'c',
    label: 'Conclure',
    requiredCount: 6,
    fields: PROCESS_FIELDS.map((f) => ({ ...f, complete: true })),
    daysInStep: 1,
    daysInProcess: 27,
    help: 'Obtenez la signature du décideur.',
  },
  {
    id: 't',
    label: 'Terminé',
    doneMessage: 'Lead qualifié : le processus est terminé.',
  },
];

// Fix step 2 fields to match original BN logic more closely
PROCESS_STEPS[2].fields = PROCESS_FIELDS.map((f, i) => ({ ...f, complete: i < 6 }));

function Toolbar() {
  const { theme, style, density, setTheme, setStyle, setDensity } = useLumen();
  return (
    <header className="top">
      <b>Lumen Design System</b>
      <span className="v">v2 · WCAG 2.2 AA</span>
      <span className="sp" />
      <div className="row" role="group" aria-label="Thème">
        {(['auto', 'light', 'dark'] as LumenTheme[]).map((t) => (
          <Chip key={t} pressed={theme === t} onClick={() => setTheme(t)}>
            {t === 'auto' ? 'Auto' : t === 'light' ? 'Clair' : 'Sombre'}
          </Chip>
        ))}
      </div>
      <div className="row" role="group" aria-label="Style">
        {(['modern', 'd365'] as LumenStyle[]).map((s) => (
          <Chip key={s} pressed={style === s} onClick={() => setStyle(s)}>
            {s === 'modern' ? 'Moderne' : 'Dynamics 365'}
          </Chip>
        ))}
      </div>
      <div className="row" role="group" aria-label="Densité">
        {(['comfortable', 'standard', 'compact'] as LumenDensity[]).map((d) => (
          <Chip key={d} pressed={density === d} onClick={() => setDensity(d)}>
            {d === 'comfortable' ? 'Confortable' : d === 'standard' ? 'Standard' : 'Compact'}
          </Chip>
        ))}
      </div>
    </header>
  );
}

function Showcase() {
  const { toast } = useToast();
  const [currentNav, setCurrentNav] = useState('s1');
  const [pill, setPill] = useState(0);
  const [tab, setTab] = useState('a');
  const [chips, setChips] = useState({ pdf: true, owner: false, date: false });
  const [siren, setSiren] = useState('84930');
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'bot' | 'user'; text: string }>>([
    { role: 'bot', text: 'Bonjour, que souhaitez-vous savoir sur ce compte ?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [bannerVisible, setBannerVisible] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(2);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [nextId, setNextId] = useState(7);
  const [selected, setSelected] = useState<Array<string | number>>([]);
  const [compact, setCompact] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [fe, setFe] = useState('B1');
  const [fa, setFa] = useState(`${isoOffset(-60)}T00:00`);
  const [fb, setFb] = useState(`${isoOffset(90)}T23:59`);
  const [fq, setFq] = useState('');
  const [fs, setFs] = useState('');
  const [activeHint, setActiveHint] = useState('');
  const [appNav, setAppNav] = useState('Comptes');

  const sirenOk = /^\d{9}$/.test(siren);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrentNav(e.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const visible = useMemo(() => {
    const a = fa.slice(0, 10);
    const b = fb.slice(0, 10);
    const q = fq.toLowerCase();
    return invoices.filter(
      (r) =>
        (!fe || r.e === fe) &&
        (!fs || r.st === fs) &&
        (!q || `${r.n}${r.cl}`.toLowerCase().includes(q)) &&
        (!a || r.dt >= a) &&
        (!b || r.dt <= b),
    );
  }, [invoices, fe, fa, fb, fq, fs]);

  const gridColumns: DataGridColumn<Invoice>[] = useMemo(
    () => [
      { key: 'n', label: 'N° facture', type: 'text' },
      { key: 'cl', label: 'Client', type: 'text' },
      { key: 'dt', label: 'Échéance', type: 'date' },
      {
        key: 'st',
        label: 'Statut',
        type: 'sel',
        options: ['Ouverte', 'En retard', 'Payée'],
        badgeMap: {
          Payée: { variant: 'ok', prefix: '✓ ' },
          'En retard': { variant: 'error', prefix: '⚠ ' },
          Ouverte: { variant: 'info', prefix: 'ⓘ ' },
        },
      },
      { key: 'q', label: 'Quantité', type: 'num' },
      { key: 'p', label: 'Prix unitaire (€)', type: 'num' },
      {
        key: 'tot',
        label: 'Total (€)',
        type: 'calc',
        compute: (r) => (+r.q || 0) * (+r.p || 0),
      },
    ],
    [],
  );

  const openTotal = invoices
    .filter((r) => r.st === 'Ouverte')
    .reduce((a, r) => a + r.q * r.p, 0);
  const due7 = invoices.filter(
    (r) => r.st === 'Ouverte' && r.dt >= isoOffset(0) && r.dt <= isoOffset(7),
  ).length;
  const late = invoices.filter((r) => r.st === 'En retard').length;

  const bpfStatus = step < 2 ? 'Nouveau' : step < 5 ? 'En cours' : 'Qualifié';

  const sendChat = () => {
    const v = chatInput.trim();
    if (!v) return;
    setMessages((m) => [...m, { role: 'user', text: v }]);
    setChatInput('');
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: 'Réponse de démonstration : je résume ce compte dès qu\'il est connecté à vos données.',
        },
      ]);
    }, 500);
  };

  const navItems = SECTIONS.map((s, i) => ({
    id: `s${i + 1}`,
    href: `#s${i + 1}`,
    label: `${i + 1}. ${s}`,
  }));

  return (
    <>
      <Toolbar />
      <div className="lay">
        <SideNav items={navItems} currentId={currentNav} />
        <main>
          <section style={{ marginBottom: 28 }}>
            <h1>Lumen</h1>
            <p className="sub">
              Légèreté de Drive pour l&apos;enveloppe, rigueur de Dynamics 365 pour les données.
              Cliquez sur une teinte pour copier son code.
            </p>
            <div className="bento">
              <div className="pal">
                {PALETTE_BASES.map(([name, hex]) => {
                  const dark = parseInt(hex.slice(1, 3), 16) < 150;
                  return (
                    <div className="ps" key={name}>
                      <div
                        className="h"
                        style={{ background: hex, color: dark ? '#fff' : '#1B2430' }}
                      >
                        <span>{name}</span>
                        <span>{hex}</span>
                      </div>
                      <div className="sc">
                        {buildScale(hex).map((c) => (
                          <i
                            key={c + name}
                            style={{ background: c }}
                            title={c}
                            onClick={() => {
                              navigator.clipboard?.writeText(c).catch(() => {});
                              toast(`Copié : ${c.toUpperCase()}`);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Card>
                <div className="tl">
                  <span>Headline</span>
                  <span>Inter</span>
                </div>
                <div className="aa" style={{ fontWeight: 500 }}>
                  Aa
                </div>
              </Card>
              <Card>
                <div className="row">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="inverted">Inverted</Button>
                  <Button variant="outlined">Outlined</Button>
                </div>
              </Card>
              <Card style={{ display: 'grid', placeItems: 'center' }}>
                <SearchField placeholder="Search" aria-label="Search" style={{ width: '100%' }} />
              </Card>
              <Card>
                <div className="tl">
                  <span>Body</span>
                  <span>Inter</span>
                </div>
                <div className="aa" style={{ color: 'var(--tx2)' }}>
                  Aa
                </div>
              </Card>
              <Card style={{ display: 'grid', alignContent: 'center' }}>
                <Progress value={70} />
                <Progress value={85} color="var(--sec)" />
                <Progress value={55} color="var(--tx2)" />
              </Card>
              <Card style={{ display: 'grid', alignContent: 'center' }}>
                <div className="pill">
                  {['⌂', '⌕', '☺'].map((icon, i) => (
                    <button
                      key={icon}
                      type="button"
                      aria-pressed={pill === i}
                      aria-label={['Accueil', 'Recherche', 'Profil'][i]}
                      onClick={() => setPill(i)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </Card>
              <Card>
                <div className="tl">
                  <span>Label</span>
                  <span>Inter</span>
                </div>
                <div className="aa" style={{ color: 'var(--tx2)', fontWeight: 500 }}>
                  Aa
                </div>
              </Card>
              <Card style={{ display: 'grid', placeItems: 'center' }}>
                <IconButton shape="square" aria-label="Modifier">
                  ✎
                </IconButton>
              </Card>
              <Card style={{ display: 'grid', placeItems: 'center' }}>
                <Button variant="primary">✎ Label</Button>
              </Card>
              <Card style={{ gridColumn: 'span 2' }}>
                <div className="row" style={{ justifyContent: 'space-around' }}>
                  <IconButton background="var(--ac)" aria-label="Magie">
                    ✦
                  </IconButton>
                  <IconButton background="var(--sec)" aria-label="Formes">
                    ▲
                  </IconButton>
                  <IconButton background="#3A4650" aria-label="Étiquette">
                    ⬖
                  </IconButton>
                  <IconButton background="#C93434" aria-label="Supprimer">
                    🗑
                  </IconButton>
                </div>
              </Card>
            </div>
          </section>

          <section id="s1">
            <h2>1. Les 6 principes directeurs</h2>
            <p className="sub">Le cadre est doux et aéré, la zone de travail est précise et dense.</p>
            <div className="g g3">
              {PRINCIPLES.map(([t, d], i) => (
                <Card soft key={t}>
                  <b>
                    {i + 1}. {t}
                  </b>
                  <div className="hint" style={{ fontSize: 13 }}>
                    {d}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section id="s2">
            <h2>2. Tokens et échelles</h2>
            <p className="sub">
              Formes, élévations, typographie. Les échelles de couleur sont dans le bandeau du haut.
            </p>
            <div className="g g3">
              <Card>
                <h3>RAYONS</h3>
                <div className="row">
                  <Badge>sm 4</Badge>
                  <Badge>md 8</Badge>
                  <Badge>lg 16</Badge>
                  <Badge>pill 999</Badge>
                </div>
              </Card>
              <Card>
                <h3>ÉLÉVATION</h3>
                <div className="row">
                  <div
                    style={{
                      width: 60,
                      height: 36,
                      background: 'var(--sf)',
                      border: '1px solid var(--bd)',
                      borderRadius: 8,
                    }}
                  />
                  <div
                    style={{
                      width: 60,
                      height: 36,
                      background: 'var(--sf)',
                      borderRadius: 8,
                      boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                    }}
                  />
                  <div
                    style={{
                      width: 60,
                      height: 36,
                      background: 'var(--sf)',
                      borderRadius: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,.25)',
                    }}
                  />
                </div>
              </Card>
              <Card>
                <h3>TYPOGRAPHIE</h3>
                <div style={{ fontSize: 28, lineHeight: '36px', fontWeight: 500 }}>Display 28</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Section 18</div>
                <div>
                  Corps 14 · <span style={{ fontSize: 12, color: 'var(--tx2)' }}>Libellé 12</span>
                </div>
              </Card>
            </div>
          </section>

          <section id="s3">
            <h2>3. Prototype vivant : App Shell</h2>
            <p className="sub">Navigation, commandes, KPI, onglets : essayez-les.</p>
            <AppShell
              nav={
                <>
                  <Button variant="tonal" style={{ marginBottom: 8 }}>
                    ＋ Nouveau
                  </Button>
                  {['Comptes', 'Contacts', 'Opportunités'].map((n) => (
                    <a
                      key={n}
                      href="#s3"
                      className={appNav === n ? 'on' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setAppNav(n);
                      }}
                    >
                      {n}
                    </a>
                  ))}
                </>
              }
            >
              <div className="hint">Comptes › Acme Corporation</div>
              <div className="row" style={{ margin: '4px 0' }}>
                <b style={{ fontSize: 22, fontWeight: 500 }}>Acme Corporation</b>
                <Badge variant="ok">✓ Enregistré</Badge>
              </div>
              <div className="row">
                <Button variant="primary" onClick={() => toast('Enregistré')}>
                  Enregistrer
                </Button>
                <Button variant="text" onClick={() => toast('Qualifié')}>
                  Qualifier
                </Button>
                <Button variant="text" onClick={() => toast('Partagé')}>
                  Partager
                </Button>
              </div>
              <div className="g g3" style={{ marginTop: 12 }}>
                <Kpi label="Revenus" value="1 450 k€" description="Chiffre d'affaires annuel" />
                <Kpi
                  variant="ok"
                  label="Pipeline"
                  value="12"
                  description="Opportunités ouvertes"
                />
              </div>
              <Tabs
                items={[
                  { id: 'a', label: 'Activités' },
                  { id: 'c', label: 'Contacts' },
                  { id: 'd', label: 'Documents' },
                ]}
                value={tab}
                onValueChange={setTab}
              />
              <div className="hint">
                {
                  {
                    a: "Dernières activités : appel de suivi (hier), e-mail d'introduction (12 sept.).",
                    c: '3 contacts liés : A. Dumitrascu, M. Cook, S. Chai.',
                    d: '2 documents : devis-2026.pdf, contrat.pdf.',
                  }[tab]
                }
              </div>
            </AppShell>
          </section>

          <section id="s4">
            <h2>4. Catalogue des composants</h2>
            <p className="sub">Un seul bouton primaire par zone.</p>
            <div className="g g2">
              <Card>
                <h3>BOUTONS</h3>
                <div className="row">
                  <Button variant="primary">Primaire</Button>
                  <Button variant="tonal">✦ Assistant</Button>
                  <Button variant="outlined">Outlined</Button>
                  <Button variant="text">Texte</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="primary" disabled>
                    Désactivé
                  </Button>
                </div>
              </Card>
              <Card>
                <h3>BADGES DE STATUT</h3>
                <div className="row">
                  <Badge variant="ok">✓ Actif</Badge>
                  <Badge variant="warn">⏱ En attente</Badge>
                  <Badge variant="error">⚠ Erreur</Badge>
                  <Badge variant="info">ⓘ Nouveau</Badge>
                </div>
                <h3 style={{ marginTop: 14 }}>CHIPS DE FILTRE</h3>
                <div className="row">
                  <Chip
                    pressed={chips.pdf}
                    onClick={() => setChips((c) => ({ ...c, pdf: !c.pdf }))}
                  >
                    Type : PDF
                  </Chip>
                  <Chip
                    pressed={chips.owner}
                    onClick={() => setChips((c) => ({ ...c, owner: !c.owner }))}
                  >
                    Propriétaire
                  </Chip>
                  <Chip
                    pressed={chips.date}
                    onClick={() => setChips((c) => ({ ...c, date: !c.date }))}
                  >
                    Date
                  </Chip>
                </div>
              </Card>
            </div>
          </section>

          <section id="s5">
            <h2>5. Matrice d&apos;accessibilité WCAG 2.2</h2>
            <p className="sub">Règles non négociables.</p>
            <Card className="tw" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Domaine</th>
                    <th>Règle Lumen</th>
                    <th>Critère</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {A11Y.map((r) => (
                    <tr key={r[0]}>
                      <td>
                        <b>{r[0]}</b>
                      </td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td>
                        <Badge variant="ok">✓ Conforme</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          <section id="s6">
            <h2>6. Formulaires avancés et validation</h2>
            <p className="sub">Saisissez 9 chiffres dans le champ SIREN pour valider.</p>
            <div className="g g2">
              <Field label="Raison sociale" required htmlFor="f1">
                <Input id="f1" defaultValue="Acme Corporation" />
              </Field>
              <Field
                label="Site web (recommandé)"
                htmlFor="f2"
                hint="Facilite l'enrichissement automatique."
              >
                <Input id="f2" placeholder="https://exemple.com" />
              </Field>
              <div>
                <label className="f" htmlFor="f3">
                  SIREN <span style={{ color: 'var(--er)' }}>*</span>
                </label>
                <Input
                  id="f3"
                  value={siren}
                  inputMode="numeric"
                  invalid={!sirenOk}
                  onChange={(e) => setSiren(e.target.value)}
                  aria-describedby="m3"
                />
                <div
                  className="er"
                  id="m3"
                  style={{ color: sirenOk ? 'var(--ok)' : undefined }}
                >
                  {sirenOk
                    ? '✓ SIREN valide'
                    : '⚠ Le SIREN doit contenir exactement 9 chiffres.'}
                </div>
              </div>
              <Field label="Identifiant système (lecture seule)" htmlFor="f4">
                <Input id="f4" disabled value="9a8f54-577-4682-a1fc" />
              </Field>
              <Field label="Secteur d'activité" htmlFor="f5">
                <Select id="f5" defaultValue="Industrie manufacturière">
                  <option>Industrie manufacturière</option>
                  <option>Services</option>
                  <option>Commerce</option>
                </Select>
              </Field>
              <Field label="Date d'échéance" htmlFor="f6">
                <Input id="f6" type="date" defaultValue="2026-10-31" />
              </Field>
            </div>
          </section>

          <section id="s7">
            <h2>7. Volet latéral et assistant IA</h2>
            <p className="sub">Le volet pousse le contenu au lieu de le recouvrir.</p>
            <SplitLayout
              open={aiOpen}
              panelLabel="Assistant"
              main={
                <Card>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <b>Vue centrale compressée</b>
                    <Button
                      variant="tonal"
                      aria-expanded={aiOpen}
                      onClick={() => setAiOpen((o) => !o)}
                    >
                      ✦ Assistant
                    </Button>
                  </div>
                  <Kpi
                    style={{ marginTop: 12 }}
                    label="Proposition"
                    value="1 450 000 €"
                    description="Offre estimée"
                  />
                  <Badge variant="warn" style={{ marginTop: 10 }}>
                    En proposition
                  </Badge>
                </Card>
              }
              panel={
                <>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <b>✦ Assistant</b>
                    <Button variant="text" aria-label="Fermer" onClick={() => setAiOpen(false)}>
                      ✕
                    </Button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {messages.map((m, i) => (
                      <div key={i} className={m.role === 'user' ? 'msg u' : 'msg'}>
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <div className="row" style={{ flexWrap: 'nowrap' }}>
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') sendChat();
                      }}
                      placeholder="Votre message"
                      aria-label="Message"
                    />
                    <Button variant="primary" aria-label="Envoyer" onClick={sendChat}>
                      ➤
                    </Button>
                  </div>
                </>
              }
            />
          </section>

          <section id="s8">
            <h2>8. Retours, dialogues et toasts</h2>
            <p className="sub">Le rouge plein n&apos;apparaît que dans la confirmation.</p>
            {bannerVisible && (
              <Banner
                style={{ marginBottom: 12 }}
                onDismiss={() => setBannerVisible(false)}
              >
                ⓘ Mise à jour planifiée samedi à 22h.
              </Banner>
            )}
            <div className="g g2">
              <Card>
                <h3>TOAST</h3>
                <Button variant="outlined" onClick={() => toast('3 éléments archivés')}>
                  Archiver 3 éléments
                </Button>
              </Card>
              <Card>
                <h3>DIALOGUE</h3>
                <Button variant="danger" onClick={() => setDialogOpen(true)}>
                  Supprimer le compte
                </Button>
              </Card>
              <Card>
                <h3>SKELETON</h3>
                <Skeleton width="80%" />
                <Skeleton />
                <Skeleton width="60%" />
              </Card>
            </div>
          </section>

          <section id="s9">
            <h2>9. Archétypes de pages</h2>
            <p className="sub">Trois gabarits réutilisables.</p>
            <div className="g g3">
              <Card>
                <b>A · Liste et grille</b>
                <div className="wf" style={{ margin: '10px 0' }}>
                  <i className="a" />
                  <i />
                </div>
                <div className="hint">Filtres en chips, tri, actions groupées.</div>
              </Card>
              <Card>
                <b>B · Fiche 360°</b>
                <div
                  className="wf"
                  style={{ margin: '10px 0', gridTemplateColumns: '1fr 70px' }}
                >
                  <i />
                  <i className="a" />
                </div>
                <div className="hint">En-tête, processus, onglets, volet de contexte.</div>
              </Card>
              <Card>
                <b>C · Tableau de bord</b>
                <div
                  className="wf"
                  style={{ margin: '10px 0', gridTemplateColumns: '1fr 1fr 1fr' }}
                >
                  <i className="a" />
                  <i className="a" />
                  <i className="a" />
                </div>
                <div className="hint">KPI, graphiques avec alternative tableau.</div>
              </Card>
            </div>
          </section>

          <section id="s10">
            <h2>10. Carte de processus (en-tête d&apos;enregistrement + BPF)</h2>
            <p className="sub">
              Carte « dashboard » inspirée de Dynamics 365 : en-tête, chevrons d&apos;étapes, panneau
              de champs, délais et aide. Cliquez sur une étape.
            </p>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <RecordHeader
                entity="LEAD ▾"
                title="Gabriele Cannata"
                fields={[
                  { label: 'Source du lead', value: 'Publicité' },
                  { label: 'Évaluation', value: 'Chaud' },
                  { label: 'Statut', value: bpfStatus },
                  {
                    label: 'Propriétaire',
                    value: 'Katie Jordan',
                    hint: 'Resp. commercial',
                  },
                ]}
              />
              <ProcessStepper
                steps={PROCESS_STEPS}
                currentIndex={step}
                onStepChange={setStep}
              />
            </Card>
          </section>

          <section id="s11">
            <h2>11. En-tête de liste (commandes, filtres, synthèse)</h2>
            <p className="sub">
              Trois niveaux : barre de commandes, titre + filtres, indicateurs en ligne. Il pilote le
              tableau juste en dessous : filtrez, créez, supprimez, exportez.
            </p>
            <ListHeader
              title="Factures ⌄"
              subtitle="Facturation"
              commands={[
                { id: 'back', label: '←' },
                { id: 'view', label: '▦ Afficher comme ⌄', separatorBefore: true },
                { id: 'chart', label: '▥ Afficher graphique' },
                { id: 'new', label: '＋ Créer une facture', variant: 'primary' },
                {
                  id: 'del',
                  label: '🗑 Supprimer',
                  variant: 'danger',
                  disabled: selected.length === 0,
                },
                { id: 'Visualiser', label: '◔ Visualiser', separatorBefore: true },
                { id: 'exp', label: '⤓ Exporter' },
                { id: 'Importer', label: '⤒ Importer' },
                { id: 'Tableaux de bord', label: '▣ Tableaux de bord' },
              ]}
              trailing={
                <Button
                  variant="outlined"
                  style={{ height: 30, fontWeight: 700 }}
                  onClick={() => toast('Partagé (démo)')}
                >
                  Share
                </Button>
              }
              filters={
                <>
                  <Select
                    value={fe}
                    onChange={(e) => setFe(e.target.value)}
                    aria-label="Société"
                    style={{ width: 'auto', minWidth: 130 }}
                  >
                    <option>B1</option>
                    <option>B2</option>
                    <option value="">Toutes</option>
                  </Select>
                  <Input
                    type="datetime-local"
                    value={fa}
                    onChange={(e) => setFa(e.target.value)}
                    aria-label="Du"
                    style={{ width: 'auto', minWidth: 130 }}
                  />
                  <Input
                    type="datetime-local"
                    value={fb}
                    onChange={(e) => setFb(e.target.value)}
                    aria-label="Au"
                    style={{ width: 'auto', minWidth: 130 }}
                  />
                  <Input
                    value={fq}
                    onChange={(e) => setFq(e.target.value)}
                    placeholder="Rechercher une facture…"
                    aria-label="Rechercher"
                    style={{ width: 'auto', minWidth: 130 }}
                  />
                  <Select
                    value={fs}
                    onChange={(e) => setFs(e.target.value)}
                    aria-label="Statut"
                    style={{ width: 'auto', minWidth: 130 }}
                  >
                    <option value="">Tous</option>
                    <option>Ouverte</option>
                    <option>En retard</option>
                    <option>Payée</option>
                  </Select>
                </>
              }
              stats={[
                { label: 'Factures ouvertes', value: euro(openTotal) },
                { label: 'Échéances sous 7 jours', value: due7 },
                { label: 'Nombre de factures', value: invoices.length },
                { label: 'Factures en retard', value: late },
              ]}
              onCommand={(id) => {
                if (id === 'new') {
                  const r: Invoice = {
                    id: nextId,
                    n: `F-2026-${String(nextId).padStart(3, '0')}`,
                    cl: '',
                    dt: isoOffset(14),
                    st: 'Ouverte',
                    q: 1,
                    p: 0,
                    e: fe || 'B1',
                  };
                  setNextId((n) => n + 1);
                  setInvoices((rows) => [...rows, r]);
                  setFq('');
                  setFs('');
                  toast('Facture créée');
                } else if (id === 'del') {
                  const n = selected.length;
                  setInvoices((rows) => rows.filter((r) => !selected.includes(r.id)));
                  setSelected([]);
                  toast(`${n} facture(s) supprimée(s)`);
                } else if (id === 'chart') {
                  setChartOpen((o) => !o);
                } else if (id === 'view') {
                  setCompact((c) => {
                    toast(c ? 'Affichage standard' : 'Affichage compact');
                    return !c;
                  });
                } else if (id === 'exp') {
                  const t =
                    'N°;Client;Échéance;Statut;Qté;Prix;Total\n' +
                    visible
                      .map((r) =>
                        [r.n, r.cl, r.dt, r.st, r.q, r.p, r.q * r.p].join(';'),
                      )
                      .join('\n');
                  navigator.clipboard?.writeText(t).catch(() => {});
                  toast('CSV copié dans le presse-papiers');
                } else {
                  toast(id === 'back' ? 'Retour' : `${id} (démo)`);
                }
              }}
            />
          </section>

          <section id="s12">
            <h2>12. Tableau éditable (style tableur)</h2>
            <p className="sub">
              Cliquez une cellule, flèches pour naviguer, Entrée ou F2 pour éditer, Échap pour
              annuler, Tab pour avancer, Suppr pour vider. Cliquez le numéro de ligne pour
              sélectionner (Ctrl pour plusieurs). La colonne Total est calculée.
            </p>
            {chartOpen && (
              <Card style={{ marginBottom: 12 }}>
                <h3>TOTAL PAR STATUT</h3>
                {(['Ouverte', 'En retard', 'Payée'] as const).map((st, i) => {
                  const sum = invoices
                    .filter((r) => r.st === st)
                    .reduce((a, r) => a + r.q * r.p, 0);
                  const mx =
                    Math.max(
                      ...['Ouverte', 'En retard', 'Payée'].map((t) =>
                        invoices
                          .filter((r) => r.st === t)
                          .reduce((a, r) => a + r.q * r.p, 0),
                      ),
                    ) || 1;
                  return (
                    <div className="row" style={{ flexWrap: 'nowrap' }} key={st}>
                      <span style={{ width: 80 }}>{st}</span>
                      <Progress
                        value={(sum / mx) * 100}
                        color={['var(--ac)', 'var(--er)', 'var(--ok)'][i]}
                        style={{ flex: 1 }}
                      />
                      <b style={{ width: 110, textAlign: 'right' }}>{euro(sum)}</b>
                    </div>
                  );
                })}
              </Card>
            )}
            <DataGrid
              columns={gridColumns}
              rows={visible}
              onRowsChange={(next) => {
                // Merge visible edits back into full list
                setInvoices((all) =>
                  all.map((r) => next.find((n) => n.id === r.id) ?? r),
                );
              }}
              selectedIds={selected}
              onSelectedIdsChange={setSelected}
              compact={compact}
              aria-label="Factures éditables"
              footerLabel={(n) => `${n} facture(s)`}
              onActiveCellChange={(info) => {
                if (!info) {
                  setActiveHint('');
                  return;
                }
                const ri = visible.findIndex((r) => r.id === info.rowId);
                setActiveHint(
                  `Cellule active : ${String.fromCharCode(65 + info.colIndex)}${ri + 1}`,
                );
              }}
            />
            <div className="hint" style={{ marginTop: 6 }}>
              {activeHint}
            </div>
          </section>
        </main>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <h3 style={{ fontSize: 18, color: 'var(--tx)', margin: '0 0 8px' }}>
          Supprimer Acme Corporation ?
        </h3>
        <p style={{ color: 'var(--tx2)', margin: '0 0 20px' }}>
          Cette action supprime définitivement le compte. Elle ne peut pas être annulée.
        </p>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setDialogOpen(false);
              toast('Suppression simulée');
            }}
          >
            Supprimer
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export function App() {
  const [theme, setTheme] = useState<LumenTheme>('auto');
  const [style, setStyle] = useState<LumenStyle>('d365');
  const [density, setDensity] = useState<LumenDensity>('standard');

  return (
    <LumenProvider
      theme={theme}
      style={style}
      density={density}
      onThemeChange={setTheme}
      onStyleChange={setStyle}
      onDensityChange={setDensity}
    >
      <ToastProvider>
        <Showcase />
      </ToastProvider>
    </LumenProvider>
  );
}
