---
image: "/images/construction.webp"
min_image: "/images/construction_min.webp"
layout: blogpost
title:  "Smooth concurrent updates with Hotwire Stimulus"
description: "Hotwire Stimulus advanced progress bars - solve concurrent updates conflicts with Stimulus controllers for smooth background job progress display"
excerpt_separator: <!--more---
---

![image](/images/construction.webp)

In the [previous blog post](https://www.visuality.pl/posts/showing-progress-of-background-jobs-with-turbo), we learned how to create a simple progress bar with Hotwire Turbo and broadcast updates to the frontend. But sometimes, simple solutions aren't enough. It's time to get familiar with another part of Hotwire: Stimulus! In this article, I'll demonstrate how to use Stimulus to handle more complex frontend logic.

<!--more-->

## The problem

Displaying the progress of synchronous data updates is straightforward with Hotwire Turbo.
But a more real-life scenario considers **asynchronous** changes on the backend. In the context of our dummy jokes application, we can introduce more than one job that downloads jokes. When the number of jokes to fetch is more than 25, the process is split into more jobs.

Unfortunately, it causes some issues:

![image](/images/stimulus_not_working.gif)

Two (or more) jobs updating the same page with broadcasts are conflicting. Concurrent processes override HTML elements: the progress bar is stuttering and the jokes count is incorrect.
Let's solve this problem!

## Architecture

Before we go to the code, let's revise the implementation plan. 
We can summarize previous architecture with a simple graph:
updating the data on the server results in an immediate broadcast and update of the frontend page.

![image](/images/broadcast_before.png)

The new architecture must handle async updates. We can't update the HTML directly from the background jobs because of overriding. We need to introduce a "mediator" between broadcasted updates and displaying them on the frontend. Time to use **Stimulus**. The plan is to:

1. broadcast updates from jobs
2. intercept the 'Append new joke' action in the Stimulus controller
3. apply frontend updates with JavaScript. We will update the progress bar (and other elements) and then execute default behavior (add new joke elements) as before.

![image](/images/broadcast_after.png)

## The code

*The provided code snippets highlight the most significant changes. 
Check out the complete solution in [the repository](https://github.com/maikhel/hotwire-jokes/).*

Update the job/service in your Ruby on Rails application: make just one broadcast that amends new jokes.

```ruby

# app/services/fetch_jokes_service.rb

class FetchJokesService
  def perform(missing_jokes_count)
    jokes = []

    missing_jokes_count.times do |num|
      # logic for fetching/creating jokes same as before
      # (...)

      add_joke_card(joke)
    end

    true
  end

  # now this is the only broadcast from the service
  def add_joke_card(joke)
    Turbo::StreamsChannel.broadcast_append_to(
      [ jokes_request, "jokes" ],
      target: "jokes_grid",
      partial: "jokes/joke",
      locals: { joke: joke }
    )

  end

  # rest of service code
  # (..)
end
```

Prepare HTML page to work with Stimulus:
- on the parent `div` define controller name: `data-controller="progress-bar"`
- define targets following Stimulus convention, eg. `data-progress-bar-target="jokesGrid"` is translated into `jokesGridTarget` inside a controller
- add attributes with input values needed for controller, eg: `data-progress-bar-limit-value="<%= @jokes_request.amount %>"`. 

```erb

<!-- just one stream is needed now -->
<%= turbo_stream_from @jokes_request, "jokes" %>

<div id="jokes_show"
     data-controller="progress-bar"
     data-progress-bar-limit-value="<%= @jokes_request.amount %>"
     data-progress-bar-actual-value="<%= @jokes_request.jokes.size %>">

  <!-- rest of the html  -->
  <!-- (...)  -->
  <%= render "jokes_progress_bar", actual: @jokes_request.jokes.size, limit: @jokes_request.amount %>

  <%= turbo_frame_tag "jokes" do %>
    <div id='jokes_grid'
        data-progress-bar-target="jokesGrid"
        class="grid grid-cols-3 gap-4 mt-4">
      <% @jokes.each do |joke| %>
        <%= render 'jokes/joke', joke: joke %>
      <% end %>
    </div>
    <% if @jokes_request.jokes.size > Joke::PER_PAGE %>
      <%= render "jokes_pagination", pagy: @pagy %>
    <% end %>
  <% end %>

```

Add the most important part: Stimulus controller. Lots of stuff happening here:
- define `values` and `targets` corresponding to HTML page elements
- add a new `EventListener` hook to override rendering turbo stream event: make additional updates on the page and then execute the default behavior. The same approach we would use for adding [custom actions](https://turbo.hotwired.dev/handbook/streams#custom-actions) to the Stimulus controller.
- configure functions to run when a new joke is added: update count, update the progress bar.

*Huge thanks to [Cezary Kłos](https://www.visuality.pl/posts?author=Cezary+K%C5%82os) , who proposed this solution!*

```javascript

import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="progress-bar"
export default class extends Controller {
  static values = {
    limit: 0,
    actual: 0,
  }
  static targets = ["progress", "count"]
  connect() {
    addEventListener("turbo:before-stream-render", ((event) => {
      const fallbackToDefaultActions = event.detail.render

      event.detail.render = (streamElement) => {
        if (streamElement.action === "append" && streamElement.target === "jokes_grid") {
          this.increment()
        }
        fallbackToDefaultActions(streamElement)
      }
    }))
  }

  increment() {
    this.actualValue++
    this.updateProgress()
    this.updateCount()
  }

  updateProgress() {
    let progress = (this.actualValue / this.limitValue) * 100
    this.progressTarget.style.width = `${progress}%`
  }

  updateCount() {
    this.countTarget.innerText = `${this.actualValue} / ${this.limitValue}`
  }
}

```


In conclusion, the responsibility for displaying updates shifts from the backend to the frontend. The backend only signals that there is a change, but the Stimulus controller is the one who decides what and how to display. The new solution uses JavaScript and is far more flexible than before.

![image](/images/stimulus_working.gif)


## Summary

Hotwire Turbo is perfect for transmitting backend updates to the frontend. But for more complex use cases, we need to use another element of Hotwire: Stimulus. The presented solution is an example of manipulating DOM elements with minimal JavaScript. Hopefully, it inspires you in your Hotwire journey!

P. S. Alternative approach with `MutationObserver` is presented in [this Drifting Ruby podcast](https://www.driftingruby.com/episodes/broadcasting-progress-from-background-jobs ).


*This post was originally published on [Visuality blog](https://www.visuality.pl/posts/smooth-concurrent-updates-with-hotwire-stimulus).*

*And also mentioned in [Hotwire Weekly Newsletter](https://hotwireweekly.com/archive/week-23-new-hotwire-browser-extension-concurrent-updates-with-stimulus/)* 🎉
