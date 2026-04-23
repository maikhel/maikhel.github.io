---
layout: blogpost
title: "Your Team Needs to Use AI Assistants the Right Way"
description: "AI coding assistants are no longer a personal tool. Here's why your team needs a shared workflow to keep code consistent and delivery efficient."
image: "/images/construction.webp"
min_image: "/images/construction_min.webp"
min_image_width: 640
image_width: 1280
excerpt_separator: <!--more-->
homepage: true
tags: [engineering, productivity, ai]
---

The way you use an AI code assistant is similar to your coding standards. You can either follow your own gut and write how you like it, you can define standards in your team, or you can follow the community's official standards. Either way, it's no longer one developer's preference. It should become a team standard.

<!--more-->

## AI as a personal tool

Most people see AI coding assistants (Claude Code, GitHub Copilot, etc.) as an extension of their coding editor. One additional layer, which helps to write code faster and more reliably. This is not entirely wrong: AI-assisted coding seems to be a smarter linter/autocomplete feature on steroids.
You can even customize it to your needs. In Claude, you can tweak `CLAUDE.md` ([main configuration file](https://code.claude.com/docs/en/memory#claude-md-files)) with instructions fitting not only your codebase, but also your personal coding style. Create your own Claude commands and skills, and you have a powerful tool to deliver code faster than ever.

However, this breaks down in a team setting. Naturally, some people in the team use coding assistants in more advanced ways, while others stay on the basic level. The faster tools evolve (Claude Code publishes patches every few days!), the wider the gap between them becomes. This alone is not a huge problem, but it reduces the effectiveness of work. More importantly, it introduces inconsistencies for solutions produced by AI. Two people with different workflows and Claude's setup come up with two completely different solutions. In mature codebases, this is a big concern: consistency means a lot.
And finally, there are common problems we face when using coding assistants. Everyone working independently on them will duplicate effort.

## Realization moment

After a few months of using Claude Code, we saw a big difference between devs. Some were using it at full speed, some occasionally, and some stopped after a few tries and Claude's mistakes. I also noticed that some people treat it as a better linter or just a test assistant, while others were implementing complete features with it.

We quickly realized that the effectiveness of work with Claude could be improved by sharing good practices, learning the tooling, and adjusting to the specifics of the project. Introducing a common process addressed those issues.

The way you use the AI coding assistant is no longer your personal preference. It's a significant part of delivering software within your team. Therefore, you should no longer treat it as a code-editor-like tool. It's more like the coding convention (eg, "we use service objects"). Defining team standards came naturally and changed the way we deliver software.[^1]

## AI as team standard

Having a workflow helps a lot to start efficient work with AI. If you switch from another code assistant to Claude Code, you don't have to reinvent the wheel: there is a specific instruction on how to handle the work with Claude. And if you are new and Claude is your first code assistant, you might be overwhelmed by its capabilities. Fear not, just follow the instructions.

Using the workflow increases the **consistency** of generated code. In production systems, this is a very important factor. Following the same pattern of research-plan-implement flow gives developers more control over delivered solutions. Practical example? On a recent complex feature (lots of places to update, business logic changes, etc.) Claude happily generates a working solution. But without a workflow, it has several problems: wrong abstraction, shortcuts, and important decisions made silently. With the research-plan-implement approach, I have a chance to make those decisions before code is written. The result is a solution that's consistent with the rest of the codebase.

When devs across projects and the whole company share the same practices, they can communicate more easily. Speaking the same language and using the same techniques is a great value in the async work environment. It also makes the migration between projects super easy and helps to build a company-wide strategy regarding one of the most important aspects of web development.

## Procedure doesn't kill creativity

I want to say it out loud: having a procedure does not limit your creativity. In the same way, good coding practices don't force you to write boring code; having a Claude workflow is just a starting point. It's a guide, especially helpful for those who don't keep up with the latest updates and don't have the time to figure everything out on their own. In my case, a refined research-plan-implement workflow boosted my productivity and convinced me to use Claude Code more.

## Summary

Relying on vibe coding is fine for pet projects or startup apps, but it's hardly applicable for commercial projects. A structured workflow for using AI coding assistance becomes essential as a guide for maintaining the codebase quality while increasing the speed of delivery. I highly recommend starting with a shared `CLAUDE.md` document and then applying a specific workflow, eg. research-plan-implement.

*This post was originally published on [Visuality blog](https://www.visuality.pl/posts/your-team-needs-to-use-ai-assistants-the-right-way).*

[^1]: Paweł, CTO of Visuality, described the details of the process in [this blog post](https://visuality.pl/posts/from-vibes-to-process-ai-coding-in-production-codebases).
