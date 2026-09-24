#!/bin/bash
# Task 2-b — Generación de imágenes QUIERO LENTES (z-ai CLI)
P=/home/z/my-project/public/images/products
S=/home/z/my-project/public/images/sections

gen() { # $1 prompt  $2 out  $3 size
  local prompt="$1" out="$2" size="$3" i
  if [ -s "$out" ]; then echo "SKIP (exists): $out"; return 0; fi
  for i in 1 2 3; do
    timeout 180 z-ai image -p "$prompt" -o "$out" -s "$size" >/dev/null 2>&1
    if [ -s "$out" ]; then echo "OK: $out"; return 0; fi
    echo "RETRY $i: $out"; sleep 6
  done
  echo "FAIL: $out"
}

PSUF=", professional e-commerce product photography, single pair of eyeglasses, seamless light warm gray studio background, soft diffused studio lighting, subtle soft shadow below, ultra sharp focus, premium optical brand catalog aesthetic, centered composition, no people, no text, no watermark, high quality, detailed"

# ---------- PRODUCTOS (1024x1024) ----------
gen "floating three-quarter angle view of square black matte acetate eyeglass frames$PSUF" "$P/nordik-aurora-1.png" "1024x1024"
gen "straight front view of square black matte acetate eyeglass frames$PSUF" "$P/nordik-aurora-2.png" "1024x1024"
gen "floating three-quarter angle view of round tortoiseshell acetate eyeglass frames$PSUF" "$P/marea-ondina-1.png" "1024x1024"
gen "straight front view of round tortoiseshell acetate eyeglass frames$PSUF" "$P/marea-ondina-2.png" "1024x1024"
gen "floating three-quarter angle view of ultra thin rectangular gunmetal titanium eyeglass frames$PSUF" "$P/vertice-titanio-1.png" "1024x1024"
gen "straight front view of ultra thin rectangular gunmetal titanium eyeglass frames$PSUF" "$P/vertice-titanio-2.png" "1024x1024"
gen "floating three-quarter angle view of gold metal aviator sunglasses with brown gradient lenses$PSUF" "$P/solara-dorada-1.png" "1024x1024"
gen "straight front view of gold metal aviator sunglasses with brown gradient lenses$PSUF" "$P/solara-dorada-2.png" "1024x1024"
gen "floating three-quarter angle view of round transparent crystal clear acetate eyeglass frames$PSUF" "$P/lumen-cristal-1.png" "1024x1024"
gen "straight front view of round transparent crystal clear acetate eyeglass frames$PSUF" "$P/lumen-cristal-2.png" "1024x1024"
gen "floating three-quarter angle view of cat-eye black acetate eyeglass frames with red lacquered accent details$PSUF" "$P/katana-aka-1.png" "1024x1024"
gen "straight front view of cat-eye black acetate eyeglass frames with red lacquered accent details$PSUF" "$P/katana-aka-2.png" "1024x1024"
gen "floating three-quarter angle view of thin gold hexagonal metal sunglasses with smoke gray lenses$PSUF" "$P/bruma-hex-1.png" "1024x1024"
gen "straight front view of thin gold hexagonal metal sunglasses with smoke gray lenses$PSUF" "$P/bruma-hex-2.png" "1024x1024"
gen "floating three-quarter angle view of thick rectangular dark havana brown acetate eyeglass frames$PSUF" "$P/cordillera-pico-1.png" "1024x1024"
gen "straight front view of thick rectangular dark havana brown acetate eyeglass frames$PSUF" "$P/cordillera-pico-2.png" "1024x1024"

# ---------- SECCIONES ----------
gen "cinematic macro shot of premium black eyeglasses resting on dark charcoal stone surface, dramatic red rim lighting from the side, elegant light reflections on the lenses, moody premium optical brand campaign photography, high contrast, no text, no people, no watermark" "$S/hero-poster.png" "1440x720"
gen "modern digital phoropter eye examination equipment in a bright premium optical clinic, clean white and warm wood interior, professional optical technology, editorial photography, no people, no text" "$S/vision-exam.png" "1152x864"
gen "interior of a premium modern optical boutique, warm wood shelving with backlit eyewear display, white walls, soft daylight from large windows, minimalist editorial retail design, no people, no text" "$S/about-store.png" "1152x864"
gen "close-up of optician hands adjusting eyeglasses with precision tools on a wooden workbench, shallow depth of field, warm workshop lighting, editorial craftsmanship photography, no faces, no text" "$S/about-craft.png" "864x1152"
gen "macro photography of a premium eyeglass lens with subtle iridescent anti-reflective coating reflecting light, floating over clean light gray studio background, high tech optical product, no text" "$S/proone-lens.png" "1152x864"
gen "autorefractor eye exam machine with chin rest in a modern minimal optical clinic, soft light, no people, no text" "$S/service-exam.png" "1024x1024"
gen "single clear eyeglass lens held up reflecting soft window light, minimal studio shot, no text" "$S/service-monofocal.png" "1024x1024"
gen "progressive eyeglass lens with subtle gradient light reflections, macro studio product photography, no text" "$S/service-progressive.png" "1024x1024"
gen "close up of eyeglass lens surface coating with elegant light streaks, dark sophisticated background, optical laboratory, no text" "$S/service-treatment.png" "1024x1024"
gen "elegant flat lay of multiple stylish eyeglass frames arranged on beige linen fabric with soft shadows, fashion editorial, no text" "$S/service-style.png" "1024x1024"
gen "rows of premium eyeglass frames on clean display shelves in an optical store, shallow depth of field, no people, no text" "$S/service-frames.png" "1024x1024"

echo "ALL DONE"
