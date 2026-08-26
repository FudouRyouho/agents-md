# agents-md

Base reutilizable de estructura documental y contratos de agente para proyectos.

## Objetivo

Separar dos cosas que suelen terminar mezcladas en el mismo lugar:

- **Lo que el proyecto sabe** — el dominio, la arquitectura, las decisiones.
- **Cómo un agente opera sobre ese conocimiento** — dónde buscar, qué escribir, dónde y cuándo.

El origen del problema es concreto: cuando la documentación de un proyecto está pensada para
consumo de agentes, termina cargando tanto contexto operativo que deja de servir como fuente de
verdad del dominio. La separación acá es **estructural**, no de estilo: cada tipo de conocimiento
tiene una carpeta y un contrato propio.

## Estructura

```text
├── AGENTS.md          — contrato global: rol, clasificación de tareas, principios
├── docs/              — SSoT del proyecto: dominio, arquitectura, ADR
├── docs-archive/      — gitignored, local: diseño muerto, racional de "por qué NO"
├── references/        — material externo: código vendoreado, wikis, capturas
└── .agents/
    ├── AGENTS.md      — punto de entrada del proyecto: routing y política transversal
    ├── context/       — backlog del hoy para el agente
    ├── scripts/       — validación ejecutable del corpus
    └── skills/        — skills del proyecto
```

Cada carpeta lleva su propio `AGENTS.md` con las reglas que la gobiernan. El routing baja desde
`.agents/AGENTS.md`.

## La cadena

```text
context/ → docs/ → proyecto
```

`context/` dice **dónde mirar y cómo comportarse**. `docs/` tiene la **verdad del dominio**. El
código es la **verdad de lo que realmente pasa**. Nunca se copia contenido hacia arriba en la
cadena: se enlaza.

## Los tres hogares

Toda afirmación tiene un solo lugar donde vive. Se decide antes de escribirla:

| Naturaleza | Hogar |
| --- | --- |
| Verdad viva del dominio o la arquitectura | `docs/` |
| Historia superada, sin valor de razonamiento | **git** — no se escribe en ningún lado |
| Racional personal de "por qué NO" (diseño muerto, enfoque descartado) | `docs-archive/` |

`docs-archive/` es local y gitignored. El agente nunca escribe ahí por inferencia: propone, y la
decisión es del usuario.

## Uso

Es una **base para ajustar por proyecto**, no un framework a adoptar entero. Un proyecto liviano
puede tener `context/` casi vacío y dos ADR; uno grande puede tener `context/` con varias
subcarpetas y un validador con más checks.

El `AGENTS.md` raíz es global —aplica igual a cualquier proyecto—, mientras que `.agents/AGENTS.md`
es el punto de entrada de *este* proyecto en particular. Esa división existe para que lo específico
nunca contamine lo general.

> [!NOTE]
> El mecanismo de distribución (symlink hacia una config global vs. copiar la plantilla a cada
> proyecto) todavía no está definido. Hoy se copia y se ajusta a mano.

## Verificación

```bash
pnpm --filter @agents/scripts validate:docs
```

Valida el corpus de `docs/`: links relativos que resuelven, ausencia de changelog embebido y de
hashes de commit. Cada check cita la regla de `docs/AGENTS.md` que ejecuta — no hay política
inventada en el validador.

## Idioma

- **Inglés** — documentación que el agente escribe para sí mismo: los `AGENTS.md`, comentarios de
  código, mensajes de commit.
- **Español** — comunicación con el usuario, `docs/`, README y JSDoc.

## Estado

Concepto inicial. Existe el esqueleto completo de carpetas con sus contratos, y un validador con
cuatro checks. Falta definir el mecanismo de distribución, poblar `skills/`, y decidir si
`.agents/scripts/` se extrae como paquete independiente.
