import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  UserCheck, 
  Shield, 
  Clock, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Play,
  Users,
  MapPin,
  AlertTriangle,
  Zap,
  ExternalLink,
  ChevronDown,
  Mail
} from 'lucide-react';

function LandingPage() {
  const [requestFormOpen, setRequestFormOpen] = useState(false);
  const [activeInstancesOpen, setActiveInstancesOpen] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    disasterType: '',
    location: '',
    urgency: 'standard',
    description: '',
    honeypot: '' // Hidden field for spam protection
  });

  // Active emergency instances - now redirect to demo with disaster parameters
  const activeInstances = [
    {
      id: 'ca-wildfire-2024',
      name: 'California Wildfire 2024',
      location: 'Los Angeles County, CA',
      type: 'Wildfire',
      status: 'Active',
      url: '/demo?disaster=ca-wildfire-2024&name=California%20Wildfire%202024',
      reportCount: 847,
      lastUpdated: '2 hours ago',
      isDemo: true
    },
    {
      id: 'tx-flooding-2024',
      name: 'Texas Flooding 2024',
      location: 'Houston Metro Area, TX',
      type: 'Flood',
      status: 'Active',
      url: '/demo?disaster=tx-flooding-2024&name=Texas%20Flooding%202024',
      reportCount: 312,
      lastUpdated: '45 minutes ago',
      isDemo: true
    },
    {
      id: 'fl-hurricane-2024',
      name: 'Hurricane Milton 2024',
      location: 'Southwest Florida',
      type: 'Hurricane',
      status: 'Active',
      url: '/demo?disaster=fl-hurricane-2024&name=Hurricane%20Milton%202024',
      reportCount: 1203,
      lastUpdated: '1 hour ago',
      isDemo: true
    },
    {
      id: 'nc-tornado-2024',
      name: 'North Carolina Tornado Outbreak',
      location: 'Central NC',
      type: 'Tornado',
      status: 'Active',
      url: '/demo?disaster=nc-tornado-2024&name=North%20Carolina%20Tornado%20Outbreak',
      reportCount: 89,
      lastUpdated: '3 hours ago',
      isDemo: true
    },
    {
      id: 'co-wildfire-2024',
      name: 'Colorado Mountain Fire',
      location: 'Boulder County, CO',
      type: 'Wildfire',
      status: 'Monitoring',
      url: '/demo?disaster=co-wildfire-2024&name=Colorado%20Mountain%20Fire',
      reportCount: 156,
      lastUpdated: '6 hours ago',
      isDemo: true
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's likely a bot
    if (formData.honeypot) {
      alert('Spam detected. Request blocked.');
      return;
    }

    // Validate required fields
    if (!formData.organizationName || !formData.contactName || !formData.email || 
        !formData.phone || !formData.disasterType || !formData.location) {
      alert('Please fill in all required fields.');
      return;
    }

    // Create email content
    const subject = `CrisisMatch Emergency Instance Request - ${formData.organizationName}`;
    const body = `
EMERGENCY INSTANCE REQUEST

Organization: ${formData.organizationName}
Contact Name: ${formData.contactName}
Email: ${formData.email}
Phone: ${formData.phone}

Disaster Details:
Type: ${formData.disasterType}
Location: ${formData.location}
Urgency Level: ${formData.urgency}

Additional Details:
${formData.description || 'None provided'}

---
This request was submitted through the CrisisMatch emergency instance request form.
Please respond within 2 hours for critical requests, or as specified by the urgency level.
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:kat@fastlynk.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show confirmation and close form
    alert('Your email client will open with the request pre-filled. Please send the email to complete your request.');
    setRequestFormOpen(false);
    
    // Reset form
    setFormData({
      organizationName: '',
      contactName: '',
      email: '',
      phone: '',
      disasterType: '',
      location: '',
      urgency: 'standard',
      description: '',
      honeypot: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-red-600 bg-red-100';
      case 'Monitoring': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'SHA256 hashing and name masking ensure sensitive data remains secure while maintaining functionality.'
    },
    {
      icon: Clock,
      title: 'Deploy in Minutes',
      description: 'Emergency-ready deployment in under 30 minutes. Every second counts during a crisis.'
    },
    {
      icon: Globe,
      title: 'Disaster Isolation',
      description: 'Each disaster gets its own secure instance with isolated data.'
    },
    {
      icon: Users,
      title: '3-Tier Deduplication',
      description: 'Advanced matching prevents duplicate reports while allowing legitimate multiple reports.'
    },
    {
      icon: MapPin,
      title: 'Location Intelligence',
      description: 'Smart location parsing and regional grouping for efficient search and coordination.'
    },
    {
      icon: Zap,
      title: 'Mobile Optimized',
      description: 'PWA capabilities with offline support, designed for high-stress emergency situations.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              CrisisMatch
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Emergency Missing Person Reporting System
            </p>
            <p className="text-lg mb-12 text-red-200 max-w-4xl mx-auto">
              Deploy disaster-specific emergency response platforms in minutes. 
              Reunite families, coordinate rescues, and save lives during critical situations.
            </p>
            
            {/* Active Emergency Instances Dropdown */}
            <div className="mb-8">
              <div className="relative inline-block">
                <button
                  onClick={() => setActiveInstancesOpen(!activeInstancesOpen)}
                  className="inline-flex items-center px-6 py-3 bg-white text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-all shadow-lg border-2 border-white"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find Your Emergency ({activeInstances.length} Active)
                  <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${activeInstancesOpen ? 'rotate-180' : ''}`} />
                </button>

                {activeInstancesOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Active Emergency Instances</h3>
                      <p className="text-sm text-gray-600 mt-1">Click to access the disaster reporting interface</p>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {activeInstances.map((instance) => (
                        <Link
                          key={instance.id}
                          to={instance.url}
                          className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => setActiveInstancesOpen(false)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-medium text-gray-500 mr-2">{instance.type}</span>
                                <h4 className="font-semibold text-gray-900">{instance.name}</h4>
                                {instance.isDemo && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    DEMO
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                {instance.location}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(instance.status)}`}>
                                  {instance.status}
                                </span>
                                <div className="text-xs text-gray-500">
                                  {instance.reportCount} reports • Updated {instance.lastUpdated}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-xs text-gray-600 text-center">
                        These are demonstration instances. For real emergency deployments, request a new instance below.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/demo"
                className="inline-flex items-center px-8 py-4 bg-white text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Try Live Demo
              </Link>
              
              <button
                onClick={() => setRequestFormOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-colors border-2 border-red-400"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Request Emergency Instance
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Emergency Response
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed for high-stress situations where every minute counts and privacy matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How CrisisMatch Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and effective family reunification to assist emergency response coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Missing</h3>
              <p className="text-gray-600">Family members report loved ones as missing with basic information.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search & Coordinate</h3>
              <p className="text-gray-600">Emergency responders can more effectively focus search efforts.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check In Safe</h3>
              <p className="text-gray-600">Persons in a disaster area can mark themselves safe to notify loved ones.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reunite Families</h3>
              <p className="text-gray-600">Real time matching can inform families faster about the status of their loved ones.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Deploy Emergency Response?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Get your disaster-specific CrisisMatch instance running in minutes, not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center px-8 py-4 bg-white text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              Explore Live Demo
            </Link>
            
            <button
              onClick={() => setRequestFormOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-colors border-2 border-red-400"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Request Emergency Deployment
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {activeInstancesOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveInstancesOpen(false)}
        />
      )}

      {/* Request Form Modal */}
      {requestFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-red-600" />
                  Request Emergency Instance
                </h3>
                <button
                  onClick={() => setRequestFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                This will open your email client with the request pre-filled. Send the email to complete your request.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Honeypot field - hidden from users but visible to bots */}
              <input
                type="text"
                name="website"
                value={formData.honeypot}
                onChange={(e) => setFormData({...formData, honeypot: e.target.value})}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Emergency Management Agency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="john@agency.gov"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disaster Type *
                  </label>
                  <select
                    required
                    value={formData.disasterType}
                    onChange={(e) => setFormData({...formData, disasterType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select disaster type</option>
                    <option value="hurricane">Hurricane</option>
                    <option value="flood">Flood</option>
                    <option value="wildfire">Wildfire</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="tornado">Tornado</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Houston, TX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level *
                </label>
                <select
                  required
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="critical">Critical - Deploy immediately (within 30 minutes)</option>
                  <option value="urgent">Urgent - Deploy within 2 hours</option>
                  <option value="standard">Standard - Deploy within 24 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Any specific requirements or additional information..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setRequestFormOpen(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Open Email Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
