# Image prompts for The Majestic

One prompt per photo slot, written to match the site: nocturnal, warm, quiet. Kohl and ebony shadows, sandstone light, a single brass accent, and no clutter.

Each prompt stands on its own, so you can paste it straight into Midjourney, Higgsfield, Flux, DALL·E or a similar tool. Save each result as `photos/<slot>.jpg` (for example `photos/saal-villa-3.jpg`), then run `sh tools/process-photos.sh`.

## Before you start

- **Size:** generate at the largest size the tool offers, and upscale to at least 2400px wide for heroes and 1600px for everything else. The photo script never upscales.
- **Negative prompt** (for tools that take one):
  ```
  text, lettering, signage, logos, watermark, people, cars, HDR, oversaturated colours, glossy CGI render, plastic surfaces, fisheye or wide-angle distortion, lens flare, clutter, cartoon, illustration
  ```
  Remove `people` for the three adviser portraits and for `principles`.
- **Keep the set consistent:** reuse one seed or style reference across a residence's five shots so they read as the same house.
- **Midjourney:** add the aspect flag listed with each prompt, for example `--ar 3:2 --style raw`.

---

## Home page

### `home-hero` · landscape 16:9, 2400px or wider
Full screen behind the MAJESTIC wordmark. Keep the bottom third dark and quiet.
```
A grand Indian heritage residence at deep blue hour, seen from across a still reflecting pool, a long colonnade of sandstone arches glowing amber from within, the sky fading from indigo to near black, the lower third of the frame in deep shadow and still water, vast negative space, symmetrical and calm. Editorial architectural photograph, medium-format, warm nocturnal mood, deep shadows, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### `home-house` · portrait 4:5
(The House), beside the counters.
```
Close interior detail in evening lamplight: an old Burma teak console with a brass lamp casting a pool of warm light across the grain, a carved wooden door frame half in shadow, a single folded linen cloth, darkness falling away at the edges. Editorial interior photograph, medium-format, shallow depth of field, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### `destination-coast` · landscape 16:9
Pinned Destinations chapter. Text sits lower left, so keep that area calm.
```
Dusk over the Konkan coast of India: black basalt rocks breaking a calm tide, a long empty beach curving away to the right, coconut palms silhouetted against a fading copper and slate sky, the lower left of the frame soft dark sand and quiet water. Editorial landscape photograph, medium-format, long exposure, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no boats, no text.
```

### `destination-heritage` · landscape 16:9
Text sits lower left.
```
A carved sandstone jharokha window seen from inside a Rajasthani haveli at dusk, framing Lake Pichola and the distant lit outline of the City Palace across the water, a few diyas glowing on the sill on the right, the lower left in deep shadow. Editorial travel photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### `destination-hills` · landscape 16:9
Text sits lower left.
```
Early morning mist drifting over shade-grown coffee estates in Coorg, layered green hills fading into soft grey, tall silver oak trees rising through the fog, a single planter's bungalow roof faintly visible on a far ridge, the lower left darker foliage in shadow. Editorial landscape photograph, medium-format, muted and atmospheric, palette of deep green-black, ebony, pale sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### `destination-city` · landscape 16:9
Text sits lower left.
```
The Queen's Necklace along Marine Drive, Mumbai, at night, seen from high on Malabar Hill: a sweeping arc of warm sodium streetlights curving around the dark Arabian Sea, Art Deco buildings softly lit, the sea in the lower left nearly black and still. Editorial cityscape photograph, medium-format, long exposure, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no text, no readable signs.
```

### `principles` · portrait 3:4
(Our way), beside the five principles.
```
Two figures seen from behind and at a distance, an adviser and a client walking slowly through a quiet colonnaded courtyard of an old Indian house at dusk, lime-washed walls, a marble floor holding the last light, a brass lantern glowing under an arch, figures small in the frame and faces not visible. Editorial photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no text.
```

### `concierge` · portrait 4:5
A sample chat card sits over the lower half, so put the interest in the upper half.
```
A single reading chair upholstered in worn leather beside a tall shuttered window at dusk, warm lamplight on the chair and a closed book on the armrest, the window showing a deep blue evening sky in the upper half, the lower half of the frame a calm dark floor and shadow. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

---

## Page banners

### `valuation-hero` · landscape 16:9
The title sits bottom left.
```
A quiet study at dusk: an old teak desk with rolled architectural drawings, a brass measuring scale and an antique brass lamp lit on the right side, a tall window behind showing a garden in blue evening light, the bottom left of the frame dark polished wood in soft shadow. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### `agency-hero` · landscape 16:9
The title sits bottom left.
```
A calm private sitting room in a Mumbai agency office on Worli Sea Face at dusk: two low armchairs, a walnut table with a brass bowl, tall windows showing the sea and the lit curve of the Bandra–Worli Sea Link in the far distance, the bottom left a dark rug and shadow. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text, no logos.
```

