## Release: _Fuscia Xenon_

#### What's in this release?

- _Feature:_ **Drag to scroll Timeline 🖱️** - You can now horizontally scroll the timeline with a mouse by clicking and dragging in the timeline area
- _Feature:_ **Gapless Timers ↔️** - There is now a setting that allows for a "gapless" timeline. When enabled, creating new timers will automatically snap to the end of the previous timer. If there is no previous timer, they will snap to the new "Start of day" setting. If there is no value for that, they will snap to 9:00AM by default. Updating the start/end times will also automatically adjust the next and previous timers if they exist. To make things easier, this setting is only available if you opt-out of allowing multiple running timers (which is also a new setting). This removes ambiguity over which timers should be auto-adjusted if editing the start/end time of a gapless timeline.

#### Odds and ends

- changes service worker logic to leverage vite-plugin-pwa's svelte virtual modules/stores
