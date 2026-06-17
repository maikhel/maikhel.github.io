---
layout: blogpost
title: "AI Hype and the Pattern of Every Tech Revolution"
description: "Is AI a revolution or just hype? What techno-economic paradigms and history reveal about where we are and what it means for your job."
image: "/images/robot.webp"
min_image: "/images/robot_min.webp"
min_image_width: 640
image_width: 1280
excerpt_separator: <!--more-->
homepage: true
tags: [ai, career, engineering]
---

Last week, I rewrote an entire section of my Ruby on Rails application to match a new design. What used to take weeks now takes days with AI assistance. It still amazes me.

<!--more-->

At the same time, I feel disoriented: what will my job look like in a year? Is the change we're seeing a revolution, or just the next iteration of post-internet IT progress? I know I'm not alone in asking these questions, so let's tackle them together.


## We've seen this before

The current AI revolution is explained with all sorts of historical analogies. They range from the broad, eg. the Industrial Revolution, to the specific: spreadsheets killing bookkeepers, or the arrival of compilers. Each one offers a useful reference point, but none captures the AI revolution fully.

The Industrial Revolution (18th–19th century) is the broadest: it captures the *scale* of the change: shaking economy, displacing workers, creating entirely new industries. But that's also the problem: it's so general it explains almost anything and doesn't help predict outcomes.

A more specific analogy points to spreadsheets killing bookkeepers. Excel transformed accounting, shifting bookkeepers from crunching numbers to advising clients. But it points to a single, specific tool, while AI is far broader.

The third analogy is the introduction of compilers. It moved the focus of programming from low-level memory management and processor instructions toward a more functional approach. But it says nothing about the areas outside software development.

Each analogy emphasizes something different, yet none explains the current AI revolution as a whole. To understand the current changes better, we can turn to economic researchers.


## Techno-economic paradigms

Carlota Perez and Christopher Freeman introduced the idea of the techno-economic paradigm (TEP): a cluster of mutually reinforcing technologies that *together* reshape industries, institutions, skills, and culture (Freeman & Perez, 1988). Take the car as an example: on its own, it's a single innovation. But you can't understand its impact without the assembly line, cheap oil, the suburb, and a whole mass-consumption culture. That whole cluster is what a TEP describes.

Perez and Freeman list five TEPs in modern history:

| TEP | Year | Catalyst |
|---|---|---|
| 1st | 1771 | Waterpower, machine tools |
| 2nd | 1829 | Steam, railways, telegraph |
| 3rd | 1875 | Electrification |
| 4th | 1913 | Assembly line, oil, mass production |
| 5th | 1971 | Microprocessor, software, internet |

Each TEP lasts 50–60 years and moves through four phases: irruption, frenzy, synergy, and maturity. The *irruption* phase is where a new technology arrives and replaces older systems. *Frenzy* is the next phase, a chaotic period of intense innovation, capital inflow, and speculative bubbles. When the technology stabilizes and integrates into mainstream economic structures, we reach the *synergy* phase. The TEP concludes with *maturity*, where growth and innovation slow. Perez (2002) also uses alternative names for these phases: Installation → Turning Point → Golden Age → Maturity.

Consider the internet: its irruption happened in the late 1980s and early 1990s; frenzy was the dotcom bubble of the late 1990s; synergy came as it integrated into every sector through the 2000s. Today, it looks to be in early maturity.

Perez frames the current AI transformation as a third wave within the IT revolution (the 5th TEP), one that started around 2020. As of 2026, **we are in a late frenzy phase**. It's characterized by speculative capital, contradictory data, and anxiety about jobs - everything we see in the IT world right now. History suggests the next phase, synergy, is still 5–15 years away. But this is the natural flow: the dotcom bubble didn't kill the internet, it preceded synergy. That said, it doesn't mean your job (especially in IT) is safe.


## Will AI take my job?

