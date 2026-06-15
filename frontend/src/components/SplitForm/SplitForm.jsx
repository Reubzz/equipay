/* eslint-disable no-unused-vars */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import ProgressBar from "../Shared/ProgressBar";
import Step1 from "./1SplitInfo";
import Step2 from "./2BillDetails";
import Step3 from "./3AddPeople";
import Step4 from "./4ItemSplit";
import Step5 from "./5TaxTipSplit";
import Step6 from "./6Review";
import Step7 from "./7Complete";

import styles from "../../scss/components/SplitForm.module.scss";

const SplitForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const steps = {
    1: <Step1 nextStep={nextStep} />,
    2: <Step2 nextStep={nextStep} prevStep={prevStep} />,
    3: <Step3 nextStep={nextStep} prevStep={prevStep} />,
    4: <Step4 nextStep={nextStep} prevStep={prevStep} />,
    5: <Step5 nextStep={nextStep} prevStep={prevStep} />,
    6: <Step6 nextStep={nextStep} prevStep={prevStep} />,
    7: <Step7 />,
  };

  return (
    <section className={styles.stepContent} >
      {/* <ProgressBar currentStep={step} totalSteps={totalSteps} /> */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="w-full flex justify-center mt-8"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default SplitForm;
