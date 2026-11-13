# Bashgah Mench detail and reviews

- Introduction: `pages/game/index.html?tab=intro`
- Reviews: `pages/game/index.html?tab=reviews`
- Both tabs share one header, banner, identity, install/actions block and bottom navigation. Changing tabs only toggles their content panels.
- Real app metadata is recorded separately in `assets/data/bashgah-mench.json`. Icon and seven screenshots were downloaded from the linked Bazaar page on 2026-11-12. The video cover is the original user-supplied 2172×724 PNG, shared by both introduction/reviews and the video poster. Review avatars are 18 distinct generated portraits. Bazaar's retrieved app icon differs from the reference illustration; the actual sourced icon is used.
- Ratings shown for the game are Bazaar's 4.4/5 and 2,827 votes, separate from the older 10-point home-card design scores. No age classification was returned by the source, so none is invented.
- `assets/data/reviews-demo.json` contains explicitly labelled demonstration reviews. Rating-distribution percentages are also labelled as sample data. They are not presented as scraped reviews.
- The browser stores one review per local visitor, edits that same record, persists helpful votes without multiple likes per review, and saves favorites in localStorage. This is a functional browser prototype, not authenticated or shared server storage. Clearing storage or using a different browser creates a different local visitor.
- The install action opens the actual Bazaar listing. Screenshots open in a dialog. Video uses the MP4 URL provided by Bazaar; third-party access can fail and the player then offers a link to the source listing.
- Keyboard tabs, star selection, native dialog focus handling, explicit labels, load-more fallback and 360/390/430px layouts were checked.

## Figma synchronization

Destination: https://www.figma.com/design/vEQYrRrWqhkgdP2moVEdn2

The existing Figma design is not the current website build. On 2026-11-12 the Figma MCP rejected the read/write request because the Starter plan's tool call limit was reached. No matching new game/reviews frames or updated prototype interactions were written in this pass. The earlier Figma font fallback was Vazirmatn; the website keeps the supplied IRANSansMobile fonts. Exact font identity cannot be claimed between these versions.
