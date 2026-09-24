# Interactive health scene assets
 
 Generated with the built-in image generation tool; no Higgsfield/video generation.
 
 All assets are illustrative, not evidence of actual insurance claims or benefits.
 
 Source: user-supplied hero section.png. WebP conversions preserve the generated alpha.
 
 Files: decision-clean-v1.webp, decision-props-v1.webp, decision-giver-v1.webp, decision-receiver-v1.webp, decision-cash-v1.webp, decision-toast-v1.webp.
 
 ## Prompts
 
 ### clean
 
 Edit target is the supplied collage. Create an animation clean plate at exactly the same 1671x941 framing. Preserve ALL eight curved panel boundaries, all people, their expressions, all scenery, lighting and composition. Remove only these foreground animation props, reconstructing what is behind them: both arms/hands and all cash in the loans panel (third panel down on left); the large tilted FACTURA MEDICA sheet in bottom-left; the large BANCARROTA newspaper top-left; the crowdfunding smartphone in second-left; the big benefit check in third-right (also remove the hands holding that check, leaving the couple and clothes); the large insurance card and holding hand bottom-right; the pink dental demonstration model in second-right and the hand holding it; the drinking-water glasses on the family dinner table top-right. Also remove the foreground central reaching hand. Keep everything else especially faces and exact panel geometry unchanged. Full opaque background plate, no transparency. This is an underlying plate for replacing the removed objects with separately moving overlays.
 
 ### props
 
 Use case background-extraction. Edit target supplied collage. Make ONE full-canvas animation overlay image in exactly the SAME 1671x941 coordinate layout with genuinely transparent alpha everywhere except these original objects: large BANCARROTA newspaper top-left; the original crowdfunding smartphone second-left; large FACTURA MEDICA sheet bottom-left; the large check with the couple's holding hands third-right; insurance card with its holding hand bottom-right; pink dental demonstration model with the small hand holding it second-right; the water glasses on the family table top-right. Preserve original sizes, positions, tilt, texture, lighting, and text of each object EXACTLY. Remove all people (except specified gripping hands), faces, backgrounds, panels, loan cash/hands and the central reaching hand completely. Do not arrange into a grid. Do not move or enlarge any object. This is an aligned transparent overlay to place directly on the supplied reference, all requested props at their existing coordinates.
 
 ### giver
 
 Use case background-extraction. Edit target supplied reference image. Extract ONLY the bare forearm and giving hand entering from LEFT in the loans panel (third panel down on left). Make a genuinely transparent PNG with same full 1671x941 canvas. Preserve this forearm and hand at its exact original coordinates and size, with the fingers slightly parted as if loosely pinching a thin stack of cash. Remove the cash: the hand must be empty. Reconstruct any occluded fingers naturally. No second hand, no money, no background, no text, no panels. Keep the sleeve edge left around y450 and fingertips around x290 y550. The rest of the full canvas entirely transparent. It is a photographic animation layer, not illustration.
 
 ### receiver
 
 Use case background-extraction. Edit target supplied reference image. Extract ONLY the receiving hand and navy jacket forearm entering from RIGHT of the loans panel (third panel down on left). Make genuinely transparent PNG at same full 1671x941 canvas. Keep original exact coordinates: receiving palm around x420 y580 and navy forearm extending toward x680 y680. Remove ALL money, the other arm, and background. The empty palm faces upward, fingers gently curled ready to receive money, with realistic anatomy and same side-view camera. Reconstruct occluded parts. No text, panels, other hands. Whole rest of canvas transparent. Photographic standalone animation layer.
 
 ### cash
 
 Use case background-extraction. Edit target supplied reference. Extract ONLY the stack of US dollar bills being exchanged in the loans panel, third panel down on left. Same exact original full-canvas 1671x941 coordinate layout: stack sits diagonally between roughly x220 y495 and x400 y610. Genuinely transparent alpha everywhere else. Reconstruct corners of notes hidden by fingers. Preserve stack thickness, downward-right tilt, scale, lighting and texture. No hands, no arms, no background, no text outside the money, no other objects. Do not center or enlarge the money; retain its original position in the large transparent canvas.
 
 ### toast
 
 Use case photorealistic-natural. Asset for layered animation: two separate adult hands each holding a clear tumbler of WATER, about to toast. Wide 1671x941 transparent PNG, genuinely transparent alpha. Left half: a woman's slender right hand and forearm enter from lower-left, holding one water glass upright around x600 y420. Right half: a man's left hand and white shirt cuff enter from lower-right, holding one water glass upright around x1080 y420. A generous clear empty gap between both glasses. Both entire glasses visible, realistic grip and five fingers, actual water refraction. Warm golden sunset light, matching a family dinner, no alcohol. Hands and glasses ONLY, no heads, no torsos, no table, no background, no text. Separate silhouettes do not touch or overlap the canvas center x835. Designed to separate the two halves and move the glasses together for a toast.
