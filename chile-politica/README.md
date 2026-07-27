# Chile Política — Rutina de seguimiento ejecutivo

Este directorio almacena la base de datos y los informes de una rutina programada que da seguimiento al acontecer político chileno: decisiones de gobierno, actividad legislativa, casos judiciales de figuras políticas, y conflictos sociales/territoriales.

## Cómo funciona

- **Primera ejecución** (27 de julio de 2026): estableció una línea base cubriendo los primeros ~3.5 meses del Gobierno de José Antonio Kast (asumió el 11 de marzo de 2026) hasta el 27 de julio de 2026.
- **Ejecuciones siguientes**: cada corrida busca la semana transcurrida desde la última ejecución y agrega los hallazgos nuevos a `data/database.json`, generando un nuevo archivo en `runs/`.

## Estructura

- `index.md` — índice de todas las ejecuciones, con enlaces.
- `runs/YYYY-MM-DD.md` — informe narrativo completo de cada ejecución.
- `data/database.json` — base de datos estructurada (JSON) con todos los hallazgos, categorizados y fechados, pensada para que ejecuciones futuras puedan consultarla y agregar registros nuevos sin duplicar.

## Categorías de la base de datos

`gabinete` (cambios de gobierno/ministros), `congreso` (votaciones y mociones), `judicial` (casos penales de políticos/funcionarios), `macrozona_sur` (conflicto mapuche), `migracion` (frontera norte), `movilizacion_social` (paros, marchas), `tension_regional` (gobierno central vs. gobiernos regionales/municipales), `encuesta` (aprobación presidencial).

## Metodología y limitaciones

La información se recopila vía búsqueda web sobre medios chilenos de distintas líneas editoriales (oficialistas, de oposición, independientes) y fuentes oficiales (gob.cl, camara.cl, senado.cl, prensa presidencial, ministerios). No se pudo acceder al contenido íntegro de varios artículos por bloqueos de acceso automatizado (HTTP 403); en esos casos la información proviene de los extractos de búsqueda, cruzados entre al menos dos fuentes cuando fue posible. Cada informe de ejecución detalla sus propios vacíos y advertencias de confiabilidad.
