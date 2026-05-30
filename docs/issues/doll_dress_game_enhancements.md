# Issue: Advanced Customization and Capture Features for Doll Dress-Up Studio 🌸

## Description
The new **Girly Games Arcade Corner** is a fantastic and highly interactive addition to the GirlyVibes site! The Three.js 3D Doll Dress-Up and the interactive digital bunny pet (Coco) are beautifully structured and provide a premium user experience.

To elevate this playroom even further and increase user engagement, we should implement advanced customization features and allow users to export their beautiful creations.

---

## Proposed Enhancements 🚀

### 1. Interactive Face & Expression Customization
Currently, the doll has a fixed happy expression. We can introduce a facial expressions selector:
* **Facial Expressions**: Happy (default), Winking, Surprised, Heart-Eyes, and Cozy Sleepy.
* **Eye & Lash customization**: Multiple custom 3D mesh patterns or textures for eyes.
* **Cheek blush opacity & pattern selector**: Adding subtle sparkles or star stickers on cheeks.

### 2. Expanded Wardrobe & Traditional Attire
Add more culturally diverse, elegant, and fashionable clothing options to match themed challenges:
* **Hijab Styles**: Crinkled cotton wraps, floral headscarves, satin Eid wraps.
* **Tops**: Detailed kaftans, embroidered shrugs, and modern modest crop blazers.
* **Accessories**: Layered gold necklaces, customized henna hand stencils, and handheld coffee cups or boba cups.
* **Bottoms**: Flowing pleated skirts, ruffled linen pants.

### 3. Polaroid Scrapbook Export Functionality
Currently, users can save their dolls to their local browser `localStorage` Polaroid scrapbook, but they cannot save them to their actual devices. We should add:
* **"Download Polaroid" Button**: Use `canvas.toDataURL()` combined with a 2D canvas context overlay to render the actual styled Polaroid card (including the written caption, the cute borders, and the 3D doll render) as a single downloadable PNG.
* **Share created doll link**: Encode the customized outfit state (e.g., `?hair=braids&top=cardigan&bottom=skirt&acc=none&bg=pink-room`) into a shareable URL so friends can view or load the same doll instantly.

### 4. Interactive Tamagotchi Minigame Upgrades
* **Bunny Boutique Shop expansion**: Add more decor items (e.g., customizable wallpaper, glowing balloons, different beds for Coco).
* **Sound Toggle/Volume Sliders**: A toggle to turn synth sound effects on/off for players who prefer quiet gameplay.

---

## Tasks / Implementation Plan 📝

- [ ] Create a facial expression selector React UI state and bind it to dynamic 3D mouth and eye mesh adjustments in `games.tsx`.
- [ ] Add 2-3 additional high-quality choices to `HAIR_OPTIONS`, `TOP_OPTIONS`, and `BOTTOM_OPTIONS` (with corresponding Three.js meshes inside `updateWardrobe`).
- [ ] Implement a helper function `downloadPolaroidCard(item)` using a hidden `<canvas>` to stitch together the captured WebGL doll image and the Polaroid white border/caption text, triggering a browser file download.
- [ ] Add query-string parser on page mount (`useEffect`) to auto-load doll styles if shared via URL parameters.
- [ ] Add sound toggle switch in the console UI.

## Visual Reference & Mockup Ideas 🎨
* *Polaroid card template*: A pastel pink-tinted photo border with handwriting font styling for captions.
* *Expression options*: Simple rounded button grid with cute face symbols (`^◡^`, `*◡<`, `♥◡♥`).
