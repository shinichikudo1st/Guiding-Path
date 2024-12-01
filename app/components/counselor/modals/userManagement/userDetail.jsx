import { motion } from "framer-motion";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaEnvelope, FaPhone, FaUserTag, FaIdCard } from "react-icons/fa";

const UserDetails = ({ user, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl"
      >
        {/* Header with profile picture */}
        <div className="relative h-48 bg-gradient-to-r from-[#0B6EC9] to-[#095396]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <IoClose className="text-xl" />
          </button>
          <div className="absolute -bottom-16 left-6">
            <Image
              src={user.profilePicture || "/noProfile.png"}
              alt={user.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* User information */}
        <div className="pt-20 px-6 pb-6">
          <h2 className="text-2xl font-bold text-[#062341]">{user.name}</h2>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={<FaIdCard />}
                label="User ID"
                value={user.user_id}
              />
              <InfoCard
                icon={<FaUserTag />}
                label="Role"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              />
              <InfoCard
                icon={<FaEnvelope />}
                label="Email"
                value={user.email}
              />
              <InfoCard
                icon={<FaPhone />}
                label="Contact"
                value={user.contact}
              />
            </div>

            {user.student && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Academic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-600">Program</p>
                    <p className="font-medium text-[#062341]">
                      {user.student.program || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Grade Level</p>
                    <p className="font-medium text-[#062341]">
                      {user.student.grade_level || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Department</p>
                    <p className="font-medium text-[#062341]">
                      {user.student.department || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
    <div className="text-[#0B6EC9] mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-[#062341]">{value}</p>
    </div>
  </div>
);

export default UserDetails;
