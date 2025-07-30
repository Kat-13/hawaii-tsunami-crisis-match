# CrisisMatch - Emergency Response System

## 🚨 Quick Deployment for Emergencies

**Deploy a disaster-specific CrisisMatch instance in under 5 minutes:**

1. **Fork this repository**
2. **Run**: `npm run apply-template texas_floods_2025` (or your disaster)
3. **Enable GitHub Pages** in repository settings
4. **Your emergency response app is live!**

## 🎯 What is CrisisMatch?

CrisisMatch is a web-based emergency response system designed for disaster scenarios. It enables:

- ✅ **Missing person reporting** with privacy protection
- ✅ **Safety check-ins** for those reported missing
- ✅ **Search and filtering** with fuzzy matching
- ✅ **Data export** for emergency coordinators
- ✅ **3-tier deduplication** to prevent duplicate records
- ✅ **PWA capabilities** for offline use
- ✅ **Mobile-responsive** design

## 🚀 Template System

### Available Templates
- **Texas Floods 2025** - Flooding emergency response
- **California Fires 2025** - Wildfire emergency response
- **Florida Hurricane 2025** - Hurricane emergency response
- **Mock Drill** - Training and drill scenarios

### Apply a Template
```bash
# Install dependencies
npm install

# Apply disaster-specific template
npm run apply-template texas_floods_2025

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Features

### 3-Tier Deduplication System
- **Tier 1**: Exact match prevention (auto-blocks duplicates)
- **Tier 2**: Strong similarity detection (user confirmation)
- **Tier 3**: Loose matching (user warning)

### Privacy Protection
- **SHA256 hashing** of sensitive data (DOB, SSN)
- **Name masking** in public displays (J*** D***)
- **Secure data handling** throughout the system

### Emergency-Ready Design
- **High-stress usability** with clear interfaces
- **Mobile-first** responsive design
- **Offline capabilities** through PWA
- **Fast deployment** for time-critical situations

## 📱 Pages and Functionality

### Report Missing Person
- Collect essential information with validation
- Duplicate prevention with 3-tier system
- Privacy-focused data collection

### Safety Check-In
- Allow missing persons to mark themselves safe
- Exact match verification for security
- Update existing records automatically

### Search and Filter
- Fuzzy search across all reports
- Filter by status (Missing/Safe)
- Sort by date, location, or status
- Masked names for privacy

### Data Export
- JSON and CSV export formats
- Event-scoped data export
- Emergency coordinator tools

## 🗄️ Database Integration

### Supabase Setup (Optional)
For full functionality with persistent data:

1. Create a Supabase project
2. Run the SQL schema from `SUPABASE_SETUP.md`
3. Add environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Without Database
The app works as a demonstration tool without a database:
- Forms validate and show appropriate messages
- Search interface displays properly
- Export functions work with sample data

## 🌐 Deployment Options

### GitHub Pages (Recommended)
- **Free hosting** with automatic deployments
- **Custom domains** supported
- **HTTPS** included
- **Global CDN** for fast loading

See `GITHUB_DEPLOYMENT.md` for detailed instructions.

### Other Hosting Options
- **Netlify** - Drag and drop deployment
- **Vercel** - Git-based deployment
- **Railway** - Modern hosting platform
- **Surge.sh** - Simple static hosting

## 📚 Documentation

- **`TEMPLATE_CUSTOMIZATION.md`** - How to customize for specific disasters
- **`GITHUB_DEPLOYMENT.md`** - Complete GitHub Pages deployment guide
- **`DEDUPLICATION_SYSTEM.md`** - Technical details of duplicate prevention
- **`SUPABASE_SETUP.md`** - Database configuration instructions
- **`DEPLOYMENT_GUIDE.md`** - General deployment options

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── utils/              # Utility functions
│   ├── supabase.js     # Database client
│   ├── hash.js         # Privacy hashing
│   └── fuzzy.js        # Deduplication logic
└── App.jsx             # Main application component

public/                 # Static assets
scripts/                # Automation scripts
template-config.json    # Disaster templates
```

## 🚨 Emergency Use Cases

### Natural Disasters
- **Hurricanes** - Track evacuees and missing persons
- **Floods** - Coordinate rescue operations
- **Wildfires** - Manage evacuation zones
- **Earthquakes** - Search and rescue coordination

### Training and Drills
- **Emergency response training**
- **Disaster preparedness exercises**
- **Multi-agency coordination drills**

### Mass Casualty Events
- **Family reunification**
- **Missing person coordination**
- **Emergency response management**

## 🔒 Security and Privacy

### Data Protection
- **Client-side hashing** of sensitive information
- **No plain-text storage** of personal data
- **Privacy-first design** throughout

### Emergency Compliance
- **HIPAA considerations** for medical emergencies
- **Privacy regulations** compliance
- **Emergency exemptions** where applicable

## 🤝 Contributing

### For Emergency Responders
- Report bugs or usability issues
- Suggest disaster-specific features
- Share deployment experiences

### For Developers
- Submit pull requests for improvements
- Add new disaster templates
- Enhance deduplication algorithms

## 📞 Support

### Emergency Deployment Support
For urgent deployment assistance during active disasters:
- Check the Issues tab for common problems
- Review documentation for quick solutions
- Community support through GitHub Discussions

### Technical Support
- **Documentation** - Comprehensive guides included
- **GitHub Issues** - Bug reports and feature requests
- **Community** - Share experiences and solutions

## 📄 License

This project is designed for emergency response and public safety use. See LICENSE file for details.

## 🙏 Acknowledgments

Built for emergency responders, disaster relief organizations, and communities in crisis. Every minute counts during emergencies - this tool is designed to save time and potentially save lives.

---

**🚨 For Active Emergencies: Deploy immediately using the quick start guide above. Detailed customization can be done after the emergency response is active.**

