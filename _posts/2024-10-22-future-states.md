---
image: "grain_field.webp"
min_image: "grain_field_min.webp"
layout: blogpost
title:  "Handling Errors in Concurrent Ruby"
excerpt_separator: <!--more-->
---

![image](/images/grain_field.webp)

In the previous [blog post on Ruby concurrency](https://www.visuality.pl/posts/from-celluloid-to-concurrent-ruby-practical-examples-of-multithreading-calls), we explored how to spawn many sub-threads with a concurrent-ruby gem. Let's continue the topic and get to know the `Future` class much better: its life cycle, state methods, and strategies for error handling.

<!--more-->

TL;DR: There is [a great documentation page](https://ruby-concurrency.github.io/concurrent-ruby/master/file.promises.out.html#Asynchronous_task)

## States of the future

We can use the `Concurrent::Future` object to spawn an asynchronous execution of the code. The preferable way of doing it utilizes the `Promise` class and `future` factory method:

```ruby

future = Concurrent::Promises.future { a_long_thing_to_do }
```

Upon creation, `future` starts in the *pending* state. When it finishes, it becomes *resolved*. This state has two sub-states to inform if the result was successful or not. Accordingly: *fulfilled* or *rejected*.
By the way, you can even create an already-resolved `future`!

![image](/images/future_states.png)

To fetch the result of the `future`, we can use the `value` method. This method blocks and waits for the `future` to be resolved. Before `future` resolves, `value` is `nil`, but then it becomes the result of the operation. In case of failure, `value` stays `nil` and we can use an additional method: `reason` to find out the error.  And speaking about errors...

## Errors in the future

Exceptions raised inside futures are **silent**. They are not transmitted into the main thread unless explicitly specified. When an exception occurs, the future's `value` remains `nil`. Which alone is not enough to distinguish between failure and an unresolved future. Therefore we need to inspect the internal state of the future using methods like `rejected?` or `fulfilled?`.

In production, it's crucial to have better control and observability. So we can add a `rescue` inside future block execution to act when something wrong happens.
Alternatively, you can force the future to raise an exception and transmit it into the main thread. This behavior is achieved with the `value!` method.

Last but not least, rescuing errors in async threads requires rethinking the desired behavior of the program in case of trouble. In some cases, it's acceptable to let the process fail; in others, you may want to retry the operation. In most cases, we want to at least know if something goes wrong within a sub-thread. Let's see it in action!

## Example implementation of errors handling

We will use an example script from the previous blogpost - a service class that makes async requests to API and returns results.
Code examples are also available in [my GitHub repository](https://github.com/maikhel/ruby-multithreads-examples)

```ruby

require 'net/http'
require 'json'
require 'concurrent'

class AsyncConcurrentService
  API_ENDPOINT = 'https://api.chucknorris.io/jokes/random'.freeze

  def self.call(requests_count)
    jokes = Concurrent::Array.new

    futures = requests_count.times.map do
      Concurrent::Promises.future { DataRequester.new(API_ENDPOINT).call }
    end

    jokes = futures.map(&:value)
  end
end

class ApiError < StandardError; end

class DataRequester
  def initialize(url)
    @url = url
  end

  def call
    raise ApiError, 'ERROR' if rand > 0.8 # 80% chance of success

    response = make_request

    parse_response(response)
  end

  def make_request
    uri = URI(@url)
    response = Net::HTTP.get_response(uri)
    response.body if response.is_a?(Net::HTTPSuccess)
  end

  def parse_response(response)
    # parsing response
  end
end
```

To test program behavior in case of errors, we added `raise ApiError, 'ERROR' if rand > 0.8`. We assume that in 20% of cases, the sub-thread will raise an error. With the current implementation, the thread will silently fail and return `nil` as a value. So the good news is that the program still works and finishes without exceptions. Bad news: it works in 80% of cases.

Let's update the service to ensure we fetch the desired number of jokes, no matter how many errors were returned by API.

```ruby

require 'net/http'
require 'json'
require 'concurrent'

class AsyncConcurrentErrorsRescueService
  API_ENDPOINT = 'https://api.chucknorris.io/jokes/random'.freeze

  def self.call(requests_count)
    futures = requests_count.times.map { future_with_retry(3) }

    jokes = Concurrent::Promises.zip(*futures).value

    jokes.compact
  end

  def self.future_with_retry(attempts = 3)
    Concurrent::Promises.future do
      DataRequester.new(API_ENDPOINT).call
    end.rescue(ApiError) do |_error|
      future_with_retry(attempts - 1).value if attempts > 1
    end
  end

end

# rest of the code the same
```

There are a few key changes:

- `future_with_retry` is a method that wraps the execution of a future and retries up to 3 times in case of errors. There is a `rescue` block to capture any `ApiError` exceptions. Notice that it is placed **after** the future block to avoid spawning new sub-threads within the existing future. After 3 failed attempts, it returns `nil`.
- `Concurrent::Promises.zip` is used to ensure all sub-threads finish before the main `call` function returns their results.

This approach makes `future_with_retry` method responsible for making API requests retries in case of errors. It could be improved for production usage by adding errors logging and introducing a delay between retries.

## Summary

Concurrent-ruby's `Future` class is a powerful tool for creating multi-threaded programs. Understanding its life cycle and helper methods is a good starting point before going to more complex topics such as chaining and using non-blocking methods. And let's not forget about proper error handling!

*This post was originally published on [Visuality blog](https://www.visuality.pl/posts/handling-errors-in-concurrent-ruby).*
