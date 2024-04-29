import { FunctionComponent } from "react";
import SelectInput from "../ui/input/SelectInput";
import mockData from "../mockData.json";

const SelectParent: FunctionComponent = ({ ...props }) => {
  return (
    <>
      <SelectInput
        clear={true}
        id="select"
        label="Паління"
        options={mockData}
      />
    </>
  );
};

export default SelectParent;
