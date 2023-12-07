---
image: "green.webp"
layout: blogpost
title:  "Data Quality in Ruby on Rails"
excerpt_separator: <!--more-->
---

![image](/images/green.webp)

Preserving data quality is always a challenge. Especially in the Ruby on Rails world where products ship fast.  It means some compromises are made along the way and often data quality is sacrificed. And when it comes to data - it's better to prevent than cure. Continue reading to see how you can avoid many data problems, at different stages of Rails app development. You will thank me later.
<!--more-->

TLDR; developers should undertake different actions to preserve data quality depending on the Rails app phase. Skipping any, leads to significant problems later.

## What is data quality and why you should care?

We can define data quality as the reliability of information to serve an intended purpose. How much it fulfills this goal depends on different criteria [^1] :

- accuracy - data is close to reality
- relevancy - data meets the requirements
- completeness - there are no missing values, records
- timeliness - data is up to date
- consistency - data has the same results in different data sets.

There are complex tools for measuring more data characteristics (e. g. Data Quality Assessment Framework), but that's a completely different topic.

High-quality data benefits in many areas. It helps in better decision-making, planning, improving customer experience, and cost optimization. Good data makes developers' work easier and opens new possibilities, such as using Machine Learning.

## Typical Rails application flow

Let's go back to Rails world. I'd like to use the division introduced by Andrzej Krzywda during the ["I love dev" conference](https://www.visuality.pl/posts/i-love-dev-and-so-do-we). He showed that typical Rails app development can be divided into certain phases [^2]. I want to enrich this classification with the data quality aspect and show that depending on the phase, there are different challenges in keeping the right shape of data.

### 1. Startup

Typical Rails apps start here. The development process is very fast and new features are added from demo to demo meeting.

In this phase, developers don't have much time for writing proper code. Delivering anything that works is usually more important than building a well-designed solution. The prototype doesn't have to be perfect to be shipped and tested against customer expectations. Unfortunately, legacy code written in this phase tends to stay in the codebase forever. This leads to many problems, including data quality flaws.

It's hard to talk about data quality in the Startup phase because there is no data yet. Also, there are no clear expectations for the data. Next month some features may be reworked or completely scrapped. Or, completely new requirements will emerge. This is fine. At this stage, developers should take care of the data coming into the system. Which means:

- control data input (e. g. format data before saving)
- add proper validations
- change data in a consistent way (e. g. using aggregates).

### 2. Engineering phase

The product behind the app was somehow successful, so there are plans for the next 1-2 years of development. Real clients are using the app and new features are planned according to their feedback. Oftentimes, the development team changes, because expectations are different - stability over deliverability. At this point, the team starts analyzing collected data, and project owners start to be aware of its importance.

This is the crucial phase, sometimes not recognized by the development team used to working in the startup phase. While it is time to stop and take a breath. This is the moment the first serious expectations around data are built - e. g. developers need to add more sophisticated admin tools, reports, or more analytics, etc.

New data still comes to the system but in a more structured way. The question of **WHY** data look like this becomes equally important to collecting data itself. Thus, developers should try to introduce tools/techniques to help answer this question.

Once again, be careful about strategies learned in the startup phase. Fixing data in the console on production is no longer a valid solution. A more professional approach is needed, especially:

- ask business people about expectations from data
- define the most important data
- improve logs of incoming data (e. g. log facts of changing sth in the system)
- operate on data in a secure, tested way (e. g. [safe data migrations](https://www.visuality.pl/posts/safe-data-migrations-in-rails))

### 3. Mature app

A project lives more than 2-3 years. Lots of development effort is moved toward fixing bugs or current maintenance. New features are well thought out and analyzed. There is a huge amount of collected data and usually, a data analyst joins the team.

In this phase, the software development department needs lots of time for delivering new features. Planning them requires collecting feedback from different places in the organization. Also, the process of developing, testing, merging, and releasing tends to take lots of effort.

Sometimes business people realize that the collected data is a true value to the company. No competitor has such a unique collection! Data analysis becomes complex and important, so usually, a dedicated team is created.

Actions taken in this phase depend on the effort on keeping the clean data in previous stages. Developers must fix and backfill the most urgent data flaws or the team learns how to handle data. Usually, both.

Takeaways:

- have a separate person/team/department for data management
- analyze the data professionally
- educate the team.

## What if you don't care?

It's very easy to forget about keeping the data clean. E. g.  adding validations may not be a priority for V1 of the feature. Unfortunately, **mistakes which are easy to fix in the first place, are very expensive to fix later.**

Shortcomings made in the startup phase usually result in a bunch of data-fixing tasks being put into the backlog. It's important to take care of them whenever possible - the more waiting, the more corrupted data is potentially created in the system. And such tasks are usually a nightmare for developers. They need to recreate data inconsistencies, which is not always trivial. Then they must provide a secure way to update existing records. Oh, and fixing the root cause, which is also not always obvious. But skipping this step here can lead to real trouble in the next phase.

Imagine a mature application where half of the development time is spent on maintenance. Having bad-quality data at this point is a missed opportunity - time is spent on fixing data instead of analyzing it. It stops the data engineering team from providing valuable insights and the business from growing. From a developer's perspective, handling data tasks is no longer a nightmare, it's a hell. Fixing the data requires huge development efforts and coordination with other departments. Sometimes it's so hard that it lands at the bottom of the backlog and stays there forever.

## Summary

The development team should be responsible for delivering solutions with excellent code. But it should also take care of data quality. The sooner developers realize that, the better. Open dialogue with business people is essential and helps in building a solid policy for tackling data quality challenges. Depending on the product phase, different actions can be taken. And adequate data equals cleaner code, more interesting tasks, business growth, and developers' happiness.

<br>   

--- 

[^1]: More about measuring data quality: [https://www.bmc.com/blogs/data-quality/](https://www.bmc.com/blogs/data-quality/)
[^2]: Proposed division can apply to whole apps or just some parts of them. For example, new features can be delivered in 'startup' mode, while the rest of the app can be mature, requiring bug fixes and maintenance.
