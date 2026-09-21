# Radar Político de Chile

Rutina automatizada que da seguimiento semanal/quincenal al acontecer político
chileno: decisiones y cambios del Poder Ejecutivo, votaciones y propuestas del
Congreso Nacional, casos judiciales/penales que involucran a figuras
políticas, movilización social y conflictos territoriales, y opinión pública.

No es un resumen de titulares: cada ejecución busca en decenas de fuentes
(medios oficialistas, de oposición, independientes, sitios oficiales del
Estado —senado.cl, camara.cl, gob.cl, Fiscalía, Contraloría, Poder Judicial—
y encuestadoras), cita la fuente de cada hallazgo, descarta explícitamente lo
que no puede fechar o verificar con confianza, y acumula todo en una base de
datos estructurada (`data/database.json`) que crece ejecución a ejecución.

## ⚠️ Nota sobre el historial (leer antes de usar los informes previos)

Esta rutina corrió **5 veces entre el 27 de junio y el 10 de agosto de 2026**
antes de esta consolidación, pero cada ejecución se hizo en una rama de git
nueva y desechable (`claude/kind-mayer-*`) que nunca se fusionó a la rama
principal ni entre sí. El resultado: 5 "primeras ejecuciones" distintas,
cada una re-investigando desde cero los mismos ~3 meses, con estructuras de
carpetas distintas (`chile-politica/` vs `politica-chile/`) y sin ninguna
acumulándose sobre la anterior. Ninguna se había mostrado al usuario como
Artifact ni como Pull Request — quedaron huérfanas.

Esta ejecución (24 de agosto de 2026) **consolida** ese historial:

1. Adopta como línea base el informe más reciente y completo de esas 5
   ejecuciones (10 de agosto de 2026, rama `claude/kind-mayer-ixb0nx`, que ya
   cubría los 3 meses completos de gobierno de Kast) — ver
   [`informes/2026-08-10-linea-base.md`](informes/2026-08-10-linea-base.md).
2. Agrega un informe nuevo con lo ocurrido entre el 10 y el 24 de agosto de
   2026 — ver [`informes/2026-08-24.md`](informes/2026-08-24.md).
3. Deja este directorio (`chile-politica/` en la rama consolidada más
   reciente) como la ubicación canónica hacia adelante, con
   [`data/database.json`](data/database.json) como la base de datos
   estructurada que cada ejecución futura debe leer y ampliar.
4. Publica un resumen ejecutivo como Artifact de Claude en cada ejecución
   (más fácil de compartir que un archivo en una rama de git); el índice de
   Artifacts publicados queda en [`index.md`](index.md).

Las 4 ejecuciones previas quedan documentadas, con enlace a su rama
original, en la sección "Ejecuciones previas (no fusionadas)" de
`index.md`, por transparencia — pero su contenido ya está incorporado en la
línea base del 10 de agosto y **no debe volver a investigarse**.

**Para quien opere esta rutina en el futuro**: si cada ejecución sigue
llegando en una rama nueva sin fusionar, este problema se repetirá. Lo ideal
es fusionar (merge) cada rama de esta rutina a la rama principal del
repositorio apenas termine, o pedir explícitamente que se abra un Pull
Request para revisarla y fusionarla.

## Estructura

```
chile-politica/
├── README.md              — este archivo
├── index.md                — índice cronológico de todas las ejecuciones
├── data/
│   └── database.json       — base de datos estructurada (crece cada ejecución)
└── informes/
    ├── 2026-08-10-linea-base.md   — línea base: mayo-agosto 2026 (3 meses)
    └── 2026-08-24.md              — primer informe incremental
```

## Metodología

- Fuentes: medios chilenos e internacionales de distintas líneas editoriales
  (BioBioChile, La Tercera, Emol, El Mostrador, T13, CNN Chile, Infobae,
  Cooperativa, 24Horas, Meganoticias, France24, Ex-Ante, The Clinic, CIPER,
  Interferencia, El Desconcierto, El Ciudadano, El Clarín, Radio U. de
  Chile, medios regionales), sitios oficiales (senado.cl, camara.cl, gob.cl,
  presidencia.cl, Fiscalía, Contraloría, Poder Judicial, Tribunal
  Constitucional) y encuestadoras (Cadem, Criteria, CEP, Pulso
  Ciudadano/Activa Research).
- Cada hallazgo cita su fuente con fecha exacta.
- Donde la evidencia era parcial, contradictoria entre casas encuestadoras,
  o no verificable, se indica explícitamente en vez de presentarla como
  hecho único.
- Cada ejecución declara qué preguntas quedaron sin respuesta verificable,
  en vez de omitirlas en silencio.