---

## The residences

Slot `-1` is the main photo used everywhere (rows, slider, cards, the map pop-up), so make it the exterior or an establishing shot. Slots `-2` to `-5` fill the gallery. All are landscape 3:2, at least 1600px wide.

### Saal Villa · Alibaug, a sea-facing villa in sal timber and black basalt

**`saal-villa-1`**: exterior
```
A long low contemporary pavilion villa on the Konkan coast at dusk, seen from a wide lawn, built of oiled sal timber and black basalt with deep overhanging eaves, floor-to-ceiling glass glowing warm amber from within, the sea and a fading copper sky beyond. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`saal-villa-2`**
```
The living room of a coastal villa with its glass walls slid fully open onto a timber verandah and the sea at sunset, low linen sofas, sal timber ceiling, basalt floor catching the last light, deep eaves framing the horizon. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`saal-villa-3`**
```
A long dark infinity pool at the end of a lawn, its edge set exactly level with the horizon of the Arabian Sea at dusk, still water reflecting a copper and slate sky, a single timber lounger, the villa's warm glow faintly at the left edge. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`saal-villa-4`**
```
A principal bedroom suite panelled in warm oiled sal timber, a low bed in natural linen, a wide window facing west onto the sea at sunset, a single brass reading lamp lit, calm and uncluttered. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`saal-villa-5`**
```
Rough black basalt steps leading down from a garden through coastal grasses to an empty beach and calm tide at dusk, wet stone catching the last warm light. Editorial landscape photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### Casa Azulejo · Assagao, Goa, a restored 1890s Portuguese balcão house

**`casa-azulejo-1`**: exterior
```
The ochre lime-plastered facade of a restored 1890s Goan Portuguese villa at dusk, a pillared balcão porch with built-in seats, white-trimmed oyster-shell windows glowing warm from inside, a red Mangalore tile roof, mango and palm trees around it. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, ochre, sandstone and muted brass, low saturation, fine film grain, no people, no cars, no text.
```

**`casa-azulejo-2`**
```
A long Goan sala lined to waist height with blue and white hand-painted azulejo tiles, antique rosewood furniture, a high timber ceiling, evening light through tall windows, a brass chandelier softly lit. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, indigo, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`casa-azulejo-3`**
```
A long dark-tiled pool in the shaded courtyard of an old Goan villa, beneath the spreading canopy of an ancient mango tree, ochre walls and a pillared arcade around it, lanterns glowing at dusk, still water reflecting the leaves. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, ochre, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`casa-azulejo-4`**
```
A bedroom in a restored Goan villa with a carved rosewood four-poster bed, translucent oyster-shell window panes glowing with soft evening light, lime-washed walls, a terracotta floor. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`casa-azulejo-5`**
```
Close detail of hand-painted blue and white azulejo tiles beside an old carved teak door with brass hardware, lime plaster texture, raking warm evening light. Editorial detail photograph, medium-format, shallow depth of field, warm nocturnal mood, palette of charcoal, ebony, indigo, sandstone and muted brass, low saturation, fine film grain, no text.
```

### The Malabar Residence · Mumbai, a duplex penthouse above Back Bay

**`malabar-residence-1`**: exterior
```
A slim residential tower on Malabar Hill, Mumbai, at blue hour, its top two penthouse floors glowing warm amber behind tall glass, the tower rising above dark trees, the Arabian Sea and city lights below. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text, no readable signs.
```

**`malabar-residence-2`**
```
A double-height penthouse salon with seven-metre glazing looking out over Back Bay and the lit curve of Marine Drive at dusk, Indian walnut panelling, honed white Makrana marble floor, low sofas, bronze details, warm lamps. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`malabar-residence-3`**
```
A heated plunge pool on a high penthouse terrace at night, dark stone surround and planters, the pool lit softly from within, the Queen's Necklace of Marine Drive glittering far below, faint steam on the water. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`malabar-residence-4`**
```
A principal suite in Indian walnut and honed Makrana marble, a low upholstered bed, bronze hardware, floor-to-ceiling windows showing the city at night, warm indirect lighting, restrained and quiet. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`malabar-residence-5`**
```
A long walnut dining table set for sixteen in a penthouse at dusk, linen napkins, bronze candlesticks lit, a brass pendant above, city lights through the tall windows behind. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### Amaltas House · Golf Links, New Delhi, a 1938 Lutyens-era bungalow

