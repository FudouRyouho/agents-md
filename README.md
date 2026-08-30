# agents-md

Base reutilizable de estructura documental y contratos de agente para proyectos.

> [!IMPORTANT]
> Este archivo describe el proyecto — **no manda**. Las reglas viven en los `AGENTS.md`, y son la
> única autoridad. Si algo de acá parece una regla y no está en un contrato, es un hueco del
> contrato, no una regla.

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
├── AGENTS.global.md   — contrato global: rol, clasificación de tareas, principios
├── AGENTS.local.md    — punto de entrada del proyecto: routing, binding y modo
├── docs/              — SSoT del proyecto: dominio y arquitectura, en presente
├── docs-archive/      — gitignored, local: diseño muerto, racional de "por qué NO"
├── profile/           — quién es el usuario: local, gitignored, con su `.example`
├── references/        — material externo: código vendoreado, wikis, capturas
└── .agents/
    ├── scripts/       — validación ejecutable del corpus
    └── skills/        — skills del proyecto
```

Los dos contratos de la raíz se distinguen por alcance, no por jerarquía. `AGENTS.global.md` no
nombra dominio, ruta ni herramienta: vale en cualquier repo, incluso en uno que no use esta base, y
por eso se instala una vez por usuario. `AGENTS.local.md` nombra las carpetas de la base, así que
sólo tiene sentido donde la base está instalada — y por eso se copia. Adentro conviven dos cosas:
las reglas genéricas sobre esas carpetas (§1–§3) y las respuestas propias del repo (§4 binding,
§5 modo).

## La cadena

```text
regla + trabajo → docs/ → código
```

Las **reglas** (`AGENTS.md`) dicen cómo comportarse. El **trabajo** abierto vive en el tracker, no
en un documento. `docs/` tiene la **verdad del dominio**. El código es la **verdad de lo que
realmente pasa**. El contenido no se copia hacia arriba en la cadena: se enlaza
(`AGENTS.local.md` §1).

Son tres formas distintas —enunciado, regla, trabajo— y sólo la primera es un cuerpo de
documentos.

## Los tres hogares

Toda afirmación tiene un solo lugar donde vive. Se decide antes de escribirla:

| Naturaleza | Hogar |
| --- | --- |
| Verdad viva del dominio o la arquitectura | `docs/` |
| Historia superada, sin valor de razonamiento | **git** — no se escribe en ningún lado |
| Racional personal de "por qué NO" (diseño muerto, enfoque descartado) | `docs-archive/` |

`docs-archive/` es local y gitignored, y el agente no escribe ahí por inferencia: propone, y la
decisión es del usuario (`docs-archive/AGENTS.md`).

## Uso

Es una **base para ajustar por proyecto**, no un framework a adoptar entero. Un proyecto liviano
puede tener un solo `docs/` plano y ningún script; uno grande puede tener varios dominios y un
validador con más checks.

## Instalación

Hay **dos destinos**, no uno:

> Lo que no nombra un dominio, una ruta ni una herramienta se instala **una vez** en el global.
> Lo que sí, se **copia** al proyecto y diverge ahí.

| Pieza | Destino |
| --- | --- |
| `AGENTS.global.md` | **global**, enlace desde lo que la herramienta carga sola (`~/.claude/CLAUDE.md` y equivalentes) |
| `profile/` | **global**, enlace junto al anterior. AGENTS.global.md lo importa |
| skills y agentes genéricos | **global** |
| `AGENTS.local.md` | **copia**, contiene el binding, que es por definición la respuesta de ese repo |
| `CLAUDE.md` | **proyecto**, symlink relativo a `AGENTS.local.md`. Sin él el contrato del proyecto no se carga |
| `docs/`, `docs-archive/`, `references/` y sus `AGENTS.md` | **proyecto** — la herramienta los carga al tocar la carpeta; si no están ahí, no existen |
| `.agents/scripts/` | **global**, `agents-validate` y `agents-seed` en PATH. El validador resuelve la raíz desde dónde se lo invoca; el seed copia desde dónde vive |
| skills y agentes dedicados | **proyecto** |

**Enlazar y copiar no son intercambiables.** Se enlaza lo que debe ser el mismo archivo en todos
lados: un cambio se propaga, y esa es la intención. Se copia lo que debe poder divergir — y
`AGENTS.local.md` es el caso límite, porque su binding responde por *un* repo y compartirlo lo
vaciaría de sentido.

Que la divergencia sea sana no la deja sin origen: la base sigue existiendo como fuente explicada,
así que una regla reescrita en un proyecto se puede contrastar contra de dónde vino. Eso es
adaptación, no drift.

La columna de copia la siembra un comando, desde la raíz del proyecto a instalar:

```bash
agents-seed
```

Crea lo que falta, deja en paz lo idéntico y reporta lo que difiere. No sobrescribe, no renombra a
`.backup` y no pregunta: sobre algo que ya existe, la decisión vuelve a la conversación. Correrlo
dos veces no hace nada la segunda.

Este repositorio es **a la vez la fuente y una instancia**: sus contratos se aplican sobre sí mismo.
Por eso los dos contratos están en la raíz en lugar de en una carpeta aparte, y por eso se puede
usar como
banco de pruebas de sus propias reglas.

## Verificación

```bash
agents-validate
```

Corre desde cualquier profundidad del proyecto: busca la raíz ascendiendo hasta `AGENTS.local.md`.
Si no la encuentra, falla — nunca valida un corpus que no le corresponde. `--dir <ruta>` es el
escape para lo que esa búsqueda no alcanza: un segundo corpus en un monorepo, un checkout en CI.

Checks sobre el corpus de `docs/`: `absolute-link`, `broken-link` y `broken-anchor` —los links
internos son relativos y resuelven, incluido el fragmento—, `changelog` —nada de historia
embebida—, `commit-hash` y `lone-date` —una fecha vale como cable de drift, no como registro—. Cada check cita la regla de `docs/AGENTS.md` que ejecuta: no hay política
inventada en el validador.

Antes de tocar el corpus corre sus **fixtures** (`.agents/scripts/fixtures/`): un archivo por check
que debe dispararlo, y uno limpio que no debe disparar ninguno. El nombre del archivo es la
expectativa. Si un check no reacciona a su caso conocido, el validador sale con `2` y no valida
nada — un check sin ejercitar no llega a reportar verde.

## Estado

Concepto inicial. Existe el esqueleto completo de carpetas con sus contratos, un validador cuyos
checks se prueban contra fixtures, y los skills del flujo de trabajo.

El trabajo abierto vive en [Issues](https://github.com/FudouRyouho/agents-md/issues), no acá: la
siembra de un proyecto ([#1](https://github.com/FudouRyouho/agents-md/issues/1)) y qué cuenta como
corpus cuando `docs/` tiene material gitignored
([#2](https://github.com/FudouRyouho/agents-md/issues/2)).
