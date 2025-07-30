# CrisisMatch Template Customization Guide

## Quick Start for New Disasters

This guide shows you how to quickly customize CrisisMatch for a specific disaster event in under 5 minutes.

## Step 1: Choose Your Template

Edit `template-config.json` and either:
- **Use existing template**: Change `"default_template"` to one of the existing options
- **Create new template**: Add a new disaster configuration

### Available Templates
- `texas_floods_2025` - Flooding emergency
- `california_fires_2025` - Wildfire emergency  
- `florida_hurricane_2025` - Hurricane emergency
- `mock_drill` - Training/drill scenarios

## Step 2: Customize Your Disaster

### Basic Configuration
```json
{
  "event_id": "event_2025_your_disaster",
  "event_name": "Your Disaster Name 2025",
  "app_title": "CrisisMatch - Your Disaster 2025",
  "primary_color": "#dc2626",
  "secondary_color": "#1e40af"
}
```

### Location Filters
Customize the search filters for your specific area:
```json
"location_filters": [
  "All Areas",
  "Your County",
  "Your City",
  "Neighboring Area"
]
```

### Disaster-Specific Fields
Add relevant evacuation zones and shelter locations:
```json
"disaster_specific_fields": {
  "evacuation_zones": ["Zone 1", "Zone 2", "Zone 3"],
  "shelter_locations": ["Main Shelter", "Secondary Shelter"]
}
```

### Custom Messaging
Update the header and description text:
```json
"messaging": {
  "header_text": "Your Disaster Emergency Response",
  "description": "Report missing persons during your specific emergency.",
  "emergency_contact": "Call 911 for immediate emergencies"
}
```

## Step 3: Apply Template (Automated)

Run the template application script:
```bash
npm run apply-template
```

This will automatically update:
- ✅ Event selector options
- ✅ Page titles and headers
- ✅ Color schemes
- ✅ Search filters
- ✅ Default event ID

## Step 4: Manual Customizations (Optional)

### Update App Title
Edit `index.html`:
```html
<title>CrisisMatch - Your Disaster 2025</title>
```

### Customize Colors
Edit `src/App.css` for custom color schemes:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Add Custom Branding
Replace logo files in `public/` directory:
- `icon-192.png`
- `icon-512.png`
- `favicon.ico`

## Step 5: Deploy

### GitHub Pages Deployment
1. Push to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Your app will be live at: `https://yourusername.github.io/your-repo-name/`

### Quick Deployment Commands
```bash
# Build the application
npm run build

# Deploy to GitHub Pages (if configured)
npm run deploy
```

## Template Structure

### File Locations
- **Configuration**: `template-config.json`
- **Event Selector**: `src/components/EventSelector.jsx`
- **Search Filters**: `src/pages/SearchPage.jsx`
- **App Title**: `index.html`
- **Styling**: `src/App.css`

### Automated Updates
The template system automatically updates:
- Default event ID in localStorage
- Event selector dropdown options
- Page titles and headers
- Search filter options
- Color schemes (if specified)

## Common Disaster Types

### Flooding
```json
"location_filters": ["All Areas", "Flood Zone A", "Flood Zone B", "High Ground Areas"]
"evacuation_zones": ["Mandatory Evacuation", "Voluntary Evacuation", "Safe Zones"]
```

### Wildfires
```json
"location_filters": ["All Areas", "Red Zone", "Yellow Zone", "Green Zone", "Safe Areas"]
"evacuation_zones": ["Immediate Evacuation", "Prepare to Leave", "Ready Status"]
```

### Hurricanes
```json
"location_filters": ["All Areas", "Coastal Areas", "Inland Areas", "Storm Surge Zones"]
"evacuation_zones": ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
```

### Earthquakes
```json
"location_filters": ["All Areas", "Affected Districts", "Search & Rescue Zones", "Safe Areas"]
"evacuation_zones": ["Damaged Areas", "Inspection Required", "Safe to Occupy"]
```

## Best Practices

### Naming Conventions
- **Event IDs**: `event_YYYY_location_type` (e.g., `event_2025_tx_floods`)
- **Repository Names**: `crisis-match-location-disaster-year` (e.g., `crisis-match-texas-floods-2025`)
- **Deployment URLs**: Keep them short and memorable

### Geographic Specificity
- Use **local county/city names** that residents recognize
- Include **major landmarks** as reference points
- Add **evacuation route** information if relevant

### Emergency Contacts
- Always include **911** for immediate emergencies
- Add **local emergency management** contact if available
- Include **disaster-specific hotlines** when applicable

## Deployment Checklist

- [ ] Template configuration updated
- [ ] Colors and branding customized
- [ ] Location filters relevant to disaster area
- [ ] Emergency contact information accurate
- [ ] App title reflects specific disaster
- [ ] GitHub repository created with descriptive name
- [ ] GitHub Pages enabled
- [ ] Application tested locally
- [ ] Deployment URL shared with emergency coordinators

## Support

For technical support or questions about template customization:
- Check the main `README.md` for general setup
- Review `DEDUPLICATION_SYSTEM.md` for duplicate prevention details
- See `DEPLOYMENT_GUIDE.md` for hosting options

## Quick Reference

### 5-Minute Deployment
1. **Fork** this repository
2. **Edit** `template-config.json` with your disaster details
3. **Run** `npm run apply-template`
4. **Push** to GitHub
5. **Enable** GitHub Pages

Your disaster-specific CrisisMatch instance will be live and ready for emergency use!

