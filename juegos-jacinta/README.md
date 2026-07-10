# 🌈 Los Juegos de Jaci

Web-app privada de minijuegos para Jacinta (3 años y 4 meses). Sin texto necesario,
sin anuncios, sin salidas: todo por voz en español, íconos gigantes y música.

## Correr

```bash
cd juegos-jacinta
npm install
npm run dev      # http://localhost:5180
```

Pensada para notebook + trackpad. Todo corre en el cliente: sin backend, sin login.

## Principios (no negociables)

- Consignas y feedback **hablados** (Web Speech API, es-CL → es-ES/es-419 → default) o visuales. Nunca texto leído.
- **Cero castigo**: el error suena neutro y se reintenta; solo se celebra el acierto.
- Targets ≥ 100 px, navegación por íconos (🏠 y 🔊 siempre visibles), dificultad por íconos.
- Rondas de 1–3 min que terminan en celebración (confeti + fanfarria + voz) y reinicio en 1 clic.
- Sonido sintetizado con Web Audio (cero assets), silenciable; preferencia en `localStorage`.

## Juegos

| Juego | Estado | Qué desarrolla |
| --- | --- | --- |
| 🐱 Memorice Sonoro | ✅ construido | Memoria de trabajo + vocabulario + oído (cada animal tiene su motivo musical propio) |
| 🎵 El Eco Musical | 🔒 próximo | Memoria auditiva secuencial (repetir melodías cortas) |
| 👂 ¿Quién suena? | 🔒 | Asociación sonido ↔ significado |
| 🧩 Arma la Figura | 🔒 | Motricidad fina con arrastre |
| 🌈 Sigue la Serie | 🔒 | Patrones pre-matemáticos, cantados |
| ✋ Cuenta Conmigo | 🔒 | Correspondencia uno-a-uno, conteo 1–5 |

## Estructura

```
src/
├─ lib/            # voz (speech.ts), sonido (audio.ts), confeti
├─ components/     # Menu, TopBar (🏠 🔊 🎶)
└─ games/
   ├─ registry.ts  # grilla del menú; juegos futuros aparecen con candado
   └─ memorice/    # primer juego completo
```

Cada juego es un componente autocontenido; se construyen de a uno y se validan con la usuaria. 🧒
