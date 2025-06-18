import {
  BarChart3,
  Calendar,
  Shield,
  Smartphone,
  Database,
  Users,
  TrendingUp,
  Settings,
  Zap,
  Globe,
  Lock,
  Clock,
  Bell,
  FileText,
  MapPin,
  Smartphone as Mobile,
} from "lucide-react";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: BarChart3,
      title: "Real-time Analytics Dashboard",
      description:
        "Get comprehensive insights into your equipment performance with real-time dashboards and detailed reports.",
      features: [
        "Live performance metrics",
        "Customizable dashboards",
        "Export capabilities",
        "Historical data analysis",
      ],
    },
    {
      icon: Calendar,
      title: "Smart Maintenance Scheduling",
      description:
        "Automated maintenance scheduling with intelligent alerts and notifications to prevent equipment downtime.",
      features: [
        "Predictive maintenance",
        "Automated scheduling",
        "Email & SMS notifications",
        "Maintenance history tracking",
      ],
    },
    {
      icon: Shield,
      title: "Advanced Security & Compliance",
      description:
        "Enterprise-grade security features to protect your valuable equipment assets and sensitive data.",
      features: [
        "Role-based access control",
        "Data encryption",
        "Audit trails",
        "GDPR compliance",
      ],
    },
    {
      icon: Smartphone,
      title: "Mobile App Access",
      description:
        "Access your equipment data anywhere with our mobile app for iOS and Android devices.",
      features: [
        "Offline capability",
        "Barcode scanning",
        "Photo documentation",
        "Push notifications",
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: Database,
      title: "Centralized Database",
      description:
        "All your equipment data in one place with cloud-based storage and automatic backups.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Enable team collaboration with role-based access control and shared workspaces.",
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description:
        "Track equipment performance metrics and identify optimization opportunities.",
    },
    {
      icon: Settings,
      title: "Customizable Workflows",
      description:
        "Create custom workflows and automation rules to match your business processes.",
    },
    {
      icon: Zap,
      title: "Automation & Integration",
      description:
        "Seamlessly integrate with your existing tools and automate repetitive tasks.",
    },
    {
      icon: Globe,
      title: "Multi-location Support",
      description:
        "Manage equipment across multiple locations with centralized control.",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Reduce Downtime",
      description:
        "Preventive maintenance reduces unplanned downtime by up to 50%",
    },
    {
      icon: TrendingUp,
      title: "Increase Efficiency",
      description:
        "Streamlined processes improve operational efficiency by 30%",
    },
    {
      icon: Lock,
      title: "Enhanced Security",
      description: "Advanced security features protect your valuable assets",
    },
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Instant notifications for maintenance, issues, and updates",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Modern Equipment Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to manage your equipment efficiently, from
              tracking to maintenance, all in one comprehensive platform
              designed for modern businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful tools that will transform how you manage
              your equipment
            </p>
          </div>

          <div className="space-y-16">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="lg:w-1/2">
                    <div className="inline-flex p-4 rounded-xl bg-blue-50 mb-6">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:w-1/2">
                    <div className="bg-gray-100 rounded-xl p-8 h-64 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Icon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Feature Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              More tools to help you manage your equipment effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="inline-flex p-3 rounded-lg bg-blue-50 mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Equipment Manager?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the real impact our platform can have on your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-green-50 mb-4">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that have already transformed their
            equipment management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