That last point (that your job isn't safe) deserves a closer look. The economist Joseph Schumpeter gave us the concept for it: creative destruction. 

> "The process of Creative Destruction is the essential fact about capitalism" (Schumpeter, 1942). 

Some jobs *must* be destroyed to enable growth and the successful assimilation of new technologies. It's a natural and inevitable part of the process. Trying hard to preserve them only stalls development and slows progress. This speaks to a fear we hear all the time in the IT world: "AI will take every programmer's job."

Look at the historical data: the number of telephone operators in the US shrank from 421,000 in 1970 to 156,000 in 2000, while the number of calls grew from 9.8 billion to 106 billion (~11×) (Cox & Alm, 2008). Per-operator throughput went from 64 calls a day to roughly 1,850. At the same time, entirely new jobs opened up: programmers, webmasters, medical technicians. The number of programmers alone grew from 160,000 in 1970 to 2.6 million in 2002 (16×).

Creative destruction means removing some jobs to make room for new ones. In IT, that likely means the next redefinition of what a programmer's job is. It's no longer writing documentation, generating simple scaffolds, or fixing junior-level bugs with Stack Overflow. The new shape is architectural judgment, more code review and advanced debugging, and the ability to ask product owners the right question. If most of your day is documentation, scaffolds, and Stack Overflow lookups, you have ~3–5 years to make the shift to judgment work.

## But you can't see AI in productivity measurements

Suppose you accept this: AI reshapes the work, some jobs disappear while others grow. You'd expect the data to reflect that - but it mostly doesn't!

> "You can see the computer age everywhere but in the productivity statistics" (Solow, 1987). 

Replace "computer age" with AI and this sounds familiar. Three years later, economist Paul David answered Robert Solow with a historical example that still applies to AI: the numbers are inconsistent. A 2022 GitHub experiment found developers using Copilot finished a coding task 55% faster than those without it (Peng et al., 2023). METR's randomized trials of experienced open-source developers found the opposite: a 19% slowdown in early 2025, then somewhere between −4% and −18% a year later, with the authors cautioning their own estimates are unreliable (Becker et al., 2025, 2026). In both rounds, developers *believed* AI had sped them up. One careful study says +55%, another says the effect is negative and hard to even measure. We've seen this kind of inconsistency before.

Meet the *electrification productivity paradox*. Electric dynamos arrived around 1880, and factories could swap their steam engines for electric motors. But manufacturing productivity didn't surge until the 1920s - around 40 years later! (David, 1990). Simply applying the new technology wasn't enough. Firms had to redesign the entire factory floor: they had to replace the single central shaft with a dedicated motor on each machine, reorganizing the way they worked.

The same thing is happening with AI today: new tools are bolted onto old workflows. Writing code with AI assistance is a step forward, but it won't deliver real productivity gains without rethinking the whole software-delivery path. We shouldn't strap an electric motor to a steam-era shaft! The mixed productivity data is just another sign we're still in the frenzy phase of the TEP.


## What's actually new about AI

So far, the analogies have helped explain the current AI revolution in the broader context of the past. But there is one place they don't: non-determinism. All previous tools guaranteed the same output for the same input. AI produces *probabilistic* results. That can be an advantage or a drawback. AI/ML systems "function differently from conventional software, independently adapting and evolving over time" (Kurz, Strohmaier & Knell, 2025). This single feature challenges economic frameworks for measuring productivity, and it creates practical problems for testing assumptions, reproducibility, and code review. You see it the moment you ask AI to review the same code twice and it suggests two different fixes.

At the same time, unpredictability is a feature. A deterministic tool produces one exact output. A probabilistic tool can give many different answers, which creates new kinds of workflows. You can try several solutions to the same problem and keep the best one. Researchers call this *best-of-N*; DeepMind's AlphaCode reached the top half of competitive programmers largely by sampling and filtering thousands of candidates (Li et al., 2022). The variation itself becomes a signal: five different answers to the same prompt point to uncertainty; the same answer every time signals confidence. It works especially well on vague tickets like "improve search performance," where you can pick the best of several AI-generated options - something no compiler or rule engine could ever do.



## Summary

By ~2032, prompt fluency will be as unremarkable as Google fluency is today. I expect AI to be as natural to use as the internet is now, with productivity gains that leave no doubt. That doesn't mean IT people will become obsolete - the hard parts, like product design and business decisions, will still depend on people. Keep in mind that we're still in the frenzy phase of the current TEP, so plenty of unknowns and chaos are to be expected; reaching synergy will take another 5–15 years.

So no, AI probably won't take your job. But the version of your job that survives the next decade will look very different from today's. How that version looks like is partly up to you.


## References

- Becker, J., Rush, N., Barnes, B. & Rein, D. (2025). *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*. METR. <https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/>
- Becker, J., Rush, N., Cunningham, T., Rein, D. & Mahamud, K. (2026). *We are Changing our Developer Productivity Experiment Design*. METR. <https://metr.org/blog/2026-02-24-uplift-update/>
- Cox, W. M. & Alm, R. (2008). *Creative Destruction*. In *The Concise Encyclopedia of Economics*. Library of Economics and Liberty. <https://www.econlib.org/library/Enc/CreativeDestruction.html>
- David, P. A. (1990). *The Dynamo and the Computer: An Historical Perspective on the Modern Productivity Paradox*. American Economic Review, 80(2), 355–361.
- Freeman, C. & Perez, C. (1988). *Structural Crises of Adjustment, Business Cycles and Investment Behaviour*. In Dosi et al. (Eds.), *Technical Change and Economic Theory*. London: Pinter.
- Kurz, H. D., Strohmaier, R. & Knell, M. (2025). *Technological Change: History, Theory and Measurement. A Brief Account*. European Commission, JRC141612.
- Li, Y. et al. (2022). *Competition-Level Code Generation with AlphaCode*. arXiv:2203.07814. <https://arxiv.org/abs/2203.07814>
- Peng, S., Kalliamvakou, E., Cihon, P. & Demirer, M. (2023). *The Impact of AI on Developer Productivity: Evidence from GitHub Copilot*. arXiv:2302.06590. <https://arxiv.org/abs/2302.06590>
- Perez, C. (2002). *Technological Revolutions and Financial Capital: The Dynamics of Bubbles and Golden Ages*. Cheltenham: Edward Elgar.
- Perez, C. *Research project: The Social Shaping of Technological Revolutions*. <https://www.carlotaperez.org/research-project/>
- Schumpeter, J. A. (1942). *Capitalism, Socialism and Democracy*. New York:  Harper & Brothers. 
- Solow, R. M. (1987). *We'd Better Watch Out*. New York Times Book Review, July 12, p. 36.
