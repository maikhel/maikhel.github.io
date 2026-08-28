---
layout: blogpost
title:  "Building a GTD system with AI"
description: "How I moved my GTD notebook from OneNote to Obsidian and let Claude maintain my work notes - and why my personal notes stay handmade."
image: "/images/red_tree_min.webp"
min_image: "/images/red_tree.webp"
min_image_width: 640
image_width: 1280
excerpt_separator: <!--more-->
tags: [gtd, productivity, ai]
---

In 2022, [in a blog post about GTD](/blog/gtd-thoughts-after-10-years/), I wrote:

> I can't imagine migrating my huge notebook to another tool right now.

Well, it just happened 😅

<!--more-->

The AI boom of the last few months, and the new tools that came with it, pushed me to update my flow. In this post, I want to describe how it went and why I moved only work notes to an AI-maintained system (leaving my personal notes as they were).

## The migration: OneNote to Obsidian

I've been using OneNote as my main GTD notebook for over a decade. Recently, though, I decided to abandon it in favor of Obsidian. This isn't just a difference in the editor - more importantly, it's a different file format. If I want to use AI with my notes, Markdown is the best format.

OneNote is a powerful editor with tons of features I never used - simple text notes are 99% of my GTD content! Obsidian is lightweight and seems much simpler, with plugins for anything more complex. One of them helped me migrate all my notes from OneNote - the migration went smoothly; I just needed to adjust some files where I used non-standard colors. And for data sync, I simply use iCloud.

## The experiment: Claude as GTD assistant

Moving notes to a better tool is just one part of the story. The second is the AI integration. I'm still not ready to use any AI tool with my personal notes due to privacy concerns, but work notes are a different matter.

Let me elaborate on the privacy topic: if I ever run a local model, I'll try connecting it to my personal notes. But right now, I don't want to expose my personal data to cloud services - e.g. notes regarding all my travels, finances, personal growth, address data. On the other hand, I have no problem using Claude with work notes, which heavily rely on GitHub or Jira, so they are already in the cloud.

How does an AI-driven GTD notebook work? I changed the philosophy and let Claude decide how the notebook should look. I started with a prompt describing my job role, what we are building, and the purpose.[^1]

This started an iterative process of questions and answers about how to organize the notes, what frontmatter to use, and what rules to apply. What I ended up with isn't a GTD structure at all - it's closer to a "second brain" idea. I've stopped caring which one it is. But here's the twist: I'm not maintaining the notebook anymore; Claude is!

Claude not only organized the notes, but also updated its own configuration and created skills to maintain the system. For example, a skill called "good morning" creates a daily note with all unfinished items from the previous day, Google Calendar events, GitHub PRs assigned to me for review, and items from the "Incoming" section. It saves me a lot of time every day. Similarly, when a new sprint starts, I ask Claude to fetch all tickets assigned to me and create a Sprint note, so I can track my progress in the notebook.

## Whose system is it, anyway?

I believe LLMs can help build a GTD system, automating routines or making parts of the knowledge base more accessible. But there are a few limitations, similar to what happens when you write code with AI: the more you rely on the assistant, the less you know your own codebase. When AI organizes your notes, you automatically lose track of them.

In my work notes, I don't care about structure at all. I ask Claude to "create a new meeting note for me"; I don't have to create it on my own, figuring out the exact location, naming, and frontmatter. Naturally, I don't perform weekly reviews of my work notes anymore - I just occasionally ask Claude for a cleanup. This way I have a system maintained by Claude, not by me. Is it a problem?

Yes and no. It's not a problem as long as it works. It becomes a problem if I want to know what is happening internally. And for my personal GTD notebook, I'd like to have control over what is happening and how the data is organized.

I still perform weekly reviews to build a mental model of what's in there. If Claude creates one more useful checklist, it won't be much help until I remember it exists. Unfortunately, this contradicts the foundation of GTD, which is a **trusted system**. When I walk through the system every week, I know the structure and know where to find what. When AI maintains the notebook, I lose trust - it shifts from my mental model to an AI model.

## Summary

For now, I keep the dual structure of my GTD system: AI maintains the work-related part, while I handle the personal part entirely by hand.

GTD with AI is not the same system anymore. Half of the responsibilities are shifted to automations or skills, turning me from the system's maintainer into its consumer. This is a bigger change than just tooling and stops me from using AI with my personal notes (even if privacy concerns are solved with a local model). I'm not ready to give up the most valuable part of GTD: thinking, clarifying, and choosing next actions.

[^1]: "I'm a team leader in the project XYZ. Help me clean up the notes in the current dir and organize them in the system. There are also other notes, like blog posts, ideas, conference CFPs, etc., so make sure to organize them as well. I want you to build a system for maintaining notes and projects, so I can keep track of progress and have everything well organized. Ask me if you have questions."
