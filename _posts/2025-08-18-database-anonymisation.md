---
homepage: true
image: "/images/mask.webp"
min_image: "/images/mask_min.webp"
layout: blogpost
title:  "Tradeoffs of Anonymising Production Data"
description: "Database anonymisation in Ruby on Rails apps - revisited"
excerpt_separator: <!--more-->
---

At some point, in every Rails project, someone says: 'Hey, our testing dataset is not relevant anymore, maybe we could anonymise production data and use it instead?'. That's when a tough journey begins: ensuring data privacy, updating scripts, and securing infrastructure. Let's explore the challenges you might face if you decide to anonymise your production data.

<!--more-->

### What even is data anonymisation?

Data anonymisation means stripping your dataset of all Personally Identifiable Information (PII). [Under the GDPR](https://www.gdprsummary.com/anonymization-and-gdpr/), it includes names, addresses, dates, and financial information that can be used to identify a person. Each piece of information has a different level of privacy and security. For example, a credit card number is more sensitive than a company name. But safe to say: if someone steals your anonymised database and **can't** track original records out of it, you are good. This means you need to provide a certain level of anonymisation. If data is reversible, it's called pseudo-anonymisation. Which is not GDPR compliant, so you'd rather avoid it.

### Reasons to anonymise

It all starts with identifying your actual goal.

- Are some unreproducible bugs happening in production?
- Do you need to run performance tests on a production-like dataset?
- Or, you want to test your data migrations without any complications?

The list of reasons can be long, and each project has its unique conditions. Often, data anonymisation is just one of several possible strategies. Taking one step back might help you find simpler alternatives.

For instance, using monitoring tools like New Relic can help with checking performance. Debugging data issues in production is much the same. Using Active Admin or QuickSight for observability can remove the need for an anonymised database. With tools like Active Admin, you can inspect live production data directly in a controlled environment - no need to download or copy it elsewhere**.** Or, dummy-data generators can solve the problem of a low volume of data. Data anonymisation is one of the options, usually not the best one for you. Why consider data anonymisation alternatives? Because of:

### The cost of data anonymisation

Data anonymisation is expensive on different levels. Let's reveal them.

**First:** data security and privacy. You need to make sure anonymised data does not contain **any** PII. You need to remove all addresses, real names, birthdates, bank accounts, and more from each table with great attention. But consider also less obvious fields: record `created_at` or `updated_at` timestamps, links to files, API keys, internal notes, and slugs. If you want truly anonymised data, the script needs to be extremely precise - that's hard to achieve.

**Second:** extra complexity in your infrastructure. Data anonymisation means copying the real production database. The process must run in the production ecosystem - downloading raw data to anonymise it locally would defeat the entire purpose. It’s a sensitive operation that requires extra care. It also adds another brick to your infrastructure - someone has to maintain it and ensure it stays secure.

**Third:** maintenance and updates. You have a perfect script and elegant infrastructure to invoke it, but your work is not done. Every update to the data structure requires checking if the script should also be updated! This step might be partially automated with CI, but the anonymisation script is still something to remember after any code changes. Extra effort and a huge risk of mistakes.

### Data anonymisation and AI

In the modern era of agentic coding and MCP servers, a new question arises. What if you want to connect AI to your production database to get some insights or solve some problems? Since your trust is limited, you want to anonymise the data first. That's a fair point, but using AI on the anonymised database won't work as well as with real data. Why? Because **truly anonymised data is no longer production data**. Names, dates, null values, and long text notes are all different.

Want AI to help you fix tricky production bugs? Keep in mind that anonymisation greatly alters the dataset. Bugs can be unreproducible anymore. The same problem applies to insights about your database - anonymised data can behave differently.  But there is good news: you can find details about missing indexes, performance tests, and table structures using other tools. You don’t need a real production database to do this.

### Summary

Data anonymisation has always been important. However, in the modern era of data leaks and AI learning from datasets, it is even more significant. Explore other solutions first! Data anonymisation comes with high maintenance costs, a lot of effort, and uneven risks. Treat it as a last resort. And if you choose to do so, be extra careful about its security and maintenance.
