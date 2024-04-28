import { FunctionComponent, memo } from "react";
import SelectInput from "../ui/input/SelectInput";
import mockData from "../mockData.json";

const SelectParent: FunctionComponent = ({ ...props }) => {
  const MemoSelect = memo(SelectInput);
  return (
    <>
      <MemoSelect
        clear={true}
        id="select"
        label="Паління"
        options={mockData}
      />
    </>
  );
};

export default SelectParent;
