# Changelog

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
