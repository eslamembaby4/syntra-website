# Refineries Map - Quick Start Guide

## Your Map is Ready!

Open `/critical-minerals-map.html` to see 22 Canadian refineries displayed with blue square markers.

## Two Clicks for PowerPoint

### Slide 1: All Refineries (22 total)
1. Open the map - default view
2. Screenshot
3. Done

### Slide 2: Priority Minerals Only (19 refineries)
1. Click "Al, Co, Cu, Ni, Li Only" button
2. Screenshot
3. Done

## What's Included

### Aluminum Refineries (6)
- Kitimat (BC)
- Arvida (QC)
- Sept-Îles (QC)
- Bécancour (QC)
- Deschambault (QC)
- Baie-Comeau (QC)

### Nickel & Cobalt Refineries (7)
- Vale Long Harbour (NL)
- Port Colborne (ON)
- KGHM Sudbury (ON)
- Cobalt Refinery (ON)
- Thompson Nickel (MB)
- Fort Saskatchewan (AB)
- Electra Battery Materials (ON) - under development

### Copper Refineries (3)
- Glencore CCR (BC)
- Horne Copper Smelter (QC)
- KGHM Sudbury (ON)

### Lithium Refineries (4 - all under development)
- Nemaska Lithium (QC)
- Rock Tech Lithium (ON)
- Sigma Lithium (QC)
- Sayona Mining (QC)

### Other Refineries (3 - filtered out)
- Brunswick Lead Smelter (NB)
- CEZinc Valleyfield (QC)
- Fort McMurray Oil Sands (AB)

## Key Features

✅ Blue square markers for all refineries
✅ Two-button filter system
✅ Orange badges for priority minerals (Al, Co, Cu, Ni, Li)
✅ Live counter showing number of refineries
✅ Click markers for details
✅ Full-screen layout perfect for screenshots

## Admin Panels

Need to add more refineries?

1. `/mining-map-admin.html` - Table view with edit/delete
2. `/mining-data-admin.html` - Form-based data entry

Both panels work now - you can add, edit, and delete refineries.

## What the Filter Does

**"Show All Refineries"** - Shows all 22 facilities

**"Al, Co, Cu, Ni, Li Only"** - Removes these 3:
- Brunswick Lead Smelter (Lead, Zinc)
- CEZinc Valleyfield (Zinc)
- Fort McMurray Oil Sands (Vanadium, Titanium, REE)

Result: 19 refineries that process Aluminum, Cobalt, Copper, Nickel, or Lithium

## Files Created

```
✅ critical-minerals-map.html           - Your main map
✅ mining-map-admin.html                - Admin interface (table view)
✅ mining-data-admin.html               - Admin interface (form view)
✅ CRITICAL_MINERALS_MAP_GUIDE.md       - Detailed guide
✅ ADMIN_PANELS_FIXED.md                - Admin panel fixes
✅ REFINERIES_MAP_COMPLETE.md           - Complete documentation
✅ REFINERIES_QUICK_START.md            - This file
```

## Database

**Table:** `mining_locations`
**Refineries:** 22 processing facilities
**Supabase:** Connected and working

## Next Steps

1. Open the map to verify it works
2. Try both filter buttons
3. Take your PowerPoint screenshots
4. (Optional) Add more refineries via admin panel

---

That's it! Your refineries map is ready to use.
