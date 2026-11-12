# Changelog

## 14.3.0

- **Now requires Foundry VTT V14 (build 14.370 or newer) and D&D 5e 6.1.0 or newer.** Support for Foundry V13 and older D&D 5e versions has ended. Stay on 14.2.2 if your world still runs on one of them.
- Nothing changes in how vision works on V14 with D&D 5e 6.1.

## 14.2.2

- **Faster vision with Detect Magic, See Invisibility, Ethereal Sight and Witch Sight.** Scenes with many magical, invisible or ethereal creatures stay smoother while tokens move, especially when a caster has Detect Magic active.
- **Faster magical senses.** Creatures with several detection senses at once (for example Divine Sense together with Detect Evil and Good and Detect Magic) no longer repeat the same line-of-sight checks.
- **Feat and effect names now have to match exactly.** Before, most recognized names also matched when they appeared inside a longer name, so a feat like "Greater Sense Magic (Recharge)" could count as Sense Magic by accident. Rename such items to the exact name if you relied on this. Matching is also faster when actors are loaded or updated.

### Fixes

- **Burning and Incapacitated** now update what tokens can see right away. Before, setting a creature on fire in the dark, or incapacitating a creature with Thermal Vision (also through Paralyzed, Stunned and similar conditions), only showed up after the next unrelated vision update.
- **Detect Poison and Disease** now also recognizes natural weapon attacks whose critical hit bonus is marked `[poison]`.
- **Default Hearing Range:** a formula that can't be calculated for a creature (for example one that refers to a text value) no longer breaks that creature's data. The creature gets a hearing range of 0 and a warning appears in the browser console.
- Tokens no longer pile up a hidden copy of their placeholder image each time they are redrawn, for example when their image or size changes.

## 14.2.1

- Verified with D&D 5e 6.1. Nothing changes in how the module works.

## 14.2.0

- The French translation was reviewed by Kameleau, with small corrections (Blindsense is now *Vision Aveugle*). Thank you!

## 14.1.1

- Removed the Italian and Japanese translations. They were machine-translated and never checked by a native speaker. Players who use Foundry in one of these languages now see this module in English. Translations by native speakers are welcome as an issue or pull request.

## 14.1.0

- New translations: Italian and Japanese. The module is now available in nine languages.
- Language names in Foundry's language list are now shown in their own language.

## 14.0.0

**Nik's Vision 5e** is a fork of Vision 5e by dev7355608. It has a new module ID (`niks-vision-5e`), so disable the original Vision 5e module and set the module settings (Default Hearing Range, Spectator Mode) again after switching.

### Fixes

- **Metric scenes:** While ethereal, a creature's senses are now limited to 18 m instead of 200 m, and Ghostly Gaze now reaches 9 m instead of 100 m.
- **Miles:** Ranges in miles are now converted correctly. Before, a mile was counted as 1,760 feet instead of 5,280.
- **Detect Magic:** Creatures affected by spell effects are now detected even if the effect's "Magical" box isn't ticked. Concentration effects still don't count.
- **Stability:** If an error happens while See Invisibility, Ethereal Sight, Detect Magic or Witch Sight are being checked, it no longer leaves tokens wrongly invisible or vision broken until the scene reloads.
- **Translations:**
  - Spanish: the Thermal Vision feat (`Visión Térmica`) is now recognized.
  - Spanish and French: the "Select Vision Mode" tooltip is now in the right language (the two were swapped).
  - Spanish and French: added the missing texts for Spectator Mode and the darkness source hint.

### Performance

- Visibility checks are faster, especially in scenes with many tokens and detection modes.
- GMs using Spectator Mode get much faster vision updates when they select or release tokens.
- Actors with many items or effects prepare faster.
