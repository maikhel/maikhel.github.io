---
image: "lollipops.webp"
min_image: "lollipops_min.webp"
layout: blogpost
title:  "From Celluloid to Concurrent Ruby: Practical Examples of Multithreading Calls"
excerpt_separator: <!--more-->
---

![image](/images/lollipops.webp)

Multithreading is a hot topic in the Ruby community. There are many good sources of theoretical knowledge (e.g. [this blog post written by Janek](https://www.visuality.pl/posts/concurrency-and-parallelism-in-ruby-processes-threads-fibers-and-ractors)), so let's focus more on practical use cases. In this article, I'm showcasing a few different ways of making asynchronous calls within a single process and ensuring their completion.

<!--more-->

**TL;DR:** Use Concurrent Ruby's `Future` class for retrieving results from async calls. Skip to the last paragraph for code examples.

## A few concepts before we start

In this tutorial, let's assume we need to make N number of calls to an external API. We can execute them asynchronously, but eventually, we want to display all results in one place. This is important: we expect the main thread to wait until all async calls are finished.

You can find presented examples, along with some benchmarks, in [this GitHub repository](https://github.com/maikhel/ruby-multithreads-examples).

## Ruby Thread.new

Before we jump into the description of the first example, let's describe the parts that are common for all of them.
We will use a `Queue` instance to collect results from async calls. It's the only built-in data structure that is thread-safe in Ruby. Thanks to that, we don't have to care about problems with concurrent data access.
`DataRequester` class is not relevant, let's just remember that it makes `GET` requests to a given endpoint and returns results (and could be written better, I know).

```ruby
require 'net/http'
require 'json'

class AsyncThreadsService
  API_ENDPOINT = 'https://api.chucknorris.io/jokes/random'.freeze

  def self.call(requests_count)
    jokes = Queue.new
    threads = []

    requests_count.times do
      thread = Thread.new do
        requester = DataRequester.new(API_ENDPOINT)
        jokes << requester.call # returns string with a response from API call
      end

      threads << thread
    end

    threads.each(&:join)

    jokes
  end
end

class DataRequester
  def initialize(url)
    @url = url
  end

  def call
    uri = URI(@url)
    response = Net::HTTP.get_response(uri)

    parse_response(response.body)
  end

  def parse_response(response)
    # (..) parsing response, nothing interesting here
  end
end
```

Every `DataRequester` invocation is wrapped into a separate `Thread.new` block, making the calls async. Nothing complicated. At the end of the call method, we execute `threads.each(&:join)` to make sure that all spawned sub-threads are completed.
The solution looks straightforward, but naturally, there are alternatives.

## Celluloid Actors

[Celluloid](https://github.com/celluloid/celluloid) is a great gem, heavily used in the ancient times of Ruby 2.0. Let's incorporate it into our solution.

```ruby
require 'net/http'
require 'json'
require 'celluloid'

Celluloid.boot

class AsyncCelluloidService
  API_ENDPOINT = 'https://api.chucknorris.io/jokes/random'.freeze

  def self.call(requests_count)
    jokes = Queue.new
    requesters = []

    requests_count.times do
      requester = DataRequester.new(API_ENDPOINT)
      future = requester.future.call


      requesters << future
    end

    jokes = requesters.map(&:value)
  end
end

class DataRequester
  include Celluloid

  # the rest is the same as in the previous example
  # (...)
end
```

Celluloid introduces the concept of Actors. Actors are objects that can be spawned in the background with a monitored state. We can turn the existing `DataRequester` class into an Actor by including `Celluloid` module. From now on, we get plenty of async methods available on class instances. In our case, we will use `future`. Futures or promises represent the concept of async calls that will eventually return some value. Perfect for returning a response from HTTP calls.

Now, instead of threads, we have a collection of futures. Calling `value` on each of them ensures their execution is finished.
The last noticeable change is an invocation of `Celluloid.boot` at the beginning of the file. We need to spawn a Celluloid supervisor. In the Rails app, we typically put it in the initializer.

## Concurrent Ruby

The previous solution looks good to me, but there is one problem. When you visit the Celluloid GitHub page, you can read: "As of 2016 the gem is not maintained any more". 😱

So, how is it done today?
[Concurrent Ruby](https://github.com/ruby-concurrency/concurrent-ruby) is a modern library providing a vast array of tools for multithreading. Let's take a look at the code:

```ruby

require 'net/http'
require 'json'
require 'concurrent'

class AsyncConcurrentService
  API_ENDPOINT = 'https://api.chucknorris.io/jokes/random'.freeze

  def self.call(requests_count)
    jokes = Concurrent::Array.new
    futures = []

    requests_count.times do
      requester = DataRequester.new(API_ENDPOINT)
      future = Concurrent::Future.execute { requester.call }

      futures << future
    end

    jokes = futures.map(&:value)
  end
end

class DataRequester
  # exactly the same as in the 1st example
  # (...)
end
```
As you can see, we follow a similar approach with futures. However, we don't have to include any additional modules in `DataRequester` class. This is the most significant difference between Celluloid solution. The logic of asynchronous operations completely shifts from the actor into the service class which decides what to invoke asynchronously.
And we can also utilize the `Concurrent::Array` structure for storing the results.

## Summary

The listed examples cover the elemental scenario of multithreading in Ruby. We used `Futures` to fetch the results of async calls to ensure they all finish. Of course, we could make some improvements, such as adding error handling in sub-threads or introducing a thread pool. Maybe that's a good topic for the next article... 🤔

P. S. If your use case covers specifically sending many HTTP requests simultaneously check out [Typhoeus](https://github.com/typhoeus/typhoeus?tab=readme-ov-file#making-parallel-requests) gem.


*This post was originally published on [Visuality blog](https://www.visuality.pl/posts/from-celluloid-to-concurrent-ruby-practical-examples-of-multithreading-calls).*
