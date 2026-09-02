# .working/ — banco de trabajo (gitignored, no versionado)

## 1. Qué vive aquí

Cualquier análisis, diseño, investigación o regla **mientras falte** arquitectura conocida, diseño conocido
o tecnologías mínimas conocidas.

El criterio es lo que **falta**, no lo que se escribió.

## 2. Nada aquí tiene respaldo

Carpeta gitignored. Borrado = pérdida real.

- Solo descartes cuando el contenido ya vive destilado en fuente canónica (`docs/`, `issues/`, código).
- Un camino probado y fallado **no** es redundante → su razonamiento va a `docs-archive/`.

## 3. Marca de evidencia (obligatoria)

Todo documento dice **cómo se obtuvo**:

| Marca | Significado |
|---|---|
| `measured` | Medido/observado directamente en el código o sistema real |
| `sourced` | Citado de fuente externa verificable (spec, RFC, doc oficial) |
| `derived` | Deducedo lógicamente de premisas ya marcadas |
| `hole` | Brecha conocida: "falta esto para poder afirmar X" |

Un doc sin marca no puede salir de `.working/`. Destilar = subir la marca (`hole` → `derived` → `sourced`).

**Por qué estas cuatro:** trazabilidad del conocimiento. Un doc en `.working/` no puede afirmar "es" sin
decir *cómo lo sabe*. Si no lleva marca, es opinión, no conocimiento candidato.

## 4. Salidas (puertas, no conductos)

El conocimiento sale de `.working/` cuando cruza un umbral verificable. La acción es la misma: el
primer commit que lo ancla en un lugar versionado.

| Umbral cruzado | Destinos posibles |
|---|---|
| Arquitectura + diseño + tech mínimas respondidas | `docs/` (conocimiento de dominio/arquitectura) o implementación |
| Analizado, contrastado, fundamentado como problema recurrente con respuesta conocida en su campo | `docs/` o `issues/` |
| Diseño descartado con razonamiento documentado | `docs-archive/` |

No hay promoción por antigüedad ni por extensión. Nada sube por "estar listo" — sube por *poder
sostenerse*.

## 5. Jerarquía de autoridad

`docs/` y `references/` son canónicos. `.working/` **puede contradecirles** solo si lleva evidencia
(`measured`/`sourced`) que lo demuestre. Sin evidencia, gana lo canónico.