import { useState } from "react";
import { FiLock, FiBell } from "react-icons/fi";

const OpenSettings = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData(event.target);
    const formPassword = formData.get("password");

    if (!formPassword) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formPassword }),
      });

      const result = await response.json();
      console.log(result.message);
    } catch (error) {}

    setLoading(false);
  };

  return (
    <div className="absolute w-[250px] h-[300px] z-10 right-[10%] top-20 rounded-[10px] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg flex flex-col items-center pt-[20px] text-[#062341]">
      <h2 className="text-xl font-bold mb-6 text-blue-800">Settings</h2>
      <div className="w-full px-6 space-y-4">
        <SettingItem
          icon={<FiLock className="text-blue-600" />}
          text="Change Password"
          onClick={() => {
            /* Add functionality */
          }}
        />
        <SettingItem
          icon={<FiBell className="text-blue-600" />}
          text="Notifications"
          onClick={() => {
            /* Add functionality */
          }}
        />
      </div>
    </div>
  );
};

const SettingItem = ({ icon, text, onClick }) => (
  <div
    className="flex items-center p-3 rounded-lg bg-white hover:bg-blue-50 cursor-pointer transition-all duration-300 shadow-sm hover:shadow"
    onClick={onClick}
  >
    <span className="mr-4 text-xl">{icon}</span>
    <span className="font-medium">{text}</span>
  </div>
);

export default OpenSettings;
