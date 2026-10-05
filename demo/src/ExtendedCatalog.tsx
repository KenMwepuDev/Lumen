import { useState } from 'react';
import {
  Accordion,
  Breadcrumb,
  Button,
  Card,
  Carousel,
  Checkbox,
  Collapse,
  Dropdown,
  Field,
  FloatingLabel,
  FloatingSelect,
  Form,
  FormActions,
  FormRow,
  Input,
  InputGroup,
  ListGroup,
  Offcanvas,
  Popover,
  Progress,
  Radio,
  Range,
  Scrollspy,
  Spinner,
  Switch,
  Table,
  Tooltip,
  useToast,
} from 'lumen-ds';

const TABLE_ROWS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Compte ${i + 1}`,
  status: i % 3 === 0 ? 'Actif' : i % 3 === 1 ? 'En attente' : 'Clos',
  amount: (i + 1) * 120,
}));

export function ExtendedCatalog() {
  const { toast, push } = useToast();
  const [offOpen, setOffOpen] = useState(false);
  const [offSize, setOffSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [offWidth, setOffWidth] = useState(400);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [range, setRange] = useState(40);
  const [listActive, setListActive] = useState('a');
  const [plan, setPlan] = useState('pro');

  return (
    <>
      <section id="s13">
        <h2>13. Offcanvas, dropdown, contrôles</h2>
        <p className="sub">Panneau latéral droit avec backdrop, menus et champs de formulaire.</p>
        <div className="g g2">
          <Card>
            <h3>OFFCANVAS (DROITE · REDIMENSIONNABLE)</h3>
            <div className="row">
              <Button variant="primary" onClick={() => setOffOpen(true)}>
                Ouvrir le panneau
              </Button>
            </div>
            <div className="oc-sizes">
              {([
                ['sm', 320],
                ['md', 400],
                ['lg', 520],
                ['xl', 640],
              ] as const).map(([id, w]) => (
                <Button
                  key={id}
                  variant={offSize === id ? 'primary' : 'outlined'}
                  onClick={() => {
                    setOffSize(id);
                    setOffWidth(w);
                    setOffOpen(true);
                  }}
                >
                  {id.toUpperCase()}
                </Button>
              ))}
            </div>
            <p className="hint">
              Tirez la poignée sur le bord gauche, ou choisissez une taille (sm → xl). Largeur :
              {` ${offWidth}px`}
            </p>
            <Offcanvas
              open={offOpen}
              onClose={() => setOffOpen(false)}
              title="Détails du compte"
              size={offSize}
              width={offWidth}
              onWidthChange={setOffWidth}
              resizable
              footer={
                <>
                  <Button variant="secondary" onClick={() => setOffOpen(false)}>
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setOffOpen(false);
                      toast('Enregistré', 'ok');
                    }}
                  >
                    Enregistrer
                  </Button>
                </>
              }
            >
              <p className="hint" style={{ marginTop: 0 }}>
                Poignée verticale à gauche pour redimensionner. Backdrop + Échap ferment le panneau.
              </p>
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} style={{ margin: '8px 0' }}>
                  Ligne de contenu {i + 1} — utile pour tester le défilement interne.
                </p>
              ))}
            </Offcanvas>
          </Card>
          <Card>
            <h3>BUTTON DROPDOWN</h3>
            <div className="row">
              <Dropdown
                label="Actions"
                variant="primary"
                items={[
                  { id: 'edit', label: 'Modifier' },
                  { id: 'share', label: 'Partager' },
                  { id: 'del', label: 'Supprimer', danger: true, separatorBefore: true },
                ]}
                onSelect={(id) => toast(`Action : ${id}`)}
              />
              <Dropdown
                label="Plus"
                align="end"
                items={[
                  { id: 'export', label: 'Exporter' },
                  { id: 'print', label: 'Imprimer', disabled: true },
                ]}
                onSelect={(id) => toast(id)}
              />
            </div>
          </Card>
          <Card>
            <h3>CHECKS & RADIOS</h3>
            <div className="g" style={{ gap: 10 }}>
              <Checkbox label="Notifications e-mail" defaultChecked />
              <Checkbox label="Option désactivée" disabled />
              <Radio name="plan" value="free" label="Gratuit" checked={plan === 'free'} onChange={() => setPlan('free')} />
              <Radio name="plan" value="pro" label="Pro" checked={plan === 'pro'} onChange={() => setPlan('pro')} />
              <Switch label="Mode compact" defaultChecked />
            </div>
          </Card>
          <Card>
            <h3>RANGE</h3>
            <Range
              label="Priorité"
              min={0}
              max={100}
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
            />
          </Card>
        </div>
      </section>

      <section id="s14">
        <h2>14. Formulaires avancés</h2>
        <p className="sub">Input group, floating labels et composition Form.</p>
        <Card>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              toast('Formulaire envoyé', 'ok');
            }}
          >
            <FormRow>
              <Field label="Input group">
                <InputGroup prepend="https://" append=".com">
                  <Input placeholder="acme" aria-label="Domaine" />
                </InputGroup>
              </Field>
              <FloatingLabel label="E-mail" type="email" name="email" />
            </FormRow>
            <FormRow>
              <FloatingSelect label="Pays" defaultValue="fr">
                <option value="fr">France</option>
                <option value="be">Belgique</option>
                <option value="ch">Suisse</option>
              </FloatingSelect>
              <FloatingLabel label="Téléphone" type="tel" name="phone" />
            </FormRow>
            <FormActions>
              <Button type="reset" variant="outlined">
                Réinitialiser
              </Button>
              <Button type="submit" variant="primary">
                Envoyer
              </Button>
            </FormActions>
          </Form>
        </Card>
      </section>

      <section id="s15">
        <h2>15. Navigation & contenu</h2>
        <p className="sub">Accordion, breadcrumb, carousel, collapse, list group.</p>
        <div className="g g2">
          <Card>
            <h3>BREADCRUMB</h3>
            <Breadcrumb
              items={[
                { id: 'h', label: 'Accueil', href: '#s15' },
                { id: 'c', label: 'Comptes', href: '#s15' },
                { id: 'a', label: 'Acme Corporation' },
              ]}
            />
            <h3 style={{ marginTop: 16 }}>ACCORDION</h3>
            <Accordion
              defaultOpenIds={['1']}
              items={[
                { id: '1', title: 'Résumé', content: 'Vue condensée du compte et des KPI.' },
                { id: '2', title: 'Contacts', content: '3 contacts liés à ce compte.' },
                { id: '3', title: 'Documents', content: 'Devis et contrats associés.' },
              ]}
            />
          </Card>
          <Card>
            <h3>CAROUSEL</h3>
            <Carousel
              slides={[
                { id: '1', content: <div><b>Slide 1</b><div className="hint">Bienvenue dans Lumen</div></div> },
                { id: '2', content: <div><b>Slide 2</b><div className="hint">Composants métier prêts</div></div> },
                { id: '3', content: <div><b>Slide 3</b><div className="hint">Dynamics + Moderne</div></div> },
              ]}
            />
            <h3 style={{ marginTop: 16 }}>COLLAPSE</h3>
            <Button variant="tonal" onClick={() => setCollapseOpen((o) => !o)} aria-expanded={collapseOpen}>
              {collapseOpen ? 'Masquer' : 'Afficher'} les détails
            </Button>
            <Collapse open={collapseOpen}>
              <p className="hint" style={{ marginTop: 10 }}>
                Contenu dévoilé progressivement — idéal pour les filtres avancés.
              </p>
            </Collapse>
            <h3 style={{ marginTop: 16 }}>LIST GROUP</h3>
            <ListGroup
              items={[
                { id: 'a', label: 'Activités', meta: '12', active: listActive === 'a', action: true },
                { id: 'b', label: 'Opportunités', meta: '4', active: listActive === 'b', action: true },
                { id: 'c', label: 'Archivés', meta: '9', active: listActive === 'c', action: true },
              ]}
              onSelect={setListActive}
            />
          </Card>
        </div>
      </section>

      <section id="s16">
        <h2>16. Table paginée, progress, feedback</h2>
        <p className="sub">Table + pagination, progress enrichi, popovers, tooltips, spinners, toasts, scrollspy.</p>
        <div className="g g2">
          <Card style={{ gridColumn: '1 / -1' }}>
            <h3>TABLE + PAGINATION</h3>
            <Table
              pageSize={5}
              columns={[
                { key: 'name', header: 'Compte', cell: (r) => r.name },
                { key: 'status', header: 'Statut', cell: (r) => r.status },
                {
                  key: 'amount',
                  header: 'Montant',
                  cell: (r) => r.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
                },
              ]}
              rows={TABLE_ROWS}
            />
          </Card>
          <Card>
            <h3>PROGRESS</h3>
            <Progress value={35} label="Profil" showValue />
            <Progress value={70} label="Pipeline" showValue color="var(--ok)" striped animated size="lg" />
            <h3 style={{ marginTop: 16 }}>SPINNERS</h3>
            <div className="row">
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
            </div>
          </Card>
          <Card>
            <h3>POPOVER / TOOLTIP / TOASTS</h3>
            <div className="row">
              <Popover title="Aide" content="Le panneau latéral pousse ou recouvre selon le pattern choisi.">
                <Button variant="outlined">Popover</Button>
              </Popover>
              <Tooltip content="Enregistrer le formulaire">
                <Button variant="primary">Tooltip</Button>
              </Tooltip>
              <Button variant="secondary" onClick={() => toast('Toast simple')}>
                Toast
              </Button>
              <Button variant="tonal" onClick={() => push({ message: 'Succès', variant: 'ok' })}>
                Toast OK
              </Button>
              <Button variant="danger" onClick={() => push({ message: 'Erreur', variant: 'er' })}>
                Toast erreur
              </Button>
            </div>
          </Card>
          <Card style={{ gridColumn: '1 / -1' }}>
            <h3>SCROLLSPY</h3>
            <Scrollspy
              sections={[
                { id: 'sp-a', title: 'Vue d’ensemble', content: 'KPIs et statut du dossier.' },
                { id: 'sp-b', title: 'Historique', content: 'Appels, e-mails et notes récentes.' },
                { id: 'sp-c', title: 'Pièces jointes', content: 'Fichiers liés au processus.' },
                { id: 'sp-d', title: 'Audit', content: 'Journal des modifications.' },
              ]}
            />
          </Card>
        </div>
      </section>
    </>
  );
}
