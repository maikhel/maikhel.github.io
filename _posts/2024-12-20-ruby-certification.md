---
image: "ruby_certificate_horizontal.webp"
min_image: "ruby_certificate_min.webp"
layout: blogpost
title:  "How to become Ruby Certified Programmer"
description: "Ruby Association Certified Programmer guide - learn exam topics, preparation strategies, study materials, and tips for passing Ruby certification"
excerpt_separator: <!--more-->
---

![image](/images/ruby_certificate_horizontal.webp)

Official certifications aren’t very popular in the Ruby on Rails community, but one is available if you’re interested: the [Ruby Association Certified Ruby Programmer Examination](https://www.ruby.or.jp/en/certification/examination/). This test checks your knowledge of the Ruby programming language. I decided to give it a try! I passed the exam and want to share my insights to help you do the same.

<!--more-->

## What is it?

The **Ruby Association Certified Ruby Programmer Examination** is available in two levels of difficulty: Silver and Gold. The test assesses your knowledge of Ruby version 3.1. The Silver certification focuses on foundational concepts, while the Gold covers more advanced topics like metaprogramming and ractors. You must pass the Silver level before being eligible to attempt the Gold level.

Each test consists of 50 multiple-choice questions, and you have 90 minutes to complete it. A passing score requires 75% (38/50 correct answers). The exam is performed onsite by Prometric, an organization with testing centers in major cities worldwide. To register, use [Prometric's system](https://www.prometric.com/test-takers/search/ry). The test is offline, but you’ll take it on a computer at the testing center. Results are provided immediately after you finish, and the certificate is emailed about a week later.

## Silver Test Topics

The Silver test covers the foundations of the Ruby language, including built-in classes and modules. That’s a lot! The good news is that [prep test example](https://github.com/ruby-association/prep-test/blob/master/silver.md) reflects the actual exam well. While the questions aren’t identical, they are very similar. For instance, a different word might be used in a question about regex pattern, or the numbers in an array slicing question may vary.

The prep test also reveals the structure of the questions. Some are trivial, while others are surprisingly tricky. There may be a varying number of correct answers per question. The distribution of topics is also similar: expect 1–3 questions about regex, 1–3 about file reading/writing, and more emphasis on key classes like `Array`, `Hash` and `String`.

If you write Ruby code professionally and studied the prep test **thoroughly**, you have a good chance of passing. However, don’t just memorize answers—make sure you understand the intent behind each question and explore all possible answers.

Here are the strategies that worked for me during preparations:

- **Master the basics**: study Ruby’s reserved keywords, literals, error handling, and operator precedence.
- **Read the documentation**: analyze all the base classes and modules
- **Experiment in the console**: test methods with edge cases and unusual inputs. Explore less common methods for `String`, `Array`, and `Hash`. (For example, what does `array.take(0)` return? 😉)
- **Review the prep tests**: study the Ruby 3.1 prep test again and revisit the older Ruby 2.0 version.
- **Use AI**: ask ChatGPT to clarify complex methods and advanced use cases.
## Tips & tricks on writing the exam

Writing any exam can be stressful, so there are some basic tips to stick to:

- take care of yourself: have a bottle of water, and eat something before the test :)
- read questions carefully, some of them are designed to be misinterpreted at first sight
- resolve easy questions right away and mark problematic questions with a flag; come back to them later
- the organizers provide you with a notepad; use it to write down method execution results or take notes
- revisit all questions before submitting the exam; confirm a valid number of answers is chosen, try to spot silly mistakes
- regardless of the final result, be grateful to yourself! You invested time, energy, and money into your growth and dared to check your knowledge - kudos to you! 🏅

## Materials

Here, I gathered a bunch of useful links:

- [Prep test Silver](https://github.com/ruby-association/prep-test/blob/master/silver.md)
- [Prep test Silver Answers](https://github.com/ruby-association/prep-test/blob/version3/silver_answers.md)
- [Prep test Silver for ruby 2.1](https://www.ruby.or.jp/assets/images/en/certification/exam_prep_en.pdf)
- [Ruby precedence operators](https://ruby-doc.org/core-3.1.0/doc/syntax/precedence_rdoc.html)
- [Literals](https://docs.ruby-lang.org/en/3.1/syntax/literals_rdoc.html)
- [Pre-defined global variables](https://docs.ruby-lang.org/en/3.1/globals_rdoc.html)
- [Object](https://docs.ruby-lang.org/en/3.1/BasicObject.html)
- [String](https://docs.ruby-lang.org/en/3.1/String.html)
- [Integer](https://docs.ruby-lang.org/en/3.1/Integer.html)
- [Numeric](https://docs.ruby-lang.org/en/3.1/Numeric.html)
- [Array](https://docs.ruby-lang.org/en/3.1/Array.html)
- [Hash](https://docs.ruby-lang.org/en/3.1/Hash.html)
- [Range](https://docs.ruby-lang.org/en/3.1/Range.html)
- [IO](https://docs.ruby-lang.org/en/3.1/IO.html#)
- [File](https://docs.ruby-lang.org/en/3.1/File.html)
- [Regexp](https://docs.ruby-lang.org/en/3.1/Regexp.html)
- [Enumerable](https://docs.ruby-lang.org/en/3.1/Enumerable.html)
- [Comparable](https://docs.ruby-lang.org/en/3.1/Comparable.html)
- [Date](https://docs.ruby-lang.org/en/3.1/Date.html)
- [Time](https://docs.ruby-lang.org/en/3.1/Time.html)
- [Exception](https://docs.ruby-lang.org/en/3.1/Exception.html)
- [Exceptional Creatures](https://www.exceptionalcreatures.com/bestiary.html)
- [Nil](https://docs.ruby-lang.org/en/3.1/NilClass.html)

## Summary

Still in doubt? I guarantee that during preparation for the Ruby Certification exam, you will learn something new about Ruby, no matter how long you code!
