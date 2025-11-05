import { useState } from "react";
import { useSplit } from "../../context/SplitContext";

const Step1SplitInfo = ({ nextStep }) => {
  const { formData, updateForm } = useSplit();
  const [localData, setLocalData] = useState({
    title: formData.title,
    date: formData.date,
    time: formData.time,
  });

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    updateForm(localData);
    nextStep();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white w-96">
      <h2 className="text-xl mb-4 font-semibold">Split Information</h2>
      <input
        name="title"
        placeholder="Enter title"
        value={localData.title}
        onChange={handleChange}
        className="w-full mb-2 p-2 rounded bg-gray-700"
      />
      <input
        type="date"
        name="date"
        value={localData.date}
        onChange={handleChange}
        className="w-full mb-2 p-2 rounded bg-gray-700"
      />
      <input
        type="time"
        name="time"
        value={localData.time}
        onChange={handleChange}
        className="w-full mb-4 p-2 rounded bg-gray-700"
      />
      <button
        onClick={handleNext}
        className="bg-green-500 w-full py-2 rounded hover:bg-green-600"
      >
        Next
      </button>
    </div>
  );
};

export default Step1SplitInfo;
