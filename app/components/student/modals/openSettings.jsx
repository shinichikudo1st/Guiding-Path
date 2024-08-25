import { useState } from "react";

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
    <div className="absolute w-[250px] h-[300px] z-10 right-[10%] top-20 rounded-[10px] bg-[#f8f9fa] shadow dark:bg-gray-800 flex flex-col items-center pt-[30px] text-[#062341]">
      <div className=" h-[30px] w-[150px] border-b-[2px] border-[#062341] font-medium cursor-pointer text-center">
        Change Password
      </div>
    </div>
  );
};

export default OpenSettings;
