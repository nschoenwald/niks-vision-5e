# Nik's Vision 5e

[![Foundry VTT](https://img.shields.io/badge/Foundry%20VTT-V13%20%E2%80%93%20V14-orange.svg)](https://foundryvtt.com)
[![DnD5e System](https://img.shields.io/badge/DnD5e-5.0%20%E2%80%93%206.x-blue.svg)](https://github.com/foundryvtt/dnd5e)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/nschoenwald/niks-vision-5e?color=purple)](https://github.com/nschoenwald/niks-vision-5e/releases/latest)

A [Foundry VTT](https://foundryvtt.com/) module that brings the senses of D&D 5e to the canvas: Darkvision, Blindsight, Truesight, Tremorsense, Hearing, Detect Magic, Divine Sense, and more. Vision is configured automatically from each actor's senses, feats, and active effects. In most games, no setup is needed.

> A fork of [Vision 5e](https://github.com/dev7355608/vision-5e) by **dev7355608**, maintained for Foundry VTT V14 and D&D 5e 6.x.

---

## Installation

In Foundry's **Install Module** dialog, paste this manifest URL:

```text
https://github.com/nschoenwald/niks-vision-5e/releases/latest/download/module.json
```

**Switching from Vision 5e?** This module has its own module ID (`niks-vision-5e`). Disable the original Vision 5e module, then set the [module settings](#settings) again. You are prompted for them the first time you load a world as GM.

---

## Compatibility

- **Foundry VTT:** V13 – V14 (verified on V14)
- **Game System:** D&D 5e 5.0 – 6.x (verified on 6.0.6), both the 2024 rules and the legacy (2014) rules
- **Module integrations:**
  - [Item Piles](https://foundryvtt.com/packages/item-piles): piles, containers, and vaults are treated as inaudible objects.
  - [Ember](https://foundryvtt.com/packages/ember): the actor flag `flags.ember.warmBlooded` decides whether Thermal Vision sees a creature.
  - [Limits](https://foundryvtt.com/packages/limits): vision sources tell Limits which sense they represent.
  - [Active Token Effects](https://foundryvtt.com/packages/ATL): only needed on V13 to change detection ranges with active effects (see [Active Effects](#active-effects)).

---

## Features

- **Automatic vision.** A token's senses and vision range come from the actor's senses (Darkvision, Blindsight, Tremorsense, Truesight), feats (e.g. _Devil's Sight_, _Blood Sense_), and active effects (e.g. _Detect Magic_, _See Invisibility_). The vision range in Token Config is locked, because the module manages it.
- **18 detection modes** for D&D 5e senses, spells, and features. See [Detection Modes](#detection-modes).
- **Conditions matter.** Blinded, deafened, sleeping, unconscious, petrified, burrowing, flying, ethereal, invisible, and more affect what a creature can perceive and how it can be perceived.
- **Imprecise senses.** Senses like Hearing and Tremorsense show _that_ something is there without revealing what it is.
- **Vision mode picker.** Tokens with more than one sight-like sense can switch between them from the Token HUD.
- **Spectator Mode.** Players whose character is down can watch through their allies' eyes, and GMs can preview what a player sees.
- **The Ethereal Plane.** Ethereal creatures see and are seen as the rules describe.
- **Feats and effects are recognized by name** in English, German, French, Spanish, and Portuguese (Brazil). See [Feat & Effect Names](#feat--effect-names).

---

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| **Default Hearing Range** | `15 + 2.5 * (@skills.prc.passive - 10)` | How far tokens can hear, in feet. Accepts a number or a formula using the actor's roll data. The default gives 15 ft at Passive Perception 10, plus 2.5 ft per point above that. Set it to `0` to turn hearing off by default. Requires a reload. |
| **Spectator Mode** | Enabled | Lets players and GMs see through other tokens when their own tokens can't perceive anything. See [Spectator Mode](#spectator-mode). |

---

## Detection Modes

### At a glance

- **Precise:** you see the token as it is.
- **Imprecise:** you only see a generic marker in its place, without its identity.
- **Overlay:** highlights a target that you can already see precisely with another sense.

| Mode | Kind | Walls | Darkness | Configured from |
| --- | --- | --- | --- | --- |
| [Blindsense](#blindsense-legacy) _(legacy)_ | Imprecise | Blocked | Ignored | PC feat, 10 ft |
| [Blindsight](#blindsight) | Precise | Blocked | Ignored | Actor senses |
| [Blood Sense](#blood-sense) | Imprecise | Ignored | Ignored | NPC feat (range from description) |
| [Darkvision](#darkvision) | Precise | Blocked | Blocked | Actor senses |
| [Detect Evil and Good](#detect-evil-and-good) | Imprecise | Blocked | Ignored | Effect, 30 ft |
| [Detect Magic](#detect-magic) | Overlay | Blocked | Ignored | Effect 30 ft · PC effect 60 ft · NPC feat |
| [Detect Poison and Disease](#detect-poison-and-disease) | Imprecise | Blocked | Ignored | Effect, 30 ft |
| [Detect Thoughts](#detect-thoughts) | Imprecise | Blocked | Ignored | Effect, 30 ft |
| [Devil's Sight](#devils-sight) | Precise | Blocked | Priority ≥ 100 only | PC feat, 120 ft |
| [Divine Sense](#divine-sense) | Imprecise | Legacy rules only | Ignored | PC effect, 60 ft |
| [Ethereal Sight](#ethereal-sight) | Overlay | Ignored | Ignored | NPC feat · PC effect (legacy), 60 ft |
| [Eyes of the Grave](#eyes-of-the-grave) | Imprecise | Blocked | Ignored | PC effect, 60 ft |
| [Hearing](#hearing) | Imprecise | Sound walls | Ignored | [Setting](#settings) |
| [Life Sense](#life-sense) | Imprecise | Ignored | Ignored | NPC feat (range from description) |
| [Light Perception](#light-perception) | Precise | Blocked | Blocked | Always, unlimited range |
| [See Invisibility](#see-invisibility) | Overlay | Ignored | Ignored | Effect, unlimited · PC effect (legacy), 10 ft |
| [Thermal Vision](#thermal-vision) | Precise | Blocked | Blocked | Feat, 60 ft |
| [Tremorsense](#tremorsense) | Imprecise | Ignored | Ignored | Actor senses |
| [Truesight](#truesight) | Precise | Blocked | Priority ≥ 100 only | Actor senses |
| [Witch Sight](#witch-sight-legacy) _(legacy)_ | Overlay | Ignored | Ignored | PC feat, 30 ft |

_Legacy_ modes and features are only available when the D&D 5e system uses the legacy (2014) rules.

### Rules shared by all modes

- **Losing your senses.** A creature that is _defeated_ (dead), _petrified_, or _unconscious_ perceives nothing. _Sleeping_ and _burrowing_ creatures lose all sight-based senses. _Blinded_ creatures keep only Blindsight and non-visual senses. _Deafened_ creatures can't hear.
- **Echolocation and Blind Senses.** Blindsight stops working while _deafened_ if the NPC has the `Echolocation` or `Blind Senses` feat.
- **Burrowing targets** can't be perceived by sight-based senses or Detect spells. Tremorsense, Hearing, Blood Sense, and Life Sense still work.
- **Invisible targets** can't be seen by Darkvision, Devil's Sight, or Light Perception. Truesight, Blindsight, Thermal Vision, and See Invisibility can still perceive them.
- **Mind Blank and Nondetection** effects hide a creature from Detect Evil and Good, Detect Magic, Detect Poison and Disease, and Detect Thoughts. Nondetection also hides it from Eyes of the Grave. The `Sequester` effect counts as Nondetection.
- **Objects.** Vehicles and [Item Piles](https://foundryvtt.com/packages/item-piles) piles, containers, and vaults are objects. Blindsense, Detect Evil and Good, Detect Thoughts, Divine Sense, Eyes of the Grave, Life Sense, Thermal Vision, and Tremorsense never detect them. Detect Magic still finds the magic items they hold.
- **Inaudible.** Tokens with the _Inaudible_ condition (added by this module) can't be heard. Item piles are inaudible automatically.
- **Darkness sources.** Darkvision, Thermal Vision, and Light Perception are always blocked by darkness. Devil's Sight and Truesight are only blocked by darkness sources with a priority of at least 100. Everything else ignores darkness.
- **Ethereal creatures.** See [The Ethereal Plane](#the-ethereal-plane).

### Details

<a name="blindsense-legacy"></a>
<details>
<summary><b>Blindsense</b> <i>(Legacy, Rogue feature, PHB'14 94)</i></summary>

- Detects tokens that are not objects. It can't detect creatures that are _burrowing_, _defeated_, or _petrified_.
- Disabled while _burrowing_ or _deafened_.
- Configured for PC actors with the `Blindsense` feat (10 ft).

</details>

<a name="blindsight"></a>
<details>
<summary><b>Blindsight</b> <i>(Sense, SRD 5.1 / PHB'14 183 / PHB'24 361)</i></summary>

- Detects tokens, notes, and door controls.
- Works while _blinded_. Disabled while _deafened_ for NPCs with the `Echolocation` or `Blind Senses` feat.
- Configured from the actor's Blindsight.

</details>

<a name="blood-sense"></a>
<details>
<summary><b>Blood Sense</b> <i>(Homebrew)</i></summary>

- Detects creatures that are _bleeding_, and creatures that have blood. That excludes constructs, elementals, oozes, plants, undead, objects, _petrified_ creatures, and creatures immune to _bleeding_.
- Configured for NPC actors with the `Blood Sense` feat. The range is read from the feat description.

</details>

<a name="darkvision"></a>
<details>
<summary><b>Darkvision</b> <i>(Sense, SRD 5.1 / PHB'14 183 / PHB'24 260)</i></summary>

- Detects tokens, notes, and door controls.
- Can't see creatures with the `Umbral Sight` feat (Gloom Stalker Ranger, XGE 41 / PHB'24 126).
- With legacy rules, NPCs with the `Devil's Sight` feat see through darkness sources with a priority below 100.
- Configured from the actor's Darkvision.

</details>

<a name="detect-evil-and-good"></a>
<details>
<summary><b>Detect Evil and Good</b> <i>(Spell, SRD 5.1 / PHB'14 231 / PHB'24 261)</i></summary>

- Detects aberrations, celestials, elementals, fey, fiends, and undead. It also detects PCs with the `Hollow One` feat (EGW 182), including `Supernatural Gift: Hollow One`.
- Configured for actors with the `Detect Evil and Good` effect (30 ft).

</details>

<a name="detect-magic"></a>
<details>
<summary><b>Detect Magic</b> <i>(Spell, SRD 5.1 / PHB'14 231 / PHB'24 262)</i></summary>

- Highlights creatures that carry a visible magic item, or are affected by a magical or spell effect. An item is visible if it is equipped or not inside a container.
- Only highlights creatures you can already see with another sense.
- Configured for actors with the `Detect Magic` effect (30 ft), PCs with the `Magic Awareness` effect (Wild Magic Barbarian, TCE 25, 60 ft), and NPCs with the `Sense Magic` feat (range from the description).

</details>

<a name="detect-poison-and-disease"></a>
<details>
<summary><b>Detect Poison and Disease</b> <i>(Spell, SRD 5.1 / PHB'14 231 / PHB'24 262)</i></summary>

- Detects creatures that are _poisoned_ or _diseased_, or that have a poisonous natural weapon attack.
- Configured for actors with the `Detect Poison and Disease` effect (30 ft).
- _Some poisonous creatures aren't detected because their natural weapon's versatile damage lacks the `[poison]` flavor. You need to add it yourself._

</details>

<a name="detect-thoughts"></a>
<details>
<summary><b>Detect Thoughts</b> <i>(Spell, SRD 5.1 / PHB'14 231 / PHB'24 262)</i></summary>

- Detects PC and NPC actors that speak at least one language and aren't objects, _petrified_, or _defeated_. With legacy rules, they also need an Intelligence of 4 or higher.
- Configured for actors with the `Detect Thoughts` effect (30 ft).

</details>

<a name="devils-sight"></a>
<details>
<summary><b>Devil's Sight</b> <i>(Eldritch Invocation, SRD 5.1 / PHB'14 110 / PHB'24 155)</i></summary>

- Detects tokens, notes, and door controls, and sees through darkness sources with a priority below 100.
- Configured for PCs with the `Devil's Sight` feat, also written as `Eldritch Invocation: Devil's Sight` or `Eldritch Adept: Devil's Sight` (120 ft).
- _Remove any active effect from the feat that grants 120 ft Darkvision. Devil's Sight doesn't extend Darkvision._

</details>

<a name="divine-sense"></a>
<details>
<summary><b>Divine Sense</b> <i>(Paladin feature, SRD 5.1 / PHB'14 82 / PHB'24 110)</i></summary>

- Detects celestials, fiends, and undead, plus PCs with the `Hollow One` feat.
- Blocked by walls only with legacy rules.
- Configured for PCs with the `Divine Sense` effect (60 ft).

</details>

<a name="ethereal-sight"></a>
<details>
<summary><b>Ethereal Sight</b> <i>(Monster feature, e.g. SRD 5.1 / MM'14 147)</i></summary>

- Lets you see _ethereal_ creatures that you would otherwise see with another precise sense.
- Configured for NPCs with the `Ethereal Sight` feat (range from the description) and, with legacy rules, for PCs with the `The Third Eye: Ethereal Sight` effect (60 ft).

</details>

<a name="eyes-of-the-grave"></a>
<details>
<summary><b>Eyes of the Grave</b> <i>(Grave Domain Cleric feature, XGE 19)</i></summary>

- Detects undead, plus PCs with the `Hollow One` feat.
- Configured for PCs with the `Eyes of the Grave` effect (60 ft).

</details>

<a name="hearing"></a>
<details>
<summary><b>Hearing</b></summary>

- Detects any token that isn't _inaudible_, _defeated_, or _petrified_.
- Blocked by sound-blocking walls, using the walls' reversed direction.
- Every token can hear. The range comes from the [Default Hearing Range](#settings) setting.

</details>

<a name="life-sense"></a>
<details>
<summary><b>Life Sense</b> <i>(Monster feature, e.g. MPMM 250 / MTF 246)</i></summary>

- Detects living creatures, which excludes constructs, undead, objects, and _defeated_ or _petrified_ creatures.
- Configured for NPCs with the `Life Sense` feat (range from the description).

</details>

<a name="light-perception"></a>
<details>
<summary><b>Light Perception</b></summary>

- Detects tokens, notes, and door controls that are lit by a light source, and creatures that are _burning_.
- Every token has it, with unlimited range.

</details>

<a name="see-invisibility"></a>
<details>
<summary><b>See Invisibility</b> <i>(Spell, SRD 5.1 / PHB'14 274 / PHB'24 314)</i></summary>

- Lets you see _invisible_ and _ethereal_ creatures that you would otherwise see with another precise sense.
- Configured for actors with the `See Invisibility` effect (unlimited range) and, with legacy rules, for PCs with the `The Third Eye: See Invisibility` effect (Divination Wizard, PHB'14 116, 10 ft).

</details>

<a name="thermal-vision"></a>
<details>
<summary><b>Thermal Vision</b> <i>(Ashka ancestry feature, Ember)</i></summary>

- Detects warm-blooded creatures (beasts, celestials, dragons, fey, fiends, giants, humanoids, monstrosities) and any creature that is _burning_. With [Ember](https://foundryvtt.com/packages/ember), `flags.ember.warmBlooded` overrides the creature type.
- Disabled while _incapacitated_ or _ethereal_. It never detects _ethereal_ creatures.
- Configured for actors with the `Thermal Vision` feat (60 ft).

</details>

<a name="tremorsense"></a>
<details>
<summary><b>Tremorsense</b> <i>(Sense, SRD 5.1 / MM'14 9 / PHB'24 377)</i></summary>

- Detects creatures touching the ground, including _burrowing_ ones. It can't detect creatures that are _flying_ or _hovering_, objects, or _defeated_ or _petrified_ creatures.
- Disabled while the creature itself is _flying_ or _hovering_.
- Configured from the actor's Tremorsense.

</details>

<a name="truesight"></a>
<details>
<summary><b>Truesight</b> <i>(Sense, SRD 5.1 / PHB'14 183 / PHB'24 377)</i></summary>

- Detects tokens, notes, and door controls, including _invisible_ and _ethereal_ creatures, and sees through darkness sources with a priority below 100.
- Configured from the actor's Truesight.

</details>

<a name="witch-sight-legacy"></a>
<details>
<summary><b>Witch Sight</b> <i>(Legacy, Eldritch Invocation, SRD 5.1 / PHB'14 111)</i></summary>

- Highlights shapechangers you can already see with another sense. Shapechangers are actors with the `Shapechanger` creature subtype, or NPCs with the `Shapechanger` feat.
- Configured for PCs with the `Witch Sight` feat, also written as `Eldritch Invocation: Witch Sight` or `Eldritch Adept: Witch Sight` (30 ft).

</details>

### Ghostly Gaze

PCs with the `Ghostly Gaze` effect (Eldritch Invocation, XGE 56), also written as `Eldritch Invocation: Ghostly Gaze` or `Eldritch Adept: Ghostly Gaze`, gain 30 ft Darkvision and can see through walls within 30 ft.

---

## Vision Modes

The available vision modes are **Blindsight**, **Darkvision**, **Devil's Sight**, and **Truesight**. A token keeps the vision mode selected for it as long as it has that sense. Otherwise it uses the mode with the longest range.

If a token has two or more of these senses, its owner can switch between them in the Token HUD (<img alt="glasses icon" src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/7.x/svgs/solid/glasses.svg" width="16px" height="16px" style="filter: invert(100%);">). On V13, the button shows an eye icon (<img alt="eye icon" src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/7.x/svgs/solid/eye.svg" width="16px" height="16px" style="filter: invert(100%);">) instead. The picker is hidden if an active effect sets the vision mode.

_Ethereal_ creatures automatically use a grayscale **Etherealness** vision mode.

---

## Spectator Mode

Some conditions make a creature unable to perceive anything: _defeated_ (dead), _petrified_, and _unconscious_. Spectator Mode keeps players from staring at a black screen while their character is out.

- **Players:** If none of the tokens a player controls can perceive anything, the player sees through every token they own or observe. If the player has no token that can perceive at all, they see through other players' tokens they have at least _limited_ permission for.
- **GMs:** When a GM controls a player's token, the GM sees what that player would see under the rules above. This makes it easy to check a downed player's view.

Spectator Mode can be turned off in the [settings](#settings). Vision then works as in core Foundry.

---

## The Ethereal Plane

While a creature has the _ethereal_ status:

- All its senses are limited to 60 ft.
- It doesn't emit light, and it sees the world in grayscale.
- It perceives other _ethereal_ creatures normally.

Creatures on the Material Plane can't perceive an _ethereal_ creature, except in these cases:

- **Truesight** sees it.
- **See Invisibility** and **Ethereal Sight** reveal it.
- An NPC whose `Etherealness` feat (e.g. SRD 5.1 / MM'14 147) says it is "visible on the Material Plane" can be perceived by most senses. Hearing, Tremorsense, Blindsense, Blood Sense, and Thermal Vision still can't perceive it.

---

## Active Effects

Change detection ranges with active effects using these attribute keys:

| Detection Mode | Attribute Key |
| --- | --- |
| Blindsense | `token.detectionModes.blindsense.range` |
| Blindsight | `system.attributes.senses.ranges.blindsight` |
| Blood Sense | `token.detectionModes.bloodSense.range` |
| Darkvision | `system.attributes.senses.ranges.darkvision` |
| Detect Evil and Good | `token.detectionModes.detectEvilAndGood.range` |
| Detect Magic | `token.detectionModes.detectMagic.range` |
| Detect Poison and Disease | `token.detectionModes.detectPoisonAndDisease.range` |
| Detect Thoughts | `token.detectionModes.detectThoughts.range` |
| Devil's Sight | `token.detectionModes.devilsSight.range` |
| Divine Sense | `token.detectionModes.divineSense.range` |
| Ethereal Sight | `token.detectionModes.etherealSight.range` |
| Eyes of the Grave | `token.detectionModes.eyesOfTheGrave.range` |
| Hearing | `token.detectionModes.hearing.range` |
| Life Sense | `token.detectionModes.lifeSense.range` |
| Light Perception | `token.detectionModes.lightPerception.range` |
| See Invisibility | `token.detectionModes.seeInvisibility.range` |
| Thermal Vision | `token.detectionModes.thermalVision.range` |
| Tremorsense | `system.attributes.senses.ranges.tremorsense` |
| Truesight | `system.attributes.senses.ranges.truesight` |
| Witch Sight | `token.detectionModes.witchSight.range` |

_Older versions:_

- On Foundry V13, replace `token.` with `ATL.` (requires [Active Token Effects](https://foundryvtt.com/packages/ATL)).
- With D&D 5e before 5.3.0, replace `.senses.ranges.` with `.senses.`.

---

## Feat & Effect Names

Feats and effects are recognized by name, in any of the languages below:

- Names aren't case-sensitive.
- Both `'` and `’` work as apostrophes.
- In French, the space before a colon is optional.
- Invocation names prefixed with `Eldritch Invocation:`, `Invocation:`, or `Eldritch Adept:` (including the plural forms) are recognized as well.

<details>
<summary><b>Show all recognized names</b></summary>

| English                     | _Source_                              | German                         | French                                                                      | Spanish                           | Portuguese (Brazil)                               |
| --------------------------- | ------------------------------------- | ------------------------------ | --------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------- |
| `Blind Senses`              | _Monster feat_                        | `Blinde Sinne`                 | `Sens aveugles`                                                             | `Sentidos de ciego`               | `Sentido Cego`                                    |
| `Blindsense`                | _Rogue feat_                          | `Blindgespür`                  | `Perception aveugle`                                                        | `Sentir sin ver`                  | `Sentido Cego`                                    |
| `Blood Sense`               | _Monster feat_                        | `Blutgespür`                   | `Perception du sang`                                                        | `Percepción de Sangre`            | `Percepção do Sangue`                             |
| `Detect Evil and Good`      | _Spell_                               | `Gutes und Böses entdecken`    | `Détection du mal et du bien`                                               | `Detectar el bien y el mal`       | `Detectar o Bem e o Mal` / `Detectar o Bem e Mal` |
| `Detect Magic`              | _Spell_                               | `Magie entdecken`              | `Détection de la magie`                                                     | `Detectar magia`                  | `Detectar Magia`                                  |
| `Detect Poison and Disease` | _Spell_                               | `Gift und Krankheit entdecken` | `Détection du poison et des maladies`                                       | `Detectar venenos y enfermedades` | `Detectar Veneno e Doença`                        |
| `Detect Thoughts`           | _Spell_                               | `Gedanken wahrnehmen`          | `Détection des pensées`                                                     | `Detectar pensamientos`           | `Detectar Pensamentos`                            |
| `Devil's Sight`             | _Warlock invocation / Monster feat_   | `Teufelssicht`                 | `Vision de diable` / `Vision du diable` / `Vue de diable` / `Vue du diable` | `Vista del diablo`                | `Visão Diabólica` / `Visão do Diabo`              |
| `Divine Sense`              | _Paladin feat_                        | `Göttliches Gespür`            | `Perception divine`                                                         | `Sentidos divinos`                | `Sentido Divino`                                  |
| `Echolocation`              | _Monster feat_                        | `Echolot`                      | `Écholocation` / `Écholocalisation`                                         | `Ecolocalización`                 | `Ecolocalização`                                  |
| `Eldritch Adept`            | _Feat_                                | `Schauerlicher Adept`          | `Adepte occulte`                                                            | `Adepto sobrenatural`             | `Adepto Místico`                                  |
| `Eldritch Invocation`       | _Warlock feat_                        | `Schauerliche Anrufung`        | `Invocation occulte` / `Manifestation occulte`                              | `Invocación sobrenatural`         | `Invocação Mística`                               |
| `Ethereal Sight`            | _Monster feat_                        | `Ätherische Sicht`             | `Vision éthérée` / `Vue éthérée`                                            | `Visión etérea`                   | `Visão Etérea`                                    |
| `Eyes of the Grave`         | _Cleric (Grave Domain) feat_          | `Grabesblick`                  | `Œil de la tombe`                                                           | `Ojos de la Tumba`                | `Olhos da Sepultura`                              |
| `Ghostly Gaze`              | _Warlock invocation_                  | `Geisterhafter Blick`          | `Regard fantomatique`                                                       | `Mirada fantasmal`                | `Olhar Fantasmagórico`                            |
| `Hollow One`                | _Supernatural Gift_                   | `Leerwandler`                  | `Celui-qui-est-creux`                                                       | `Aquel que está vacío`            | `Oco`                                             |
| `Life Sense`                | _Monster feat_                        | `Lebensgespür`                 | `Perception de la vie`                                                      | `Percepción de la Vida`           | `Percepção da Vida`                               |
| `Magic Awareness`           | _Barbarian (Path of Wild Magic) feat_ | `Magische Wahrnehmung`         | `Conscience magique`                                                        | `Conciencia mágica`               | `Percepção Mágica`                                |
| `Mind Blank`                | _Spell_                               | `Gedankenleere`                | `Esprit impénétrable`                                                       | `Mente en Blanco`                 | `Limpar a Mente`                                  |
| `Nondetection`              | _Spell_                               | `Unauffindbarkeit`             | `Antidétection`                                                             | `Indetectable`                    | `Indetectável`                                    |
| `See Invisibility`          | _Spell_                               | `Unsichtbares sehen`           | `Détection de l'invisibilité`                                               | `Ver invisibilidad`               | `Ver o Invisível`                                 |
| `Sense Magic`               | _Monster feat_                        | `Magie spüren`                 | `Détection de la magie` / `Perception de la magie`                          | `Sentir magia`                    | `Sentir Magia`                                    |
| `Sequester`                 | _Spell_                               | `Verbergen`                    | `Dissimulation suprême`                                                     | `Recluir`                         | `Refugiar`                                        |
| `Shapechanger`              | _Monster feat / Subtype_              | `Gestaltwandler`               | `Métamorphe`                                                                | `Cambiaformas`                    | `Metamorfo`                                       |
| `Supernatural Gift`         | _Character Creation Option_           | `Übernatürliche Gabe`          | `Don surnaturel`                                                            | `Don supernatural`                | `Dom Sobrenatural`                                |
| `The Third Eye`             | _Wizard (Divination) feat_            | `Das dritte Auge`              | `Troisième œil`                                                             | `El Tercer Ojo`                   | `O Terceiro Olho`                                 |
| `Thermal Vision`            | _Ancestry (Ashka) feat_               | `Wärmesicht`                   | `Vision thermique`                                                          | `Visión Térmica`                  | `Visão Térmica`                                   |
| `Umbral Sight`              | _Ranger (Gloomstalker) feat_          | `Düstersicht`                  | `Vision des ombres`                                                         | `Visión en la umbra`              | `Visão Umbral`                                    |
| `Witch Sight`               | _Warlock invocation_                  | `Hexensicht`                   | `Vision de sorcier` / `Vision sorcière` / `Vue de sorcier` / `Vue sorcière` | `Visión bruja`                    | `Visão da Bruxa`                                  |

</details>

The module's interface is also translated into Polish and Czech, but feat and effect names in those languages aren't recognized yet.

---

## Credits

Nik's Vision 5e is based on [Vision 5e](https://github.com/dev7355608/vision-5e) by **dev7355608**, licensed under MIT. Thank you for the excellent original module!

---

## Other Modules by Nik

### 🎲 D&D 5e Specific
* **[Nik's DnD5e Tweaks](https://github.com/nschoenwald/niks-dnd5e-tweaks)** – Consolidated collection of quality-of-life enhancements and combat automation tweaks for DnD5e.

### ⚔️ Combat & Token Tools
* **[Nik's Action HUD](https://github.com/nschoenwald/niks-action-hud)** – Sleek, modern canvas-docked Action HUD for quick access to attacks, spells, inventory, and utility rolls.
* **[Nik's Token Tags](https://github.com/nschoenwald/niks-token-tags)** – Automatically numbers duplicate combatant NPCs (A, B, C…) with color-coded letter overlays.
* **[Nik's Shared NPC Initiative](https://github.com/nschoenwald/niks-shared-npc-initiative)** – Groups NPCs of the same type in combat so they share a single initiative roll.
* **[Nik's Movement Control](https://github.com/nschoenwald/niks-movement-control)** – GM controls to toggle player movement and automatically restrict/allow movement on combat start and end.
* **[Nik's Tiny Change Logs](https://github.com/nschoenwald/niks-tiny-changelogs)** – Compact, single-line chat messages logging token HP and Temp HP changes.

### 🎲 Visuals & Display
* **[Nik's Dynamic Roll Area](https://github.com/nschoenwald/niks-dynamic-roll-area)** – Dynamically restricts Dice So Nice 3D dice rolling area to exclude the sidebar / chat log across all screen resolutions and window sizes.

### ⚙️ Utilities & System Management
* **[Nik's Settings Locks](https://github.com/nschoenwald/niks-settings-locks)** – Soft-lock and hard-lock client settings and keybindings across all connected players.
* **[Nik's Compendium Search Tweaks](https://github.com/nschoenwald/niks-compendium-search-tweaks)** – Configure which compendium packs are included or excluded from native sidebar search.
* **[Nik's Copy Environment](https://github.com/nschoenwald/niks-copy-environment)** – Copy the list of systems, modules, and versions, and export/import game and player settings.
* **[Nik's Show & Tell](https://github.com/nschoenwald/niks-show-and-tell)** – Share popout images to chat and paste image files directly into chat messages.
* **[Nik's Zoom / Pan Options](https://github.com/nschoenwald/niks-zoom-pan-options)** – Touchpad and scroll wheel pan/zoom controls and canvas navigation enhancements.
* **[Nik's Scene Transformations](https://github.com/nschoenwald/niks-scene-transformations)** – Rotate scenes or add playable space around them, with tokens, walls, lights, tiles and regions moved along so everything stays in place.
