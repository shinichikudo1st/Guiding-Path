import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaCalendarCheck,
  FaChartLine,
  FaComments,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUserGraduate className="w-8 h-8" />,
    title: "Academic Guidance",
    description:
      "Get personalized academic advice and support from experienced counselors.",
  },
  {
    icon: <FaCalendarCheck className="w-8 h-8" />,
    title: "Appointment Scheduling",
    description: "Easily schedule and manage counseling appointments online.",
  },
  {
    icon: <FaChartLine className="w-8 h-8" />,
    title: "Progress Tracking",
    description: "Monitor your academic progress and achievements over time.",
  },
  {
    icon: <FaComments className="w-8 h-8" />,
    title: "Communication Hub",
    description: "Stay connected with counselors and receive timely updates.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-[#E6F0F9] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#0B6EC9]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#062341]/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#062341] mb-4">
            Features that Empower Your Journey
          </h2>
          <p className="mt-4 text-xl text-[#062341]/80 max-w-2xl mx-auto">
            Everything you need to succeed in your academic career
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px -10px rgba(6, 35, 65, 0.2)",
                zIndex: 20,
              }}
              className="group relative bg-gradient-to-b from-[#F8FAFC] to-[#E6F0F9] rounded-2xl p-8 shadow-lg transition-all duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B6EC9] to-[#062341] rounded-t-2xl"></div>

              <div className="w-14 h-14 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center text-white mb-6 shadow-lg transform -rotate-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-[#062341] mb-3">
                {feature.title}
              </h3>

              <p className="text-[#062341]/70 leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 bg-[#0B6EC9] rounded-full flex items-center justify-center text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-6 py-3 bg-[#062341]/5 rounded-full text-[#062341] font-semibold">
            Want to learn more about our features?
            <button className="ml-4 px-4 py-2 bg-[#0B6EC9] text-white rounded-full hover:bg-[#095396] transition-colors duration-300">
              View Details
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#0B6EC9]/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-[#062341]/5 rounded-full"></div>
      </div>
    </section>
  );
};

export default Features;
