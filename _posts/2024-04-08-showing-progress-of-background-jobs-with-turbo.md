---
image: "robot.webp"
min_image: "robot_min.webp"
layout: blogpost
title:  "Showing progress of background jobs with Turbo"
excerpt_separator: <!--more-->
---

![image](/images/robot.webp)

Hotwire Turbo constantly changes the way we build backend-frontend integrations. Things that were complicated before, can now be done with a few lines of Ruby code. Let me present how to transmit progress information from background jobs into the frontend.

<!--more-->

Hotwire Turbo constantly changes the way we build backend-frontend integrations. Things that were complicated before, can now be done with a few lines of Ruby code. Let me present how to transmit progress information from background jobs into the frontend.


## Tutorial application setup

For this article (and the next ones), I created the Chuck Norris Jokes Fetcher App®. We will use it to experiment and learn various Turbo features. The main functionality is basic: you create a request with a certain number of jokes to fetch. Then, the background job downloads them from Chuck Norris API.

Grab the link to [repository](https://github.com/maikhel/hotwire-jokes) and feel free to explore it. Tags are pointing to various stages of development.

The goal for today is to achieve this stunning progress bar:

![image](/images/progress_bar.gif)

## Active Record broadcasts

Turbo provides an effortless way to broadcast any Active Record model updates to Turbo Streams. Therefore, we can bind the results of the background job with some Active Record model. It's intuitive and easy to implement, so let's see the code:


```ruby
# app/models/joke.rb

class Joke < ApplicationRecord
  after_create_commit ->(joke) do
    broadcast_replace_to([ joke.jokes_request, "jokes_progress_bar" ],
                         target: "jokes_progress_bar",
                         partial: "jokes_requests/jokes_progress_bar",
                         locals: { jokes_request: joke.jokes_request })
  end

  belongs_to :jokes_request

  validates :body, presence: true
end
```

We use a callback to invoke broadcasting that replaces the existing progress bar partial with an updated one. 

On the frontend side, we open a stream channel with the `turbo_stream_from` command. Its name must match the one from the callback: `[ joke.jokes_request, "jokes_progress_bar" ]`.

```ruby

# app/views/jokes_requests/show.html.erb

<%= turbo_stream_from @jokes_request, "jokes_progress_bar" %>

# (..)

<%= render "jokes_progress_bar", jokes_request: @jokes_request %>
```

Lastly, we need to render the partial with a progress bar:


```ruby

# app/views/jokes_requests/_jokes_progress_bar.html.erb

<% progress_width = jokes_request.jokes.count / jokes_request.amount.to_f * 100 %>

<div id="jokes_progress_bar" class="w-full bg-gray-200 rounded-full">
  <div class="h-0.5 bg-lime-500 rounded-full" style="width: <%= progress_width.to_i %>%;"></div>
</div>
```

As you can see in the example, the solution requires minimal changes and works almost 'out of the box'. It has some drawbacks, though. Foremost: we introduced callbacks. Even though it's an officially recommended way, we don't like it. It quickly escalates, leading to "callbacks hell".
Secondly, you can't always connect job results with creating records in the database. To deal with this issue, we could use an artificially created read model. But it's still not the best approach.

Keep reading to see a more elegant solution.

## Option 2: Direct broadcast from the job

Broadcasting to Turbo Streams doesn't necessarily need to be bound to Active Record. `Turbo::StreamsChannel` class can be used anywhere in the Rails application, so we can invoke it inside the worker/service:

```ruby

def update_progress_bar(number)
  Turbo::StreamsChannel.broadcast_replace_to(
    [ jokes_request, "jokes_progress_bar" ],
    target: "jokes_progress_bar",
    partial: "jokes_requests/jokes_progress_bar",
    locals: { actual: number, limit: jokes_request.amount }
  )
end
```

The broadcasting method mirrors the previous solution, with one noticeable difference: no Active Record dependency. We pass all input to the progress bar partial as separate variables.


```ruby

# app/views/jokes_requests/show.html.erb

<%= turbo_stream_from @jokes_request, "jokes_progress_bar" %>

# (..)

<%= render "jokes_progress_bar",
  actual: @jokes_request.jokes.count, 
  limit: @jokes_request.amount %>
```

And then in progress bar partial:

```ruby

# app/views/jokes_requests/_jokes_progress_bar.html.erb

<% progress_width = actual / limit.to_f * 100 %>

<div id="jokes_progress_bar" class="w-full bg-gray-200 rounded-full">
  <div class="h-0.5 bg-lime-500 rounded-full" style="width: <%= progress_width.to_i %>%;"></div>
</div>
```


We can use this approach to broadcast any other changes to the page: adding new joke elements, updating counters, etc. Even re-rendering pagination to ensure we are always displaying the proper page number! 

![image](/images/progress_pagination.gif)

## Summary

Hotwire Turbo makes transmitting backend updates to the frontend a pleasure. Progress bars, counters, adding new elements, or even refreshing pagination can be written in Ruby, without touching any JavaScript! Hope this tutorial will help you in your Turbo adventures.

P.S. This joke caught me off guard: _Chuck Norris does infinite loops in 4 seconds._ 😂


*This post was originally published on [Visuality blog](https://www.visuality.pl/posts/showing-progress-of-background-jobs-with-turbo).*
