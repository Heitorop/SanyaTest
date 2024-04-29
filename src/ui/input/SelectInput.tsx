import { FunctionComponent, SyntheticEvent, useState } from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import "./SelectInput.scss";
import { useOutsideClick } from "../../hooks/useClickOutSide";

interface Options {
  id: string;
  name: string;
  variants?: Options[];
  optionsTitle?: string;
  options?: Options[];
}

interface SelectInputProps {
  id: string;
  options: Options[];
  label?: string;
  clear?: boolean;
}

const SelectInput: FunctionComponent<SelectInputProps> = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [checkedOptions, setCheckedOptions] = useState(
    new Array(props.options.length).fill(false)
  );
  const variantsArray = props.options.map((item) =>
    item.variants ? item.variants : null
  );
  const variantsLength = variantsArray.map((item) => (item ? item.length : 0));
  const checkedVariants = variantsArray.map<boolean[]>((item, index) =>
    item ? new Array(variantsLength[index]).fill(false) : []
  );
  const [checkedVariantsState, setCheckedVariantsState] =
    useState<boolean[][]>(checkedVariants);
  const [selectedValues, setSelectedValues] = useState<string>("");

  const handleOptions = (position: number) => {
    const updatedOptions = checkedOptions.map<boolean>((item, index) =>
      index === position ? !item : false
    );

    setCheckedOptions(updatedOptions);
  };

  const handleVariants = (optionPosition: number, position: number) => {
    const updatedVariants = checkedVariantsState.map((item, index) =>
      index === optionPosition
        ? item.map((variant, pos) =>
            pos === position ? !variant : variant
          )
        : item
    );

    setCheckedVariantsState(updatedVariants);

    const selected = variantsArray[optionPosition]!.filter(
      (_, index) => updatedVariants[optionPosition][index]
    ).map((item) => item.name);

    setSelectedValues(selected.join(","));
  };


  const close = (e?: SyntheticEvent) => {
    e?.stopPropagation();

    setIsOpen(false);
  };

  const ref = useOutsideClick(close);
  return (
    <>
      <div
        ref={ref}
        className={`select ${isOpen ? " select--opened" : ""}`}
        onClick={() => setIsOpen(true)}
      >
        {props.label && (
          <label className="select__label" htmlFor={props.id}>
            {props.label}
          </label>
        )}

        <div className="select__container">
          <div className="select__content" id={props.id}>
            {selectedValues && selectedValues}
          </div>
          {isOpen && props.clear && (
            <div className="select__icon-close" onClick={(e) => close(e)}>
              <Icon path={mdiClose} size={0.8} color="black" />
            </div>
          )}
        </div>
        {isOpen && (
          <div className="select__selection-block">
            {props.options?.map((item, opionIndex) => {
              return (
                <div className="select__selection-item" key={item.id}>
                  <label>
                    <input
                      type="radio"
                      id={item.name + item.id}
                      name={item.name}
                      value={item.name}
                      checked={checkedOptions[opionIndex]}
                      onChange={() => handleOptions(opionIndex)}
                    />
                    <span className="checkmark-radio"></span>
                    <span>{item.name}</span>
                  </label>
                  {item.variants && (
                    <div className="select__selection-item__variants">
                      {item?.variants.map((variant, variantIndex) => {
                        return (
                          <label key={variant.name} id={variant.id}>
                            <input
                              type="checkbox"
                              id={variant.id}
                              name={variant.name}
                              value={variant.name}
                              checked={
                                checkedVariantsState[opionIndex][variantIndex]
                              }
                              onChange={() =>
                                handleVariants(opionIndex, variantIndex)
                              }
                            />
                            <span className="checkmark"></span>
                            <span>{variant.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectInput;
