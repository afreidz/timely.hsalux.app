## Release: _Fuscia Xenon_

#### What's in this release?

- _Feature:_ **Project delete ❌/archive 🗄️** - you can now delete a project (not recommmended because it will lead to orphaned timers that won't render properly. But this helps if you accidentally added a project and want it GONE). More importantly, you can **archive** a project so that it will no longer show in the project list (although it will be visible behind an expanding "archived" section). This keeps the project around for reporting and historical rendering purposes.
- _Feature:_ **Project budgets/hours 🕑** - you can now add a hour budget to a project and **timely** will keep track of how many hours you have worked against that budget. It will display in both the project details view, as well as any timer detail view for the project. This feature will be behind a toggle for each project. That's because there are added db calls for this to get a running total of hours worked. If you don't wish to track hours for a project, it will be helpful not to waste making a db call.
- _Feature:_ **Backfill timers 🌟** - you can now add timers to past dates if you need to backfill things you may have missed. By default the start time of the timer will be set to the current hour/minute, but of the day you are viewing. The end time will default to either EOWD (if enabled) or EOD. These timers are fully editable like any other.

#### Odds and ends

- The timeline navigation elements have moved to a heading between the masthead and the timeline. It looks a bit cleaner 🧹.
- Google analytics 📋 was added to track the browser usage so I can prioritize any cross-browser wonkiness
- The timeline styles/classes were refactored. It bugged me that I had to use inline styles for calculating grid (timeline) positions for timers. Tailwind has classes that handle that, but they weren't working. I realized they weren't working because TW is aggressively tree-shaking unused css out of the final bundle. Since the classnames were dynamic, TW is unable to exclude tree shaking and thus they were removed. I created a "forceload" file that tricks TW into including styles for everything that is currently "dynamic" but this is going to be a pain/unmaintainalbe moving forward 😞.
