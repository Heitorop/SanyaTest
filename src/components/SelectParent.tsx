import { FunctionComponent, useState } from "react";
import SelectInput from "../ui/input/SelectInput";
import mockData from "../mockData.json";
import { Errors, Options } from "../types";

const SelectParent: FunctionComponent = ({ ...props }) => {
  const [value, setValue] = useState<Options>({ id: "", name: "" });
  const [errors, setErrors] = useState<Errors[]>([
    {
      name: "selection",
      message: "Виберіть хоча б один вид паління",
      invoke: false,
    },
  ]);
  return (
    <>
      <SelectInput
        id="select"
        label="Паління"
        options={mockData}
        value={value}
        onChange={setValue}
        errors={errors}
        setErrors={setErrors}
      />
    </>
  );
};

export default SelectParent;
