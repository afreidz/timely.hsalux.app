## Release: **Silver Dahlia**

#### What's in this release?

- _BREAKING Feature:_ **Migrate to Azure 🌐** - This is a major backend change to move the entire project from Firebase to Azure. A new app backend is now setup in Azure. This means new authentication accounts, as well as a fresh set of data for each user. I will research if we can export the current Firebase data and import/link it to the new app, but no promises. I apologize for this, but migrating to Azure is the best path forward for this app!
- _Feature:_ **Weekly Reports 📅** - You can now see the daily report view for the entire week in a scrolling window. There is a new nav item for this view.
- _Feature:_ **Report Rounding 🧮** - There is now a setting to peform rouding to the nearest 15m/30m/1hr for timer reporting. Timers will remain unchanged with regards to start/end, only the reports will show this.
- _Feature:_ **Timer Project Change 💼** - In the timer details view, you can now move a timer from one project to another.
- _Feature:_ **Auto Snap Timers 🫰** - There is now a setting to automatically snap the start of a new timer to either the end of the previous timer, or the time in the "start of workday" setting. This (along with "manual timer snap") is going to take the place of "gapless" timers. There were odd edge cases where adjusting the start/end times of timers in "gapless" mode would cause unintended results to other timers. See the next section for more details ...
- _Feature:_ **Snap Timers** - In the timer details view, there is now a manual button to snap the start time to the end of the last timer (or start of workday) as well as snap the end time to the start of the next timer (or end of workday). Adding this manual option is a compromize on the edge cases of the previous "gapless" feature. Surrounding timers will no longer be adjusted when a timer's start/end is updated, but the manual snap can still be used to quickly remove gaps.

#### Odds and ends

- adds "changeType" to fields. Possible values: "change" will fire the change event on the standard input change, "commit" will render a user action that will not fire the change event until a user commits to it.
