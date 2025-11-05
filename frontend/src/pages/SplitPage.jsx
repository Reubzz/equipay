import { SplitProvider } from "../context/SplitContext";
import SplitForm from "../components/SplitForm/SplitForm";

const SplitPage = () => {
  return (
    <SplitProvider>
      <SplitForm />
    </SplitProvider>
  );
};

export default SplitPage;
