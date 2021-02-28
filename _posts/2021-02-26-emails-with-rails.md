---
image: "diana-akhmetianova-iZCHv8ViRdw-unsplash.jpg"
layout: default
title:  "How to receive emails with a Rails app in 2021"
external_url: "https://www.visuality.pl/posts/how-to-receive-emails-with-a-rails-app-in-2021"
---

Some time ago, we needed to implement a full email inbox feature in the Ruby on Rails application. It was supposed to have all the basic functionalities that regular email inboxes have: send and receive messages, collect them in threads, have a contact book, etc. While email sending is a relatively frequent feature among Rails applications (there are tons of different solutions around the web), receiving messages is not so popular. So, let’s take a look at possible ways of building an email receiver mechanism with Rails.

---

* Solution 0: Rails Action Mailbox
* Solution 1: Third-party integration with Griddler
* Solution 2: IMAP protocol
* Solution 3: AWS SES
* Summary

### Solution 0: Rails Action Mailbox
Rails 6 release in 2019 changed the way of handling emails in Ruby on Rails applications by introducing the [Action Mailbox](https://guides.rubyonrails.org/action_mailbox_basics.html) feature. It allowed routing incoming emails to controller-like mailboxes - for every new email, there now was an InboundEmail record created that could be processed later on. Action Mailbox by default uses Active Storage to keep messages in the cloud and automatically provides a background job for deleting old emails. Moreover, it integrates easily with the most popular transactional email services like Mailgun, SendGrid, Mandrill, Postmark, and allows to handle emails directly with Postfix, Exim, or Qmail. The only disadvantage: using Action Mailbox requires Rails 6, which can be hard to achieve if you are maintaining old applications with legacy code.

**To sum up:** use Action Mailbox if you can, otherwise keep reading to see other solutions!

### Solution 1: Third-party integration with Griddler
This was the most common solution before Rails 6. Basically, developers built a similar mechanism to what Action Mailbox provides, but using a ruby gem called [Griddler](https://github.com/thoughtbot/griddler). It adds an endpoint for receiving messages and lets the developer define a class that will be responsible for processing messages later on (like creating a database entry with an email body or sending an automatic reply). It’s also possible to easily integrate Griddler with transactional email services like Sendgrid or Mailgun (there are even dedicated gem versions, like [griddler-sendgrid](https://github.com/thoughtbot/griddler-sendgrid) or [griddler-mandrill](https://github.com/wingrunr21/griddler-mandrill)). Disadvantages? It’s a little outdated. According to [The Ruby Toolbox page](https://www.ruby-toolbox.com/projects/griddler), it has a low commit activity in the last 3 years and no release in over a year.

**To sum up:** a little outdated, but still a usable alternative for Action Mailbox.

### Solution 2: IMAP protocol
[IMAP](https://tools.ietf.org/html/rfc3501) (Internet Message Access Protocol) was created in 2003. Its goal was to define how email communication across all the web should work. So why don’t use it directly? Without a doubt, the most popular is a ruby built-in library Net::IMAP. It allows all basic operations provided by the aforementioned protocol, like connecting to the IMAP server, getting a list of inboxes, fetching email messages, etc. Unfortunately, using it is a bit troublesome: protocol itself is a little enigmatic, Net::IMAP library documentation could be more precise and, most importantly, it doesn’t provide some features of modern email inboxes, like handling attachments or connecting via SSL (or requires a significant amount of work to add them). Building a complex solution based on Net::IMAP library requires much work and should be considered only when other solutions are not viable (or as an interesting side project).

**To sum up:** Net::IMAP is for very simple use cases or for radical geeks who want to implement everything on their own.

### Solution 3: AWS SES
[Amazon Simple Email Service](https://aws.amazon.com/ses/) allows cost-effective handling of emails: both incoming and outgoing. It integrates very well with other AWS services (eg. S3, Lambda) and provides lots of flexibility in terms of architecture design. Building an AWS SES-based email processor with Rails application could be more complex than the options mentioned above and will require some knowledge about AWS infrastructure, but will also allow creating a well-tailored solution. This was the path my team chose when implementing an email receiver (after creating a prototype and confirming that it meets all requirements). We integrated AWS SES with S3 for storing all incoming messages and with Lambda function, which is invoked every time a new message comes. Then, Lambda saves information about new emails to the database which is used by the Rails application. In the end, the whole architecture is very flexible and extendable - I will present its details in the next blog post. :)

**To sum up:** AWS SES is the best solution for more complex systems, which already use AWS infrastructure.

---

### Summary
There are many different options to implement email receiving in Ruby on Rails applications. Probably the easiest and most straightforward one is picking Action Mailbox, but it might be not possible for applications with older versions of Rails. In such cases, one should consider other circumstances, such as architecture dependencies, specific feature requirements, or even budget to choose the most suitable solution.

