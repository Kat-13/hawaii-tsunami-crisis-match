#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load template configuration
const configPath = path.join(__dirname, '..', 'template-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Get template name from command line or use default
const templateName = process.argv[2] || config.default_template;
const template = config.disaster_templates[templateName];

if (!template) {
  console.error(`Template "${templateName}" not found!`);
  console.log('Available templates:', Object.keys(config.disaster_templates).join(', '));
  process.exit(1);
}

console.log(`Applying template: ${templateName}`);
console.log(`Event: ${template.event_name}`);

// Update EventSelector.jsx
const eventSelectorPath = path.join(__dirname, '..', 'src', 'components', 'EventSelector.jsx');
let eventSelectorContent = fs.readFileSync(eventSelectorPath, 'utf8');

// Replace the events array
const newEventsArray = `const events = [
  { id: '${template.event_id}', name: '${template.event_name}' },
  { id: 'event_mock_drill', name: 'Emergency Response Drill' }
];`;

eventSelectorContent = eventSelectorContent.replace(
  /const events = \[[\s\S]*?\];/,
  newEventsArray
);

fs.writeFileSync(eventSelectorPath, eventSelectorContent);
console.log('✓ Updated EventSelector.jsx');

// Update index.html title
const indexPath = path.join(__dirname, '..', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

indexContent = indexContent.replace(
  /<title>.*<\/title>/,
  `<title>${template.app_title}</title>`
);

fs.writeFileSync(indexPath, indexContent);
console.log('✓ Updated index.html title');

// Update SearchPage.jsx with location filters
const searchPagePath = path.join(__dirname, '..', 'src', 'pages', 'SearchPage.jsx');
let searchPageContent = fs.readFileSync(searchPagePath, 'utf8');

// Create location filter options
const locationOptions = template.location_filters.map(location => 
  `                <option value="${location}">${location}</option>`
).join('\n');

// Replace location filter section (this is a simplified approach)
// In a real implementation, you'd want more sophisticated parsing
console.log('✓ Location filters ready for manual update');
console.log('  Add these options to SearchPage.jsx location filter:');
template.location_filters.forEach(location => {
  console.log(`    <option value="${location}">${location}</option>`);
});

// Update package.json name
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.name = `crisis-match-${templateName.replace(/_/g, '-')}`;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log('✓ Updated package.json name');

// Create environment file with default event
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = `VITE_DEFAULT_EVENT_ID=${template.event_id}
VITE_EVENT_NAME="${template.event_name}"
VITE_APP_TITLE="${template.app_title}"
VITE_PRIMARY_COLOR="${template.primary_color}"
VITE_SECONDARY_COLOR="${template.secondary_color}"
`;

fs.writeFileSync(envPath, envContent);
console.log('✓ Created .env.local with template variables');

// Create deployment-specific README
const deploymentReadmePath = path.join(__dirname, '..', 'DEPLOYMENT_README.md');
const deploymentReadmeContent = `# ${template.event_name} - CrisisMatch Deployment

## Quick Info
- **Event**: ${template.event_name}
- **Event ID**: ${template.event_id}
- **Template Applied**: ${templateName}
- **Primary Color**: ${template.primary_color}

## Emergency Information
${template.messaging.header_text}

${template.messaging.description}

**${template.messaging.emergency_contact}**

## Location Coverage
${template.location_filters.map(loc => `- ${loc}`).join('\n')}

## Evacuation Zones
${template.disaster_specific_fields.evacuation_zones.map(zone => `- ${zone}`).join('\n')}

## Shelter Locations
${template.disaster_specific_fields.shelter_locations.map(shelter => `- ${shelter}`).join('\n')}

## Deployment
This instance is configured for ${template.event_name}. 

To deploy:
1. Push to GitHub repository
2. Enable GitHub Pages
3. Share the live URL with emergency coordinators

## Support
For technical issues or updates, refer to the main documentation files.
`;

fs.writeFileSync(deploymentReadmePath, deploymentReadmeContent);
console.log('✓ Created deployment-specific README');

console.log('\n🎉 Template application complete!');
console.log('\nNext steps:');
console.log('1. Review the updated files');
console.log('2. Manually update SearchPage.jsx location filters if needed');
console.log('3. Test the application locally: npm run dev');
console.log('4. Build and deploy: npm run build');
console.log('\nYour CrisisMatch instance is ready for', template.event_name);

