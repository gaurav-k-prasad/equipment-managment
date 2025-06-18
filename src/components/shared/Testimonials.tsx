import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager",
      company: "TechCorp Industries",
      content:
        "Equipment Manager has revolutionized how we track and maintain our assets. The real-time analytics have helped us reduce downtime by 40%.",
      rating: 5,
      avatar: "/api/placeholder/60/60",
    },
    {
      name: "Michael Chen",
      role: "Facility Director",
      company: "Global Manufacturing Co.",
      content:
        "The maintenance scheduling feature is a game-changer. We've never missed a maintenance window since implementing this platform.",
      rating: 5,
      avatar: "/api/placeholder/60/60",
    },
    {
      name: "Emily Rodriguez",
      role: "Asset Manager",
      company: "Construction Solutions Ltd.",
      content:
        "The mobile app allows our field teams to update equipment status in real-time. It's incredibly user-friendly and reliable.",
      rating: 5,
      avatar: "/api/placeholder/60/60",
    },
    {
      name: "David Thompson",
      role: "IT Director",
      company: "Healthcare Systems Inc.",
      content:
        "Security was our top concern, and Equipment Manager exceeded our expectations. The role-based access control is excellent.",
      rating: 5,
      avatar: "/api/placeholder/60/60",
    },
    {
      name: "Lisa Wang",
      role: "Plant Manager",
      company: "Automotive Parts Co.",
      content:
        "The performance tracking features have given us insights we never had before. We've optimized our equipment utilization significantly.",
      rating: 5,
      avatar: "/api/placeholder/60/60",
    },
    {
      name: "Robert Kim",
      role: "Operations Director",
      company: "Energy Solutions Corp.",
      content:
        "The customizable workflows perfectly match our business processes. Implementation was smooth and the support team is outstanding.",
      rating: 5,
      avatar: "/api/placeholder/60/60",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about how Equipment Manager has
            transformed their operations and improved efficiency.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-blue-600 opacity-20" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              10,000+
            </div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              500,000+
            </div>
            <div className="text-gray-600">Assets Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              99.9%
            </div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              4.9/5
            </div>
            <div className="text-gray-600">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