**`amaltas-house-1`**: exterior
```
The whitewashed front of a 1938 Lutyens-era Delhi bungalow at golden dusk, seen through hanging chains of yellow amaltas blossom, a deep colonnaded verandah, green shutters, a lawn and gravel drive, windows glowing warm. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone, muted brass and soft amaltas yellow, low saturation, fine film grain, no people, no cars, no text.
```

**`amaltas-house-2`**
```
A drawing room in a 1930s Delhi bungalow, fourteen-foot ceilings, lime-washed walls, polished Burma teak floors, tall shuttered windows half open to evening light, antique armchairs, a brass lamp lit. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`amaltas-house-3`**
```
A wide colonial-era verandah with white columns wrapping the side of a bungalow, cane chairs and a low table, looking onto a large rear lawn and mature trees at dusk, a ceiling fan and a lantern glowing. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`amaltas-house-4`**
```
A private library lined floor to ceiling with old books, framed antique maps of Delhi on the walls, a leather armchair, a teak reading table with a green-shaded brass lamp lit. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no legible text.
```

**`amaltas-house-5`**
```
A long teak dining table laid for dinner beneath a pierced brass lantern casting patterned light, lime-washed walls, old silver and linen, candles lit, evening darkness at the windows. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### Jharokha Haveli · Lake Pichola, Udaipur, an 18th-century lakeside haveli

**`jharokha-haveli-1`**: exterior
```
A four-storey eighteenth-century haveli of lime and sandstone rising straight out of Lake Pichola at dusk, carved jharokha balconies glowing warm from within, reflections shimmering on still water, the sky deep indigo. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`jharokha-haveli-2`**
```
An inner courtyard of a Rajasthani haveli, carved sandstone arches on every side, a white marble floor, brass lanterns hanging in the arcades, the last evening light falling from the open sky above. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`jharokha-haveli-3`**
```
A rooftop terrace of a lakeside haveli at dusk, low cushioned seating and lanterns, a carved parapet, looking across Lake Pichola to the softly lit City Palace on the far shore. Editorial travel photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`jharokha-haveli-4`**
```
A haveli suite with walls of intricate antique mirror work glinting in lamplight, a carved wooden bed, and a jharokha window seat opening onto the lake at dusk. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`jharokha-haveli-5`**
```
A private stone ghat with worn steps descending into Lake Pichola at dusk, a small wooden boat moored at the bottom step, a few diyas flickering along the edge, the haveli wall rising behind. Editorial travel photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### Cardamom Hill Estate · Coorg, a 1926 planter's bungalow on 42 acres

**`cardamom-hill-estate-1`**: exterior
```
A 1926 planter's bungalow with a red tile roof on the highest ridge of a coffee estate in Coorg, terraces of shade-grown coffee falling away below, morning mist in the valley, tall silver oak and rosewood trees, a faint warm light in the windows. Editorial architectural photograph, medium-format, atmospheric, palette of deep green-black, ebony, sandstone, terracotta and muted brass, low saturation, fine film grain, no people, no text.
```

**`cardamom-hill-estate-2`**
```
A deep red-oxide floored verandah of an old Coorg bungalow, two cane planter's chairs and a low table with a brass tumbler, wooden pillars framing a misty valley view in soft early light. Editorial architectural photograph, medium-format, atmospheric, palette of deep green-black, ebony, oxide red, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`cardamom-hill-estate-3`**
```
A sitting room in a plantation bungalow with a rough stone fireplace, a log fire burning, dark teak ceiling beams, worn leather sofas and wool throws, rain-grey light at the small windows. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`cardamom-hill-estate-4`**
```
Rows of glossy coffee bushes beneath a high canopy of tall silver oak trees wound with pepper vines, soft dappled light through morning mist, a quiet path between the rows. Editorial landscape photograph, medium-format, atmospheric, palette of deep green-black, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`cardamom-hill-estate-5`**
```
Red and dark crimson coffee cherries spread to dry on a stone yard of a plantation, close and textured, late afternoon raking light, a wooden rake resting at the edge. Editorial detail photograph, medium-format, shallow depth of field, palette of deep crimson, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### Deodar House · Kasauli, a stone, slate and glass hill retreat

