---
image: "/images/thing.webp"
min_image: "/images/thing_min.webp"
layout: blogpost
title:  "A simple guide to pessimistic locking in Rails"
description: "Rails pessimistic locking tutorial - learn how to implement database locks, handle race conditions, and test concurrent operations in Ruby on Rails"
excerpt_separator: <!--more-->
---

In the Rails world, optimistic locking is relatively well known, while its pessimistic alternative is often overlooked. In this blog post, I will present how to effectively use pessimistic locking in Rails applications.

<!--more-->

### What is it?

Pessimistic locking works at the moment of retrieving the records from the database. One process blocks a particular record and others wait until it's unblocked. This ensures that a certain process will always use the newest version of the record (or raise an exception).

Pessimistic locking assumes that transaction conflicts occur frequently in the system. In such a situation optimistic locking wouldn't be much useful: it would cause irritating Stale Object errors too often. To address this challenge, a different approach is necessary.

The remarkable benefit of pessimistic locking is the fact that it doesn't affect the whole system. You don't have to change the database at all. Instead, you need to explicitly specify all areas which will utilize this technique. This way you have full control of which processes needs to care about locking. It's useful for fixing places with race conditions, without affecting other functionalities.

### Show me the code

```ruby

ActiveRecord::Base.transaction do
  # SELECT * FROM INVOICES WHERE id=? FOR UPDATE
  invoice = Invoice.lock.find(invoice_id)

  return unless invoice.status == 'new'

  invoice.create_payment
  invoice.update(status: 'paid')
end
```

Selecting a particular invoice uses special SQL command: `SELECT ... FOR UPDATE`. It "locks" the rows returned by `SELECT` and prevents other processes from retrieving it until the transaction is done. At the same time, other places in the app could use the good old `Invoice.find(invoice_id)` statement without worrying about locks.

### Advanced stuff

It is possible to use database-specific locking by passing custom clauses to the `lock` method, such as:

```ruby

# raise an error if a record is already locked
invoice = Invoice.lock("FOR UPDATE NOWAIT").find(invoice_id)
```

There is also an alternative method for locking individual records:  `with_lock` . In this scenario, all operations happening within the block are wrapped into the transaction.

```ruby

invoice = Invoice.find(invoice_id)
invoice.with_lock do
  (..)
end
```

The general rule is: **Always use pessimistic locking within a transaction.** Theoretically, you can call `lock!` method on records outside of it, but it doesn’t make sense and won’t simply work.

### Testing pessimistic locking

Testing pessimistic locking is not trivial. To simulate the real conditions, many processes must attempt to retrieve a record simultaneously. This can be achieved by using some concurrency mechanisms, like ruby threads:

```ruby

threads = []
3.times do
  threads << Thread.new do
    service.call
  end
end
threads.each(&:join)

# this should fail without a lock
expect(invoice.payments.count).to eq 1
```

### Summary

There are certain scenarios when pessimistic locking is perfect. It's a valuable tool for resolving race conditions and maintaining data integrity. Use it when you don't want to introduce an extra `version` column for optimistic locking. Or, when you need to fix a specific place in your Ruby on Rails app without affecting the rest of the system.


*This post was originally published on [Visuality blog](https://www.visuality.pl/posts/a-simple-guide-to-pessimistic-locking-in-rails).*
