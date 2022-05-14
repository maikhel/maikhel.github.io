---
image: "machine.jpeg"
layout: default
title:  "Let's prototype"
excerpt_separator: <!--more-->
external_url: "https://www.visuality.pl/posts/let-s-prototype"
---

{:.lh-copy .measure-wide .center}
![image](/images/machine.jpeg)

{:.lh-copy .measure-wide .center .tj}
Uncertainty is an inseparable part of creating any software. At the beginning of the project you never have a full knowledge about future requirements and features. Developers don’t know the whole specification, project manager doesn’t know all clients’s expectations and usually clients are not aware about all features their product should have. When the amount of unspecified requirements is significant, choosing to create a prototype could be really beneficial.
<!--more-->

{:.f3 .tc .lh-title}
About prototypes

{:.lh-copy .measure-wide .center .tj}
Prototyping is one of the system development life cycle methods, used in software development from late 70’s. Basically, it’s about creating a prototype — simplified model of the system or its part. It’s especially helpful in situations where not all requirements are specified at the beginning. Usually creating a prototype has following stages:

{:.lh-copy .measure-wide .center .tj}
1. gathering basic project requirements
1. developing a prototype
1. review — getting feedback from client or end user
1. adjusting prototype according to feedback.

{:.lh-copy .measure-wide .center .tj}
Creating a prototype could be the easiest way to visualise and try business ideas, it helps to spot potential risks, misunderstandings or concerns. Ideally, creating a first version of prototype should take relatively small amount of time. Open dialogue between developer, who creates a prototype and the client/end-user, who tests it, is a must-have element in this process. Client can easily check if developer understands all needs and propose improvements after reviewing prototype. Thanks to fast feedback, developer can implement fixes and is more likely to create a solution that meets all expectations of client.
Depending on how prototyping outcome is used, we can distinguish two types of prototyping: throw-away prototyping and evolutionary prototyping. Both of them have specific use cases.

{:.f3 .tc .lh-title}
Throw away prototyping

{:.lh-copy .measure-wide .center .tj}
In throw-away prototyping created software isn’t the part of the final solution. It might look like a waste of time, money or development resources to create a product, which won’t be used, but sometimes it’s really worth to create such prototype. This type of prototyping is really helpful to answer the question if requested feature is possible to implement or if all requirement are well understood by developers. Created software often reflects most important part of the system or the feature that is the biggest unknown. Getting feedback about fast developed solution is the most valuable part of this process — after that, prototype can be thrown away and work on final product can be started. Thanks to this kind of prototyping, not only client can define his/her needs in more specific way, but also developers can plan the architecture easier and select right tools to build the final solution.

{:.f3 .tc .lh-title}
Evolutionary prototyping

{:.lh-copy .measure-wide .center .tj}
The second type of prototyping is the process of creating a final solution by building more and more advanced prototype. It differs from throw-away prototype in one basic thing — prototype is not discarded, it will go to production. The key point is the feedback provided by the client after each development iteration — because it defines the direction of further improvements. That’s why the communication between developers and client is very important for this methodology. It’s also called “rapid prototyping” due to fast feedback loop and immediate software growth.

{:.f3 .tc .lh-title}
Pros & cons

{:.lh-copy .measure-wide .center .tj}
As every software building methodology, prototyping has weak and strong sides. Let’s take a look at advantages first.
Creating a successful prototype requires developing ubiquitous language among the people involved in the project. Developers and project owners/clients have to learn common terms and get to know all business domain models that stays behind implemented logic. Only then, developers who are working on the prototype, are able to fully understand the real needs and all requirements. Using ubiquitous language makes work on the prototype really productive and guarantees that developed outcome solves the original problem.
Moreover, prototyping allows to spot the risks and potential problems at the very early stage of development. Prototype is also a good place for experimenting with new solutions, ideas and technologies. Also, mistakes discovered in prototype are far more cheaper to repair than bugs that could occur in the final version of product.

{:.lh-copy .measure-wide .center .tj}
Last but not least, created prototype can have a huge influence on the decisions connected to next steps of product. Simple, but working software, can show a potential of implemented ideas and even increase the excitement of the team and product owners. Especially that client could have a feeling of being of co-creator of the product thanks to provided feedback.
On the other hand, there are some dangers in using prototyping wrong way. The most common is to choose to prototype when there is no need for that. If there are clearly written requirements already and client expects a fully working solution, choosing to start with prototype could be a wrong decision.
Also, due to necessity of feedback provided by end-user/client prototyping should’t be used in environment where communication with the client is difficult. In such scenario, prototyping desired to speed up development process might have exactly opposite result. Other disadvantages are connected to fast development process: lack of documentation, using provisional solutions that remain in final product or no time for creating solid codebase just to name a few.

{:.f3 .tc .lh-title}
Case study

{:.lh-copy .measure-wide .center .tj}
We needed to create a simulator that will help visualise accounting processes. There was an existing application, but it was old and had a deprecated technology stack (flash) that needed to be replaced. It was also nearly impossible to extend or add new features. Creating a prototype worked great for us here.
Our client requested to build a new solution with similar functionalities and a little polishing. Actually, new software was expected to work pretty the same, but better — faster, more reliable and easier to configure. And that was all the requirements — the technology, system design and architecture was up to our choice. So we decided to create a prototype that reflects existing functionalities but in the shape of new technology and frontend design. We also wanted to discover weak points and problems that might occur during migration to new version.

{:.lh-copy .measure-wide .center .tj}
First prototype was time-boxed for five-seven days. After that time we had a very simple, but working solution with basic functionalities and architecture draft. We also noticed some trouble cases and uncertainties that needed to be addressed by client. This was a key point — after a few days of rapid development and a review meeting with client, we gained lots of knowledge about unspoken expectations. We discovered that next to using modern technology, the most important requirement was flexibility and configurability of the new solution.
After initial review and provided feedback, we threw away first prototype and started to work on a software, which eventually became final product. Therefore, we moved from throw-away prototyping process to evolutionary prototyping. In next iterations we were improving the solution based on client’s feedback and finally developed working system that meets all requirements.

{:.f3 .tc .lh-title}
Summary

{:.lh-copy .measure-wide .center .tj}
Prototyping is a very helpful software development technique, especially when building complex systems with many user’s interactions or complicated logic that needs to be tested by clients/product owners. Fast feedback provided by them looks to be a crucial part of creating and improving a prototype. From developer’s perspective, I can say that creating a prototype — having only the general image, not detailed specification — was quite challenging but also so much fun!