**`deodar-house-1`**: exterior
```
A contemporary hill house of local grey stone with a slate roof and a wall of glass, set among towering old deodar cedar trees on a Himalayan ridge at dusk, warm light glowing inside, mist between the trunks. Editorial architectural photograph, medium-format, atmospheric, palette of charcoal, ebony, slate grey, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`deodar-house-2`**
```
A living room whose entire west wall is glass, looking straight into a forest of tall deodar trees, a low timber-framed sofa and a wool rug, stone floor, soft fading daylight and one lamp lit. Editorial interior photograph, medium-format, atmospheric, palette of charcoal, ebony, slate grey, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`deodar-house-3`**
```
A large black cast-iron wood-burning stove with a fire glowing, a stack of split logs beside it, stone wall behind, pale cold winter light from a window falling across a wooden floor. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, slate grey, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`deodar-house-4`**
```
A small minimalist glass studio pavilion at the edge of a deodar forest at dusk, a single desk and chair visible inside under a warm lamp, distant snowline faint on the horizon. Editorial architectural photograph, medium-format, atmospheric, palette of charcoal, ebony, slate grey, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`deodar-house-5`**
```
Layers of the Shivalik hills fading into soft mist at first light, seen from a stone terrace edge with a wooden railing in the foreground, deodar branches framing the top of the view. Editorial landscape photograph, medium-format, atmospheric, palette of charcoal, slate blue-grey, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

### The Lavelle · Bengaluru, a garden residence near Cubbon Park

**`the-lavelle-1`**: exterior
```
The garden front of a low, refined contemporary residential building in Bengaluru at dusk, pale stone and timber louvres, large glass doors glowing warm onto a private lawn, the canopy of giant rain trees arching overhead. Editorial architectural photograph, medium-format, warm nocturnal mood, palette of deep green-black, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no cars, no text.
```

**`the-lavelle-2`**
```
A long, calm living and dining room in pale oak and limestone, wide glass doors open onto a green lawn at dusk, low linen sofas, a long dining table, warm lamps, rain tree foliage outside. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

**`the-lavelle-3`**
```
A stone path through a private garden lined with frangipani trees, white and yellow blossoms fallen on the paving, native shrubs, soft garden lanterns at dusk. Editorial landscape photograph, medium-format, warm nocturnal mood, palette of deep green-black, ebony, sandstone, cream and muted brass, low saturation, fine film grain, no people, no text.
```

**`the-lavelle-4`**
```
A quiet study with a simple oak desk facing a large window onto a lush garden, a brass desk lamp lit, a few books and an open notebook, soft evening light. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no legible text.
```

**`the-lavelle-5`**
```
A principal bedroom in pale oak and natural linen, a low bed with rumpled white linen, sheer curtains filtering soft evening garden light, a single warm bedside lamp. Editorial interior photograph, medium-format, warm nocturnal mood, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no people, no text.
```

---

## Advisers · portrait 4:5, face in the upper half

These are fictional people. Keep all three in one lighting setup so they read as a set.

**`adviser-1`**: Meher Kapadia, senior adviser, Mumbai and the coast
```
Editorial portrait of a poised Indian woman in her early forties, a senior real estate adviser, dark hair tied back, wearing a tailored charcoal linen blazer, small gold earrings, a calm and confident half-smile, head and shoulders with her face in the upper half of the frame, soft window light from the left, a dark warm-toned background. Medium-format portrait photograph, shallow depth of field, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no text.
```

**`adviser-2`**: Arjun Rathore, partner, heritage and the north
```
Editorial portrait of a thoughtful Indian man in his late forties, a conservation architect turned property partner, short greying hair and a trimmed beard, wearing an unstructured navy bandhgala jacket over a white shirt, a warm steady gaze, head and shoulders with his face in the upper half of the frame, soft window light from the left, a dark warm-toned background. Medium-format portrait photograph, shallow depth of field, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no text.
```

**`adviser-3`**: Tara Nanjappa, senior adviser, Bengaluru and the south
```
Editorial portrait of a warm, outdoorsy Indian woman in her late thirties from Coorg, shoulder-length dark hair, wearing an olive cotton shirt and a simple silver necklace, a relaxed open smile, head and shoulders with her face in the upper half of the frame, soft window light from the left, a dark warm-toned background. Medium-format portrait photograph, shallow depth of field, palette of charcoal, ebony, sandstone and muted brass, low saturation, fine film grain, no text.
```
