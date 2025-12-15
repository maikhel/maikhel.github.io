---
image: "wheel.webp"
min_image: "wheel_min.webp"
layout: blogpost
title:  "Load Path in Ruby - How It Works?"
excerpt_separator: <!--more-->
---

![image](/images/wheel.webp)

Recently, I encountered a weird Ruby error: \
`Gem::LoadError: You have already activated X, but your Gemfile requires Y`. \
A quick Stack Overflow search and a few commands with Bundler, and it was fixed. But it got me thinking: why did it happen in the first place? What does it even mean _to activate a gem,_ and how may Ruby want to activate two gem versions at the same time? Let's search for answers together.

<!--more-->

## How Ruby loads files

A quick recap of Ruby file loading fundamentals is a good start. When you want to use the code from a different `rb` file in Ruby, you use the `require` method.

```ruby

# we have my_class.rb in current dir
require 'my_class'
```

(`require` returns `true` when the file is just loaded, `false` when it already was).

But we can require files that are not in the current directory.
Meet `$LOAD_PATH`. It stores absolute paths of places where Ruby code can be searched for.

```ruby

require 'set'

s = Set[1, 2]
```

When you call `require 'set'`, Ruby scans each directory in `$LOAD_PATH` in order until it finds a matching file. That’s why adding a path there instantly makes its `.rb` files visible to Ruby. Do you want to require files from your custom dir? Just append it to `$LOAD_PATH`.

When you inspect the content of `$LOAD_PATH`, you notice it already includes dozens of gem directories. That’s because RubyGems hooks into Ruby’s `require` mechanism: when you install a gem, it adds its `lib/` folder to `$LOAD_PATH`.

```ruby

> puts $LOAD_PATH.last(3)
# /Users/maikhel/.rbenv/versions/3.4.5/lib/ruby/vendor_ruby
# /Users/maikhel/.rbenv/versions/3.4.5/lib/ruby/3.4.0
# /Users/maikhel/.rbenv/versions/3.4.5/lib/ruby/3.4.0/arm64-darwin23
```

It's not all. Ruby also uses the `$LOADED_FEATURES` environment variable to track all files that are already loaded. Helps with performance and avoiding duplicates. And provides very important information: which exact place the file is loaded from.

```ruby

> puts $LOADED_FEATURES.last(3)
# /Users/maikhel/.rbenv/versions/3.4.5/lib/ruby/gems/3.4.0/gems/rdoc-6.15.0/lib/rdoc.rb
# /Users/maikhel/.rbenv/versions/3.4.5/lib/ruby/3.4.0/arm64-darwin23/enc/utf_16le.bundle
# /Users/maikhel/.rbenv/versions/3.4.5/lib/ruby/3.4.0/arm64-darwin23/enc/utf_16be.bundle

> $LOADED_FEATURES.size
# => 452
> require 'securerandom'
# => true
> $LOADED_FEATURES.size
# => 454

```

There is also the `require_relative` method, which skips `$LOAD_PATH` entirely.
It allows you to provide an exact path relative to the current file.

```ruby

require_relative '../my_super_class'
```

So far, we know how Ruby finds and loads files. But when your app has more dependencies, problems with gem versioning and compatibility start to appear. That’s where Bundler steps in.

## How Bundler Helps

Ruby's built-in mechanism for requiring code is enough for simple Ruby scripts. But we face other problems when working with large projects: gem version conflicts. There is no easy way to control _which_ version of the file/gem you load if you have more than one installed on your machine. Second big problem: make sure other team members are using the same version as you.

Bundler solves these issues by setting up a predictable environment with `Gemfile` - a list of all gems your project depends on. Bundler activates only the gem versions from the `Gemfile.lock` file, then rewrites `$LOAD_PATH` so that **only those gems** appear there.
Everything else (system gems, default gems, other installed versions) is ignored.

