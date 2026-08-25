# Skill-position filter: real excerpt from the agent's instruction set

This is not pseudocode written for this showcase. It's a lightly-trimmed
excerpt from the actual instruction file the Claude Code agent reads and
follows during qualification. The rest of the pipeline's "logic" for
judgment-heavy checks like this one looks the same: structured, versioned
rules in plain language, not a hardcoded scorer.

The problem it solves: a plain keyword match treats "Python" the same
whether it's the first bullet under "Requirements" or a throwaway mention
in paragraph six under "nice to have." Those are very different signals,
and a JD's own phrasing usually tells you which one it is, if something
actually reads it.

---

## CHECK 4: SKILL POSITION FILTER

This check looks specifically at the REQUIREMENTS SECTION of the JD and
evaluates where certain weak-match skills appear and how they are framed.

**STEP A: Locate the requirements section.**

Look for a section headed by any of these (English or Hebrew):
`Requirements`, `Must have`, `We're looking for`, `What you'll need`,
`Qualifications`, `You should have`, `We require`, `דרישות`, `דרישות התפקיד`

- If a clear requirements section is found, number the bullet points
  within it: position 1, 2, 3, 4, 5...
- If no clear requirements section exists, number all bullet points in
  the entire JD from the top
- If the JD is prose with no bullets, split by sentence and number the
  first 4 sentences as positions 1 to 4

**STEP B: Identify MUST language vs. SOFT-MUST language vs. NICE-TO-HAVE.**

A skill is a **MUST** if it appears with `must`, `required`, `mandatory`,
`essential`, `necessary`, or with no softening language at all (a bare
mention is treated as an implied must).

A skill is **SOFT-MUST**, added after a real JD's phrasing revealed a gap
in the original two-tier rule, if it appears with `working knowledge of`,
`familiarity with`, `basic understanding of`, `some experience with`,
`exposure to`. This signals the skill is secondary to a stronger,
safely-held skill rather than an equal bar, for example: "strong SQL
skills and working knowledge of Python."

A skill is **not a must** (ignored for this filter) if softened by
`advantage`, `nice to have`, `preferred`, `a plus`, `bonus`, `desirable`.

**STEP C: Apply position rules.**

- A watch-list skill that's a **hard MUST in an early position** (top of
  the requirements list): discard. It's a real gap, stated as
  non-negotiable, near the top.
- A watch-list skill that's a **hard MUST further down the list**: don't
  discard, but flag it for manual review. Plausible the role still fits,
  worth a second look before applying.
- A watch-list skill that's **SOFT-MUST at any position**: process
  normally, just flag it. The JD's own phrasing already told you it's
  secondary, regardless of where it happens to sit in the list.
- Anything past the flagging threshold, or on the safe list, is ignored
  entirely by this filter.

---

The full version also handles a subtler case: a skill the candidate has at
a *developing*, not absent, level, where the same word can mean very
different things depending on whether the JD is asking for it in a
hands-on build/production context versus an exploratory/analysis context.
Trimmed here for length; the shape above is the actual mechanism.
