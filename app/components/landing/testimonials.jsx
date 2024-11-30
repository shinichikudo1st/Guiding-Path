import { motion } from "framer-motion";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    content:
      "The guidance I received helped me improve my academic performance significantly.",
    author: "Carlito Huerte",
    role: "Information Systems Student",
    image: "/carlito.jpg",
  },
  {
    content:
      "An excellent platform that makes counseling services easily accessible.",
    author: "Vaughn Andre Camangyan",
    role: "Information Systems Student",
    image: "/vaughn.jpg",
  },
  {
    content:
      "The scheduling system is efficient and the counselors are very helpful.",
    author: "Nino Etchon Hipolito",
    role: "Information Systems Student",
    image: "/etchon.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-[#F8FAFC] relative z-10">
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
            What Our Students Say
          </h2>
          <p className="mt-4 text-xl text-[#062341]/80 max-w-2xl mx-auto">
            Real experiences from students using our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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

              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-full flex items-center justify-center text-white shadow-lg">
                <FaQuoteLeft className="w-5 h-5" />
              </div>

              <p className="text-[#062341]/80 mb-8 mt-4 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-full blur-sm"></div>
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full relative"
                  />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-[#062341] group-hover:text-[#0B6EC9] transition-colors duration-300">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-[#062341]/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#0B6EC9]/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-[#062341]/5 rounded-full"></div>
      </div>
    </section>
  );
};

export default Testimonials;
