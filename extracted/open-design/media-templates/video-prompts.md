# Open Design — Video Prompt Templates Catalog

This document is a full transcription of the media-generation prompt templates found in `prompt-templates/video/` of the [nexu-io/open-design](https://github.com/nexu-io/open-design) repository. Open Design is an AI design tool, and these JSON files are the built-in prompt templates surfaced in its plugin/template system for generating media (images or videos) via various AI models.

## Schema

Each template JSON file has the following fields:

- `id` — unique slug identifier
- `surface` — `image` or `video`
- `title` — human-readable template title
- `summary` — short description of what the prompt produces
- `category` — template category (e.g. Profile / Avatar, Social Media Post)
- `tags` — array of freeform tags
- `model` — the target generation model (e.g. gpt-image-2, seedream, etc.)
- `aspect` — target aspect ratio
- `prompt` — the literal generation-prompt text. Sometimes plain prose, sometimes a JSON-structured prompt string, sometimes containing non-English text, and may contain `{argument name="..." default="..."}` template placeholders. Preserved exactly as-is below.
- `previewImageUrl` — URL of a preview image for the template
- `source` — attribution object with `repo`, `license`, `author`, `url`

## Note on plugins/_official duplication

The directory `plugins/_official/video-templates/<slug>/template.json` in the same repo contains byte-identical content to these files (same `id`, same `prompt` text) — they are the same templates repackaged as installable plugins. Each plugin also ships an `open-design.json` manifest with i18n translations, which is not transcribed here since the underlying prompt content is identical to what appears below.

## Table of Contents

| # | Title | Category | Model | Aspect |
|---|-------|----------|-------|--------|
| 1 | [3D Animated Boy Building Lego](#3d-animated-boy-building-lego) | General | seedance-2.0 | 16:9 |
| 2 | [A Decade of Refinement Glow-Up](#a-decade-of-refinement-glow-up) | Advertising | seedance-2.0 | 16:9 |
| 3 | [Ancient Guardian Dragon Rescue](#ancient-guardian-dragon-rescue) | General | seedance-2.0 | 16:9 |
| 4 | [Ancient Indian Kingdom FPV Video](#ancient-indian-kingdom-fpv-video) | General | seedance-2.0 | 16:9 |
| 5 | [Animation transfer and camera tracking prompt](#animation-transfer-and-camera-tracking-prompt) | General | seedance-2.0 | 16:9 |
| 6 | [Beat-Synced Outfit Transformation Dance](#beat-synced-outfit-transformation-dance) | General | seedance-2.0 | 16:9 |
| 7 | [Character Intro Motion Graphics Sequence](#character-intro-motion-graphics-sequence) | Motion Graphics | seedance-2.0 | 16:9 |
| 8 | [Cinematic Birthday Celebration Sequence](#cinematic-birthday-celebration-sequence) | Cinematic | seedance-2.0 | 16:9 |
| 9 | [Cinematic Dragon Interaction & Flight](#cinematic-dragon-interaction--flight) | Cinematic | seedance-2.0 | 16:9 |
| 10 | [Cinematic East Asian Woman Hand Dance](#cinematic-east-asian-woman-hand-dance) | Cinematic | seedance-2.0 | 16:9 |
| 11 | [Cinematic Emotional Face Close-up](#cinematic-emotional-face-close-up) | Cinematic | seedance-2.0 | 16:9 |
| 12 | [Cinematic Marine Biologist Exploration](#cinematic-marine-biologist-exploration) | Cinematic | seedance-2.0 | 16:9 |
| 13 | [Cinematic Music Podcast and Guitar Technique](#cinematic-music-podcast-and-guitar-technique) | Cinematic | seedance-2.0 | 16:9 |
| 14 | [Cinematic Route Navigation Guide](#cinematic-route-navigation-guide) | Cinematic | seedance-2.0 | 16:9 |
| 15 | [Cinematic Street Racing Sequence for Seedance 2](#cinematic-street-racing-sequence-for-seedance-2) | Cinematic | seedance-2.0 | 16:9 |
| 16 | [Cinematic vampire alley fight sequence](#cinematic-vampire-alley-fight-sequence) | Cinematic | seedance-2.0 | 16:9 |
| 17 | [Crimson Horizon Sci-Fi Cinematic Sequence](#crimson-horizon-sci-fi-cinematic-sequence) | Cinematic | seedance-2.0 | 16:9 |
| 18 | [Cyberpunk Game Trailer Script](#cyberpunk-game-trailer-script) | General | seedance-2.0 | 16:9 |
| 19 | [Forbidden City Cat Satire](#forbidden-city-cat-satire) | General | seedance-2.0 | 16:9 |
| 20 | [Hollywood Haute Couture Fantasy Video Prompt](#hollywood-haute-couture-fantasy-video-prompt) | VFX / Fantasy | seedance-2.0 | 16:9 |
| 21 | [Hunched Character Animation](#hunched-character-animation) | General | seedance-2.0 | 16:9 |
| 22 | [HyperFrames: 12-Second App Showcase — Three Floating Phones](#hyperframes-12-second-app-showcase--three-floating-phones) | Product | hyperframes-html | 16:9 |
| 23 | [HyperFrames: 30-Second Brand Sizzle Reel](#hyperframes-30-second-brand-sizzle-reel) | Marketing | hyperframes-html | 16:9 |
| 24 | [HyperFrames: Animated Bar-Chart Race (NYT-style)](#hyperframes-animated-bar-chart-race-nyt-style) | Data | hyperframes-html | 16:9 |
| 25 | [HyperFrames: Apple-Style Flight Map (Origin → Destination)](#hyperframes-apple-style-flight-map-origin--destination) | Travel | hyperframes-html | 16:9 |
| 26 | [HyperFrames HTML-in-Canvas: 3D iPhone + MacBook Product Demo](#hyperframes-html-in-canvas-3d-iphone--macbook-product-demo) | VFX / HTML-in-Canvas | hyperframes-html | 16:9 |
| 27 | [HyperFrames HTML-in-Canvas: Liquid Background Hero](#hyperframes-html-in-canvas-liquid-background-hero) | VFX / HTML-in-Canvas | hyperframes-html | 16:9 |
| 28 | [HyperFrames HTML-in-Canvas: Liquid Glass Landing Reveal](#hyperframes-html-in-canvas-liquid-glass-landing-reveal) | VFX / HTML-in-Canvas | hyperframes-html | 16:9 |
| 29 | [HyperFrames HTML-in-Canvas: Magnetic Field Visualisation](#hyperframes-html-in-canvas-magnetic-field-visualisation) | VFX / HTML-in-Canvas | hyperframes-html | 16:9 |
| 30 | [HyperFrames HTML-in-Canvas: Portal Reveal Dashboard](#hyperframes-html-in-canvas-portal-reveal-dashboard) | VFX / HTML-in-Canvas | hyperframes-html | 16:9 |
| 31 | [HyperFrames HTML-in-Canvas: Glass Shatter Outro](#hyperframes-html-in-canvas-glass-shatter-outro) | VFX / HTML-in-Canvas | hyperframes-html | 16:9 |
| 32 | [HyperFrames HTML-in-Canvas: Cinematic Text Cursor Reveal](#hyperframes-html-in-canvas-cinematic-text-cursor-reveal) | VFX / HTML-in-Canvas | hyperframes-html | 16:9 |
| 33 | [HyperFrames: 4-Second Cinematic Logo Outro](#hyperframes-4-second-cinematic-logo-outro) | Branding | hyperframes-html | 16:9 |
| 34 | [HyperFrames: $0 → $10K Money Counter Hype (9:16)](#hyperframes-0--10k-money-counter-hype-916) | Short Form | hyperframes-html | 9:16 |
| 35 | [HyperFrames: 5-Second Minimal Product Reveal](#hyperframes-5-second-minimal-product-reveal) | Cinematic | hyperframes-html | 16:9 |
| 36 | [HyperFrames: 30-Second SaaS Product Promo (Linear-style)](#hyperframes-30-second-saas-product-promo-linear-style) | Marketing | hyperframes-html | 16:9 |
| 37 | [HyperFrames: 9:16 Social Overlay Stack (X · Reddit · Spotify · Instagram)](#hyperframes-916-social-overlay-stack-x--reddit--spotify--instagram) | Short Form | hyperframes-html | 9:16 |
| 38 | [HyperFrames: 9:16 TikTok Talking-Head with Karaoke Captions](#hyperframes-916-tiktok-talking-head-with-karaoke-captions) | Short Form | hyperframes-html | 9:16 |
| 39 | [HyperFrames: Website-to-Video Pipeline (15-Second Marketing Cut)](#hyperframes-website-to-video-pipeline-15-second-marketing-cut) | Marketing | hyperframes-html | 16:9 |
| 40 | [Live-Action Anime Adaptation: Water vs. Thunder Breathing Duel](#live-action-anime-adaptation-water-vs-thunder-breathing-duel) | Anime | seedance-2.0 | 16:9 |
| 41 | [Luxury Supercar Cinematic Narrative](#luxury-supercar-cinematic-narrative) | Cinematic | seedance-2.0 | 16:9 |
| 42 | [Magical Academy Storyboard Sequence](#magical-academy-storyboard-sequence) | Advertising | seedance-2.0 | 16:9 |
| 43 | [Modern Rural Aesthetics Healing Short Film Video Prompt](#modern-rural-aesthetics-healing-short-film-video-prompt) | Cinematic | seedance-2.0 | 16:9 |
| 44 | [Nightclub Flyer Atmospheric Animation](#nightclub-flyer-atmospheric-animation) | General | seedance-2.0 | 16:9 |
| 45 | [Retro HK Wuxia Film Aesthetic](#retro-hk-wuxia-film-aesthetic) | Cinematic | seedance-2.0 | 16:9 |
| 46 | [Seedance 2.0: 15-Second Cinematic Japanese Romance Short Film](#seedance-20-15-second-cinematic-japanese-romance-short-film) | Cinematic | seedance-2.0 | 16:9 |
| 47 | [Seedance 2.0: 80-Year-Old Rapper MV](#seedance-20-80-year-old-rapper-mv) | General | seedance-2.0 | 16:9 |
| 48 | [Sequence and Movement Instruction for Martial Arts Video](#sequence-and-movement-instruction-for-martial-arts-video) | General | seedance-2.0 | 16:9 |
| 49 | [Soul-Switching Mirror Magic Sequence](#soul-switching-mirror-magic-sequence) | VFX / Fantasy | seedance-2.0 | 16:9 |
| 50 | [Toaster Rocket Jumpscare](#toaster-rocket-jumpscare) | General | seedance-2.0 | 16:9 |
| 51 | [Traditional Dance Performance](#traditional-dance-performance) | Advertising | seedance-2.0 | 16:9 |
| 52 | [Video - Desk Hologram AR on Real Workspace (Seedance 2.0)](#video---desk-hologram-ar-on-real-workspace-seedance-20) | Product | seedance-2.0 | 9:16 |
| 53 | [Video - Three Kingdoms ARPG - Guan Yu Slays Yan Liang (Seedance 2.0)](#video---three-kingdoms-arpg---guan-yu-slays-yan-liang-seedance-20) | Cinematic | seedance-2.0 | 16:9 |
| 54 | [Video - Three Kingdoms ARPG - Lyu Bu Yuanmen Archery (Seedance 2.0)](#video---three-kingdoms-arpg---lyu-bu-yuanmen-archery-seedance-20) | Cinematic | seedance-2.0 | 16:9 |
| 55 | [Video - Three Kingdoms ARPG - Zhao Yun Cradle Escape (Seedance 2.0)](#video---three-kingdoms-arpg---zhao-yun-cradle-escape-seedance-20) | Cinematic | seedance-2.0 | 16:9 |
| 56 | [Vintage Disney Style Pirate Crocodile Animation](#vintage-disney-style-pirate-crocodile-animation) | General | seedance-2.0 | 16:9 |
| 57 | [Viral K-pop Dance Choreography](#viral-k-pop-dance-choreography) | Social / Meme | seedance-2.0 | 16:9 |
| 58 | [Wasteland Factory Chase](#wasteland-factory-chase) | General | seedance-2.0 | 16:9 |

## Templates

### 3D Animated Boy Building Lego

- **id**: `3d-animated-boy-building-lego`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: (none)
- **summary**: A multi-shot video prompt in 3D animation style describing a boy carefully assembling Lego pieces in a room, featuring time-lapse effects.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Alex Zhang
- **source license**: CC-BY-4.0
- **source url**: https://x.com/jojogh_007/status/2049123558102810714
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/2dba80d5da706c3ea078ed69096c67d3/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Scene: A boy in a room seriously assembling Lego blocks. The visual style is 3D animation with vibrant colors, smooth lines, full of childlike fun and vitality. A time-lapse effect is added to show the assembly process.
Scene: Wide shot of the room, sunlight spilling onto the desk through the window. The boy sits at the desk focused on assembling Lego, with a serious expression. The camera slowly zooms in.
Scene: Time-lapse effect showing the boy quickly snapping Lego pieces together, the blocks gradually taking shape in his hands. The camera switches to different angles.
Scene: Close-up of hands, showing details of the boy skillfully assembling Lego, fingers moving nimbly. The camera follows the hand movements.
Scene: Time-lapse effect continues showing the assembly process. The Lego creation becomes complete, and the boy's expression changes from focused to satisfied.
Scene: The boy looks up with a satisfied smile. The camera pulls back to reveal the finished Lego masterpiece.

Duration: 00:20
```

### A Decade of Refinement Glow-Up

- **id**: `a-decade-of-refinement-glow-up`
- **category**: Advertising
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, fantasy, product
- **summary**: A transformation prompt for Seedance 2.0 showing a man's transition from a casual 2016 setting to a luxurious 2026 Dubai lifestyle while maintaining character consistency.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Maverick | AI
- **source license**: CC-BY-4.0
- **source url**: https://x.com/RizwanAly07/status/2048948726623056366
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/d2d6d15cbc6ef4d4d4c8c9a7de7007d7/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Create a 15-second ultra-realistic cinematic transformation video using the exact same man from the uploaded reference image. Maintain perfect face consistency, same hairstyle, facial features, identity, and body proportions throughout. No face change. Concept: “2026 is the new 2016” nostalgia-to-luxury glow-up. Scene 1: 2016 version — simple casual clothes, basic hairstyle, walking alone on a normal street, warm nostalgic colors, old Instagram aesthetic, simple life, no luxury. Scene 2: Flashback cuts — old bike ride, cheap café alone, late-night dreams, city lights, silent ambition in his eyes. Scene 3: Strong transition — speed-ramp effect, screen crack cinematic transition, time shifts from 2016 to 2026, luxury watch appears, black suit transformation begins. Scene 4: 2026 version — walking confidently in Dubai downtown, luxury black suit, sunglasses, expensive watch, black luxury car behind him, people turn and stare. Scene 5: Hero shot — rooftop skyline at sunset, slow motion, wind moving, camera rotating around him, strong eye contact, main character energy. Final scene: cinematic ending with the feeling “Same Man. Different Era.” Style: hyper-realistic, Netflix-level production, luxury transformation, dramatic lighting, viral Instagram reel style, strong masculine aura, editorial fashion visuals, 4K ultra realism, emotional and powerful storytelling.
```

### Ancient Guardian Dragon Rescue

- **id**: `ancient-guardian-dragon-rescue`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: fantasy, action
- **summary**: A detailed multi-shot cinematic prompt for a story about a girl in a rainy village saved by an emerging dragon, focusing on VFX and atmospheric sound.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Jasmine Ai
- **source license**: CC-BY-4.0
- **source url**: https://x.com/jasminekhan90_/status/2049038597333090769
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/18d35c93cc1d6ab0a8eff2a68e6d701b/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Shot 1 (00:00–00:02) – WS, Rainy Night, Forward Tracking. A narrow, ancient village alley drenched in relentless rain. Water streams down slanted rooftops and floods uneven stone pathways, reflecting flickering lantern light. A young girl runs barefoot through the water, her soaked dress clinging to her as she struggles to keep balance. Behind her, shadowy figures move unnaturally—distorted, stretching and glitching with each lightning flash as they close in. VFX: Heavy rain simulation, reflective wet surfaces, lightning illuminating distorted shadows. SFX: Thunder cracks, rapid splashing footsteps, howling wind. Shot 2 (00:02–00:04) – CU, Panic Fall, Slight Handheld Shake. She suddenly slips and crashes onto the wet stone. Water splashes outward. Close on her face—rain mixes with tears, her breath sharp and uneven. Her trembling hands push against the ground as she tries to move back, eyes locked on the approaching darkness. VFX: Detailed splash simulation, motion blur, lens water droplets. SFX: Intensifying heartbeat, heavy breathing, rain striking surfaces. Shot 3 (00:04–00:06) – LS, Violent Ground Eruption. The ground beneath the shadows fractures violently. Stone explodes upward in a powerful shockwave, sending debris and water into the air. A massive dragon bursts from below—its body dark and armored, faint glowing veins pulsing beneath its scales. It rises between the girl and the shadows, instantly scattering them into fragments of darkness. VFX: Ground destruction, flying debris, glowing cracks, volumetric dust. SFX: Deep impact boom, layered dragon roar with sub-bass rumble. Shot 4 (00:06–00:08) – CU, Emotional Realization, Slow Push-In. The girl freezes, looking up. Her fear begins to fade. Lightning briefly illuminates the dragon’s face—its glowing eye calm, focused. The reflection of that eye fills hers. The rain appears to slow slightly in this moment. VFX: Eye reflection detail, subtle slow-motion rain, soft glow from dragon’s eye. SFX: Thunder fades into low ambient tone, rain softens. Shot 5 (00:08–00:11) – MS, Gentle Interaction, Static Frame. The dragon slowly lowers its massive head toward her, movements controlled and careful. It gently nudges her shoulder. Water droplets slide across its scales, glowing faintly as they fall. She hesitates, then slowly lifts her hand toward it, tension leaving her body. VFX: Subtle bioluminescent pulses under scales, detailed water interaction. SFX: Deep calm breathing, soft ambient hum. Shot 6 (00:11–00:13) – LS, Protective Wing Expansion. The dragon spreads its massive wings wide, forming a protective barrier around her. Rain violently hits the outer surface of the wings, but inside the space becomes still—dry, warm, and silent. The contrast between chaos outside and calm inside is immediate and striking. VFX: Rain deflection on wings, cold blue tones outside vs warm
```

### Ancient Indian Kingdom FPV Video

- **id**: `ancient-indian-kingdom-fpv-video`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, nature
- **summary**: A fast-paced FPV drone-style cinematic prompt depicting a mystical Indian kingdom with temples and jungles.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Shushant Lakhyani
- **source license**: CC-BY-4.0
- **source url**: https://x.com/shushant_l/status/2049141805233672529
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/146717bc1b96541c0da02f0ba053b9c3/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
extremely fast-paced cinematic FPV flying through the ancient Indian Dandaka kingdom, dense mystical forests, towering sal and teak trees, tribal settlements, ancient ashrams, sages meditating, wildlife moving through fog, dramatic sunlight rays piercing canopy, rivers cutting through rugged terrain, ruined temples covered in vines, hyper-realistic textures, high-speed aerial dives and sharp turns, immersive depth, volumetric lighting, earthy tones, epic scale, realism, cinematic color grading, smooth stabilization, ultra-detailed environment, intense atmosphere
```

### Animation transfer and camera tracking prompt

- **id**: `animation-transfer-and-camera-tracking-prompt`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: (none)
- **summary**: A technical prompt for Seedance 2.0 that applies a specific motion reference to a character while maintaining fixed camera tracking.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Olivio Sarikas
- **source license**: CC-BY-4.0
- **source url**: https://x.com/OlivioSarikas/status/2049093762077630628
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/089e7cd70d20131d6d1b44741520eaee/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
apply the walking animation of @anim exactly as it is to @char7. the camera tracks the character exactly in place, camera angle does not change
```

### Beat-Synced Outfit Transformation Dance

- **id**: `beat-synced-outfit-transformation-dance`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: fantasy
- **summary**: A prompt for Seedance 2.0 that coordinates a character dance following breakdown frames while performing a beat-synced outfit change.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Kashberg
- **source license**: CC-BY-4.0
- **source url**: https://x.com/Kashberg_0/status/2049074008730247669
- **preview image**: https://pbs.twimg.com/media/HG_FqHJboAA5vAe.jpg

**Prompt text (verbatim):**

```text
Have the character from Image 1 perform the dance based on the breakdown in Image 3. During the performance, include a beat-synced transformation into the character from Image 2. After the transformation, the character from Image 2 continues and completes the remaining dance steps from Image 3. Emphasize precise beat matching with the music
```

### Character Intro Motion Graphics Sequence

- **id**: `character-intro-motion-graphics-sequence`
- **category**: Motion Graphics
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, fantasy, 3d-render
- **summary**: A complex, multi-stage motion graphics prompt for introducing a team of characters with specific UI overlays and transitions, designed for the Seedance 2.0 model.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: KANA
- **source license**: CC-BY-4.0
- **source url**: https://x.com/KanaWorks_AI/status/2049281443956974029
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/d7697b00e2a3cb0ecb91273a772eda39/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Based on the three characters in the reference images. High definition, Unreal Engine rendering, cinematic quality, candy-colored palette, Japanese-style aesthetics, artistic, with strong sense of rhythm.

0–2s: Empty scene, a small dot at the center, thin-line UI frame, subtle particles. Text: “STATUS: STANDBY” “SYSTEM: INIT”.

2–4s: The fox on the left from image2 appears, riding a hovering skateboard, waves toward the camera. Curved motion trails behind. Text: “ID: 01” “CODENAME: RED” “ROLE: TACTICIAN”.

4–6s: The rabbit on the right from image1 appears, swings a carrot weapon and takes a combat stance. Circular motion trails. Text: “ID: 02” “CODENAME: KANA” “ROLE: EXECUTIONER” “WEAPON: CARROT”.

6–8s: The corgi from image3 appears, looks left and right, showing a simple, friendly smile. Concentric circle UI under its feet. Text: “ID: 03” “CODENAME: Arthur” “ROLE: COMMANDER”.

8–15s: The three characters align horizontally, from left to right: FIREBIRD, SAGE, MAD RABBIT. Snap alignment, unified circular platform beneath. Text: “SYSTEM SYNC COMPLETE” “UNIT READY”. Add UI overlay to each character: tracking frames, data bars, simplified charts. Text: “TRACKING” “ANALYSIS” “LOCKED”.

Large title “CHAOS UNIT” appears, breaking into geometric fragments that expand outward. Text: “SYSTEM ERROR” “DATA BREAK”. The fragments then reassemble into “CHAOS UNIT”, centered layout with subtle circular guide lines. Text: “REBUILD COMPLETE” “SYSTEM ONLINE” “KANAWORKS_AI”.

Final frame: “CHAOS UNIT” at the top, the three characters standing side by side below, with a clean circular platform at the bottom. Text: “STATUS: LOCKED” “UNIT: ACTIVE”.
```

### Cinematic Birthday Celebration Sequence

- **id**: `cinematic-birthday-celebration-sequence`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, fantasy, cinematic-romance
- **summary**: A highly detailed multi-shot video prompt for a birthday sequence, focusing on character consistency and emotional storytelling.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Soulful Ai
- **source license**: CC-BY-4.0
- **source url**: https://x.com/soulful__ai/status/2048908956178001993
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/47f113f50f5bd3794cbd83d2bb99320b/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
0s–4s
Close-up of a young girl waking up in a softly lit bedroom, warm golden sunlight through curtains, she gently smiles while checking her phone filled with birthday wishes, natural makeup, SAME facial features as reference image, cinematic lighting, shallow depth of field, ultra-realistic, 4K

4s–8s
Cut to a cozy, beautifully decorated room with balloons and fairy lights, her friends surprise her with a birthday cake, everyone cheering, she laughs happily, SAME face as reference image, joyful expressions, cinematic camera movement, vibrant colors, soft glow, high detail

8s–12s
Her boyfriend enters — a well-dressed young man with neatly styled dark hair, sharp jawline, warm expressive eyes, wearing a clean elegant outfit (white shirt with a fitted blazer), minimal accessories, charming and calm presence ,he presents a beautiful bouquet of fresh flowers, she looks surprised and emotional, soft eye contact, SAME facial features maintained, romantic cinematic tone, warm lighting, slight slow motion, realistic textures, elegant framing

12s–16s
Final scene: she stands surrounded by friends, holding the bouquet and cake, boyfriend beside her smiling softly, candles glowing, she closes her eyes to make a wish, SAME face consistency, cinematic wide shot, dreamy atmosphere, soft bokeh lights, high-end film look
```

### Cinematic Dragon Interaction & Flight

- **id**: `cinematic-dragon-interaction-flight`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, fantasy, action
- **summary**: A detailed storyboard-style prompt for a video featuring a woman's emotional interaction with a dragon followed by a cinematic flight sequence.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: simply
- **source license**: CC-BY-4.0
- **source url**: https://x.com/kingofdairyque/status/2049052738924023976
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/f72b7a26635bdf580a2899bf2682f7f6/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
STYLE Handheld + aerial camera blend Soft motion blur (only during fast transitions) Teal–orange cinematic grade Cool tones during dragon moments, warm tones at emotional peak ⏱ TIMELINE (15s) 0–2s (HOOK) Close-up on woman standing at a cliff Wind moving through hair A giant shadow passes over her → she slowly turns Low rumble builds tension 2–5s (CONNECTION) Dragon lands behind her with heavy presence It lowers its head slowly She hesitates, then touches its face Wind + dust particles react subtly Quiet emotional moment (no aggression) 5–8s (TAKEOFF) She climbs onto its back Dragon launches powerfully into the sky Camera follows upward, slight rotation Clouds rush past, strong sense of speed 8–12s (FLIGHT SEQUENCE) Fast but controlled cuts: Flying through clouds Passing mountain peaks Close-up of wings moving Her expression shifting to awe Wide aerial shot showing scale 12–15s (FINAL MOMENT) Above the clouds in golden light Dragon slows and stabilizes She stands confidently on its back Wide cinematic shot → calm, powerful ending
```

### Cinematic East Asian Woman Hand Dance

- **id**: `cinematic-east-asian-woman-hand-dance`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, action
- **summary**: A highly detailed multi-shot cinematic video prompt for a stylized hand dance, featuring time-coded instructions for camera movement and character actions.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: 阿绎 AYi
- **source license**: CC-BY-4.0
- **source url**: https://x.com/AYi_AInotes/status/2049047545435889883
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/3b2699622675dd4b8b24808a1d7c4a34/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
1 0-3s Extreme close-up of the face, exquisite and three-dimensional features, cold and elegant eyes locked on the lens, sword dance opening pose: hands quickly swipe from both sides of the cheeks to a fixed point in front of the chest, clean fingertip movements. 15-second vertical screen 9:16, 24fps, 8K ultra-high definition, realistic movie texture, stable screen without flicker. Top-tier East Asian young female, exquisite features, delicate and transparent skin with natural luster, clear and bright atmosphere makeup, distinct hair strands. Cold and confident gaze locked on the lens throughout, hands quickly swiping from cheeks to chest, clean sword dance hand gestures, clear fingertip details. Soft ring light, soft facial light and shadow without dead blacks, clear and bright eye light, camera moves forward slightly at a uniform speed, subject always in the center of the frame, first-person interaction, natural color saturation, full of details. Cold impact, strong freeze frame at the first heavy drum beat, hand gestures perfectly match the beat.

2 3-6s Medium close-up of the upper body, showing shoulder and neck lines and smooth arms, core sword dance cutting hand gestures, combined with shoulder rhythmic beats, body swaying slightly left and right, eyes never leaving the lens. Vertical screen 9:16, 24fps, 8K, realistic texture, stable screen. Young woman with smooth and tight body lines, superior shoulder and neck lines, wearing a slim black short top, coherent and smooth movements, core sword dance hand gestures, matching shoulder rhythmic beats, body swaying slightly with the rhythm, eyes always locked on the lens. Warm atmosphere light, distinct levels of light and dark, camera moves horizontally slowly, subject in the center throughout, no distortion, no lag in movement. Sharp beats, rhythmic progression with 3 consecutive light drum beats, each hand movement precisely hitting the beat.

3 6-9s Full-body wide shot, fully displaying superior body proportions and dance rhythm, iconic sword dance double-hand circling + body wave combination, small steps matching the beat, movements stretched and powerful. Vertical screen 9:16, 24fps, 8K, realistic movie texture, stable screen without shaking. Female with superior head-to-body ratio, tight waist and abdominal lines, long legs, wearing slim high-waisted black pants, smooth and coherent movements without lag, iconic sword dance circling + body wave, small footsteps matching the rhythm, stretched and powerful movements. Modern minimalist luxury white background wall, soft top light + side light compensation, rich light and shadow layers, camera slowly and uniformly pulls back, subject remains in the center throughout, no clipping or deformation. Grand and elegant, full of rhythm at the heavy drum burst point, wave movement peak precisely hits the heavy drum.

4 9-12s Local close-up of hands + waist and hips, sword dance fingertip fixed-point details, matching slight waist and hip swaying, highlighting body curves and gesture details, clean and precise movements. Vertical screen 9:16, 24fps, 8K, realistic texture, stable screen. Fingertip detail movements, long and slender fingers, clean and exquisite nails, matching rhythmic waist and hip swaying, tight and smooth waist and abdominal lines, precise and sharp movements. Soft side light outlines the body, camera moves slightly following hand movements, focus always on gestures and body lines, clear picture without blurring. Detailed and high-end texture with consecutive light drum beats, each fingertip movement hitting the beat.

5 12-15s Quick zoom from full body back to upper body + face close-up, sword dance closing pose, eyebrow raise + confident smile, eyes locked on the lens throughout, clean ending. Vertical screen 9:16, 24fps, 8K, realistic movie texture, stable screen without flicker. Top-tier beauty and figure, closing sword dance pose, hands sharply fixed in front of the chest, confident smile, eyes locked on the lens, clean ending. Soft ring light, soft facial light and shadow, camera quickly and uniformly zooms from full body to face close-up, final frame frozen on the face, subject always in the center, no distortion, coherent movement. Explosive ending with full memory points at the last heavy drum beat, pose synchronized with the drum, frozen for 3 frames.
```

### Cinematic Emotional Face Close-up

- **id**: `cinematic-emotional-face-close-up`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: portrait, cinematic, action
- **summary**: A highly detailed technical prompt for Seedance 2.0 focusing on realistic skin textures and a series of complex emotional facial transitions.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Ai Doctor
- **source license**: CC-BY-4.0
- **source url**: https://x.com/DoctorAmna11/status/2049119918755283014
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/4a47ba646e7cedd79363c861864b8714/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
A realistic human face with highly detailed skin texture, pores, and micro-musculature. Scene: Tight portrait close-up against a dark, void-like background. Style: Cinematic realism, 35mm film aesthetic, shallow depth of field with soft bokeh, moody and introspective. Lighting: Dynamic emotional lighting that shifts in color temperature and direction to match the internal state. Audio: Ambient atmospheric drone, soft rhythmic breathing, subtle emotional orchestral swells. Avoid: Identity drift, jitter, distorted limbs, unnatural morphing artifacts. [0-3s] Camera: Slow, imperceptible push-in. Action: The face breaks into a genuine, soft smile; eyes crinkle at the corners and the cheeks lift. Lighting: Warm golden-hour glow, soft and frontal. Vfx: Subtle lens flare. [3-6s] Camera: Static extreme close-up. Action: The smile dissolves into a heavy, downward curve; eyes well up with glistening tears that catch the light, and the lower lip trembles. Lighting: Transition to a cool, melancholy blue wash from above. [6-9s] Camera: Controlled lateral pan. Action: The brow furrows deeply into a sharp V-shape; the jaw clenches visibly, and nostrils flare with rhythmic, heavy breathing. Lighting: Harsh, high-contrast red and orange side-lighting creating deep shadows. [9-12s] Camera: Subtle handheld micro-shake for tension. Action: The eyes snap wide, pupils dilating; the face pales as the muscles go taut, and the mouth hangs slightly open in a shallow gasp. Lighting: Dim, desaturated, flickering low-key light. [12-15s] Camera: Gentle pull-out to a medium close-up. Action: All tension drains from the face; the eyes slowly close, and the features settle into a mask of perfect, serene stillness. Lighting: Soft, diffused white light enveloping the subject like a halo.
```

### Cinematic Marine Biologist Exploration

- **id**: `cinematic-marine-biologist-exploration`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic
- **summary**: A detailed cinematic video prompt for an underwater scene featuring a marine biologist discovering an ancient shipwreck in a coral reef.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: LudovicCreator
- **source license**: CC-BY-4.0
- **source url**: https://x.com/LudovicCreator/status/2049190693550055726
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/4394ac601188eb66755d2c92451665c6/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
A marine biologist in a sleek wetsuit swims through the vibrant coral reefs of the Great Barrier Reef. At the 3-second mark, he dives deeper to approach an ancient shipwreck. The camera follows him as schools of colorful fish dart around. He retrieves a mysterious artifact from the wreck just as a curious shark glides by.
Underwater ruins, coral reef exploration, ancient artifact retrieval, marine life encounter, cinematic underwater lighting, 4K.
```

### Cinematic Music Podcast and Guitar Technique

- **id**: `cinematic-music-podcast-and-guitar-technique`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, cyberpunk, fantasy
- **summary**: An advanced cinematic prompt for generating a 4K music podcast video, with specific focus on guitar technique, pinch harmonics, and studio aesthetics.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: TheYudayVerse
- **source license**: CC-BY-4.0
- **source url**: https://x.com/yuday9909/status/2048949262109880363
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/c4515f4f328539e1ded2cc32f4ce63e7/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
**Cinematic Truth Source & Setup**  
Professional music podcast video production, shot on Sony FX6 cinema camera in 4K DCI, anamorphic lenses with natural breathing and subtle flare, controlled studio lighting using ARRI Skypanels and practical LED backlights, clean broadcast color science with warm highlights and rich mid-tones exactly like high-end Netflix music documentaries. Realistic 24fps motion, light film grain, zero stylization.

** Image Reference & Legend**  
No external image reference supplied. Original generation locked to user character tagged @character on frame 0. Exact black electric guitar (Stratocaster style with whammy bar) must remain 100% consistent in shape, color, and wear. Back wall behind character locked with large professional podcast branding text “StudioName" in bold modern sans-serif font, subtly backlit with soft neon glow. No deviation allowed on character identity @character , guitar model/design/colors, or background text.

** Timeline (Second-by-Second)**  
0-3s: Medium close-up handheld camera on guitarist seated in modern podcast studio, microphone visible stage left. Left hand frets high note on 3rd string while right hand picks aggressively; camera slowly pushes in toward guitar neck. Pinch harmonic executed at 2.2s — thumb edge lightly touches string node creating exact “nguik” squealing overtone with natural string vibration and slight whammy bar dive. Back wall clearly shows large “StudioName” podcast name text. Studio monitors in background show faint reflection of hands.  

3-7s: Cut to tighter ECU on right hand performing rapid pinch-harmonic technique; strings visibly bend and ring with realistic metallic sustain and micro-vibrato. Left hand shifts positions smoothly, forearm muscles tensing naturally. Camera dollies left in slow arc revealing podcast microphone and back wall “StudioName” branding.  

7-11s: Camera pulls back to medium shot as guitarist sustains final high-pitched “nguik” harmonic, letting it feedback naturally through amp. Head nods slightly in time. Background podcast setup with “StudioName” wall text stays in soft focus.  

11-15s: Final wide push-in as guitarist releases note, right hand lifts off strings cleanly, left hand relaxes on fretboard. Guitarist glances toward camera with professional nod. Full back wall “StudioName” podcast branding remains visible. Natural string decay and light body movement throughout.

** Style, Quality Boosters & Negative Prompts**  
Ultra-realistic guitar physics with accurate string tension, pinch-harmonic squeal, and natural sustain; perfect finger synchronization and skin texture; natural motion blur on picking hand; professional color grading with high dynamic range and subtle lens breathing. Strict negatives: no extra limbs, no deformed fingers or hands, no rubbe
```

### Cinematic Route Navigation Guide

- **id**: `cinematic-route-navigation-guide`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, fantasy, action
- **summary**: A structured multi-scene prompt designed for Seedance to create a consistent walking navigation video featuring a recurring tour guide character and smooth transitions between real-world locations.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Michael Guo
- **source license**: CC-BY-4.0
- **source url**: https://x.com/Michaelzsguo/status/2048966649982669053
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/49a08d9ecf7257120711ce6d7b158073/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Create a 5-second cinematic route-guide clip for a walking navigation video.

Continuity:
This is scene {N} of 5 in a route from North Avenue MARTA Station to Coda Tech Square in Atlanta.
The guide is the same stylish female tour guide in every scene: black sunglasses, sleeveless cream belted dress, brown leather belt, tour lanyard, small shoulder bag, brown hair tied back, confident warm expression.
She appears on the sidewalk or plaza only, never in traffic lanes.

Scene role:
{route_step}

Starting frame:
Use the supplied Street View image as the real-world location reference. Preserve the recognizable street layout, building massing, sidewalk direction, signage, and lighting.

Action:
The guide is already in frame, slightly ahead of the viewer. She turns toward the camera, gestures toward the next walking direction, then begins to lead the viewer forward.

Camera:
Smooth handheld walking pace, slight forward push-in, no jumpy zooms, no orbit. Keep horizon stable. The final second should frame the direction of the next scene so the edit can cut naturally.

End frame:
End with the camera facing {next_direction_or_landmark}, with the guide near the edge of frame pointing forward.

Restrictions:
Do not invent a different city, indoor location, parking lot, or tourist group. Do not place the guide in the road. Do not block crosswalks, street signs, building entrances, or the Coda facade.
```

### Cinematic Street Racing Sequence for Seedance 2

- **id**: `cinematic-street-racing-sequence-for-seedance-2`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, cyberpunk, action
- **summary**: A detailed, multi-shot prompt designed for Seedance 2 to generate a cinematic street racing sequence at night, focusing on intense driver focus, dynamic camera work, and explosive acceleration, struct
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Pierrick Chevallier | IA
- **source license**: CC-BY-4.0
- **source url**: https://x.com/CharaspowerAI/status/2039651574297792688
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/3a7fb0a6d706b9f568479bb720ce1ad4/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
cinematic street racing sequence at night, a focused driver inside a high-performance car grips the steering wheel, intense eye focus, city lights reflecting on windshield, tension building before sudden acceleration

camera: rapid multi-angle system with seamless transitions, interior close-up → over-the-shoulder → exterior tracking → low ground shots, ultra dynamic camera movement, whip pans + speed ramp transitions + motion blur masking cuts, continuous flow illusion

(0-2s) interior close-up on driver, hand tightens on gear shift, subtle breathing, dashboard lights glowing
(2-4s) over-the-shoulder shot, road ahead stretching into neon-lit city, engine vibration building
(4-6s) extreme close-up on finger pressing NOS button, instant ignition reaction
(6-8s) explosive acceleration, camera snaps to exterior side tracking shot, car launches forward with violent speed surge
(8-10s) ultra low ground shot near asphalt, wheels spinning at extreme velocity, environment streaking past
(10-12s) high-speed chase through tight streets, sharp turns, camera whip pans between angles, reflections and light trails enhancing speed

Dense urban night environment, wet asphalt reflecting neon lights, tunnel passages, street lights streaking, high-speed city atmosphere
Ultra realistic, fast and furious inspired energy, photorealistic lighting, intense motion blur, high contrast neon reflections, cinematic depth of field, extreme sense of speed, fluid transitions, no distortion, no stretching
```

### Cinematic vampire alley fight sequence

- **id**: `cinematic-vampire-alley-fight-sequence`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, cyberpunk
- **summary**: A comprehensive action prompt for a short film scene involving dynamic camera movements and high-speed combat in a neon-lit alley.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Cortex Visual ・ AI Movies
- **source license**: CC-BY-4.0
- **source url**: https://x.com/Cortex__Visual/status/2049070872426688714
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/e665ecf343c35d97dd64e3b930a96fa5/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Draev stands in the center of the neon-lit alley, surrounded by multiple vampires positioned on rooftops and street level.

The vampires attack simultaneously.
Draev reacts instantly with superhuman speed.

He dodges the first attacker with a fast sidestep and counters with a brutal punch, sending the vampire crashing into a wall.

Second vampire lunges from above Draev jumps unnaturally high, grabs him mid-air, and slams him into the ground.

Impact creates a small shockwave on the wet street.
The defeated vampire rapidly disintegrates into ash and particles.

Camera moves dynamically:
starts frontal wide shot transitions into fast tracking side movement then switches to over-the-shoulder following Draev More vampires rush in.

Draev performs a fast acrobatic kick hitting two enemies at once.

One vampire is thrown into neon signs, sparks and electricity burst.

Another gets grabbed by the throat — Draev lifts him with one hand and crushes him, turning him into ash.
Rain reacts to movement, splashes intensify with impacts.

Final moment:
Draev stands still in the center, surrounded by falling ash, breathing slightly, eyes glowing red.
Remaining vampires hesitate, stepping back in fear. No music
```

### Crimson Horizon Sci-Fi Cinematic Sequence

- **id**: `crimson-horizon-sci-fi-cinematic-sequence`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic
- **summary**: A comprehensive 9-shot cinematic video sequence for a sci-fi film titled 'Crimson Horizon', detailing everything from a rocket launch to an eerie alien encounter on Mars.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: wonder
- **source license**: CC-BY-4.0
- **source url**: https://x.com/WonderBoy023/status/2049086862858367347
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/ff7d9d956d3e812f4f99cf99e0552382/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
SHOT 1: Cinematic wide angle format — rocket launching into night sky, city lights below, clouds parting, stars above. Dark, dramatic, photorealistic.

SHOT 2: Medium two-shot format — man and woman in astronaut suits inside a dark capsule, Mars glowing red through the porthole behind them. Cinematic, intimate.

SHOT 3: Dramatic aerial format — descent capsule burning through Mars atmosphere, heat shield glowing orange, red desert surface rushing up below. Hyperrealistic.

SHOT 4: Ultra wide low angle format — two astronauts standing with backs to camera on Mars surface, vast red desert and amber sky stretching before them. Empty, eerie.

SHOT 5: Extreme close-up format — female astronaut's gloved hand tracing ancient carved symbols on a canyon wall, helmet lamp lighting the carvings, her eyes wide with fear.

SHOT 6: Tight close-up format — male astronaut's arm display glowing red reading "UNKNOWN", a massive dark shape looming behind him in the dust haze. Tense, cinematic.

SHOT 7: Extreme wide format — colossal dark horned creature emerging from a dust storm, violet glowing eyes, two tiny astronauts dwarfed at the bottom of the frame. Cinematic horror.

SHOT 8: Locked macro format — creature's enormous purple glowing eye filling the entire frame, two astronaut silhouettes reflected in the iris. Pure black background. Photorealistic.

SHOT 9: Title card format — pure black background, bold cracked text reads CRIMSON HORIZON, tagline below: "They came searching for life. Life was already waiting."
```

### Cyberpunk Game Trailer Script

- **id**: `cyberpunk-game-trailer-script`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, cyberpunk, 3d-render
- **summary**: An extensive video generation prompt for a cyberpunk game trailer, detailing character design, UI animations, and environmental transitions from a white void to a favela.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Larus Canus
- **source license**: CC-BY-4.0
- **source url**: https://x.com/MrLarus/status/2049004278908330226
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/b6af40bfbe9ab029c5385fe3cdcf2893/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
INK INDUSTRIES : GAME TRAILER
CHARACTERYoung athletic male, dark curly hair, shirtless, full chest and back tattoos, gold hoop earring, cigarette in mouth, black cybernetic prosthetic arms with cyan LED nodes at joints. Black shorts with white stripe, white socks, beige chunky sneakers. Seated cross-legged on white void floor.
CINEMATIC SETUPOpens on clean white void environment with minimal game UI. Camera high angle looking down at character. Hyper-realistic CGI rendering, clean white background transitioning to dense cyberpunk favela environment.
SEQUENCE [0s–15s]
[0s–2s] High angle shot looking down. Character seated on white floor, looking up at camera with cigarette smoke rising. Game menu UI on left: START NEW GAME, CONTINUE highlighted, SETTINGS, EXIT GAME. Player profile top right showing INK_NOMAD LVL 23. A cursor clicks CONTINUE. The button pulses. Subtle bass hit.
[2s–4s] Smooth zoom-in toward his left arm. UI panels slide in from left LEFT ARM EQUIPMENT panel appears. Selection highlights PHANTOM GRIP, then slides to CHRONOS CLAW. His left hand mechanically reconfigures fingers split apart, new claw-like digits lock into place, cyan LEDs pulse brighter. Stats bars animate on right panel. Servo click sounds.
[4s–7s] Camera orbits smoothly around to his right side. New UI slides in ARMAMENT CUSTOMIZATION grid showing HAND, FOREARM, ELBOW, UPPER ARM components. Selection cycles through parts rapidly. His right arm disassembles section by section forearm plates detach, new plating slides on, elbow joint swaps, hand reconfigures with exposed wiring and pistons visible mid-swap. Each component locks with a mechanical snap. Tech Points counter ticks up.
[7s–8.5s] Camera pulls back to medium shot. CONFIRM CONFIG button pulses. Click. All UI panels collapse inward. Character uncrosses legs, shifts position, now sitting relaxed, one knee up, cybernetic hand bringing cigarette to mouth. Smoke curls.
[8.5s–10s] LOADING bar appears at bottom. Fills rapidly 0 to 100%. White environment begins darkening shadows creep in from edges, warm golden light bleeds through. The white void dissolves like fog burning off. Character starts standing up in one fluid motion.
[10s–15s] Full environment loads around him as he rises to his feet. Dense cyberpunk favela materializes, neon signs flickering on, wet streets reflecting light, crowds populating, motorcycles, tangled power lines, stacked buildings climbing toward futuristic skyscrapers in the distance. Camera settles into third-person view behind him, showing his full tattooed back. HUD elements fade in, minimap top left, health bar, ammo counter bottom right. Quest marker appears. He takes a step forward into the street, puddle splashing under his shoe. Golden hour light cuts through the alley. Ambient city noise floods in, chatter, distant music, neon buzz.
STYLEHyper-realistic CGI. White void sections: clean, mini
```

### Forbidden City Cat Satire

- **id**: `forbidden-city-cat-satire`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: action
- **summary**: A complex dark comedy prompt for Seedance 2.0 featuring an orange cat official and a hyena emperor in a satirical Qing dynasty setting.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: The Anxious Mind
- **source license**: CC-BY-4.0
- **source url**: https://x.com/drjoetw/status/2048996625654354333
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/0279a674ce138ab5a0a6f020a7273d89/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
STORY FORMAT: 15s / 150 BPM / MULTI-CUT / American dark comedy with exaggerated imperial satire / slapstick timing and punchline ending
TONE: tense accusation → rising absurdity → chaotic reveal → shameless comedic payoff
SETTING: Grand hall of the Forbidden City, massive golden throne room, rich red and gold tones, dramatic lighting, echoing atmosphere, ceremonial yet absurd
CHARACTERS:
Orange cat official: wearing Qing dynasty court robes and an official hat, a long orange queue braid trailing behind, belly comically round as if hiding something, cautious and visibly nervous
Hyena emperor: dressed in extravagant Qing imperial robes with a golden crown, domineering presence, easily irritated, dramatic temper
White rabbit maids: wearing Qing palace maid outfits, purple eyeshadow, bright red lips, each holding feather fans, fanning the emperor in synchronized rhythm
Gray rabbit guards: standing on both sides of the hall, stern expressions, wearing palace guard uniforms, holding long wooden staffs
CAMERA STYLE: dramatic push-ins, snap zooms, symmetrical wide shots, rapid reaction cuts, exaggerated sound cues, slight handheld shake for comedic tension
SCENE
0–2s
Wide symmetrical shot: The massive throne hall
The hyena emperor sits high on the throne, being fanned by rows of white rabbit maids
A plate of apples rests beside him
Guards line both sides like statues
The orange cat carefully walks in, tiny footsteps echoing loudly
2–4s
Sudden snap zoom to emperor
Hyena SLAMS armrest
Hyena (furious):
“Speak! Why did you sneak into the imperial harem?!”
Echo effect fills the hall
4–6s
Cut to orange cat
He instantly drops to his knees, trembling
Orange cat (panicked):
“I heard someone screaming for help!”
6–7s
Beat
Cut to emperor’s face slowly twisting in rage
Hyena (shouting):
“That is an obvious lie!”
7–8s
In one swift motion, he grabs an apple and HURLS it
Sound: WHOOSH
8–9s
Slow motion: apple flying through the air
Orange cat’s eyes widen
He suddenly raises one hand
SNATCHES it cleanly
Perfect catch
9–11s
Silence
Everyone freezes
Then
Orange cat awkwardly smiles
He slowly reaches inside his robe
11–13s
He pulls out
A PARROT
The parrot flaps slightly, completely alive
Parrot (loud, repetitive):
“Help! Help! Help!”
Beat
13–15s FINAL PAYOFF
Cut to wide shot
The entire hall ERUPTS in laughter
White rabbit maids bend over laughing, fans shaking
Gray guards struggle to stay serious but break
Even the emperor leans back laughing uncontrollably
Hyena (laughing hard):
“You smuggled THAT into the harem?!”
Orange cat turns to camera, dead serious
Orange cat:
“I told you… I wasn’t lying.”
Freeze-frame energy
Background laughter echoes as the scene ends
```

### Hollywood Haute Couture Fantasy Video Prompt

- **id**: `hollywood-haute-couture-fantasy-video-prompt`
- **category**: VFX / Fantasy
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, fantasy, 3d-render
- **summary**: A detailed, multi-scene video generation prompt for Seedance 2.0, designed to create a Hollywood Haute Couture Fantasy film. The prompt specifies style, resolution (8K), rendering engine (Unreal Engin
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: John
- **source license**: CC-BY-4.0
- **source url**: https://x.com/johnAGI168/status/2025849650654122348
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/e066fab457509bc6809ea212ae5d6a51/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
[Style] Hollywood Haute Couture Fantasy blockbuster, 8K ultra-clear, Photorealistic, High-fashion Editorial Style, Unreal Engine 5 fluid rendering, visual illusion. [Duration] 15 seconds. [Scene] An endless, real-life Salar de Uyuni (Sky Mirror) salt flat. The sky is filled with oppressive dark clouds, and the ground perfectly reflects everything like a mirror, with the overall picture presenting a minimalist, cool tone. [00:00-00:05] Shot 1: Haute Couture Entrance and Porcelain Skin. Camera position: Extremely low-angle upward shot, ultra-telephoto lens zoom-in. Action: An Asian female model with a highly recognizable, high-fashion face walks coolly on the water surface. Effect: She is wearing not fabric, but a long dress made of flowing, real Liquid Blue-and-White Porcelain. As she walks, the skirt makes a crisp collision sound like real ceramic, with a flowing luster on the surface. The traditional blue-and-white patterns move across the white porcelain-textured skirt as if alive. [00:05-00:10] Shot 2: Physical Shattering and Ink-wash Descent. Camera position: Extreme close-up of the face, focus rapidly pulls back. Action: The model suddenly stops, stares coldly at the camera, and snaps her fingers crisply. Effect: The moment the fingers snap, her blue-and-white porcelain dress does not fall, but instantly explodes into thousands of extremely photorealistic Ink-wash Swallows. These swallows carry real water droplets and ink marks, dragging black fluid afterimages in the air, spinning frantically around her. [00:10-00:15] Shot 3: Dimensional Dissolution and Abyss Reflection. Camera position: High-altitude overhead shot, camera rapidly rotates and descends. Action: The swarm of ink-wash swallows plunges into the mirrored lake water beneath the model's feet. Effect: The surface tension of the originally solid salt lake instantly disappears. The entire extremely realistic world begins to violently bleed and dissolve like concentrated ink dropped into clear water. The real dark clouds and the model's figure transform entirely into an extremely grand 3D Fluid Ink Vortex, completely swallowing the camera into a black and white interwoven abyss.
```

### Hunched Character Animation

- **id**: `hunched-character-animation`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: (none)
- **summary**: Instruction for Seedance 2 to create an in-place walking animation for a specific character reference.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Olivio Sarikas
- **source license**: CC-BY-4.0
- **source url**: https://x.com/OlivioSarikas/status/2049093747011670042
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/d3d5dcaf102414a8cceca23d60b5c0d0/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
create a walking animation for this hunched over character. the character stays in place
```

### HyperFrames: 12-Second App Showcase — Three Floating Phones

- **id**: `hyperframes-app-showcase-three-phones`
- **category**: Product
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, app-showcase, product, 3d, mobile
- **summary**: A 12-second 16:9 app showcase composition — three floating iPhone screens hover in 3D space, each rotating in turn to surface a different feature, beat-synced label callouts, end logo lockup. Built directly on the HyperFrames `app-showcase` catalog block.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/app-showcase
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/app-showcase.png

**Prompt text (verbatim):**

```text
Build a 12-second HyperFrames app-showcase composition (1920×1080, 30fps) with three floating iPhone screens, each highlighting a feature of a fictional fitness app. Pull `npx hyperframes add app-showcase`, `npx hyperframes add ui-3d-reveal`, `npx hyperframes add shimmer-sweep`, and `npx hyperframes add logo-outro`.

Visual identity: warm canvas #fff5e8, ink text #1a1410, single hot accent #ff5e3a, secondary teal #2bbab2 used only on the active feature pill. Display: "General Sans" 88px for the headline; body "Inter" 24px; mono on the in-app data labels.

The three phones (left, center, right) carry these screens — render each as a sub-composition under `screens/`:
1. Left phone — workout summary card (3 rings, distance / pace / heart-rate).
2. Center phone — live activity timer (large MM:SS counter, tabular-nums), pause / resume buttons.
3. Right phone — weekly streak grid (7 cells × 4 rows, the active week glowing).

Animation (12s total):
• 0–1.0s — headline "YOUR WEEK, IN MOTION" rises from y=50 → 0 over 0.7s ease expo.out at the top of the canvas. A hairline rule wipes in below it.
• 0.6–2.0s — the three phones fly in via ui-3d-reveal: left from x=-260 + rotateY=-20°, right from x=+260 + rotateY=+20°, center from z=-300, all easing expo.out 1.4s, staggered 180ms.
• 2.0–4.0s — left phone front-facing: rotateY tweens to 0°, scale to 1.04 over 0.6s, then a label callout "workout summary" types in to its left over 0.4s. Hold 1s. Then phone returns to its idle 3D pose.
• 4.0–6.0s — center phone takes over with the same beat (label callout "live activity").
• 6.0–8.0s — right phone takes over (label callout "streaks").
• 8.0–10.0s — all three phones reset to idle, gently bobbing on a sin wave (deterministic, finite repeats — calculate cycles from the 2.0s window).
• 10.0–12.0s — logo-outro fires in the bottom-right corner with a final shimmer-sweep across the headline.

Non-negotiables: deterministic only; entrance-only animations; phones use a non-timed wrapper `<div>` if you nest video screens — never put video directly inside a timed clip; no `repeat: -1` (compute exact cycle count); min 24px on label callouts; all timelines paused:true; root data-duration=12. Run `npx hyperframes inspect --samples 12` to catch label overlap with phones.

Output: `app-showcase-12s.mp4`.
```

### HyperFrames: 30-Second Brand Sizzle Reel

- **id**: `hyperframes-brand-sizzle-reel`
- **category**: Marketing
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, sizzle, kinetic-typography, audio-reactive, brand
- **summary**: A 30-second 16:9 HyperFrames sizzle reel — fast cuts, beat-synced kinetic typography, audio-reactive scale on display words, shader transitions between five scenes, end-card with logo bloom. Modelled on the aisoc-hype archetype from the student kit.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://x.com/HeyGen/status/2044827454460871072
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/logo-outro.png

**Prompt text (verbatim):**

```text
Build a 30-second HyperFrames sizzle reel (1920×1080, 30fps) — five scenes hammered to a tempo, beat-synced display words, restrained color, one logo outro. The audio is a 90 BPM bed track (`bed.mp3`) — every scene cut and major pop lands on a beat (every 666ms). Use the audio-reactive reference for amplitude-driven scale, and pull `npx hyperframes add flash-through-white`, `npx hyperframes add cinematic-zoom`, `npx hyperframes add chromatic-radial-split`, `npx hyperframes add logo-outro`.

Visual identity: ink canvas #0a0a0a, single jewel accent #f0c14b, off-white #f7f3e8. Display: "Druk Wide" 220px (or "Anton") for one-word scenes; body "Inter" 28px; tabular-nums on any number scene.

Scene 1 (0–6s) WHO — full-bleed display word "BUILD" centered, scales 0.92→1 ease expo.out 0.5s on the first beat (beat 1, t=0.0s), then audio-amplitude reacts on every beat with a +2% scale pop (use audio-reactive: map 0–80Hz amplitude → scale, dampened). At 4s the kicker line "a film about shipping" fades in below at 36px. Transition at 6.0s → flash-through-white, 0.4s.

Scene 2 (6.4–12s) WHAT — three quick cuts inside the scene of static product photography (img clips), each 1.8s, with x-axis whip-pan transitions between them (`whip-pan` shader, 0.25s each). Caption mode: a single mono line at the bottom changes per cut.
Transition at 12.0s → chromatic-radial-split, 0.5s.

Scene 3 (12.5–18.5s) STATS — three numbers, each in a dedicated 2s slot, animated with apple-money-count-style counters (use the catalog block as reference). 0 → 12k, 0 → 4.2×, 0 → $1.4M. Tabular-nums forced.
Transition at 18.5s → cinematic-zoom, 0.5s.

Scene 4 (19.0–25.0s) PEOPLE — three back-to-back testimonial pull-quotes typeset like NYT, each 2s, with a left hairline rule extending in from y=0 over 0.4s before the quote types in via a clip-path reveal.
Transition at 25.0s → flash-through-white, 0.3s.

Scene 5 (25.3–30s) END-CARD — logo-outro block: wordmark piece-by-piece assembly over 1.4s with #f0c14b bloom; one-line CTA fades in at 28.5s; hold to 30s.

Non-negotiables: every cut on a beat, no orphan motion; min 60px headlines; entrance-only (transitions handle exits); deterministic; all timelines paused:true; root data-duration=30. Run lint/validate/inspect. Output: `brand-sizzle-30s.mp4`.
```

### HyperFrames: Animated Bar-Chart Race (NYT-style)

- **id**: `hyperframes-data-bar-chart-race`
- **category**: Data
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, data-viz, chart, infographic, editorial
- **summary**: A 12-second 16:9 data infographic — animated bar + line chart with staggered category reveal, NYT-style serif headline, footnote source, kinetic value labels. Built directly on the HyperFrames `data-chart` catalog block.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/data-chart
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/data-chart.png

**Prompt text (verbatim):**

```text
Build a 12-second HyperFrames data composition (1920×1080, 30fps) showing a 6-bar animated bar-chart race with a NYT-style headline. Pull the catalog block first: `npx hyperframes add data-chart`. Use it as the render surface and override the data via a small JSON inline.

Dataset (provide inline; choose the topic from the user's brief or default to AI labs market share):
• Anthropic — 28%
• OpenAI — 31%
• Google — 18%
• xAI — 9%
• Meta — 8%
• Other — 6%

Visual identity: cream canvas #f5efe4, ink text #161312, single rust accent #b14a2c on the active/leading bar only, hairline rules in #b3a692. Display headline: "Editorial New" or "Tiempos Headline" 84px; deck face "Inter" 22px tracked +1%; mono "JetBrains Mono" 16px for value labels with `font-variant-numeric: tabular-nums`.

Layout:
• Top 18% of canvas — headline (one line, max 64 chars) + a 16px-high deck line below, separated by a hairline rule.
• Middle 64% — the data-chart block, padded 120px left / 80px right.
• Bottom 18% — source line (small caps, tracked +6%) like "source · sec filings · may 2026" and a kinetic ticking timestamp counter (0 → "may 1 2026" using apple-money-count-style logic on a date string is wrong — instead do a clean fade-in at 11.0s).

Animation (12s total):
• 0–0.4s — page hairline rule wipes in from left, ease power3.out.
• 0.3–1.2s — headline rises from y=40 → 0 over 0.7s ease expo.out, then deck line fades in at 0.9s over 0.4s.
• 1.2–9.0s — data-chart block runs its built-in stagger: each bar grows from width 0 → final value over 1.4s, ease power2.out, staggered 180ms per bar; value labels count up tabular-nums at the same easing; the leading bar (`#b14a2c`) gets a 4% scale pulse on landing.
• 9.5–11.5s — annotation callout pointing at the leader: a 360px box with a one-line analysis ("Anthropic narrowed the gap to 3 points") fades + slides in from x=40 over 0.5s.
• 11.5–12s — final hold. Source line fades in. No exit animations (this is the only scene).

Non-negotiables: tabular-nums on every digit; min 16px on data labels; deterministic; entrance-only; all timelines paused:true; root data-duration=12. Run `npx hyperframes inspect --at 1.5,5,9,11.5` to catch any value-label overflow.

Output: `data-chart-race-12s.mp4`.
```

### HyperFrames: Apple-Style Flight Map (Origin → Destination)

- **id**: `hyperframes-flight-map-route`
- **category**: Travel
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, map, travel, route, cinematic
- **summary**: An 8-second 16:9 cinematic flight-route map — realistic terrain zoom, animated plane gliding from origin to destination along a curved path, labelled cities, kinetic distance counter. Built directly on the HyperFrames `nyc-paris-flight` catalog block, repurposable for any city pair.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/nyc-paris-flight
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/nyc-paris-flight.png

**Prompt text (verbatim):**

```text
Build an 8-second HyperFrames cinematic flight-map (1920×1080, 30fps) showing a plane traveling between two named cities. Pull `npx hyperframes add nyc-paris-flight` and override the two endpoint coordinates plus city labels with the user's chosen pair (default: New York → Paris, ~5,837 km).

Visual identity: dark map canvas #0a0e1a (Apple Maps dark style), warm route accent #ffb76b, off-white labels #f5f1ea, secondary slate #7da4ff for distance / coordinate text. Display: "Inter" 64px for city names; mono "JetBrains Mono" 18px for coordinates; tabular-nums forced on the distance counter.

Animation (8s total):
• 0–1.2s — globe / map zooms in from a wide world view to a regional view spanning both cities, ease expo.inOut, with a slight rotation correction. Use the catalog block's built-in zoom hook.
• 1.0–1.8s — origin city label fades in at the origin marker, x-axis offset 0, opacity 0→1 + scale 0.92→1 ease power3.out 0.6s. The marker (a 14px ring + 4px dot in #ffb76b) pulses scale 1→1.18→1 over 1.0s ease sine.inOut.
• 1.8–6.0s — the route arc draws progressively from origin to destination using stroke-dashoffset on an SVG path, 4.0s ease power2.inOut. The plane icon (small 36px svg) rides the path with motionPath, rotating to match the bearing. A small cluster of "distance traveled" text in tabular-nums counts up below the plane: 0 → 5,837 km.
• 5.5–6.5s — destination city label fades in at the destination marker on landing, same pattern as origin.
• 6.5–8.0s — final hold. The full route + both labels remain on screen. A small footer line "flight time · 7h 42m" fades in at 7.0s. No exit animations.

Non-negotiables: tabular-nums on the distance readout; min 16px on coordinate labels; deterministic only (no Math.random for plane jitter — use a seeded mulberry32 if you need any noise); entrance-only; all timelines paused:true; root data-duration=8.

Quality: run `npx hyperframes inspect --at 1.5,3,5.5,7.5` to confirm both labels fit inside the canvas, then dispatch render. Output: `flight-route-{origin}-{destination}.mp4`.
```

### HyperFrames HTML-in-Canvas: 3D iPhone + MacBook Product Demo

- **id**: `hyperframes-html-in-canvas-iphone-device`
- **category**: VFX / HTML-in-Canvas
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, html-in-canvas, 3d, iphone, macbook, product-demo
- **summary**: A 15-second product demo where a real GLTF iPhone 15 Pro Max and MacBook Pro float on a clean stage with the actual app UI rendering live on their screens via drawElementImage. Morphing glass lens flare + 360° turntable. Built on the vfx-iphone-device catalog block.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/blocks/vfx-iphone-device
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/vfx-iphone-device.png

**Prompt text (verbatim):**

```text
Build a 15-second HyperFrames composition (1920×1080, 30fps) titled "device-product-demo". Pull the catalog block first: `npx hyperframes add vfx-iphone-device`. The block ships the iPhone and MacBook GLTFs plus screen-content placeholders.

Visual identity: ultra-clean studio canvas with a vertical gradient #f7f8fb → #eaecf2, single primary brand color the user supplies (default #4f46e5), muted ink #0f172a for type. Display face: "Söhne Halbfett" 96px for the headline; body "Inter Tight" 28px (for video sizing); mono "JetBrains Mono" 20px on UI bits. Subtle floor-shadow blob beneath each device.

Replace the block's two screen placeholders with the user's actual product surfaces:
• `mobile-screen` — a `<canvas layoutsubtree width="1170" height="2532">` containing the real iOS app UI as DOM (status bar, large title, primary list, bottom tab bar). Use real semantic HTML and CSS so the captured texture is pixel-perfect.
• `desktop-screen` — a `<canvas layoutsubtree width="2880" height="1800">` containing the macOS app UI (sidebar, main pane, command palette overlay).

Timeline (paused: true, registered window.__timelines.main, data-duration=15):

0.0–4.5s ENTRY — both devices fly in: iPhone from camera-left (x:-600, rotateY:35°→0°, scale 0.85→1.0, ease expo.out 1.1s), MacBook from camera-right with a 0.25s stagger (x:+800, rotateY:-28°→0°, ease expo.out 1.2s). Headline "Your work. Anywhere." types in via `gsap.from(".headline", { y: 60, opacity: 0, duration: 0.7, ease: 'power3.out' }, 1.0)`. Subhead at 1.6s.

4.5–10.5s TURNTABLE — both devices rotate slowly +18° on Y in lock-step (ease sine.inOut). Re-blit `drawElementImage` every frame so the captured screen content stays sharp under the moving normal map. Add the morphing glass-lens flare overlay (block-supplied) sweeping camera-left to camera-right between 6.0s–9.5s. At 7.5s, animate one in-app interaction inside `mobile-screen` (a list item slides in, then a checkmark scales 0→1) — the texture re-capture picks this up automatically.

10.5–15.0s OUTRO — devices ease back to neutral (rotateY 0°, x 0). Headline morphs to a single CTA line "download today" with marker-sweep highlight using `references/css-patterns.md`. Final 0.6s holds the hero frame — no opacity-to-0 exits.

Feature detection: gracefully fall back to flat 2D screenshots on browsers without `drawElementImage`. The renderer enables the flag automatically; Studio preview without it must not be black.

Non-negotiables: GLTF assets stay at the block's default paths (`models/iphone.glb`, `models/macbook.glb`); only swap the screen DOM content, not the model URIs. Deterministic — no Math.random / Date.now, no `repeat: -1`. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 10 --at 1,3,5,7.5,10,13` before render. Output: `device-product-demo.mp4`.
```

### HyperFrames HTML-in-Canvas: Liquid Background Hero

- **id**: `hyperframes-html-in-canvas-liquid-background`
- **category**: VFX / HTML-in-Canvas
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, html-in-canvas, liquid, displacement, hero
- **summary**: A 12-second hero with HTML content floating above an organic liquid surface — vertex-displaced subdivided plane, real-time wave dynamics, captured DOM rides on top crisp and readable. Built on the vfx-liquid-background catalog block.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/blocks/vfx-liquid-background
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/vfx-liquid-background.png

**Prompt text (verbatim):**

```text
Build a 12-second HyperFrames composition (1920×1080, 30fps) titled "liquid-background-hero". Pull the catalog block first: `npx hyperframes add vfx-liquid-background`.

Visual identity: oceanic canvas — base #0a1f2c flowing into accent #1cd6c4 and secondary #4a7dff for the liquid surface, off-white type #f6fbff for the floating HTML. Display face: "PP Right Grotesk" Compact Bold 156px; body "PP Right Grotesk" Regular 26px; numerals tabular. The liquid is the painting; the type is the subtitle.

Layer A — `liquid` (background): the vfx-liquid-background WebGL canvas with the block's default subdivided plane, vertex displacement amplitude 0.18, wave speed 0.42, two superposed wave functions (period 1.6s and 4.2s) for organic motion. Color gradient flows base → accent → secondary across the surface, deterministic phase from `seed = mulberry32(2046)`.

Layer B — `hero-content`: a `<canvas layoutsubtree width="1920" height="1080">` containing centered DOM — a single hero headline ("every drop, accounted for"), a one-line subhead ("realtime water analytics across 412 sensors"), a small numeric ticker ("412" tabular-nums) that increments slightly over the composition. Captured every frame and composited above the liquid layer with mix-blend-mode normal at z-index 2.

Timeline (paused: true, window.__timelines.main, data-duration=12):

0.0–2.0s ENTRY — liquid plane starts flat (displacement amplitude 0 → 0.18 over 1.8s ease expo.out), color flow ramps from monochrome → full gradient over 1.6s. Hero content fades in at 0.6s (`gsap.from('.headline', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' })`, subhead at 1.0s with y:30, ticker at 1.4s scale 0.9 → 1.0).

2.0–9.5s FLOAT — full motion. Liquid waves continue indefinitely-but-finitely (calculate exact repeat count from data-duration / cycle so the timeline never uses `repeat: -1`). Ticker counts 412 → 437 over 7.5s ease none, tabular-nums on every digit. At 5.0s, a gentle highlight sweep crosses the hero headline (use `references/css-patterns.md` marker sweep). At 7.0s, a soft caustic flicker on the liquid layer (deterministic seeded brightness pulse).

9.5–12.0s SETTLE — wave amplitude tapers 0.18 → 0.10, color flow slows. Hero content holds. Final 0.6s holds the hero frame; no opacity-to-0 exits except optionally a 0.3s liquid-only opacity fade if the user is chaining it before another scene.

Feature detection: if `drawElementImage` is unavailable, layer the hero DOM directly on a static gradient backdrop (#0a1f2c → #1cd6c4 radial-gradient) without the liquid shader. Never show a black canvas.

Non-negotiables: deterministic seeds, no `repeat: -1` (use Math.ceil-based finite repeats), no async timeline construction, min font 60px on headline, 24px on subhead, tabular-nums on the ticker. The liquid timeline and the hero-content timeline both register on `window.__timelines.main` — do not split into sub-compositions unless the user asks for it. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 10 --at 0.5,2,4,6,8,11` before render. Output: `liquid-background-hero.mp4`.
```

### HyperFrames HTML-in-Canvas: Liquid Glass Landing Reveal

- **id**: `hyperframes-html-in-canvas-liquid-glass`
- **category**: VFX / HTML-in-Canvas
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, html-in-canvas, liquid-glass, webgl, product-promo
- **summary**: A 20-second voronoi liquid-glass reveal of a real product landing page — DOM is captured live via drawElementImage, shattered into refracting glass cells, then settles into a clean hero shot. Built on the vfx-liquid-glass catalog block.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/blocks/vfx-liquid-glass
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/vfx-liquid-glass.png

**Prompt text (verbatim):**

```text
Build a 20-second HyperFrames composition (1920×1080, 30fps) titled "liquid-glass-landing-reveal". Pull the catalog block first: `npx hyperframes add vfx-liquid-glass` (or `npx hyperframes add html-in-canvas` to grab the full set).

Visual identity: deep-space canvas #0a0d14, single warm accent #ff8a4c for refraction tint, secondary cool #6cf3c0 for chromatic edge highlights, off-white text #f5f7fa. Display face: "Migra" 140px for the headline; body "Söhne" 24px; mono "JetBrains Mono" 18px. Tabular-nums on any numerals.

Two nested compositions:

1. `landing-source` — a `<canvas layoutsubtree width="1920" height="1080">` containing the actual product landing-page DOM: a tall hero ("Ship faster. Stay calm."), a 3-column feature grid with rounded cards using `backdrop-filter: blur(24px)`, a soft radial accent glow behind the headline, and a CTA pill ("start free"). Real CSS, real web fonts — this gets captured live by the WebGL pass.
2. `theater` — the WebGL canvas that runs the vfx-liquid-glass shader on the captured texture.

Timeline (single root composition, paused: true, registered as window.__timelines.main, data-duration=20):

0.0–6.0s ENTRY — voronoi cells start fully fractured at scale 1.6, opacity 0.2, with strong chromatic aberration (0.04 offset). Easing: expo.out. Cells coalesce inward, refraction strength tapers from 1.0 → 0.18, parallax reveals the underlying landing-page shot.

6.0–13.5s SETTLE — full landing page resolves crisp behind a thin glass sheen. Add a slow lateral parallax (drift the texture x by 24px over 7s, ease sine.inOut). Tween a subtle highlight sweep across the hero using the `shimmer-sweep` component at 9.0s.

13.5–20.0s OUTRO — gentle re-fracture: refraction strength 0.18 → 0.42, voronoi scale 1.0 → 1.08, slight rotation 0 → -2deg, opacity hold. Final 0.6s fades the entire theater canvas to black via the root container only — never animate the source DOM out.

Feature detection (mandatory): inside the theater script tag, before instantiating Three.js, check `('layoutSubtree' in document.createElement('canvas')) && typeof CanvasRenderingContext2D.prototype.drawElementImage === 'function'`. If false, hide the theater canvas and let the source DOM display directly — the rendered MP4 always has the flag enabled, but Studio preview without it must not show black.

Non-negotiables: deterministic motion (seeded mulberry32 if any noise needed), no Math.random / Date.now, no `repeat: -1`, no async timeline construction. All entrances via `gsap.from()` against the hero CSS layout. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 12 --at 2,4,6,9,13,17` before render. Output: `liquid-glass-landing-reveal.mp4`.
```

### HyperFrames HTML-in-Canvas: Magnetic Field Visualisation

- **id**: `hyperframes-html-in-canvas-magnetic`
- **category**: VFX / HTML-in-Canvas
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, html-in-canvas, magnetic, particles, data
- **summary**: A 15-second magnetic-field particle visualisation reacting to a live DOM heatmap or chart — particles trace field lines that bend around the captured HTML, ideal for ML/data products. Built on the vfx-magnetic catalog block.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/blocks/vfx-magnetic
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/vfx-magnetic.png

**Prompt text (verbatim):**

```text
Build a 15-second HyperFrames composition (1920×1080, 30fps) titled "magnetic-field-data". Pull the catalog block first: `npx hyperframes add vfx-magnetic`.

Visual identity: graphite canvas #0a0c11, single primary particle color #ff6a00 with a cool secondary #38e6ff for opposing-pole particles, off-white text #eef2f7. Display face: "PP Neue Machina" 124px Plain Ultrabold; body "PP Mondwest" Regular 24px; mono "Berkeley Mono" 18px on labels. Tabular-nums on every numeral.

Layer A — `field-source`: a `<canvas layoutsubtree width="1920" height="1080">` containing real DOM that drives the magnetic field — a centered chart card (760×520px) with a live SVG line chart (12 data points, animated path), two KPI labels above ("signal strength" 0.84 and "coverage" 92%), and a small mono caption beneath ("polling 412 nodes · realtime"). The chart card acts as the magnetic source — particles repel from its bounds, attract toward dipole anchors at the chart's two endpoints.

Layer B — `theater`: WebGL canvas running the vfx-magnetic shader. Particle count 1800, deterministic spawn seeded mulberry32(91347), spawn distribution rim-biased so the field lines read clearly. Two opposing dipoles at the chart's first and last data points sample the captured DOM bounds every frame so the field re-flows when the chart line animates.

Timeline (paused: true, window.__timelines.main, data-duration=15):

0.0–2.4s ENTRY — particles spawn invisible, opacity ramps 0 → 0.85 over 2.0s ease expo.out. Field strength 0 → 1.0 ease power3.out 1.6s. Chart card fades in at 0.4s (`gsap.from('.chart-card', { y: 60, opacity: 0, scale: 0.96, duration: 0.9, ease: 'power3.out' })`). KPI labels stagger in at 0.9s and 1.2s (200ms apart, y:30 → 0).

2.4–10.0s FLOW — particles trace field lines. Chart line animates over 6.0s (`gsap.from('.chart-line', { strokeDashoffset: pathLength, duration: 6.0, ease: 'sine.inOut' })`); the captured-DOM resampling means particles bend around the moving chart line in real time. KPI numerals tick: signal strength 0.84 → 0.91, coverage 92% → 96%, both ease none. At 6.0s, brief field-strength pulse from 1.0 → 1.4 → 1.0 over 0.5s; particles speed up correspondingly.

10.0–13.5s STATEMENT — headline appears ("see the field, not the dots") with marker-sweep highlight from `references/css-patterns.md` at 10.4s. Particles dim slightly (opacity 0.85 → 0.55) so the headline reads cleanly above them.

13.5–15.0s SETTLE — field strength tapers 1.0 → 0.6, particle speed halves, ambient drift only. Final 0.6s holds the hero frame. No opacity-to-0 exits.

Feature detection: if `drawElementImage` is unavailable, render the chart card DOM directly on a flat #0a0c11 background without the particle field. Studio preview must never go black.

Non-negotiables: deterministic seeds, finite repeats only, no Math.random / Date.now, no `<br>` in headline (let it wrap with `max-width`). Particle position update runs inside the same window.__timelines.main timeline ticker — don't spin off requestAnimationFrame outside the framework's clock. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 12 --at 1,2.5,4,6,8,11,13.5` before render. Output: `magnetic-field-data.mp4`.
```

### HyperFrames HTML-in-Canvas: Portal Reveal Dashboard

- **id**: `hyperframes-html-in-canvas-portal-reveal`
- **category**: VFX / HTML-in-Canvas
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, html-in-canvas, portal, dashboard, keynote
- **summary**: A 10-second dimensional portal opens onto a live data dashboard — DOM captured in real time, volumetric light spill, portal-edge particles. Built on the vfx-portal catalog block. Designed for keynote-style data hero shots.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/blocks/vfx-portal
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/vfx-portal.png

**Prompt text (verbatim):**

```text
Build a 10-second HyperFrames composition (1920×1080, 30fps) titled "portal-reveal-dashboard". Pull the catalog block first: `npx hyperframes add vfx-portal`.

Visual identity: jet canvas #050609, single electric accent #7df9ff for portal rim and volumetric light, secondary magenta #ff4ecd as chromatic edge tint, off-white text #f5f7fa. Display face: "PP Editorial New" 132px italic; body "GT America" 24px; mono "GT America Mono" 18px tabular-nums on every digit.

Two nested canvases:
• `dashboard-source` — a `<canvas layoutsubtree width="1920" height="1080">` containing a real-looking analytics dashboard DOM: top KPI strip (4 stats, large numerals), a primary line chart (animated SVG path, 12 data points), a secondary bar chart, a live counter that increments 1247 → 1392 over the composition. Use actual CSS Grid for layout, `backdrop-filter` on the KPI cards, and tabular-nums on every numeral.
• `theater` — WebGL canvas running the vfx-portal shader on that captured texture.

Timeline (paused: true, window.__timelines.main, data-duration=10):

0.0–2.4s OPEN — portal radius 0 → 1.0 (ease expo.out 1.4s, slight overshoot 1.05 → 1.0). Volumetric light cone intensity 0 → 1.6 → 1.0. Edge particles spawn count ramps 0 → 240 over 1.6s with deterministic seeded mulberry32(1337). Dashboard texture is captured every frame from 0.6s onward; before that the portal is opaque rim.

2.4–7.6s INSPECT — portal stable at 1.0. Camera pushes in gently (z 0 → -120, ease sine.inOut 5.2s). Inside the source DOM, drive the live counter and chart path animations on the same window.__timelines.main timeline so they sync with the camera push. Add a subtle headline outside the portal ("the numbers, in real time") fading in at 3.2s and a single mono kicker ("+11.6% week over week") with the css-patterns marker sweep at 5.0s.

7.6–10.0s SETTLE — portal radius 1.0 → 1.04 (gentle breathe), light cone tapers to 0.7 intensity, edge particles settle. Final 0.4s holds the hero. No opacity-to-0 exits — the portal IS the frame.

Feature detection: if `drawElementImage` is unavailable, render the dashboard DOM directly without the portal, with a single text overlay "open in HyperFrames render for the full effect". Studio preview must never go black.

Non-negotiables: deterministic seeds, no `repeat: -1`, no async timeline construction, no `<br>` in content text — let it wrap. Min font 60px on the headline, 36px on KPI numerals, tabular-nums everywhere. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 12 --at 1,2,3,5,7,9` before render. Output: `portal-reveal-dashboard.mp4`.
```

### HyperFrames HTML-in-Canvas: Glass Shatter Outro

- **id**: `hyperframes-html-in-canvas-shatter`
- **category**: VFX / HTML-in-Canvas
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, html-in-canvas, shatter, outro, destruction
- **summary**: A 12-second HTML shatter outro — a real product page or pricing card holds for a beat, then explodes into refracting glass fragments with depth blur and chromatic dispersion. Built on the vfx-shatter catalog block. Pairs as an end-card after a longer composition.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/blocks/vfx-shatter
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/vfx-shatter.png

**Prompt text (verbatim):**

```text
Build a 12-second HyperFrames composition (1920×1080, 30fps) titled "glass-shatter-outro". Pull the catalog block first: `npx hyperframes add vfx-shatter`.

Visual identity: deep ink canvas #0c0e14, single warm accent #ff5b3a for fragment edges, secondary cool #5cd4ff for chromatic dispersion, off-white type #f5f5f3. Display face: "PP Telegraf" Bold 140px on the hero card; body "PP Telegraf" 24px. Tabular-nums on the price.

The composition shatters one piece of UI the user supplies — default: a single pricing card centered on canvas, 760×920px, glass-morphism (rgba(255,255,255,0.06) bg, `backdrop-filter: blur(28px)`, 1px rgba border, 28px radius), with: tier name ("Pro"), price ("$24/mo" tabular-nums), 4 feature bullets, primary CTA ("choose Pro").

Source layer: a `<canvas layoutsubtree width="1920" height="1080">` containing the centered pricing-card DOM on top of a soft #0c0e14 → #14161e radial-gradient backdrop.

Timeline (paused: true, window.__timelines.main, data-duration=12):

0.0–3.5s HOLD — card fully composed, idle state. Subtle ambient drift (translateY ±4px ease sine.inOut, finite period 3.0s, 1 repeat). Capture the source canvas at every frame so any micro-motion in the DOM (e.g., a soft accent shimmer behind the price) makes it through.

3.5–4.0s WIND-UP — card scales 1.0 → 1.04 (ease power2.in 0.5s), chromatic offset on the captured texture grows from 0 → 0.012, faint vibration on the fragment field (precomputed Voronoi seed mulberry32(8743)).

4.0–6.6s SHATTER — fragment spawn at t=4.0s. Each fragment gets a deterministic vector based on its centroid (outward + slight upward bias). Translate over 2.6s ease expo.out to final positions in a 2400×1400px field, rotate 0 → ±240° per fragment (signed by centroid sign), scale 1.0 → 0.92, refraction strength 0 → 0.6 → 0.3. Chromatic dispersion peaks at 4.4s (offset 0.034) then decays. Add depth blur on fragments behind the focal plane (z < -100).

6.6–10.0s DRIFT — fragments slow-tumble in negative space, deterministic per-fragment angular velocity. Camera does a slow dolly z 0 → -80 ease sine.inOut. Reveal the brand wordmark behind the fragment field at 7.4s (`gsap.from('.wordmark', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })`) — wordmark uses 96px display size.

10.0–12.0s SETTLE — fragments tumble out of frame; wordmark and a single CTA line ("keep building") stay centered. Final 0.6s of grain-overlay hold. No opacity-to-0 exits on the wordmark — only the fragment field exits.

Feature detection: if `drawElementImage` is unavailable, hold the source DOM card without the shatter, fade to wordmark via a CSS crossfade. Never show a black canvas.

Non-negotiables: deterministic Voronoi seeding, no Math.random / Date.now, all fragment animations finite-repeat, entrance animations on the wordmark, no exit animations except on the fragment field itself. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 14 --at 1,3,4,4.5,5.5,7.5,9.5,11.5` before render. Output: `glass-shatter-outro.mp4`.
```

### HyperFrames HTML-in-Canvas: Cinematic Text Cursor Reveal

- **id**: `hyperframes-html-in-canvas-text-cursor`
- **category**: VFX / HTML-in-Canvas
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, html-in-canvas, text, cinematic, shader
- **summary**: An 8-second dramatic text reveal with cursor glow, chromatic shadow rays, and directional lighting on a black stage. Real DOM typography under live shader post-processing. Built on the vfx-text-cursor catalog block.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/blocks/vfx-text-cursor
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/vfx-text-cursor.png

**Prompt text (verbatim):**

```text
Build an 8-second HyperFrames composition (1920×1080, 30fps) titled "cinematic-text-cursor". Pull the catalog block first: `npx hyperframes add vfx-text-cursor`.

Visual identity: pure black stage #000000, off-white type #f7f7f5, single chromatic shadow tint #ff4d3a (warm) bleeding into #4d8dff (cool) for spectral edges. Display face: "PP Neue Montreal" 220px Medium for the hero word, fallback "NB International Pro". Tracking -0.02em on the hero. No body type — the whole composition is one line.

The full composition is one HTML-in-Canvas reveal of a single short line the user supplies (default: "think bigger"). Source DOM is a `<canvas layoutsubtree width="1920" height="1080">` with one centered `<h1>` element. The shader does the cinema.

Timeline (paused: true, window.__timelines.main, data-duration=8):

0.0–0.8s DARK — fully black, only a single faint cursor scan-line at 50% canvas height moving left to right at 800px/s, intensity 0.3.

0.8–2.4s REVEAL — cursor reaches the headline x-position. The hero word reveals letter by letter via clip-path (linear left-to-right wipe over 1.4s, ease power3.out). Each letter, the moment it appears, lights up the chromatic shadow rays radiating outward 18° spread, length 320px, intensity peaks at 0.85, decays over 0.5s. Directional key light from camera-upper-left sweeps the type with a soft glow.

2.4–5.0s HOLD — type stays lit, cursor parks just to the right of the final letter and pulses (opacity 0.9 ↔ 0.5, period 0.8s, ease sine.inOut, finite repeat — calculate `Math.ceil(2.6 / 0.8) - 1` repeats). Chromatic shadow stabilises at 0.18 intensity. A subtle film-grain overlay (use `grain-overlay` component at 6%) holds across the scene.

5.0–8.0s OUTRO — cursor accelerates rightward off-canvas (x position +1200 over 1.0s ease expo.in). Chromatic rays intensify briefly to 1.0, then everything dims to black via the root container's opacity over 1.6s. The hero word stays in CSS position — only the root container fades. Final 0.4s pure black hold.

Feature detection: if `drawElementImage` is unavailable, render the source DOM directly as a normal CSS-only kinetic-type composition with class-based reveal — the text itself is the fallback. Never show a black canvas with no text.

Non-negotiables: one font, one expressive line, deterministic motion. Min hero size 200px. No `repeat: -1` (the cursor pulse uses a finite count). No animation conflict — the cursor glow shader and the GSAP letter reveal animate different properties on different elements. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 8 --at 0.5,1.6,2.2,4.0,5.5,7.0` before render. Output: `cinematic-text-cursor.mp4`.
```

### HyperFrames: 4-Second Cinematic Logo Outro

- **id**: `hyperframes-logo-outro-cinematic`
- **category**: Branding
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, logo, outro, endcard, branding
- **summary**: A 4-second 16:9 logo outro — piece-by-piece wordmark assembly with bloom, shimmer sweep across the final lockup, soft grain overlay, single-line CTA. Built on the HyperFrames `logo-outro`, `shimmer-sweep`, and `grain-overlay` blocks.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/logo-outro
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/logo-outro.png

**Prompt text (verbatim):**

```text
Build a 4-second HyperFrames logo outro (1920×1080, 30fps) for a brand end-card. Pull `npx hyperframes add logo-outro`, `npx hyperframes add shimmer-sweep`, and `npx hyperframes add grain-overlay`.

Visual identity: deep ink #07070a, single jewel accent #f0c14b, off-white #f7f3e8, secondary mauve #b8a3c8 used only on a 1px hairline rule. Display: "General Sans" 200px for the wordmark; body "Inter" 24px tracked +6% small caps for the CTA line.

Layer structure:
• Track 0: full-bleed background. Solid #07070a with a centered radial glow #f0c14b at 14% opacity, 720px diameter, sized by the bloom on landing.
• Track 1: grain-overlay block at 8% opacity, full duration.
• Track 2: logo-outro block in the center. Override the wordmark text via a slot to the user's brand name (default: "OPEN DESIGN").
• Track 3: shimmer-sweep block running across the wordmark once, starting at 2.0s, lasting 0.8s.
• Track 4: CTA line (one of: "open-design.dev", "github.com/nexu-io/open-design") at y=72%, fades in at 2.6s.

Animation (4s total):
• 0–0.3s — empty stage, grain ramps from 0 → 8% opacity.
• 0.3–1.7s — logo-outro built-in choreography: each glyph piece flies in from random offsets (use the block's seeded variant — DO NOT rewrite with Math.random) and assembles, ease expo.out, 1.4s.
• 1.7–2.0s — radial glow pulses scale 0.96 → 1.04 → 1, 1.2s ease sine.inOut, simulating a bloom hit.
• 2.0–2.8s — shimmer-sweep slides across the assembled wordmark using its built-in CSS gradient mask.
• 2.6–3.4s — CTA line rises from y=20→0, opacity 0→1 ease power3.out 0.7s.
• 3.4–4.0s — final hold, grain continues, no exits.

Non-negotiables: deterministic only — use the block's built-in seed; no `repeat: -1` (calculate explicit cycle count from duration if you keep grain animated); entrance-only; all timelines paused:true; root data-duration=4. Run lint and validate (contrast on the CTA line must clear 4.5:1 against the dark canvas).

Output: `logo-outro-4s.mp4`.
```

### HyperFrames: $0 → $10K Money Counter Hype (9:16)

- **id**: `hyperframes-money-counter-hype`
- **category**: Short Form
- **model**: hyperframes-html
- **aspect**: 9:16
- **tags**: hyperframes, vertical, hype, counter, money
- **summary**: A 6-second vertical 1080×1920 HyperFrames hype clip — Apple-style $0 → $10,000 counter with green flash, money burst particles, cash-stack icon, kicker headline. Built on the HyperFrames `apple-money-count` catalog block.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/apple-money-count
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/apple-money-count.png

**Prompt text (verbatim):**

```text
Build a 6-second vertical HyperFrames hype clip (1080×1920, 30fps) — a single dramatic counter from $0 to $10,000 with a money burst on landing. Pull `npx hyperframes add apple-money-count` and `npx hyperframes add grain-overlay`. Optional: `npx hyperframes add flash-through-white` for the moment of impact.

Visual identity: deep emerald canvas #052520, single hot-green accent #00ff95, off-white #f5fff8, secondary gold #f0c14b on the burst particles only. Display: "Druk Wide" 280px for the counter (with `font-variant-numeric: tabular-nums slashed-zero`); body "Inter" 32px tracked +4% small caps for the kicker.

Layer structure:
• Track 0: full-bleed background — solid #052520 with a soft 540px radial glow #00ff95 at 10% opacity behind the counter, growing to 18% on the impact frame.
• Track 1: grain-overlay at 6% opacity, full duration.
• Track 2: kicker line at y=28% — "WHAT $10K LOOKS LIKE" small caps, fades in at 0.2s.
• Track 3: apple-money-count block centered (use as-is — its seeded confetti/burst is deterministic). Override start=0, end=10000, format=USD.
• Track 4: bottom caption at y=82% — "day · one" small caps, fades in at 4.0s.
• Track 5 (optional): a single flash-through-white frame at 3.4s, 0.18s long.

Animation (6s total):
• 0–0.3s — grain ramps in, kicker fades in from y=14→0 ease power3.out 0.5s.
• 0.5–3.5s — counter ticks $0 → $10,000, 3.0s, ease power2.inOut. Tabular-nums forced. Counter scale: 1.0 the whole way except a +4% pop at $10,000 landing (3.5s) ease back.out.
• 3.4–3.6s — flash-through-white snap.
• 3.5–4.0s — green flash on the counter color: text-color tweens to #00ff95 over 0.3s ease power2.out, then fades back to off-white over 0.6s.
• 3.5–4.5s — money burst block fires its built-in particle system (50 deterministic shards in #f0c14b + #00ff95).
• 4.5–6.0s — final hold. No exit animations.

Non-negotiables: tabular-nums + slashed-zero on the counter; no Math.random in particle positions — use the block's seed; no `repeat: -1`; entrance-only; deterministic; all timelines paused:true; root data-duration=6, data-width=1080, data-height=1920.

Output: `money-counter-6s.mp4`.
```

### HyperFrames: 5-Second Minimal Product Reveal

- **id**: `hyperframes-product-reveal-minimal`
- **category**: Cinematic
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, product, minimal, title-card
- **summary**: A 5-second HyperFrames composition for a high-end product reveal — dark canvas, single warm accent, slow push-in title card, kinetic kicker line, restrained motion. The agent renders MP4 from HTML+GSAP via puppeteer; no stock footage needed.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://x.com/HeyGen/status/2044827454460871072
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/logo-outro.png

**Prompt text (verbatim):**

```text
Build a 5-second HyperFrames composition (1920×1080, 30fps) for a minimal product reveal. The brief is restraint: one product, one accent color, no clutter.

Visual identity: dark canvas #0b0b0f, warm rust accent #ffb76b, off-white text #f5f1ea, secondary slate #7da4ff used only on a single hairline rule. Display face: "Editorial New" or fallback "Times Now" at 140px for the brand wordmark; body in "Inter" 22px tracked +2%; tabular-nums on any digits.

Scene 1 (0–2.0s) — empty stage with a single hairline rule entering from the left at 0.2s, easing power3.out, 0.8s duration. At 0.6s a small caps kicker label "NEW · MAY 2026" fades in below the rule, x-offset 24px → 0, opacity 0 → 1, ease power2.out, 0.5s.

Scene 2 (2.0–4.2s) — the brand wordmark slides up from y=80 to y=0 with opacity 0→1 over 0.7s ease expo.out, staggered 80ms per character via gsap.from with each glyph wrapped in a span. Behind it a soft 540px radial glow #ffb76b at 12% opacity pulses once (scale 1 → 1.04 → 1, 1.6s ease sine.inOut). At 3.4s a one-line tagline (max 56 chars) rises in from y=24 over 0.5s.

Scene 3 (4.2–5.0s) — final hold. No exit animations on any element — the composition simply ends on the hero frame. The hairline rule extends another 80px on a 0.4s ease power2.out for a final breath.

Non-negotiables (HyperFrames contract): all timelines paused: true, registered to window.__timelines["main"]; deterministic only, no Math.random or Date.now; entrance-only animations (no opacity-to-0 exits); root <div> carries data-composition-id, data-width="1920", data-height="1080", data-duration="5".

Deliverable: index.html plus hyperframes.json + meta.json scaffold from `npx hyperframes init --example blank`. Render via daemon dispatch. Output a single descriptive .mp4 in the project root (e.g. `product-reveal-minimal.mp4`).
```

### HyperFrames: 30-Second SaaS Product Promo (Linear-style)

- **id**: `hyperframes-saas-product-promo-30s`
- **category**: Marketing
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, product-promo, saas, linear-style, kinetic-typography
- **summary**: A 30-second HyperFrames composition modelled on Linear/ClickUp-style product films — UI 3D reveals, beat-synced kinetic typography, animated UI screenshots, end-card with logo outro. Built from HF catalog blocks (ui-3d-reveal, app-showcase, logo-outro) plus shader transitions between scenes.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://x.com/HeyGen/status/2048882211022311614
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/app-showcase.png

**Prompt text (verbatim):**

```text
Build a 30-second HyperFrames product promo (1920×1080, 30fps) for a fictional SaaS app. Pull these catalog blocks first: `npx hyperframes add ui-3d-reveal`, `npx hyperframes add app-showcase`, `npx hyperframes add logo-outro`, `npx hyperframes add flash-through-white`, `npx hyperframes add chromatic-radial-split`.

Visual identity: cool slate canvas #0e1116, single electric accent #6cf3c0, off-white text #f5f7fa, secondary indigo #7da4ff used only on UI chrome. Display face: "General Sans" 120px; body "Inter" 24px; mono "JetBrains Mono" 18px on UI bits; tabular-nums on numbers.

Four scenes, each ~7s, separated by shader transitions:

Scene 1 (0–7s) HOOK — full-bleed quote-typography. Headline scales in from 0.9 over 0.6s ease expo.out, then a single mono kicker line below appears with a marker-sweep highlight (use the css-patterns marker pattern). Background: subtle grain-overlay block at 8% opacity.
Transition at 7.0s → flash-through-white, 0.4s.

Scene 2 (7.4–14.4s) PROBLEM — three pull-quotes from "users" in stacked Reddit-style cards using the `reddit-post` overlay block, staggered 280ms apart, each entering with x:-60→0 + opacity 0→1 ease power3.out 0.5s. Hold for 2s on the third card. Background still grain-overlay; soft #6cf3c0 radial glow at 6% behind the stack.
Transition at 14.4s → chromatic-radial-split, 0.5s.

Scene 3 (14.9–22.0s) SOLUTION — the `app-showcase` block (three floating phones / desktop hybrid) renders the product UI. Use ui-3d-reveal to fly in the central UI panel from z=-400 with a 0.7s ease expo.out, then stagger three feature pills (each "plan / track / ship") sliding in from the right over 1.6s. Animate one cursor click on the active pill at 19.5s.
Transition at 22.0s → flash-through-white, 0.3s.

Scene 4 (22.3–30s) END-CARD — `logo-outro` block: piece-by-piece wordmark assembly with bloom glow over 1.4s, then a single CTA line "try it · 14-day free" fades in at 25.5s, then hold. Final 1s of grain-overlay continues for texture.

Non-negotiables: all timelines `paused: true` registered to window.__timelines; entrance-only animations (no opacity-to-0 exits — transitions handle the cuts); root data-composition-id, data-width=1920, data-height=1080, data-duration=30; min font-size 60px on every headline; tabular-nums on any digit row. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 10` before render. Output: `saas-product-promo-30s.mp4`.
```

### HyperFrames: 9:16 Social Overlay Stack (X · Reddit · Spotify · Instagram)

- **id**: `hyperframes-social-overlay-stack`
- **category**: Short Form
- **model**: hyperframes-html
- **aspect**: 9:16
- **tags**: hyperframes, vertical, social, overlay, tiktok
- **summary**: A 15-second vertical 1080×1920 HyperFrames composition that stacks four animated social cards over a face-cam loop — an X post, a Reddit reaction, a Spotify now-playing card, and an Instagram-follow CTA at the end. Each card is a HyperFrames catalog block; the choreography is the value-add.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://hyperframes.heygen.com/catalog/instagram-follow
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/instagram-follow.png

**Prompt text (verbatim):**

```text
Build a 15-second vertical HyperFrames composition (1080×1920, 30fps) that lays four animated social cards in sequence over a muted face-cam loop. Pull all four catalog blocks first: `npx hyperframes add x-post`, `npx hyperframes add reddit-post`, `npx hyperframes add spotify-card`, `npx hyperframes add instagram-follow`.

Visual identity: warm canvas #1a1410, off-white #fff8f1 for chrome, single hot accent #ff5e3a on glow rings around incoming cards. Display: "Inter" 26px tracked normal, the social cards keep their authentic in-platform typefaces (x-post → system, reddit-post → IBM Plex Sans / equivalent, spotify-card → Circular fallback, instagram-follow → SF Pro fallback).

Layer structure:
• Track 0: <video> face-cam.mp4 (muted playsinline) full-bleed background, slightly desaturated via CSS filter.
• Track 1: solid #1a1410 at 38% opacity scrim across the bottom 32% of canvas, full duration, to keep cards readable.
• Track 2: x-post card, data-start=0.4, data-duration=3.2, slides in from x=-340 → 0 ease expo.out 0.6s, holds 2.2s, no exit (transitions handle).
• Track 3: reddit-post card, data-start=3.6, data-duration=3.4, slides in from y=80 → 0 ease power3.out 0.5s, holds.
• Track 4: spotify-card, data-start=7.0, data-duration=4.0, slides in from x=+340 → 0 ease expo.out 0.6s, with the album-art rotating gently inside its built-in pose.
• Track 5: instagram-follow card, data-start=11.0, data-duration=4.0, scales 0.9 → 1 + opacity 0 → 1 ease back.out(1.4) 0.7s, holds to 15s end with the follow button pulsing once at 13.5s.

Between consecutive cards (3.6s, 7.0s, 11.0s) drop a 0.18s flash-through-white shader (`npx hyperframes add flash-through-white`) for a snappy beat. Each card's landing frame should align with a beat (assume 90 BPM = 666ms grid).

Non-negotiables: each social card's text content should be specific to the user's brief — feed real example handles / posts (or the user's own brand) into the slot data on each block. No animating video element dimensions — wrap face-cam in a non-timed div if you need to scale. All timelines paused:true. Deterministic only. Root data-duration=15, data-width=1080, data-height=1920. Run `npx hyperframes inspect --samples 15` and confirm no card spills off the 1080-wide canvas.

Output: `social-overlay-stack-15s.mp4`.
```

### HyperFrames: 9:16 TikTok Talking-Head with Karaoke Captions

- **id**: `hyperframes-tiktok-karaoke-talking-head`
- **category**: Short Form
- **model**: hyperframes-html
- **aspect**: 9:16
- **tags**: hyperframes, vertical, tiktok, captions, karaoke, tts
- **summary**: A vertical 1080×1920 HyperFrames short — TTS-narrated talking-head over a face-cam loop, with karaoke-style word-synced captions, animated lower third, and a tiktok-follow overlay at the end. Mirrors the may-shorts-19 archetype from the HyperFrames student kit.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://x.com/HeyGen/status/2047333014024396873
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/tiktok-follow.png

**Prompt text (verbatim):**

```text
Build a 25-second HyperFrames vertical short (1080×1920, 30fps) for a TikTok-style talking-head clip with karaoke captions. Generate the narration with `npx hyperframes tts` first, then transcribe word-level timings with `npx hyperframes transcribe`. Pull `npx hyperframes add tiktok-follow` and `npx hyperframes add yt-lower-third` (we'll use the lower-third as a name plate, mid-clip). Use the css-patterns reference for word highlighting (marker / clip-path / scatter).

Visual identity: warm canvas #1a1410, single hot accent #ff5e3a, off-white #fff8f1 for text. Display: "Druk Wide" 84px (or "Anton") for caption words; body "Inter" 26px for the lower-third name plate. Captions should be tone-adaptive — emphasis words pop with the marker-sweep pattern; numbers use clip-path slam.

Layer structure (root composition):
• Track 0: <video> face-cam.mp4 (muted, playsinline) full-bleed, slightly cropped, with a 8px inset border in #ff5e3a at 30% opacity.
• Track 1: <audio> narration.mp3 (data-volume=1) generated by `hyperframes tts`.
• Track 2: caption stack (sub-composition `captions.html` loaded via data-composition-src). Captions group by 2–3 words per chunk, max 28 chars per line, sit at y=78% of screen. Each word entry: y=24→0 + opacity 0→1 ease power3.out 0.18s, with the active word color-flipping to #ff5e3a on its own start frame (use tl.set(...) inside the timeline at the word's data-start, not at construction time). Exit by clip-path inset wipe over 0.12s right before the next chunk enters.
• Track 3: lower-third (`yt-lower-third` block, repurposed) entering at 5.0s from x=-360→0 ease expo.out 0.7s, holding 4s, exiting via the transition at 9.5s.
• Track 4: tiktok-follow overlay enters at 22.0s, holds to 25s end, no exit.

Non-negotiables: captions never overlap or run off-frame — use `window.__hyperframes.fitTextFontSize(...)` for any chunk longer than 22 chars; min font 60px on captions for legibility on mobile; deterministic only; all timelines paused:true; root data-duration=25.

Quality: run `npx hyperframes lint`, then `npx hyperframes validate` (WCAG contrast must clear 4.5:1 against the face-cam frame at 5 sample timestamps), then `npx hyperframes inspect --samples 12`. Fix any overflow, then dispatch render. Output: `tiktok-karaoke-25s.mp4`.
```

### HyperFrames: Website-to-Video Pipeline (15-Second Marketing Cut)

- **id**: `hyperframes-website-to-video-promo`
- **category**: Marketing
- **model**: hyperframes-html
- **aspect**: 16:9
- **tags**: hyperframes, website-to-video, marketing, pipeline
- **summary**: A 15-second 16:9 HyperFrames composition that captures a live website at three viewport sizes, then animates between them with a chromatic radial split between scenes. Mirrors the hyperframes-sizzle student-kit archetype where the site is the source asset.
- **source repo**: heygen-com/hyperframes
- **source author**: HeyGen
- **source license**: Apache-2.0
- **source url**: https://x.com/HeyGen/status/2048155061751288197
- **preview image**: https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/ui-3d-reveal.png

**Prompt text (verbatim):**

```text
Build a 15-second HyperFrames marketing cut (1920×1080, 30fps) that turns a real website into a video. The pipeline: capture the site headlessly at three viewport sizes, drop the captures into the composition, animate between them. Pull `npx hyperframes add chromatic-radial-split`, `npx hyperframes add flash-through-white`, `npx hyperframes add logo-outro`. Use the website-to-video guide from the HF docs to capture the source frames into `assets/site-{desktop,tablet,mobile}.png` before authoring the timeline.

Visual identity: cool canvas #0a0c12, off-white #f5f7fa, single accent #6cf3c0 on UI ring frames. Display: "General Sans" 96px for the kicker title, body "Inter" 22px for captions, mono "JetBrains Mono" 18px for url overlays. Tabular-nums on any digit row.

Three scenes, 5s each, separated by transitions:

Scene 1 (0–5s) DESKTOP — captured screenshot (1440×900) inside a stylized browser chrome (use the OD `assets/frames/browser-chrome.html` look as inspiration if available). The screenshot scales 1.04 → 1.0 over 0.7s ease expo.out, then a 1.5s slow Ken-Burns pan across its hero section. A monospace url chip in the top-left fades in at 1.0s. At 4.5s a kicker line types in below the frame.
Transition at 5.0s → flash-through-white, 0.3s.

Scene 2 (5.3–10s) TABLET — captured screenshot (1024×768) tilted slightly in 3D (rotateY=-8°) over the canvas, with the previous chrome floating off via the transition. Same Ken-Burns + url chip pattern. A second kicker line at 8.5s.
Transition at 10.0s → chromatic-radial-split, 0.5s.

Scene 3 (10.5–15s) MOBILE — captured screenshot (390×844) inside an iPhone-15-pro-like chrome, vertical, rotateY=+8°. Animated hand cursor taps once at 12.0s on the primary CTA region, with a small ripple ring expanding over 0.8s. At 13.5s the logo-outro block fires in the lower-right.

Non-negotiables: never animate the dimensions of an <img> directly — wrap each screenshot in a non-timed div and animate the wrapper; entrance-only motion; transitions handle scene exits; deterministic; all timelines paused:true; root data-duration=15. Run `npx hyperframes lint` and `npx hyperframes inspect --samples 15`.

Output: `website-to-video-15s.mp4`.
```

### Live-Action Anime Adaptation: Water vs. Thunder Breathing Duel

- **id**: `live-action-anime-adaptation-water-vs-thunder-breathing-duel`
- **category**: Anime
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: anime, fantasy, action
- **summary**: A highly detailed, 15-second prompt for generating a live-action adaptation of an anime-style duel, featuring 'Water Breathing' (blue water dragon) versus 'Thunder Breathing' (golden lightning). The p
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: John
- **source license**: CC-BY-4.0
- **source url**: https://x.com/johnAGI168/status/2021610292979876208
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/870c9907c5740c3d98ed2d62328ca83b/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Live-Action Anime Adaptation · Breathing Technique Decisive Battle (15 seconds · Super Burning Special Effects Version)
【Core Focus】: Water Breathing (Blue Water Dragon) VS Thunder Breathing (Golden Lightning), live-action extreme speed duel.

【Style】: Hollywood live-action anime adaptation film quality, dark samurai style, 4K ultra-clear, extreme fast cuts, explosive particle light effects, no gore.
【Duration】: 15 seconds
【Scene】: Misty forest under the moonlight, muddy ground, falling leaves.

[00:00-00:05] Shot 1: Water Melody Prelude · Starting Stance (Sense of charging)
Visuals: A young samurai wearing a green and black checkered haori (jacket), lowering his center of gravity under the moonlight, gripping his sword with both hands.
Action: He takes a deep breath, and the surrounding air instantly solidifies. As he draws his sword, a giant blue water dragon, condensed from high-pressure water flow, appears out of thin air, rotating rapidly around his body and blade, emitting the roar of flowing water.
Special Effects Details: The water flow has a realistic sense of splashing, illuminating the dark forest.

[00:05-00:10] Shot 2: Thunder Flash · Charge (Sense of extreme speed)
Visuals: The opponent, a blonde swordsman wearing a yellow triangular patterned haori, is crouched extremely low, adopting the posture of Iaijutsu (sword drawing technique).
Action: The ground suddenly explodes, and he instantly transforms into a dazzling golden lightning afterimage, refracting and charging through the forest in a "Z" shape at a speed undetectable by the naked eye.
Special Effects Details: Golden electric arcs and scorched fallen leaves remain in the places he passes.

[00:10-00:15] Shot 3: Water and Thunder Collision · Final Sound (Ultimate move clash)
Visuals: Extreme speed collision. The young samurai swings the giant blue water dragon down to meet the attack, and the blonde swordsman, transformed into lightning, crashes into him head-on.
Action: The two swords violently collide in the center of the frame.
Special Effects Spectacle: The blue water dragon and the golden lightning instantly explode, forming a massive water-thunder energy storm that spreads outwards. The surrounding large trees are snapped in half by the energy wave, and mud and light obscure the camera. The scene ends in an extremely dazzling blue, yellow, and white light.
```

### Luxury Supercar Cinematic Narrative

- **id**: `luxury-supercar-cinematic-narrative`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, action, nature
- **summary**: A highly detailed multi-shot cinematic prompt for Seedance 2.0 involving a stylish man, Dobermans, and a vintage supercar in a misty mountain setting.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Ivanna | AI Art & Prompts
- **source license**: CC-BY-4.0
- **source url**: https://x.com/ivanka_humeniuk/status/2048962364083691774
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/7e8983364a95fe333f0f88bd1085a0e8/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Global Intent: Quiet Luxury with an aggressive edge. A stylish man with Dobermans and a classic dark blue vintage supercar journeys through misty mountains to an epic coast. Deep, saturated color palette: dark blue, matte black, foggy gray. The pacing is driven by a slow, heavy trap beat with deep 808 bass, featuring rhythmic cinematic cuts.

SEQUENCE LIST:

SHOT 1 (0-1.5s) Medium Shot

• camera_motion: push in

• core_action: Front of a modern matte black house. A stylish man in effortlessly expensive dark clothing stands motionless, holding three perfect Dobermans on thick leather leashes. Behind them sits a classic dark blue vintage supercar. confident movement, grounded interaction, authentic human behavior patterns. Audio: Quiet engine idling, trap beat intro.

(CUT TO)

SHOT 2 (1.5-2.5s) Extreme Close-Up

• camera_motion: static shot

• core_action: Macro of the man's face. He slowly lowers his sunglasses, staring directly into the lens with absolute confidence, revealing diamond grillz catching the light. confident movement, slow and deliberate movement. Audio: First heavy 808 bass hit.

(CUT TO)

SHOT 3 (2.5-4s) Close-Up

• camera_motion: static shot

• core_action: The head of one Doberman. The dog aggressively barks and bares its teeth in slight slow motion, saliva flying. energetic movement, realistic physics. Audio: Muffled, bass-heavy dog bark syncing seamlessly with the beat.

(CUT TO)

SHOT 4 (4-5s) Medium Shot

• camera_motion: static shot

• core_action: Next to the supercar. The man pulls open the heavy car door. A Doberman elegantly and quickly leaps onto the vibrant red leather passenger seat. fluid movement, authentic momentum conservation. Audio: Heavy car door CLICK-CLUNK.

(CUT TO)

SHOT 5 (5-6.5s) Macro Shot

• camera_motion: push in

• core_action: The supercar's hood. The pop-up headlights sharply snap open, instantly illuminating the frame with a piercing, bright yellow beam. mechanical precision, rigid body movement. Audio: Mechanical WHIRR and explosive engine roar on startup.

(CUT TO)

SHOT 6 (6.5-8s) Wide Shot

• camera_motion: tracking shot

• core_action: Winding mountain road engulfed in dense fog. The dark blue supercar aggressively drifts through a sharp hairpin turn, leaving a thick trail of tire smoke. realistic physics governing all actions, volumetric smoke flow, authentic momentum conservation. Audio: Tire SCREECH perfectly pitched to the track's high frequencies.

(CUT TO)

SHOT 7 (8-9.5s) Medium Shot

• camera_motion: static shot

• core_action: Interior of the supercar. The man calmly steers with one hand. The Doberman sits in the passenger seat, its head sticking out the window, ears violently flapping in the rushing wind. wind interaction dynamics, natural movement. Audio: Heavy wind noise, muffled interior engine roar.

(CUT TO)

SHOT 8 (9.5-11.5s) Wide Shot

• camera_motion: tracking shot
```

### Magical Academy Storyboard Sequence

- **id**: `magical-academy-storyboard-sequence`
- **category**: Advertising
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic
- **summary**: A detailed storyboard-style prompt for a cinematic sequence depicting a magical girl at an academy, covering arrival, discovery of power, and a magical duel.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Soulful Ai
- **source license**: CC-BY-4.0
- **source url**: https://x.com/soulful__ai/status/2049186700199620777
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/c81825485052d7aff4ee2af086c7f307/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
0s – 4s (Arrival at the Academy)
A massive gothic magical academy appears above floating cliffs, surrounded by storm clouds and glowing runes. The girl walks through the grand iron gates. Her expression is calm but curious. Floating spell books drift around the entrance. Cinematic slow push-in shot, mist and dramatic lighting.

4s – 8s (The Forbidden Core Reveal)
Inside a grand hall, students channel elemental magic. The girl stands still as her “sealed magical core” reacts. Dark energy briefly flickers around her chest, but she doesn’t collapse like others would. The academy masters observe in shock. Close-up on her face with glowing rune reflections in her eyes.

8s – 12s (Soul-Binding Lesson)
In a floating classroom, chains of light connect students’ souls to magical entities. The girl absorbs a forbidden spell instead of being harmed. The spell dissolves into her body safely. Books levitate violently around her. Slow-motion, cinematic orbit camera around her.

12s – 16s (Forbidden Power Awakens)
A sudden magical duel breaks out. She steps forward and releases a silent wave of forbidden magic. Reality bends slightly around her. Runes explode into glowing fragments in the air. The academy freezes in awe as her power stabilizes. Final shot: her standing alone under floating spell books, softly glowing.
```

### Modern Rural Aesthetics Healing Short Film Video Prompt

- **id**: `modern-rural-aesthetics-healing-short-film-video-prompt`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, action, food
- **summary**: A detailed, three-shot prompt for Seedance 2.0 to generate a healing, cinematic short film in the Modern Rural Aesthetics style. It specifies the style (Cinematic Commercial, 4K/8K, Extreme Macro, nat
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: John
- **source license**: CC-BY-4.0
- **source url**: https://x.com/johnAGI168/status/2021818021354848258
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/ce508b28e505ffce07247e2ab036d6f1/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
[Style]
Modern Rural Aesthetics, Cinematic Commercial quality, shot with Sony A7S3/cinema camera, 4K/8K ultra-clear, Extreme Macro, natural transparent lighting, healing ASMR, no historical costume drama feel.

[Scene]
A well-maintained modern farmhouse open kitchen, background is a lush vegetable garden, bright sunshine.

[Character]
Modern Rural Creator, black long hair casually tied up with a wooden hairpin, wearing a dark blue comfortable linen outfit, clear makeup, focused and peaceful eyes.

[Shot Details]
[00:00-00:05] Shot 1: Morning Harvest (The Freshness)
Visuals: High-definition close-up. Morning sunlight hits the plants with side backlighting.
Action: The Creator's bare hands (long, clean fingers) pick a bright red tomato with glistening dew drops from the vine.
Details: Extremely sharp focus, clearly showing the fuzz on the tomato surface and the trajectory of sliding water droplets. Background is blurred high-quality green.

[00:05-00:10] Shot 2: Extreme Craftsmanship (The Craft)
Visuals: Indoor stove area, full of life but spotless.
Action: The Creator is cutting vegetables, movements are skilled and precise (non-performance nature).
Details: Macro lens captures the moment the knife blade slices through the ingredients, juice splattering. Then switches to the orange flame flickering in the earthen stove, light and shadow are warm and real.

[00:10-00:15] Shot 3: Tranquil Time (The Moment)
Visuals: Full shot/Medium shot.
Action: A delicate home-cooked dish is placed on the wooden long table in the yard. The Creator sits down quietly, gently tidies a stray hair, and picks up a bite of food.
Atmosphere: Steam slowly rises against the backlight, the scene is so quiet you can almost hear the wind, showcasing the ultimate sense of relaxation modern people yearn for.
```

### Nightclub Flyer Atmospheric Animation

- **id**: `nightclub-flyer-atmospheric-animation`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, typography
- **summary**: A subtle animation prompt for Seedance 2.0 to bring background and lighting elements to life while keeping the subject locked
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Nash Deen
- **source license**: CC-BY-4.0
- **source url**: https://x.com/DeenNash_Fu/status/2048912067361452121
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/ac4aa8dd242046f292eab0e1333692ef/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Hyper-detailed nightclub event flyer, a Black woman with sleek long braids and bold red lipstick photographed in a confident chin-up power pose looking directly at camera, wearing a fitted black blazer with gold chain, dramatic red rim light from behind creating glowing edge, harder key light from front-left. Subject cut out over deep oxblood-red textured background with heavy film grain and subtle smoke haze. Behind her the massive display word "FRIDAY" in tall condensed slab serif, cream-white with grungy distressed edges, partially occluded by her shoulders and hair. Secondary script tagline "the night belongs to you" in elegant gold cursive. Bottom info block: "NOV 14 · 10PM · DOORS AT 9 · UPTOWN CLT". Scattered accents: small gold sparkle stars, one circled date stamp, thin gold scribble line. Palette strictly oxblood red, cream-white, gold, deep black. Warm cinematic grade. 4:5 vertical, 2048x2560, club poster quality. Negative: smooth AI skin, generic stock, watermarks. Animate only the background and atmospheric elements — subject, typography, and outfit remain completely locked. Slow rolling smoke haze drifts horizontally across the lower third of the frame behind her, low-opacity, dreamy. Red rim light behind her subtly pulses brighter then dimmer once over 5 seconds, like a slow heartbeat. Tiny gold sparkle particles float upward slowly from bottom edge. Film grain flickers naturally. Cream "FRIDAY" letters behind her have an almost imperceptible texture shimmer. Camera fully locked off, no pan, no zoom. 24fps, 5 seconds, cinematic nightclub mood. Negative: subject moving, face changing, lips moving, hands deforming, text warping.
```

### Retro HK Wuxia Film Aesthetic

- **id**: `retro-hk-wuxia-film-aesthetic`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, product
- **summary**: A complex multi-part video prompt recreating 80s-90s Hong Kong Wuxia film aesthetics, featuring a character transformation from a cat to a human with stylized shots.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Alex Zhang
- **source license**: CC-BY-4.0
- **source url**: https://x.com/jojogh_007/status/2048969153202307329
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/08b292a22998460684d2d5e56c3b6014/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
core_style: 80s-90s Shaw Brothers film style, early Hong Kong Wuxia drama aesthetics, nostalgic Chinese Wuxia movies, vintage TV quality, warm tones with high saturation palette, retro film grain texture, slight Technicolor chromatic aberration, classic studio backdrop feel, soft stage lighting. visual_quality: 35mm film photography, physical film defects, vintage film texture, subtle chromatic dispersion, soft focus effect, slight light flicker, strong bloom on highlight surfaces. character_modeling: female_character - classic 80s period drama makeup, black eyeliner, peach-pink lip balm, exquisite braids with pink ribbons and flower accessories, traditional light blue and white Hanfu with floral embroidery and silk texture. male_character - classic Wuxia young scholar appearance, long hair tied with a white ribbon at the waist, signature sideburns, clean-shaven face, pure white scholar/knight robe. script_and_storyboard: logic - sitcom editing logic with early physical transition effects. scenes: shot_1, [Close-up, a young woman looks affectionately at a black and white cow cat on a wooden table. Dialogue: 'If only you could turn into a handsome guy.'] shot_2, [Medium shot, the cow cat is licking its paws, then a burst of retro white physical smoke effect erupts in the center of the screen.] shot_3, [Transformation, smoke clears, a handsome man in white robes appears where the cat was.] shot_4, [Over-the-shoulder shot, the woman looks surprised and happy, reaching out to touch the man's shoulder or chest. Dialogue: 'Wow, you really became a handsome guy!'] shot_5, [Medium shot, the man has a serious expression, gesturing with orchid fingers and speaking in a charming tone. Dialogue: 'Did you forget you already neutered me? I've changed now, I'm your sister!'] shot_6, [Close-up, the woman is stunned in place, expression shocked. Dialogue: 'Ah!?'] audio_and_post_production: 'Puff' transformation sound effect, nostalgic Hong Kong background music, AI voiceover with 'old movie' or 'TVB dubbing style' accent, duration 00:30.
```

### Seedance 2.0: 15-Second Cinematic Japanese Romance Short Film

- **id**: `seedance-2-0-15-second-cinematic-japanese-romance-short-film`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, cinematic-romance
- **summary**: A highly detailed, 15-second multi-scene prompt for Seedance 2.0, designed to generate a cinematic, ultra-realistic Japanese high school pure love short film. The prompt specifies scene setting (empty
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: AIGC｜阳家豪
- **source license**: CC-BY-4.0
- **source url**: https://x.com/JiahaoYang_art/status/2033119940216344616
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/7f63ad253175a9ad1dac53de490efac8/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
15-second cinematic Japanese drama pure love ambiguous short film, ultra-realistic quality, warm golden sunlight in an empty classroom in the afternoon, spilling through the blinds onto the side-by-side desks, fine dust motes slowly floating in the light beams, old wooden desks, extremely natural subtle movements, breathing, and eye tension, characters maintain consistent faces, clothing, and hairstyles throughout without deformation, drift, or artifacts, real slight chest rise and fall synchronized with breathing, shallow depth of field, creamy blurred background, warm film grain, 8K sharp, Japanese youth restrained heart-fluttering suffocating atmosphere.
0-4 seconds: Extremely slow push-in shot from a medium shot of the desktop to a close-up of the two people's side profiles sitting side-by-side. A pure girl in a summer school uniform is focused on writing notes with her head down, long black hair and stray hairs by her ears are gently lifted by a slight breeze, long eyelashes cast subtle shadows, skin is naturally pink and tender, a slight, unintentional upturn of the corner of her mouth in concentration, light and even breathing.
4-9 seconds: Switch to a close-up of the boy. His school uniform collar is slightly loose, he props his elbow on the desk and secretly turns his head to gaze at her, his eyes filled with gentle, restrained affection and tenderness, pupils slightly dilated, his Adam's apple gently rolls. Suddenly noticing her pen pause, he quickly and flusteredly turns his head to pretend to look at his own notes, his earlobes quickly turn slightly red, his fingertips tremble slightly as he grips the pen, occasionally glancing at her from under his bangs, his breathing is slightly disordered, and his lips are tightly pressed in an effort to remain calm.
9-15 seconds: Extreme close-up of both faces in the same frame, slow-motion eyes suddenly meet: the girl slowly turns her head, first showing a dazed surprise, then quickly and shyly lowers her head for 0.3 seconds, gently biting her lower lip, her cheeks and earlobes instantly bloom with cherry blossom pink, her moist eyelashes timidly look up to meet his gaze again, while softly and shyly whispering, "...What are you looking at?"; the boy freezes completely, his pupils dilate, and he is stunned for 0.4 seconds, then flusteredly and quietly stutters in response, "N-nothing...". The girl whispers even quieter, biting her lip and peeking at him again, continuing to whisper, "...Liar.". The boy pauses, then gently sighs and whispers, "...Just looking at you.", the corner of his mouth slowly curls up into a shy, gentle, crooked smile, fine lines appear at the corners of his eyes, and his breathing noticeably deepens. An invisible current seems to pull the ambiguous tension between their faces, sharing each other's breathing temperature, the background completely melts into layers of creamy, dreamy light spots, warm halos, and fine air particles.
Lip synchronization is natural and precise, emotional micro-tremors and breathing are synchronized, dialogue is low-energy whispering with a shy tone, natural short pauses between 200-400 milliseconds, the mouth only moves slightly when speaking, without exaggeration or robotic feel, perfect natural lip-sync and emotional authenticity.
Overall Sound Effects: Distant summer cicada chirping faintly, the soft scratching sound of the pen touching the paper, the almost inaudible low-frequency pulse of their heartbeats, finally fading into a very light, airy piano. The dialogue is completely naturally integrated into the scene as whispers, the girl's voice is soft and shy, the boy transitions from flustered stuttering to gentle.
Character identity is maintained throughout, real subtle head tilts, eye movements, and breathing synchronization, no text, watermarks, or subtitles, pure Japanese style youth secret crush heart-fluttering suspense.
```

### Seedance 2.0: 80-Year-Old Rapper MV

- **id**: `seedance-2-0-80-year-old-rapper-mv`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cyberpunk, action
- **summary**: A detailed, 15-second prompt for Seedance 2.0 to generate a 16:9 horizontal street rap music video (MV) featuring an 80-year-old woman. The prompt specifies the style (neon purple/blue cool tones, exp
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: 松果先森
- **source license**: CC-BY-4.0
- **source url**: https://x.com/songguoxiansen/status/2033175478765289598
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/e011d2666b5ee19d5b9f8b9837b974c2/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
16:9 horizontal screen, street rap MV style, neon purple and blue cool tones, explosive cool and fierce atmosphere. 0-3 seconds: Medium shot push-in, city street night scene with flashing neon lights, an 80-year-old silver-haired woman stands in front of a graffiti wall, short silver-white hair styled in a neat slick-back, distinct square face contour, sword-like eyebrows slanting towards the temples, eyes sharp like electricity, wrinkles at the corners of her eyes like badges of time, a confident smile on the corner of her mouth, wearing a black leather jacket over a white printed T-shirt (large black letters "YOLO" on the chest) + black cargo pants + white high-top sneakers, a thick gold chain necklace around her neck, silver bracelet on her wrist, holding up a microphone with both hands, strong drum beats of the BGM start, the old woman's eyes sharpen, and her lips open to start Rap. 3-7 seconds: Medium shot + close-up switch, the old woman starts rapping, with an extremely strong sense of rhythm, her silver hair flying with her head-nodding movements, one hand holding the microphone, the other hand making gestures to match the rhythm—index finger pointing at the camera, palm cutting the rhythm up and down, making hip-hop gestures, movements are smooth and flowing, eyes sharp and looking directly at the camera, wrinkles vividly jumping with her expression, lips opening and closing rapidly to spit out lyrics: [Rap Lyrics] "Eighty-year-old legs, can jump better than you! Silver hair flowing, this is my pride! Don't call me old, my Flow is better than yours, when you were playing rap, I was listening to disco!" (Fast speed, strong rhythm, fierce attitude) Quick cuts: facial close-ups, hand movements, full-body swaying, side silhouettes, synchronized with the BGM beat. 7-11 seconds: Dance segment, the camera pulls back to show the full body, the old woman starts dancing—first the classic hip-hop bounce, then a neat street dance freeze, followed by a body wave transmitting from the shoulders to the toes, and then a quick footwork workout, movements are clean and sharp, silver hair flies under the neon lights, the leather jacket flutters in the air, she continues to Rap while dancing: [Rap Lyrics] "Legs and feet are nimble, speed is not slow, my lyrics are carved in time! You play with phones, I play with beats, eighty years of life, written into this verse!" (Faster rhythm, stronger tone) Low-angle upward shot + 360-degree surrounding shot, capturing the old woman's cool and fierce dance moves. 11-15 seconds: Climax ending, the old woman makes a cool turn, her silver hair arcs in the air, she faces the camera and makes a "shush" gesture with her finger, then her lips move closer to the microphone, singing the last line in a low, magnetic voice: [Reality Lyrics] "Time never defeats a beauty, I just changed the way I experience youth..." (Slow rhythm, deep emotion, lingering finish) The camera slowly pushes in for a close-up of the old woman's eyes, the wrinkles at the corners of her eyes are all stories, her gaze is still sharp yet with a hint of kindness, the BGM abruptly stops at the climax, the frame freezes on the old woman's cool yet slightly gentle smile, vignetting + neon purple light halo.
```

### Sequence and Movement Instruction for Martial Arts Video

- **id**: `sequence-and-movement-instruction-for-martial-arts-video`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: fantasy, 3d-render
- **summary**: A video prompt for Seedance 2.0 that instructs the model to animate a sequence based on a character sheet, focusing on specific movements and steps.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Aijaz
- **source license**: CC-BY-4.0
- **source url**: https://x.com/iamsofiaijaz/status/2049045776001564680
- **preview image**: https://pbs.twimg.com/media/HG-sP7Lb0AEmlWA.jpg

**Prompt text (verbatim):**

```text
[STYLE] Monochrome grayscale illustration, 3D-rendered character, clean instructional reference sheet, white background, comic-style cell grid layout, technical diagram aesthetic. [LAYOUT] 4×4 grid layout with a total of 16 panels. Each panel is separated by thin black border lines. Cells are numbered from 1 to 16, with consistent panel sizes. [CHARACTER] image1 (the same character appears consistently in all panels) [PANEL STRUCTURE – per cell] Top-left: bold number badge + English title text Center: full-body character pose illustration Bottom-left: English description text (3–4 lines) Overlay: directional arrows indicating movement [ARROWS / MOTION INDICATORS] Curved arrows, straight arrows, and circular rotation indicators placed around the character to show motion flow and direction. [RENDERING STYLE] Highly detailed 3D sculpted style, soft studio lighting, subtle shadows, no color, grayscale shading, clean linework, game concept art quality. [NEGATIVE] No background scenery, no color tones, no additional characters, no complex background. Create img2 that follows the exact sequence and movements from steps 1–16 shown in img1. The music should be aud1. There should be no dialogue, text, or narration.
```

### Soul-Switching Mirror Magic Sequence

- **id**: `soul-switching-mirror-magic-sequence`
- **category**: VFX / Fantasy
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic
- **summary**: A narrative video prompt describing a magical soul-switching event at a mirror, with specific camera instructions and emotional cues for each segment.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Soulful Ai
- **source license**: CC-BY-4.0
- **source url**: https://x.com/soulful__ai/status/2049094162134532477
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/e614b54b8f60956db3cd9cb765db1d09/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
0s – 4s (Opening Mystery)
A hidden magical kingdom under heavy rain at night. The girl stands beside a glowing water mirror in an ancient palace courtyard. Blue magical fog surrounds her. The water reflects faint glowing runes. She slowly reaches toward the reflection.
Camera: Slow push-in close-up, cinematic depth of field
Mood: Mysterious, calm tension, soft rain sounds

4s – 8s (Soul Switch Event)
Her fingers touch the water reflection suddenly the surface shatters into glowing blue energy. A magical pulse spreads. Her eyes flash with light as her soul violently switches with the crown prince.
Camera: Fast magical shockwave transition, close-up eye zoom
VFX: Soul transfer glow, water turning into floating light particles
Mood: Intense, dramatic awakening

8s – 12s (Living as the Prince)
Now inside the crown prince’s body (her consciousness), she stands in a royal throne room. Nobles bow before her, unaware of the switch. She struggles to act like him while hiding panic. Subtle expressions of confusion and fear.
Camera: Slow tracking shot through palace hall
Lighting: Cold golden royal lighting with shadows
Mood: Suspense, identity tension, hidden fear

12s – 16s (Hidden Truth + Cliffhanger)
Back in the courtyard mirror, the prince (in her body) looks back at her real form from the reflection. The magical water starts cracking again, suggesting unstable soul connection. Blue energy rises violently.
```

### Toaster Rocket Jumpscare

- **id**: `toaster-rocket-jumpscare`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: food
- **summary**: A prompt for a realistic home-video style shot of an old man being jumpscared by a toaster launching bread like a rocket.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Marin
- **source license**: CC-BY-4.0
- **source url**: https://x.com/MarinMethod/status/2049140113343394003
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/fbf9f399fd8f4905a62661966d937ba8/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
A realistic shot of an old man in a cozy kitchen being jumpscared when his toaster launches the bread five feet into the air like a rocket. Handheld "home video" style capturing his genuine look of shock and the bread hitting the ceiling.A realistic shot of an old man in a cozy kitchen being jumpscared when his toaster launches the bread five feet into the air like a rocket. Handheld "home video" style capturing his genuine look of shock and the bread hitting the ceiling.
```

### Traditional Dance Performance

- **id**: `traditional-dance-performance`
- **category**: Advertising
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: cinematic, fantasy, action
- **summary**: A comprehensive video prompt for Seedance 2.0 to generate a graceful traditional dance based on choreography and identity reference images.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Sydney
- **source license**: CC-BY-4.0
- **source url**: https://x.com/XSydneyFan/status/2049170241247449316
- **preview image**: https://pbs.twimg.com/media/HHAdco5aQAAtTCa.jpg

**Prompt text (verbatim):**

```text
Use the first reference image as the exact choreography and motion-process guide. Use the second reference image as the identity reference for the adult woman dancer.

Create a graceful traditional dance performance that follows all 16 illustrated steps in order, from the confident opening pose to the respectful closing pose. The dancer performs with poised posture, soft knee bends, precise cross steps, elegant wrist waves, curved fingers, shoulder accents, hip sways, flowing turns, and expressive selendang sweeps.

Keep the camera in a clean full-body cinematic frame, mostly front-facing, with slow controlled movement that supports the dance instead of distracting from it. During the left and right turns, allow a subtle circular camera drift, then return to a centered frontal composition. The dancer’s hands, feet, facial expression, and selendang fabric must remain visible throughout.

Use soft studio lighting, refined contrast, and a calm traditional performance atmosphere. The motion should feel smooth, rhythmic, respectful, and feminine, with the selendang floating naturally as the dancer glides forward and backward. End on a still closing pose with hands at the heart, peaceful smile, and elegant silence.
```

### Video - Desk Hologram AR on Real Workspace (Seedance 2.0)

- **id**: `video-seedance-desk-hologram-ar-realdesk`
- **category**: Product
- **model**: seedance-2.0
- **aspect**: 9:16
- **tags**: seedance-2.0, desk-hologram, ar, image-to-video, keyframe, photoreal, workspace, open-design, short-form, 9:16
- **summary**: A two-phase Seedance 2.0 workflow for the viral desk-hologram format: first lock a photoreal keyframe on a real developer desk (Open Design UI on the monitor, a cobalt-blue extraterrestrial hunter standing on the keyboard), then animate that still into a ~15s 9:16 image-to-video clip. Tuned for believable AR passthrough — medium-strength VFX, real desk clutter, monitor glow spill on the character, and light physical interactions (open mug, keyboard step, bow draw). Inspired by the desk-hologram Seedance 2.0 trend; no copyrighted character names in the prompt.
- **source repo**: nexu-io/open-design
- **source author**: open-design contributors
- **source license**: Apache-2.0
- **source url**: https://x.com/VincentLogic/status/2063611686653981013
- **preview image**: https://repo-assets.open-design.ai/resources/images/prompt-templates/video-seedance-desk-hologram-ar-realdesk-poster.jpg

**Prompt text (verbatim):**

```text
Two-phase production workflow for a ~15 second vertical desk-hologram AR clip (9:16, Seedance 2.0). Phase A locks the still; Phase B animates it. Use the same hero design in both phases.

# Phase A — Image keyframe (gpt-image-2, image-to-image)
Upload or generate a {argument name="desk_photo" default="vertical iPhone photo of a lived-in real developer desk at night: floral desk mat, white mechanical keyboard, ASUS monitor with a screen bar, Mac mini, tangled USB-C/HDMI cables, sticky notes, pens, tissues, subtle monitor glow on the desk surface — NOT a clean 3D render"}.

Image edit prompt (i2i): Keep the real desk, monitor, keyboard, and clutter exactly as photographed. Add a {argument name="hero" default="cobalt-blue extraterrestrial hunter with bioluminescent cyan spots, long dark braided hair, pointed ears, amber eyes, lean athletic build, leather loincloth and minimal tribal gear, a long prehensile tail, medium-strength semi-transparent holographic VFX (AR passthrough, not a thick cartoon outline)"} standing on the keyboard keys in the foreground. The monitor shows {argument name="monitor_ui" default="the Open Design app previewing the same character in a video template card — meta narrative: the character exists both on-screen and on the desk"}. Place an {argument name="open_mug" default="open ceramic coffee mug"} on the desk within reach. Lighting: monitor key light + soft screen-bar rim; shallow depth of field; photoreal iPhone grain.

Export this keyframe as the Seedance reference image.

# Phase B — Video (Seedance 2.0 image-to-video, ~15s, reference = Phase A keyframe)
A single continuous locked-off smartphone shot of the same real desk. The hero is a medium-strength holographic AR overlay with believable contact shadows and monitor-color spill on skin and tail. No cuts, no whip-pans, no on-screen text or watermarks.

## Hero (locked identity, first frame to last)
{argument name="hero_video" default="cobalt-blue extraterrestrial hunter, bioluminescent cyan spots, braided hair, pointed ears, amber eyes, leather loincloth, long tail, semi-transparent holographic edges with soft cyan bloom"}

## Action timeline (~15s, one take)
1. 0.0–3.0s — Idle on keyboard. Hero stands on the white keyboard, weight shifting subtly; tail sways; monitor shows Open Design preview of the same character; desk clutter stays untouched.
2. 3.0–6.0s — Drink beat. Hero reaches for the {argument name="mug_action" default="open ceramic mug"}, lifts it with both hands, takes a small believable sip, sets it back without knocking it over; liquid level changes slightly.
3. 6.0–9.0s — Keyboard interaction. Hero steps across keys with deliberate footfalls; keys depress slightly under bare feet; a few keys glow from contact; monitor UI remains stable.
4. 9.0–15.0s — Archery beat. Hero draws a compact energy bow, aims toward the monitor, eyes track the arrow direction; a faint cyan arrow streak travels toward the screen; hero holds the finish pose as the glow fades.

## Technical direction
- Camera: fixed smartphone POV, slight natural handheld micro-drift only, no zooms.
- Framing: hero + keyboard in lower third; monitor UI readable in upper half.
- VFX: medium AR passthrough — semi-transparent body, soft edge bloom, grounded shadows on desk mat; NOT a solid toy figurine.
- Lighting: monitor as primary key; preserve real desk reflections and cable clutter.
- Motion: photoreal weight on feet and tail; bow draw in real time, no slow-motion ramp.

## Negative prompt
no copyrighted character names, no branded movie references, no anime cel-shading, no thick white sticker outline, no studio-sweep clean desk, no duplicated hero, no warped monitor UI text, no garbled glyphs on screen, no watermark, no on-screen captions, no jump cuts, no explosion, no blood, no extra limbs, no broken keyboard geometry, no weightless bow, no plastic toy look
```

### Video - Three Kingdoms ARPG - Guan Yu Slays Yan Liang (Seedance 2.0)

- **id**: `video-seedance-three-kingdoms-guanyu-slaying-yanliang`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: game-cinematic, arpg, three-kingdoms, ancient-china, combat, cavalry, guanyu, key-visual, hud-safe, companion-to-image
- **summary**: A ~10s in-engine cinematic action sequence bringing the companion image template game-screenshot-three-kingdoms-guanyu-slaying-yanliang to life. Guan Yu (关羽) rides his Red Hare horse straight into an enemy battle line, raises the Green Dragon Crescent Blade, and executes a single clean cleave of the opposing general Yan Liang. Tuned for Seedance 2.0 — tight camera discipline, one decisive strike, clean horse-and-blade physics, photoreal lighting, absolutely no gore on-screen (the strike is implied by a gold qi flash, not by any blood). Designed as the direct video companion to the matching image template so the still and the clip can be served as a pair. Reference image: the Guan Yu slaying-Yan-Liang screenshot template.
- **source repo**: nexu-io/open-design
- **source author**: open-design contributors
- **source license**: Apache-2.0
- **source url**: https://github.com/nexu-io/open-design
- **preview image**: https://repo-assets.open-design.ai/resources/images/prompt-templates/video-seedance-three-kingdoms-guanyu-slaying-yanliang-poster.jpg

**Prompt text (verbatim):**

```text
A ~10 second in-engine cinematic ARPG action sequence, photoreal, Unreal-Engine-5-grade render quality, desaturated filmic color grading, shallow depth of field on the background. Strict in-game camera discipline — one continuous beat, no cuts, no swish pans.

# Scene (reference image: {argument name="reference_image" default="game-screenshot-three-kingdoms-guanyu-slaying-yanliang"})
- Setting: {argument name="environment" default="a broad open battlefield at dawn, dry yellow earth churned by thousands of hooves, low ground mist clinging to the field, distant spear forests on both sides, tattered war banners fluttering, a cold teal sky with warm amber sunrise light from the left"}.
- Hero (center-left of frame, stays identical from first to last frame): {argument name="hero" default="Guan Yu (关羽), a towering red-faced general in ornate green-lacquered lamellar armor with a long flowing beard, phoenix-eye expression, silk headband under a ridged helmet, red-green battle robe fluttering behind him"}.
- Mount: {argument name="mount" default="Red Hare (赤兔), a massive crimson-chestnut warhorse with a long mane, bronze-studded tack, full gallop"}.
- Weapon: {argument name="weapon" default="the Green Dragon Crescent Blade (青龙偃月刀), a long polearm with a heavy curved blade and a dragon-head socket, held in his right hand"}.
- Opposing general (mid-ground, center-right): {argument name="target" default="Yan Liang, an enemy general in dark iron armor on his own black warhorse, turning late to face the charge"}.

# Action (three micro-beats across ~10s, single continuous shot)
1. 0.0 - 4.0s  Charge. Hero rides Red Hare full gallop directly toward camera-right; beard and robe stream backwards; hooves kick up dust trails; the polearm is held low and trailing so the crescent blade only catches a single glint of sunrise; camera tracks alongside on a smooth lateral dolly matching the horse's speed, framing the hero and horse in a clean center-left third.
2. 4.0 - 7.0s  Raise + lock on. Hero rises slightly in the saddle and swings the Green Dragon Crescent Blade up into a shoulder-high guard; the blade catches a long sharp highlight; a faint {argument name="qi_color" default="cold jade-green"} qi glow builds along the edge; the enemy general is now fully in the mid-ground turning; their horses begin to cross paths; the background armies blur to a soft bokeh.
3. 7.0 - 10.0s  Single clean cleave. Hero swings the blade in one decisive diagonal arc from high-right down to low-left as the two riders cross; a single bright gold-into-jade qi flash briefly blooms along the arc; the enemy general's helmet flies off-frame; his horse rears back; no blood, no gore, no on-screen text; hero's blade recovers smoothly to a trailing low guard; camera continues its lateral track and gently decelerates as the cleave finishes, ending on the hero's stoic profile riding past.

# Technical direction
- Framing: hero + Red Hare occupy the center-left third for the full shot; the enemy enters from the right third around the 4s mark; horizon low; never cut to a closeup.
- Camera: smooth lateral dolly matching horse speed, zero handheld shake, zero rack-focus; focus stays on the hero throughout.
- Lighting: cinematic cold-sunrise key from the left, warm amber rim on the armor, volumetric ground mist drifting left-to-right, subtle bloom on the qi glow only.
- Motion: photoreal horse gallop, 4-beat gait, plausible saddle bounce on the hero, blade weight feels real. The cleave is in real time — no slow-motion ramp. The qi flash lasts less than 0.2s.
- Color: desaturated filmic grade, cold teal + warm amber split, slight filmic grain, subtle chromatic aberration at frame edges only.
- HUD: none rendered in this shot (the companion image template carries the HUD; this video is a pure in-engine action beat).

# Negative prompt
no blood, no gore, no decapitated head shown on-screen, no severed limbs, no red splatter, no anime cel-shading, no comic speed lines, no slow-motion ramp, no whip-pan, no lens flare, no particle fireworks, no explosion, no watermark, no on-screen text or UI, no warped Chinese characters or garbled glyphs on banners, no modern clothing, no firearms, no Western medieval armor, no duplicated hero, no wandering crowd extras in the foreground, no extra fingers on the hero, no broken horse geometry, no weightless polearm, no jump cut.
```

### Video - Three Kingdoms ARPG - Lyu Bu Yuanmen Archery (Seedance 2.0)

- **id**: `video-seedance-three-kingdoms-lyubu-yuanmen-archery`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: game-cinematic, arpg, three-kingdoms, ancient-china, combat, archery, lyubu, key-visual, hud-safe, companion-to-image
- **summary**: A ~10s in-engine cinematic action sequence bringing the companion image template game-screenshot-three-kingdoms-lyubu-yuanmen-archery to life. Lyu Bu (吕布) stands at the center of a dusty military encampment between two facing armies, draws a red-lacquered longbow, holds a bead-on-draw, then looses a single gold-glowing qi-imbued arrow down the range toward a distant halberd planted in the ground. Tuned for Seedance 2.0 — tight camera discipline, a single decisive beat, crisp HUD-safe framing, clean bow/arrow physics, wind + dust + banner motion, and in-game-screenshot color grading. Designed as the direct video companion to the matching image template so the still and the clip can be served as a pair. Reference image: the Lyu Bu yuanmen-archery screenshot template.
- **source repo**: nexu-io/open-design
- **source author**: open-design contributors
- **source license**: Apache-2.0
- **source url**: https://github.com/nexu-io/open-design
- **preview image**: https://repo-assets.open-design.ai/resources/images/prompt-templates/video-seedance-three-kingdoms-lyubu-yuanmen-archery-poster.jpg

**Prompt text (verbatim):**

```text
A ~10 second in-engine cinematic ARPG action sequence, photoreal, Unreal-Engine-5-grade render quality, desaturated filmic color grading, shallow depth of field on the background. Strict in-game camera discipline — one continuous beat, no cuts, no swish pans, no overlays drawn on top of the frame.

# Scene (reference image: {argument name="reference_image" default="game-screenshot-three-kingdoms-lyubu-yuanmen-archery"})
- Setting: {argument name="environment" default="a dusty late-Han military encampment (辕门) between two facing armies, earthen ramparts and wooden palisades framing a wide parade ground, tattered red and black war banners fluttering on tall poles, distant rows of spearmen in lacquered leather armor standing in formation, low golden-hour sun cutting horizontal god rays through drifting dust"}.
- Hero (center of frame, stays identical from first to last frame): {argument name="hero" default="Lyu Bu (吕布), a tall broad-shouldered general in ornate red-lacquered lamellar armor with a phoenix-crest helmet and a purple-and-gold sash, long tied-back black hair, thick sideburns, serious piercing eyes, powerful warrior frame"}.
- Prop: {argument name="weapon" default="a tall red-lacquered recurve longbow with gold-filigree grip, a single long-shafted bronze-tipped war arrow nocked on the string"}.
- Target in the deep background, visible through haze: {argument name="target" default="a single upright halberd planted head-down in the sand roughly 150 paces down the range, a small red ribbon tied near its blade"}.

# Action (three micro-beats across ~10s, single continuous shot)
1. 0.0 - 3.5s  Draw + hold. Hero is already in the frame as the shot opens. He pulls the bowstring smoothly back to anchor next to his cheek; the bow arches into a tight half-moon; his stance widens slightly; the ribbon on the arrow shaft flutters in the wind; his breath is held, eyes locked on the distant target; dust whirls slowly around his boots. Camera is locked-off or breathes with a micro-dolly of less than 5cm — no full camera move.
2. 3.5 - 6.5s  Charge. A faint {argument name="qi_color" default="warm amber-gold"} qi glow builds along the arrow shaft and up the bowstring; tiny embers of qi drift off the arrowhead; the bow creaks subtly; a banner behind the hero snaps once in the wind; the two armies in the far background remain still and silent, watching; no muzzle flash, no lens flare, no UI text pops.
3. 6.5 - 10.0s  Release + follow. A crisp bowstring snap; the arrow streaks cleanly across the frame in a single golden trail, leaving a very short motion trail (less than a third of the frame); camera stays locked on the hero's stance recovery — shoulders drop, drawing hand recoils, the bow returns toward a neutral hold; in the deep background the halberd's red ribbon reacts almost imperceptibly (a single pluck of the ribbon is enough — do not show the arrow striking).

# Technical direction
- Framing: hero occupies roughly the center-left third of the frame for the entire shot; horizon line low; target visible as a small silhouette far right-deep.
- Lighting: cinematic golden-hour key from the left, cool teal fill on the right, volumetric god rays + fine dust particles drifting left-to-right, ~5fps dust parallax in the deep field, subtle bloom on the qi glow only.
- Motion: no camera shake on release, no match-cuts, no slow-motion ramps; the release is in real time at normal speed. Physics plausible — bowstring tension, arrow flex, armor plates click, sash flutters.
- Sound in spec (even if the exported file has no audio): draw creak, one inhale, bowstring snap, arrow whistle fading into wind. Do not render any on-screen sound-effect text.
- Color: desaturated filmic grade, deep warm shadows, slight filmic grain, subtle chromatic aberration at frame edges only.
- HUD: none rendered in this shot (the companion image template carries the HUD; this video is a pure in-engine action beat that can be overlaid with HUD in post or paired with the still).

# Negative prompt
no anime cel-shading, no comic speed lines, no particle fireworks, no explosion, no blood spray, no arrow impacting the target on-screen, no slow-motion ramp, no whip-pan, no lens flare, no watermark, no on-screen text or UI, no warped Chinese characters or garbled glyphs on banners, no modern clothing, no firearms, no Western medieval armor, no duplicated hero, no crowd extras wandering in the foreground, no extra fingers on the drawing hand, no broken bow geometry, no floating arrow without proper nock, no jump cut.
```

### Video - Three Kingdoms ARPG - Zhao Yun Cradle Escape (Seedance 2.0)

- **id**: `video-seedance-three-kingdoms-zhaoyun-cradle-escape`
- **category**: Cinematic
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: game-cinematic, arpg, three-kingdoms, ancient-china, combat, cavalry, zhaoyun, escort, key-visual, hud-safe, companion-to-image
- **summary**: A ~12s in-engine cinematic action sequence bringing the companion image template game-screenshot-three-kingdoms-zhaoyun-cradle-escape to life. Zhao Yun (赵云) rides his warhorse through a broken Changban battlefield, cradling the infant heir A Dou in the crook of his left arm and wielding his spear in the right, parrying an incoming strike with a single PERFECT DODGE and vaulting past a fallen war-chariot to clear a path. Tuned for Seedance 2.0 — tight camera discipline, single continuous beat, believable one-arm spearwork, clean horse physics, and absolutely no visible harm to the infant. Designed as the direct video companion to the matching image template so the still and the clip can be served as a pair. Reference image: the Zhao Yun cradle-escape screenshot template.
- **source repo**: nexu-io/open-design
- **source author**: open-design contributors
- **source license**: Apache-2.0
- **source url**: https://github.com/nexu-io/open-design
- **preview image**: https://repo-assets.open-design.ai/resources/images/prompt-templates/video-seedance-three-kingdoms-zhaoyun-cradle-escape-poster.jpg

**Prompt text (verbatim):**

```text
A ~12 second in-engine cinematic ARPG action sequence, photoreal, Unreal-Engine-5-grade render quality, desaturated filmic color grading, shallow depth of field on the background. Strict in-game camera discipline — one continuous beat, no cuts, no whip-pans.

# Scene (reference image: {argument name="reference_image" default="game-screenshot-three-kingdoms-zhaoyun-cradle-escape"})
- Setting: {argument name="environment" default="the Changban (长坂坡) battlefield in the late afternoon, a broken rural road cutting across rolling yellow-earth hills, overturned wooden war-chariots and broken shield walls scattered across the ground, thick drifts of battlefield smoke and dust, Cao Cao's distant cavalry visible as a dark wave of spears and banners on the far ridge, low amber sun cutting through the haze"}.
- Hero (center of frame, stays identical from first to last frame): {argument name="hero" default="Zhao Yun (赵云), a young handsome Shu general in white-and-silver lacquered lamellar armor with a silver lion pauldron, long black hair tied back under a silver-winged helmet, determined steady eyes, blue sash, blood-smudged cheek but not wounded"}.
- Mount: {argument name="mount" default="a tall white warhorse with a dark mane, silver-studded tack, full gallop"}.
- Left-arm cradle: {argument name="infant" default="the infant heir A Dou (阿斗) wrapped tight in a red silk sling across Zhao Yun's chest, small head resting safely under his left shoulder armor, peacefully asleep"}.
- Weapon (right hand): {argument name="weapon" default="a long steel spear with a phoenix-tassel just below the blade, held in a one-handed mid guard"}.
- Enemy in the near ground (mid-shot): {argument name="attacker" default="a single Cao Cao cavalry officer in black-iron armor swinging a saber at Zhao Yun from the right side"}.

# Action (three micro-beats across ~12s, single continuous shot)
1. 0.0 - 4.5s  Escort gallop. Hero rides straight toward camera-left on his white warhorse through the smoke; his left arm is clearly visible cradling the infant sling against his chest (the red silk is unmistakable); his right hand holds the spear low and trailing; hooves kick up dust and small embers drift past; the background cavalry remains a soft out-of-focus threat; camera tracks alongside on a smooth lateral dolly matching horse speed.
2. 4.5 - 8.0s  Single PERFECT DODGE parry. The enemy officer enters hard from the right swinging a saber at Zhao Yun's head; Zhao Yun leans his torso subtly left to shield the infant sling with his shoulder, snaps the spear up one-handed into a perfect diagonal parry, and deflects the saber upward in a single sharp metal-on-metal sparkle — {argument name="parry_color" default="cold silver-blue"} qi briefly flashes along the spear shaft; the infant stays peacefully asleep, unharmed, unshaken; camera holds steady and does NOT zoom in.
3. 8.0 - 12.0s  Clear the path. Hero redirects the spear back to a low trailing guard; the warhorse vaults cleanly over an overturned war-chariot blocking the road; dust and embers stream upward past the frame; hero lands smoothly on the far side, silhouette briefly rimmed by the low amber sun, eyes still locked forward; the enemy officer falls out of frame behind; end on the hero galloping away from camera into the smoke haze with the red silk cradle still clearly visible at his chest.

# Technical direction
- Framing: hero and horse occupy the center-left two-thirds of the frame for the entire shot; the infant cradle at his chest is always readable; horizon low; never cut to a close-up.
- Camera: smooth lateral + gentle trailing dolly matching horse speed, zero handheld shake, focus stays on the hero throughout, background stays bokeh.
- Lighting: cold haze-ambient from above, warm amber rim from the low sun behind/left, volumetric smoke + dust drifting, subtle bloom only on the parry qi flash and on the silver armor highlights.
- Motion: photoreal horse gallop, 4-beat gait, plausible one-handed spearwork, the parry is one decisive contact (not a multi-strike combo), real-time speed — NO slow-motion ramp anywhere.
- Color: desaturated filmic grade, warm amber + cool teal split, slight filmic grain, subtle chromatic aberration at frame edges only.
- HUD: none rendered in this shot (the companion image template carries the HUD; this video is a pure in-engine action beat that can be overlaid with HUD in post).
- Safety: the infant must remain visible, peaceful, and obviously unharmed in every frame. No visible blood, no visible wounds, no hit on the sling, no dropping the infant, no expression of distress from the baby.

# Negative prompt
no harm to the infant, no dropped baby, no blood on the sling, no crying baby, no visible wounds on the hero, no gore, no anime cel-shading, no comic speed lines, no slow-motion ramp, no whip-pan, no rack-focus, no lens flare, no particle fireworks, no explosion, no watermark, no on-screen text or UI, no warped Chinese characters or garbled glyphs on banners, no modern clothing, no firearms, no Western medieval armor, no duplicated hero, no crowd extras wandering into the foreground, no extra fingers on the hero, no broken horse geometry, no weightless spear, no jump cut.
```

### Vintage Disney Style Pirate Crocodile Animation

- **id**: `vintage-disney-style-pirate-crocodile-animation`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: (none)
- **summary**: A multi-scene narrative prompt for a classic vintage Disney-style animation featuring a crocodile pirate and bird pirates on a ship.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: migrok
- **source license**: CC-BY-4.0
- **source url**: https://x.com/migrok293703/status/2049073744346239415
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/3db7bf471d6244585f772e001af0c625/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Classic vintage Disney animation style. Scene 1: On a pirate ship sailing on the sea, a fat and sinister crocodile pirate stands at the end of a plank. Three bird pirates are watching on the ship, while another bird pirate stands at the beginning of the plank, pointing a sword at the crocodile pirate. The crocodile pirate is wearing a sleeveless tight suit and is muscular. He looks at the bird pirates provocatively. Although he is a bit overwhelmed, he does not intend to give up. The bird pirates look at the crocodile pirate with evil smiles. The atmosphere is tense, and the bird pirates hope the crocodile pirate will jump off the plank into the sea below. Scene 2: The bird pirate says it's all over. He slams the plank with his claw, and the plank shakes. The crocodile pirate loses his balance and falls off the plank. Scene 3: The bird pirates let out evil laughter, but then discover that the crocodile pirate did not fall. Instead, he is grabbing the end of the plank with one hand, his arm stretched straight. Scene 4: Close-up of the crocodile pirate's upper body. A bird pirate leans down with a sly smile, reaches out a feather, and points it at the armpit of the arm the crocodile pirate is using to grab the plank, saying: "It's time to laugh out loud." Scene 5: Close-up of the feather wriggling in the crocodile's armpit, accompanied by funny sound effects. At the same time, we hear the crocodile chuckling. Scene 6: The camera focuses on the upper body of the crocodile hanging in the air, smirking, eyes closed, letting out a muffled laugh as the feather continues to tickle its armpit. Scene 7: The camera sweeps across the crocodile pirate's whole body; the bird pirate continues to tickle his armpit, and soon the crocodile pirate starts laughing out loud. Scene 8: The bird continues to tickle the crocodile pirate's armpit, making him laugh hysterically. Suddenly, the crocodile pirate laughs so hard that he lets go of the plank and falls into the sea. The bird pirate finally lets out a sly chuckle, with a satisfied smile on his face, and stands back on the plank. English voiceover.
```

### Viral K-pop Dance Choreography

- **id**: `viral-k-pop-dance-choreography`
- **category**: Social / Meme
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: fantasy, 3d-render
- **summary**: A detailed prompt for Seedance 2.0 to animate a character performing a dance based on a 16-panel storyboard reference.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: MetaBynny
- **source license**: CC-BY-4.0
- **source url**: https://x.com/MetaBynny/status/2049008203854184461
- **preview image**: https://pbs.twimg.com/media/HG-JpHkbUAA2B08.jpg

**Prompt text (verbatim):**

```text
viral kpop dance. Monochrome grayscale illustration, 3D-rendered character, clean instructional reference sheet, white background, comic-style cell grid layout, technical diagram aesthetic. [LAYOUT] 4×4 grid layout with a total of 16 panels. Each panel is separated by thin black border lines. Cells are numbered from 1 to 16, with consistent panel sizes. [CHARACTER] image1 (the same character appears consistently in all panels) [PANEL STRUCTURE – per cell] Top-left: bold number badge + English title text Center: full-body character pose illustration Bottom-left: English description text (3–4 lines) Overlay: directional arrows indicating movement [ARROWS / MOTION INDICATORS] Curved arrows, straight arrows, and circular rotation indicators placed around the character to show motion flow and direction. [RENDERING STYLE] Highly detailed 3D sculpted style, soft studio lighting, subtle shadows, no color, grayscale shading, clean linework, game concept art quality. [NEGATIVE] No background scenery, no color tones, no additional characters, no complex background. Use the attached image as reference. Use the attached image as reference. Create a dance video that follows the exact sequence and movements from steps 1–16 shown in the attached image. The music should be a trending tiktok song. There should be no dialogue, text, or narration. she is wearing a casual tank top with sweatpants and sneakers.
```

### Wasteland Factory Chase

- **id**: `wasteland-factory-chase`
- **category**: General
- **model**: seedance-2.0
- **aspect**: 16:9
- **tags**: action
- **summary**: A cinematic prompt for a high-speed desert wasteland scene featuring a moving industrial factory on legs and a rebel bike chase.
- **source repo**: YouMind-OpenLab/awesome-seedance-2-prompts
- **source author**: Alexandra Aisling
- **source license**: CC-BY-4.0
- **source url**: https://x.com/AllaAisling/status/2049132779288322134
- **preview image**: https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/c00999fd2444b7303984afe02b739e64/thumbnails/thumbnail.jpg

**Prompt text (verbatim):**

```text
Ultra-realistic desert horizon. A gigantic industrial factory moving on mechanical legs crosses the wasteland like a living city. Female rebel riding a fast bike toward it. Scrap armor forms from metal debris. Defense drones launch from the machine. Camera chases beside hoverbike at high speed. She jumps from bike onto a drone, smashes it, lands on the walking factory. Final frame: towering machine blocks the sun.
```
