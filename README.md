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

Los dos contratos de la raíz se distinguen por alcance, no por jerarquía: `AGENTS.global.md` no
nombra dominio, ruta ni herramienta, y por eso se instala una vez por usuario; `AGENTS.local.md`
es exactamente lo contrario — sólo contiene lo que este repo responde sobre su entorno.

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
| `AGENTS.global.md` | **global**, se mueve a lo que la herramienta carga sola (`~/.config/opencode/AGENTS.md` y equivalentes) |
| `profile/` | **global**, enlace junto al anterior. AGENTS.global.md lo importa |
| skills y agentes genéricos | **global** |
| `AGENTS.local.md` | **copia**, contiene el binding, que es por definición la respuesta de ese repo |
| `docs/`, `docs-archive/`, `references/` y sus `AGENTS.md` | **proyecto** — la herramienta los carga al tocar la carpeta; si no están ahí, no existen |
| `.agents/scripts/` | **global**, comando en PATH — pendiente: hoy resuelve la raíz desde su propia ubicación |
| skills y agentes dedicados | **proyecto** |

**Enlazar y copiar no son intercambiables.** Se enlaza lo que debe ser el mismo archivo en todos
lados: un cambio se propaga, y esa es la intención. Se copia lo que debe poder divergir — y
`AGENTS.local.md` es el caso límite, porque su binding responde por *un* repo y compartirlo lo
vaciaría de sentido.

Que la divergencia sea sana no la deja sin origen: la base sigue existiendo como fuente explicada,
así que una regla reescrita en un proyecto se puede contrastar contra de dónde vino. Eso es
adaptación, no drift.

Este repositorio es **a la vez la fuente y una instancia**: sus contratos se aplican sobre sí mismo.
Por eso los dos contratos están en la raíz en lugar de en una carpeta aparte, y por eso se puede
usar como
banco de pruebas de sus propias reglas.

## Verificación

```bash
node .agents/scripts/src/validate-docs.mjs
```

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

Abierto:

- **El mecanismo de carga del perfil** — `AGENTS.global.md` lo importa; falta confirmar que ese
  import se incluya literal y no de forma perezosa.
- **`.agents/scripts/` como comando global** — decidido que no es un paquete npm sino un ejecutable
  en PATH; falta que resuelva la raíz del proyecto desde dónde se lo invoca, no desde dónde vive.
- **El script que siembra un proyecto** — qué hace ante una carpeta que ya existe, y qué pasa
  cuando la base cambia y el proyecto ya fue sembrado.
