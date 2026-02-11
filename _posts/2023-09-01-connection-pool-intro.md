---
homepage: true
image: "/images/window.webp"
min_image: "/images/window_min.webp"
layout: blogpost
title:  "Easy introduction to Connection Pool in ruby"
description: "Ruby connection pooling guide - learn how to improve performance with ConnectionPool gem for RabbitMQ and other external services with practical examples"
excerpt_separator: <!--more-->
---

As Rails developers, we often encounter performance issues in different parts of our applications. But establishing connections to external services is usually the place we overlook. Let me introduce the concept of connection pooling and show you an example of easy, performant connections to RabbitMQ.

<!--more-->

### The problem

Imagine we need to asynchronously send messages to RabbitMQ. We can use [Bunny](https://github.com/ruby-amqp/bunny) gem and have the following ruby method:

```ruby

def send_message_to_rabbit(message)
  rabbit_client = Bunny.new(
    hostname: ENV.fetch('RABBITMQ_HOST'),
    username: ENV.fetch('RABBITMQ_USER'),
    password: ENV.fetch('RABBITMQ_PASS'),
    port: ENV.fetch('RABBITMQ_PORT')
  )
  connection = rabbit_client.start
  channel = connection.create_channel
  queue = channel.queue(QUEUE)
  queue.publish(message)

  channel.close
  connection.close
end
```

There is one problem though. The method is far from being optimal. On a large scale, it wastes a lot of resources to repeat the same all over again - opening new connections to RabbitMQ. The solution is pretty intuitive: let's reuse existing connections.

### Connection pool in theory

Connection pool is the engineering concept of keeping connections to some external service and reusing them. In Rails world, you already know it from [Active Record Connection Pool](https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/ConnectionPool.html) which handles database connections. Or, the Redis connection pool used in Sidekiq.

Opening a new connection is usually an expensive operation. Connection to RabbitMQ is done with TCP protocol. Creating a new one requires many steps, such as DNS lookup, TCP handshake, TLS handshake, authentication, etc. At some point, it's more efficient to open the connection once and reuse it later. This will also prevent reaching the opened connections limit.

### Connection pool in practice

There is a great ruby gem - [ConnectionPool](https://github.com/mperham/connection_pool) written by Mike Perham. We will use it and I highly encourage you to take a look at the code (in fact it's all in three ruby classes!).

First, we need to define a connection pool. In Rails apps, the initializer is the place to go:

```ruby

require 'bunny'
require 'connection_pool'

unless Rails.env.test?
  RABBITMQ_POOL = ConnectionPool.new(size: 10) do
    conn = Bunny.new(
      hostname: ENV.fetch('RABBITMQ_HOST'),
      username: ENV.fetch('RABBITMQ_USER'),
      password: ENV.fetch('RABBITMQ_PASS'),
      port: ENV.fetch('RABBITMQ_PORT'),
      channel_max: 1000
    )

    conn.start
    conn
  end
end
```

Then, we can use `RABBITMQ_POOL`  in all other places in the app:

```ruby

def send_message_to_rabbit(message)
  RABBITMQ_POOL.with do |conn|
    channel = conn.create_channel
    queue = channel.queue(QUEUE_NAME, durable: true)

    queue.publish(message, { persistent: true })
    channel.close
  end
end
```

The above block tries to pick an existing connection from the pool and if there is none - it waits. A timeout error will be raised if a time limit is reached (5 seconds by default). Worth mentioning that connections inside the pool are created lazily when they are needed.
In RabbitMQ, we reuse the connections and create channels, which are defined as "lightweight connections that share a single TCP connection" (more on this [here](https://www.rabbitmq.com/tutorials/amqp-concepts.html#amqp-channels)).
And what are the results?

```ruby

n = 5000

def print_time_spent(&block)
  time = Benchmark.realtime(&block)
  puts "Time: #{time.round(2)}"
end

print_time_spent do
  n.times do
    send_message_to_rabbit('test message')
  end
end

# Sending 5k messages without connection pooling
Time: 61.61
Time: 64.14
Time: 67.99

# Sending 5k messages with connection pooling
Time: 11.29
Time: 13.16
Time: 11.75
```

Quick tests show that on my local, non-representative machine using the connection pool gives about a 5x performance boost.

### Discussion about performance

Handling performance issues in production is always a challenging task. There are usually many factors that need to be taken into consideration. The usage of ConnectionPool might need some tweaking. You can change the number of opened connections, as well as the timeout value to find the optimal configuration for your system.

Also, when you see timeout errors while connecting to an external service, there might be other options worth trying:

- increase connection limit
- increase timeout value
- scale up the service to give it more RAM/CPU resources.

### Summary

Connection pool allows you to do more with the same resources. You can use it as an alternative to increasing the timeout limit or number of open connections to the external service. ConnectionPool gem is an excellent, simple tool for achieving it in the Ruby on Rails ecosystem.


*This post was originally published on [Visuality blog](https://www.visuality.pl/posts/easy-introduction-to-connection-pool-in-ruby).* \
*And also mentioned in [Ruby Weekly newsletter](https://rubyweekly.com/issues/672)* 🎉
