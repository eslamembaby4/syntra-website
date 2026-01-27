# 🚀 Quick Start: GIF Banner Email Signature

## 3-Minute Setup Guide

---

## Step 1: Record the GIF (10 minutes)

### Open the Template
```
File: gif-capture-template.html
Browser: Google Chrome
Action: Double-click to open
```

### Download Recording Tool

**Windows:**
- Download: [ScreenToGif](https://www.screentogif.com/)
- Install and launch

**Mac:**
- Download: [Kap](https://getkap.co/)
- Install and launch

### Record the Animation
1. Position recording area over the banner (550x200px)
2. Click "Hide Instructions & Start"
3. Press **Record**
4. Wait **20 seconds** (one full diamond rotation)
5. Press **Stop**

### Optimize and Save
**ScreenToGif:**
- Click "Editor" → "File" → "Save As" → "GIF"
- Quality: 90
- Save as: `syntra-banner-animated.gif`

**Kap:**
- Export as GIF
- Quality: High
- Save as: `syntra-banner-animated.gif`

---

## Step 2: Host the GIF (2 minutes)

### Upload Location
```
Server Path: /public/assets/email-signature/
Filename: syntra-banner-animated.gif
```

### Public URL
```
https://www.syntrarefining.com/assets/email-signature/syntra-banner-animated.gif
```

### Test Access
```bash
# Open in browser or use curl
curl -I https://www.syntrarefining.com/assets/email-signature/syntra-banner-animated.gif

# Should return: HTTP/2 200
```

---

## Step 3: Update HTML (1 minute)

### Open the Template
```
File: signature-gif-banner.html
Editor: Any text editor
```

### Update GIF URL
Find this line (around line 23):
```html
<img src="https://www.syntrarefining.com/assets/email-signature/syntra-banner-animated.gif"
```

Update with your actual URL if different.

### Replace Variables

| Find This | Replace With | Example |
|-----------|--------------|---------|
| `{{FULL_NAME}}` | `%%displayName%%` | M365 field |
| `{{JOB_TITLE}}` | `%%title%%` | M365 field |
| `{{EMAIL}}` | `%%email%%` | M365 field |

---

## Step 4: Deploy to Microsoft 365 (5 minutes)

### Navigate to Exchange Admin
```
1. Go to: admin.microsoft.com
2. Click: Exchange Admin Center
3. Go to: Mail flow → Rules
```

### Create New Rule
```
1. Click: + Add a rule
2. Name: "Syntra Email Signature - GIF Banner"
3. Apply to: All users (or specific group)
4. Do the following: Append disclaimer
```

### Add HTML
```
1. Click: "Enter text"
2. Paste: Contents of signature-gif-banner.html
3. Fallback: Wrap
4. Mode: Enforce
```

### Save and Test
```
1. Click: Save
2. Set priority: 1 (highest)
3. Wait: 5-10 minutes for propagation
4. Send test email to yourself
```

---

## ✅ Verification Checklist

After deployment, check:

- [ ] GIF banner displays at top of signature
- [ ] Animation plays smoothly
- [ ] Your name appears correctly
- [ ] Your title appears correctly
- [ ] Your email is linked correctly
- [ ] Website link works
- [ ] Signature looks good on mobile
- [ ] Works in Outlook desktop
- [ ] Works in Gmail
- [ ] Works in Outlook mobile

---

## 📊 Troubleshooting

### GIF Not Showing
**Check:**
- URL is correct
- File uploaded successfully
- URL is HTTPS (not HTTP)
- File is publicly accessible

**Test:**
```bash
curl -I [YOUR_GIF_URL]
```

### Variables Not Replaced
**Issue:** Shows `{{FULL_NAME}}` instead of actual name

**Fix:**
- Use M365 dynamic fields: `%%displayName%%`
- Verify user profiles are complete in M365
- Wait 10-15 minutes for rule to propagate

### Animation Not Working
**Issue:** Shows static image

**Notes:**
- In Outlook reading pane: Normal (animates when opened)
- In Gmail: Should animate immediately
- On mobile: Should animate

---

## 📁 File Reference

### Files You Need
```
gif-capture-template.html        → For recording
signature-gif-banner.html        → For deployment
syntra-banner-animated.gif       → Your created GIF
```

### Documentation
```
GIF_BANNER_GUIDE.md             → Complete guide
GIF_BANNER_SUMMARY.md           → Overview
QUICK_START_GIF.md              → This file
```

---

## 🎯 Key Specifications

### GIF Requirements
- **Dimensions:** 550 x 200 pixels
- **Duration:** 20 seconds minimum
- **Frame Rate:** 20 FPS
- **File Size:** Under 1MB preferred
- **Format:** GIF

### Hosting Requirements
- **Protocol:** HTTPS required
- **Access:** Public (no auth)
- **Location:** Syntra servers or CDN

---

## 💡 Pro Tips

### Best Results
- Record in Chrome (best rendering)
- Use 20-25 FPS for smooth animation
- Optimize GIF to under 1MB
- Test in Outlook first (most important)
- Start with small test group

### Common Mistakes
- ❌ Using HTTP instead of HTTPS
- ❌ Not optimizing GIF (file too large)
- ❌ Recording at low frame rate (choppy)
- ❌ Not testing in multiple clients
- ❌ Forgetting to replace variables

---

## 📞 Need Help?

### Full Documentation
See `GIF_BANNER_GUIDE.md` for comprehensive instructions

### Support Contacts
- **GIF Creation Issues:** IT Department
- **M365 Deployment:** Exchange Admin
- **Design Questions:** Marketing Team

---

## 🏁 You're Done!

If you followed all steps:
- ✅ GIF banner created
- ✅ GIF hosted publicly
- ✅ Signature deployed to M365
- ✅ Tested and verified

**Your professional animated email signature is now live!**

---

**Time to Complete:** ~20 minutes
**Difficulty:** Easy to Medium
**Result:** Professional animated email signature

*For detailed information, see: `GIF_BANNER_GUIDE.md`*
