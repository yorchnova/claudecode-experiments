# Índice de ejecuciones — Radar Político de Chile

## ✅ Línea canónica (consolidada, esta rama)

| Fecha | Tipo | Informe | Cobertura |
|---|---|---|---|
| 2026-08-10 | Línea base | [`informes/2026-08-10-linea-base.md`](informes/2026-08-10-linea-base.md) | 10 mayo – 10 agosto 2026 (3 meses) |
| 2026-08-24 | Incremental | [`informes/2026-08-24.md`](informes/2026-08-24.md) | 10 – 24 agosto 2026 |

Base de datos estructurada (crece cada ejecución): [`data/database.json`](data/database.json).

## 🗂️ Ejecuciones previas (no fusionadas — huérfanas)

Antes de la consolidación del 24 de agosto de 2026, esta rutina corrió 4
veces más, cada una en una rama de git nueva y desechable que nunca se
fusionó. Se listan aquí solo por trazabilidad; su contenido relevante ya
quedó incorporado en la línea base del 10 de agosto y **no debe
reinvestigarse**. Los enlaces apuntan al archivo tal como quedó en su rama
original (siguen siendo accesibles vía GitHub aunque la rama no esté
fusionada a la rama principal del repositorio):

| Fecha | Rama | Informe |
|---|---|---|
| 2026-06-27 | `claude/kind-mayer-42w783` | [`politica-chile/reportes/2026-06-27-trimestre-base.md`](https://github.com/yorchnova/claudecode-experiments/blob/claude/kind-mayer-42w783/politica-chile/reportes/2026-06-27-trimestre-base.md) |
| 2026-06-29 | `claude/kind-mayer-1mxbel` | [`chile-politica/2026-06-29-reporte-inaugural.md`](https://github.com/yorchnova/claudecode-experiments/blob/claude/kind-mayer-1mxbel/chile-politica/2026-06-29-reporte-inaugural.md) |
| 2026-07-13 | `claude/kind-mayer-jf5pny` | [`chile-politica/informes/2026-07-13.md`](https://github.com/yorchnova/claudecode-experiments/blob/claude/kind-mayer-jf5pny/chile-politica/informes/2026-07-13.md) |
| 2026-07-27 | `claude/kind-mayer-901zkd` | [`chile-politica/runs/2026-07-27-resumen.html`](https://github.com/yorchnova/claudecode-experiments/blob/claude/kind-mayer-901zkd/chile-politica/runs/2026-07-27-resumen.html) · [`.md`](https://github.com/yorchnova/claudecode-experiments/blob/claude/kind-mayer-901zkd/chile-politica/runs/2026-07-27.md) |
| 2026-08-10 | `claude/kind-mayer-ixb0nx` | [`chile-politica/informes/2026-08-10.md`](https://github.com/yorchnova/claudecode-experiments/blob/claude/kind-mayer-ixb0nx/chile-politica/informes/2026-08-10.md) (= línea base, copiada arriba) |

## 🌐 Resúmenes ejecutivos publicados (Artifacts)

Desde la ejecución del 24 de agosto de 2026 en adelante, cada ejecución
publica además un resumen ejecutivo como Artifact de Claude (más fácil de
compartir y navegar que un archivo de texto en una rama de git):

| Fecha | Enlace |
|---|---|
| 2026-08-24 | _(agregado al pie de esta lista tras publicarse; ver también el listado de Artifacts del usuario)_ |

## ⚠️ Para la próxima ejecución

Esta rama (`claude/kind-mayer-oqoso4`) no está fusionada a la rama por
defecto del repositorio. Si nadie la fusiona, la próxima ejecución de esta
rutina recibirá —según el patrón observado hasta ahora— otra rama nueva
sin este historial. Antes de investigar desde cero, la próxima ejecución
debería:

1. Revisar si `claude/kind-mayer-oqoso4` (u otra rama más reciente que
   contenga `chile-politica/data/database.json`) ya fue fusionada a la rama
   por defecto; si no, partir explícitamente desde el contenido de esa
   rama en vez de la rama por defecto.
2. Leer `data/database.json` completo para saber qué ya está cubierto.
3. Investigar solo el período posterior a la fecha del último informe
   (`informes/<fecha>.md` más reciente) hasta la fecha actual.
4. Anexar sus hallazgos nuevos a `database.json` (sin borrar los
   anteriores), agregar su propio `informes/<fecha>.md`, y actualizar este
   índice.