Most Ruby processes run inside Bundler without any extra effort from your side.
The magic happens in the `Bundler.setup` function (check out the [source code]([https://github.com/ruby/rubygems/blob/master/bundler/lib/bundler.rb#L128](https://github.com/ruby/rubygems/blob/master/bundler/lib/bundler.rb#L128)) if you want). Rails apps automatically call `Bundler.setup` when booting, but you can explicitly invoke it with `require 'bundler/setup'` in files or with `bundle exec` before executing any command.

You can run a test script to compare the content of your `LOAD_PATH` before and after using the Bundler setup:

```ruby

# before bundler setup
$LOAD_PATH.size
# => 28

# after bundler setup
require "bundler/setup"
$LOAD_PATH.size
# => 387
```

Gem is _activated_ when `Bundler.setup` is invoked. Bundler tells RubyGems: "This is the version we're using." RubyGems then refuses to activate a different version of the same gem later. That’s why conflicts produce `Gem::LoadError`.

## The error

Knowing how Ruby and Bundler coordinate to load libraries, we can finally start debugging the error message:
`Gem::LoadError: You have already activated X, but your Gemfile requires Y`.

This error only appears when something loads the wrong gem _before_ Bundler can set up the environment. Bundler and Ruby disagree about which gem version should be active:
Ruby is telling us that we already have a specific gem version, while Bundler states it's not the right one. How can it happen?

RubyGems activates the first matching version it finds in `$LOAD_PATH`. This is often a default gem or globally installed version, which differs from the version required by Bundler. Here is the simple example:

```bash

ruby script.rb # loads default gems

bundle exec ruby script.rb # loads only Gemfile.lock gems
```

Typically, the error can also occur when you switch branches and have a process still running (like a Rails server), or when you run a command without `bundle exec`.

These errors became more common once many parts of Ruby’s standard library were converted into _default gems_. Ruby activates those versions early in the boot process, which can conflict with the versions listed in your Gemfile.
These issues have been reported frequently in the last couple of years (like [here](https://gorails.com/blog/bundler-default-gem-dependency-error), [here](https://github.com/ruby/rubygems/issues/7996) or [here](https://github.com/ruby/rubygems/issues/6667)).

## How to debug it

When this error occurs, the goal is always the same:
**Find out which version of the Ruby gem was loaded first and from where.**
You can use the following steps to do it.

**1. Check which version is active**

Use `Gem.loaded_specs` to inspect loaded gems:

```ruby

puts Gem.loaded_specs.map { |n, spec| "#{n} #{spec.version}" }
# pathname 0.4.0
# rake 13.3.0
# Ascii85 2.0.1
# concurrent-ruby 1.3.5
# aasm 5.5.1
# base64 0.3.0
# benchmark 0.4.1
# (...)

```

Or, check the specific gem version with: `puts Gem.loaded_specs["rack"]`
This tells you the version of Ruby that has already been activated.

**2. Find where it was loaded from**

Use `$LOADED_FEATURES` to find the source of the specific gems:

```ruby
$LOADED_FEATURES.grep(/rack/)

# "/Users/maikhel/.rbenv/versions/3.4.6/lib/ruby/gems/3.4.0/gems/railties-7.1.5.2/lib/rails/rack.rb",
# "/Users/maikhel/.rbenv/versions/3.4.6/lib/ruby/gems/3.4.0/gems/rack-3.2.3/lib/rack/version.rb",
# "/Users/maikhel/.rbenv/versions/3.4.6/lib/ruby/gems/3.4.0/gems/rack-3.2.3/lib/rack/constants.rb",

```

This shows you **the exact file paths** Ruby loaded.

**3. Find out which other versions are available**

Use `Gem.find_files`, which shows every possible candidate Ruby could load:

```ruby

puts Gem.find_files("rack.rb")

# ["/Users/maikhel/.rbenv/versions/3.4.6/lib/ruby/gems/3.4.0/gems/rack-3.2.3/lib/rack.rb",
# "/Users/maikhel/.rbenv/versions/3.4.6/lib/ruby/gems/3.4.0/gems/rack-3.2.2/lib/rack.rb",
# "/Users/maikhel/.rbenv/versions/3.4.6/lib/ruby/gems/3.4.0/gems/rack-3.2.1/lib/rack.rb"]

```

This helps to find **duplicate installs**, default gem conflicts, or globally installed gems.

The listed steps tell you where the wrong version came from. It helps to trace what program invoked it.
Remember, the rule of thumb is Bundler **must run first**. Otherwise, Ruby might activate whatever version it finds in `$LOAD_PATH` (and it's a correct behaviour!).

## How to fix it

Once you know **which gem version was loaded first** and **why** it happened, fixing the error usually comes down to making sure Bundler takes control _before_ Ruby loads anything unexpected. The most common ways to fix it are:

- Run the command with `bundle exec`. It ensures Bundler rewrites `$LOAD_PATH` and prevents RubyGems from loading the wrong version of gems.
- run `bundle clean --force`. Sometimes old versions of gems are installed on your system, so it's advisable to remove them. This command deletes all gems not listed in your Gemfile.lock.
- run `gem update --system` to update `RubyGems` version. The command updates RubyGems internals, often fixing bugs with gem installation and activation (like [here](https://github.com/ruby/rubygems/pull/8412)).
- Restart long-running processes (Spring, Rails server, background workers). These processes may have loaded an old gem version before you changed branches or updated gems.
- Remove version constraints for default gems from your Gemfile. This one is non-trivial. When your Gemfile restricts a specific version of a default gem, it may cause extra trouble for Ruby and Bundler. Ruby loads default gems before Bundler setup, so Bundler environment override can fail with the error. Recent fixes in Bundler ([like this](https://github.com/ruby/rubygems/pull/8412)) should improve how Bundler handles default gem dependencies.

```ruby

# before
gem "uri", "0.10.0"

# after
gem "uri"
```


## Now you know more

Ruby's way of handling gem versions and loading files is pretty sophisticated. Connected with Bundler, it provides an elegant way to handle dependencies. The error we discussed is just Ruby protecting you from running two different versions of a gem at once.
Next time you see it, you will not only fix it easily - you will understand *why* it happened.

*This post was originally published on [Visuality blog](https://www.visuality.pl/posts/load_path_in_ruby_how_it_works).*
