# Syntra Refining Email Signature

## Professional Email Signature System

This directory contains the official Syntra Refining Corporation email signature for organization-wide deployment.

---

## 📁 Files

### 1. **signature-static.html**
The default, recommended email signature.
- Clean, professional layout
- Works in all email clients including Outlook
- No animations - maximum compatibility
- **Status:** Production-ready

### 2. **signature-animated.html**
Enhanced version with subtle motion effects.
- Barely-visible gradient shift on top divider
- Subtle pulse effect on logo container
- Conveys advanced technology and precision
- Gracefully falls back to static in unsupported clients
- **Status:** Optional enhancement

### 3. **DEPLOYMENT_GUIDE.md**
Complete step-by-step deployment instructions.
- Microsoft 365 setup
- Logo hosting requirements
- Variable mapping
- Troubleshooting
- Maintenance procedures

---

## 🎨 Design Philosophy

**Industrial · Secure · Executive · Advanced**

The signature reflects Syntra Refining's identity:
- **High-technology focus** - Subtle motion suggests precision systems
- **Industrial credibility** - Clean, structured layout
- **Security-focused** - Dark logo container, professional restraint
- **Trust & reliability** - No clutter, no marketing language

---

## 🚀 Quick Start

### Before Deployment
1. ✅ Host the Syntra logo publicly (HTTPS required)
2. ✅ Update image URLs in both HTML files
3. ✅ Verify all users have complete profiles in Microsoft 365
4. ✅ Review and approve design with leadership

### Deploy to Microsoft 365
1. Open **Exchange Admin Center**
2. Create a new **Mail Flow Rule**
3. Use "Apply disclaimers" with signature HTML
4. Map variables to Exchange dynamic fields
5. Set to **Enforce** mode
6. Test with multiple email clients

**Detailed instructions:** See `DEPLOYMENT_GUIDE.md`

---

## 🔧 Technical Specifications

### Layout
- Left-aligned vertical design
- Mobile-responsive
- Table-based structure (email-safe)
- Inline CSS only

### Logo
- **Current:** White logo on dark background
- **Source:** `assets/images/SYNTRA REFINING WHITE LOGO KIT - SBG.png`
- **Display size:** 116px width
- **Background:** #1a1a1a (dark industrial)

### Typography
- System font stack for universal compatibility
- Weights: 400 (regular), 500 (medium), 600 (semibold)
- Clear hierarchy: Name → Title → Company → Contact

### Color Palette
- **Primary dark:** #1a1a1a
- **Medium gray:** #4a4a4a
- **Text gray:** #6a6a6a
- **Divider:** #d0d0d0
- **Links:** #1a1a1a (black, professional)

---

## 📋 Signature Content

### Dynamic Fields
These are populated automatically from Microsoft 365:
- **Full Name** - From user's display name
- **Job Title** - From user's title field
- **Email Address** - From primary email
- **Phone Number** - Optional, from mobile/phone field

### Static Content
These are the same for everyone:
- Company name: **Syntra Refining Corporation**
- Website: **www.syntrarefining.com**
- Location: **Halifax, Nova Scotia, Canada**
- Confidentiality notice

---

## 🎯 Governance

### Mandatory
- One signature for entire organization
- No personal customization allowed
- Applied centrally via Microsoft 365
- Only AD fields are dynamic

### Not Allowed
- Custom colors or fonts
- Additional links or social media
- Marketing slogans or taglines
- Personal branding elements
- Logo modifications

### Approval Required
Any changes to this signature require approval from:
- CIO
- Marketing/Brand Manager
- IT Security Lead

---

## 🧪 Testing Checklist

Before full deployment, test on:
- [ ] Outlook Desktop (Windows)
- [ ] Outlook Desktop (Mac)
- [ ] Outlook Web App
- [ ] Outlook Mobile (iOS)
- [ ] Outlook Mobile (Android)
- [ ] Gmail (web)
- [ ] Apple Mail
- [ ] Mobile email clients

**Key tests:**
- Logo displays correctly
- All text is readable
- Links work properly
- Layout doesn't break
- No horizontal scrolling on mobile

---

## 🐛 Common Issues

### Logo Not Showing
→ Verify logo is publicly hosted with valid HTTPS URL

### Signature Not Applying
→ Check Exchange rule is set to "Enforce" and has high priority

### Variables Show as "%%displayName%%"
→ User profile fields are missing in Microsoft 365

### Different formatting in Outlook vs Gmail
→ Expected behavior - minor rendering differences are normal

**Full troubleshooting guide:** See `DEPLOYMENT_GUIDE.md`

---

## 📞 Support

**Questions or issues?**
Contact: IT Support at support@syntrarefining.com

**Documentation updates?**
Submit through IT change management process

---

## 📈 Version Control

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | Jan 2026 | Initial release | Pending |

---

## 🔐 Security & Compliance

- No external scripts
- No tracking pixels
- No third-party integrations
- Confidentiality notice included
- Logo hosted on Syntra infrastructure only

---

**Maintained by:** Syntra Refining IT Department
**Last updated:** January 2026
**Status:** Production Ready
