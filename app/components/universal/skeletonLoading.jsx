import { motion } from "framer-motion";

const SkeletonLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8">
            <div className="h-8 w-64 bg-white/20 rounded-lg mx-auto animate-pulse" />
          </div>

          <div className="p-8 sm:p-10">
            {/* Profile Picture Skeleton */}
            <div className="flex justify-center mb-10">
              <div className="w-32 h-32 rounded-full bg-[#0B6EC9]/10 animate-pulse" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white/50 rounded-xl p-6 shadow-sm animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0B6EC9]/10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-20 bg-[#0B6EC9]/10 rounded" />
                      <div className="h-5 w-32 bg-[#0B6EC9]/10 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <div className="h-12 w-32 bg-[#0B6EC9]/10 rounded-xl animate-pulse" />
              <div className="h-12 w-32 bg-[#0B6EC9]/10 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonLoading;
