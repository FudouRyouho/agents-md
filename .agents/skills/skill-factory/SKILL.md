---
name: skill-factory
description: Use when asked to create, extend, or review an agent skill. Turns a procedure that already ran by hand into a SKILL.md, and refuses to draft speculative ones.
---

# Skill Factory

**A skill records a procedure that already happened. Never one that might help.**

Owns: drafting a new skill, proposing an extension to an existing one, validating either.
Does not own: adopting it, editing any contract, renaming or deleting an existing skill.

## 1. Evidence — the gate that refuses

Ask the user, in these terms:

> Have you run this procedure by hand at least twice, the same way both times?

Their answer is the evidence. There is no log to grep, and inventing one is not the job.

Refuse on "it would be useful" or "we will need it". Usefulness is a prediction; a skill is a
record. A refusal here is a successful run — say what would qualify, and stop.

## 2. Dedupe — the gate that prefers an extension

Read every `SKILL.md` under `.agents/skills/` and `~/.agents/skills/`. If the procedure is already
partly covered, propose a diff to that skill instead of a new one.

Every skill costs context in every thread that loads it. When the call is close, extend.

## 3. Destination

Does the procedure name a domain, a path, or a tool?

| | Where it goes |
| --- | --- |
| No | global — wherever the tool loads skills from outside any project |
| Yes | project — the project's own skills directory |

A skill that names one project's folders is not global, however general its idea sounds.

**Confirm the directory exists before writing into it.** The tool documents several candidate
paths and a machine has only some of them; one may be a link to another, which collapses the two
destinations into one. Writing to a path you assumed is the same defect this skill exists to
prevent.

## 4. Draft

```markdown
---
name: <kebab-case>
description: <when to use it — the tool loads the skill by this line, so it names the trigger,
  not the idea>
---

# <Name>

**<What it does, in one line.>**

Owns: … Does not own: …

## <Numbered steps, each with what proves it worked>

## Test Task
<one concrete task that exercises the core path>
```

Four rules for the draft:

- **A skill cites criteria; it never defines them.** If it needs a rule that no contract states,
  stop and say so: the rule is written first, in the contract that governs it.
- It never redefines the mode. It reads the surface table of the project it runs in.
- The `description` names *when* to use it. A description that describes the idea will not be
  loaded when it is needed.
- English, like every contract.

## 5. Validate

Run `/skills` and confirm the tool lists it. That is the only proof the frontmatter parsed — a
skill the tool does not list does not exist. Never accept a visual check of the YAML.

## 6. Test task

Execute the skill's own Test Task in a throwaway thread. It passes, or the skill is fixed or
declined. Delete the scaffolding afterwards.

## 7. Hand off

Present, in one message: the draft, the evidence the user gave, the dedupe result, the destination
and why, and the test-task outcome. A human approves before the skill is adopted.

## Test Task

1. **Refusal path.** Propose a skill for a procedure the user has never run. The evidence gate must
   refuse and report what would qualify.
2. **Draft path.** Take a procedure the user confirms running twice. Produce the draft, place it by
   the destination table, and confirm `/skills` lists it.
