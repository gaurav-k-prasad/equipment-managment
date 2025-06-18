import {
  BarChart3,
  Calendar,
  Shield,
  Smartphone,
  Database,
  Users,
  TrendingUp,
  Settings,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Get comprehensive insights into your equipment performance with real-time dashboards and detailed reports.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Calendar,
      title: "Maintenance Scheduling",
      description:
        "Automated maintenance scheduling with alerts and notifications to prevent equipment downtime.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Shield,
      title: "Asset Security",
      description:
        "Advanced security features to protect your valuable equipment assets and sensitive data.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description:
        "Access your equipment data anywhere with our mobile app for iOS and Android devices.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Database,
      title: "Centralized Database",
      description:
        "All your equipment data in one place with cloud-based storage and automatic backups.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Enable team collaboration with role-based access control and shared workspaces.",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description:
        "Track equipment performance metrics and identify optimization opportunities.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Settings,
      title: "Customizable Workflows",
      description:
        "Create custom workflows and automation rules to match your business processes.",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Equipment Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your equipment efficiently, from
            tracking to maintenance, all in one comprehensive platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div
                  className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Equipment Management?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of companies that have already streamlined their
              operations with our comprehensive equipment management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
