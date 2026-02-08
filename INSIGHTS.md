# When2Solve Insights Reference

30 scheduling insights, all conditional. Trigger rates tested against 27 real When2Meet events.

## Useful Scheduling Insights

These show up often and teach you about your group's scheduling patterns.

| # | Name | Icon | Trigger Rate | Condition |
|---|------|------|-------------|-----------|
| 3 | **Best Buds** | `fa-user-group` | 93% | Two people share ≥70% of the smaller person's availability. Tiered flavor text: ≥95% "scheduling clones", ≥85% "scheduling soulmates", else "easiest pair to co-schedule". |
| 17 | **Split Shift** | `fa-scissors` | 89% | Someone has a ≥1h gap in their availability on a single day (available, disappears, comes back). Only reports first person found. |
| 8 | **Minimalist / Accommodator** | `fa-scale-balanced` | 81% | The least-available person offered ≤1/3 of the most-available person's hours. Requires N≥4. |
| 7 | **Ghost Day** | `fa-calendar-xmark` | 70% | One day has ≥40% less total availability than the best day. Requires ≥2 days. |
| 18 | **Core Crew** | `fa-people-group` | 52% | Three people are simultaneously free for ≥4h total. N must be 4–12. |
| 4 | **Ships in the Night** | `fa-right-left` | 44% | Two people (both with ≥2h availability) overlap by ≤1h. Special wording for zero overlap. |
| 15 | **Power Hour** | `fa-bolt` | 37% | One specific day+hour has ≥80% attendance AND ≥1.3× the average hour's attendance. |
| 10 | **Lunch Crunch** | `fa-utensils` | 33% | Less than 40% of the team is free during 12–1 PM. |
| 5 | **Unanimous Windows** | `fa-bullseye` | 33% | Contiguous blocks where every single person is free. Only shown for N≤10 and only when windows exist (no "zero unanimous" noise). |
| 6 | **The Linchpin** | `fa-key` | varies | Removing one specific person would unlock perfect-attendance windows. Depends on solver results. |
| 9 | **"If only..." Suggestion** | `fa-lightbulb` | varies | When 1–2 people can't make any meeting pair, suggests which days they could extend. From solver. |

## Fun Facts

These trigger sometimes and make you go "huh, interesting!"

| # | Name | Icon | Trigger Rate | Condition |
|---|------|------|-------------|-----------|
| 25 | **Marathon Runner** | `fa-person-running` | 56% | Someone has a ≥10h unbroken availability stretch on a single day. |
| 26 | **The Consistent One** | `fa-robot` | 52% | Someone marked the exact same time range on ≥3 different days. Requires ≥4 slots (1h+). |
| 14 | **Friday Flight Risk** | `fa-plane-departure` | 41% | Friday has ≥40% less availability than the best day. Only triggers when Friday is in the event and isn't the best day. |
| 24 | **Schedule Tetris** | `fa-puzzle-piece` | 37% | Two people's combined availability covers every single time slot. Together they "fill the board." |
| 20 | **One-Day Wonder** | `fa-calendar-day` | 33% | Someone is only free on a single day when the event spans ≥3 days. Only reports first found. |
| 1 | **Early Bird / Night Owl** | `fa-sun` | 26% | The earliest person's start and latest person's end are ≥4h apart. |
| 28 | **Availability Desert** | `fa-temperature-empty` | 26% | A ≥2h contiguous dead zone where nobody is free on some day. |
| 30 | **Crowd Favorite** | `fa-star` | 22% | ≥60% of active people agree that the same day is their most-available day. Requires ≥3 days, ≥4 people. |
| 21 | **The Bottleneck** | `fa-user-xmark` | 22% | The best single meeting covers N-1 people. Names who's missing — they're the "scheduling wild card." |
| 12 | **The Sniper** | `fa-crosshairs` | 22% | 1–3 people offered ≤1.5h total. Requires N≥3. |
| 31 | **Mirror Schedules** | `fa-arrows-rotate` | 19% | Two people whose union covers ≥70% of all slots but overlap ≤10% of the smaller person's time. "Scheduling yin and yang." |
| 11 | **The Anchor** | `fa-anchor` | 19% | Someone is available for every single time slot. |
| 13 | **The Twins** | `fa-clone` | 15% | Two people with ≥95% Jaccard similarity (overlap / union). |
| 29 | **Two Worlds** | `fa-arrows-split-up-and-left` | 15% | The group splits into an "earlier" crew and a "later" crew based on average available hour. Within-group overlap is ≥1.5× cross-group overlap. Data-driven split point. |
| 27 | **Social Butterfly** | `fa-wand-magic-sparkles` | 11% | One person has ≥25% more total pairwise overlap than the #2 person, and ≥1.3× the group average. |
| 23 | **The Overachiever** | `fa-trophy` | 7% | One person offered ≥2.5× the median availability. Requires ≥4 active people. |
| 16 | **Three's a Crowd** | `fa-triangle-exclamation` | 4% | Three people who each pair up fine (≥1h pairwise) but are never all three free simultaneously. N must be 4–10. |
| 2 | **Morning / Afternoon Skew** | `fa-sun` / `fa-moon` | 4% | The team's fill rate before noon vs after noon differs by ≥20 percentage points. |
| 22 | **Lunch Rush** | `fa-burger` | 4% | Every active person is free for at least one slot during 12–1 PM on the same day. |

## Data Quality Insights

These flag potential issues with the When2Meet data itself.

| # | Name | Icon | Trigger Rate | Condition |
|---|------|------|-------------|-----------|
| 0 | **Ghost** | `fa-ghost` | 59% | One or more people signed up but marked zero availability. |
| 19 | **Doppelganger** | `fa-people-arrows` | 22% | Two names that match after trimming whitespace and lowercasing (e.g., "Sophia" vs "Sophia "). Common When2Meet issue where someone signs up twice. |

## How Trigger Rates Were Calculated

All 30 insights were tested against 27 real When2Meet events spanning:
- 4 to 23 participants per event
- 16 to 672 time slots per event
- 1 to 7 days per event
- Academic, union, lab, and social scheduling contexts

No insight triggers 100% of the time. The rarest (Three's a Crowd, Morning Skew, Lunch Rush) trigger in ~4% of events — genuine surprises when they appear.
