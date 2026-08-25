I got tired of the job search routine, so I automated the parts that don't need me and kept the parts that do.

Meet JOS (Job Operating System), a pipeline I built that runs my job search's repetitive work every day:

🔍 Pulls new postings from my Gmail job alerts, Indeed, and a few job boards directly
🎯 Filters them through a two-stage check, including a judgment call most keyword filters get wrong: is "Python" in this JD actually a hard requirement, or a soft mention buried in paragraph six? (The system reads it like a person would, not like a regex.)
🧾 Checks it against 6+ months of my own application history so I never accidentally reapply
✍️ Drafts a tailored CV, cover letter, and short note for anything that qualifies
🤝 Finds 1st and 2nd degree LinkedIn connections at the company
✅ Then stops and hands it all to me to approve

That last part matters most to me: nothing gets submitted automatically. JOS finds and prepares, I still decide and apply. It's automation for sourcing and tracking, not for pretending to be me.

It's been running since October 2025 and has logged 370+ applications so far, with zero manual copy-pasting of job details or contact research.

Under the hood it's a small Node.js/React app that triggers a Claude Code agent for the parts that need actual judgment, and plain deterministic code for everything mechanical (dedup, scheduling, Sheet updates). I wrote up the architecture and a few sanitized code examples here if you're curious how it fits together: [link to repo]

If you want to try running your own copy: you'll need Node.js, a Claude subscription (it's built on Claude Code), and a Google account for Gmail/Sheets/Docs. It's not a hosted product, everyone runs their own copy with their own accounts, nothing is shared between users. A few friends are already using it. If you're job hunting and want to give it a shot, send me a message and I'll help you get set up.

#JobSearch #Automation #ClaudeCode #BuildInPublic #DataAnalyst
