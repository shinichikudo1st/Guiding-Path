import CloseButton from "../../UI/closeButton";
import MeterBar from "../../UI/meterBar";

const ViewScore = ({ areaScores, close }) => {
  return (
    <div className="absolute w-screen h-screen flex justify-center items-center z-10">
      <div className="absolute w-[100%] h-[100%] bg-black opacity-75 z-20"></div>
      <div className="grid grid-cols-3 bg-[#dfecf6] w-[80%] h-[90%] opacity-100 z-30 rounded-[20px]">
        <div className="flex col-span-3 items-center pl-[10%] text-[20pt] font-bold">
          Evaluation Area Scores
          <CloseButton buttonAction={close} />
        </div>
        <div className="flex flex-col gap-[5%] bg-blue-200 row-span-4 items-center pt-[10%]">
          <span className="text-[15pt] font-bold">Academic Assessment</span>
          <MeterBar />
          <span className="mt-[10%] font-semibold">
            "Moderate Academic Performance"
          </span>
          <p className=" mx-[10%] text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid
            eum aspernatur soluta praesentium voluptates vitae neque molestiae
            sint dicta recusandae, perferendis repellat natus accusantium ullam.
            Laborum qui labore iusto tempore!
          </p>
          <p className=" mx-[10%] text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid
            eum aspernatur soluta praesentium voluptates vitae neque molestiae
            sint dicta recusandae, perferendis repellat natus accusantium ullam.
            Laborum qui labore iusto tempore!
          </p>
        </div>
        <div className="flex flex-col gap-[5%] bg-green-200 row-span-4 items-center pt-[10%]">
          <span className="text-[15pt] font-bold">
            Socio-Emotional Well Being
          </span>
          <MeterBar />
          <span className="mt-[10%] font-semibold">"Neutral/Stable"</span>
          <p className=" mx-[10%] text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid
            eum aspernatur soluta praesentium voluptates vitae neque molestiae
            sint dicta recusandae, perferendis repellat natus accusantium ullam.
            Laborum qui labore iusto tempore!
          </p>
          <p className=" mx-[10%] text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid
            eum aspernatur soluta praesentium voluptates vitae neque molestiae
            sint dicta recusandae, perferendis repellat natus accusantium ullam.
            Laborum qui labore iusto tempore!
          </p>
        </div>
        <div className="flex flex-col gap-[5%] bg-yellow-200 row-span-4 items-center pt-[10%]">
          <span className="text-[15pt] font-bold">Career Exploration</span>
          <MeterBar />
          <span className="mt-[10%] font-semibold">
            "Moderate Career Clarity"
          </span>
          <p className=" mx-[10%] text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid
            eum aspernatur soluta praesentium voluptates vitae neque molestiae
            sint dicta recusandae, perferendis repellat natus accusantium ullam.
            Laborum qui labore iusto tempore!
          </p>
          <p className=" mx-[10%] text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid
            eum aspernatur soluta praesentium voluptates vitae neque molestiae
            sint dicta recusandae, perferendis repellat natus accusantium ullam.
            Laborum qui labore iusto tempore!
          </p>
        </div>
        <div className="flex col-span-3"></div>
      </div>
    </div>
  );
};

export default ViewScore;
