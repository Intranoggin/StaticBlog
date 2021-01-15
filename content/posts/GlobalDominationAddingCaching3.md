---
title:  Global Domination Adding Caching
date: "2019-12-31"
description: "Hello World"
---
# Global Domination Adding Caching

At this point, I have a couple entities and scaffolded controllers, plus some seriously seeded data and a couple additional get methods that return back just the facilities that match a given zip code or state. Now I want to add in some caching. 

In my production systems, this will utilize Redis Cache and the cache will be specific to each datacenter. The idea being that users in one area of the country care about the information specific to their location. They will utilize the datacenter nearest them and that Redis instance will deal with the local queries. 

I've decided to use Polly https://github.com/App-vNext/Polly to abstract the caching within development because I like the abstraction it gives me and I intend to surface most of the cache durations configurations as app settings, and the cache policy capabilities that Polly provides gets me a fair way there in terms of the per object customization I want. 

## Existential Crisis

Here I had an existential crisis around the architecture. At a fundamental level I was going for a cache aside architecture where when a service gets called, it first checks the cache and if no cached version exists, then reads from the database. However, I knew my objects would have a mix of valid durations, some could be cached for days, while others hours or minutes, and some could not legitimately be cached at all. Here was the problem I wrestled with: 

Who, or what layer, should know about and control caching? 

- It seemed like something at the service/controller that knows about the entities should maybe know about the valid cache durations of those entities. 
- The service shouldn't need to know anything about newing up a cache. 
- I don't want to code in cache durations. I need them configurable by the admin. That means something outside the service should be involved.
- In Poly, cache Policies are set up based on the type of object you are caching. 
  - Setting this up in the startup, to allow for configuration, means the startup has to too much about each entity and adds way too much complexity to the startup for my tastes. 
  - Moving this duty to the controllers means every controller needs to know about setting up cache policies.

## Resolution

After talking it out with my office mate. I came up with a compromise. I created a utility class called CachePolicyHelper. This class resides outside the startup and the controller classes and serves as a intermediary between the startup and controller classes. It exposes methods that allow the startup class to pass in configurations for cache durations. It then does the work of creating policies that are passed to controllers through dependency injection. On the controller's side, nothing is known about the policy details. Controllers only know how to interact with a Poly cache policy and use it when retrieving data.

## Caveat

The whole thing isn't as DRY as I'd like it. There is probably some factory pattern refactoring that could be done or there may be some trick to Polly I haven't grasped yet that would simplify my policies.

**Related NuGet Packages**

To the GlobalDomination projects, add these NuGet packages:

- Polly.Caching.Distributed
- Polly.Caching.Serialization.Json
- Microsoft.Extensions.Caching.Redis

