# 🇨🇱 Radar Político de Chile

Base de datos y resúmenes ejecutivos del acontecer político chileno: decisiones y
crisis del Ejecutivo, votaciones del Congreso, propuestas de diputados y
senadores, movilización social y conflictos territoriales, casos judiciales que
involucran a figuras políticas, y el pulso de la opinión pública y los medios.

Esta carpeta es alimentada por una rutina automatizada:

- **Primera ejecución** (10 de agosto de 2026): informe base que cubre los
  primeros ~3 meses del gobierno de José Antonio Kast (desde el 10 de mayo de
  2026, cuando ya llevaba unos dos meses en el cargo, hasta el 10 de agosto de
  2026).
- **Ejecuciones siguientes**: cada corrida agrega un informe semanal nuevo con
  los hechos ocurridos desde la corrida anterior.

## 🗂️ Cómo navegar

- [`index.md`](./index.md) — listado cronológico de todas las ejecuciones de
  esta rutina, con enlace a cada informe.
- [`informes/`](./informes/) — un archivo Markdown por ejecución, nombrado
  `AAAA-MM-DD.md` según la fecha en que se corrió.

## ⚠️ Naturaleza de la información

Los informes se generan mediante búsqueda web sobre medios chilenos e
internacionales de distintas líneas editoriales (oficialistas, de oposición e
independientes), sitios oficiales (Congreso, gobierno, Poder Judicial,
Contraloría) y encuestadoras. Cada hallazgo cita su fuente. Cuando la
información no pudo verificarse con una fuente concreta, el informe lo señala
explícitamente en vez de presentarla como un hecho confirmado. Esto no
reemplaza el trabajo periodístico ni el asesoramiento legal/político
profesional — es un radar de seguimiento, no una fuente primaria.
