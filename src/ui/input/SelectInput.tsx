import { FunctionComponent, SyntheticEvent, useState } from "react";
import { mdiClose, mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { useOutsideClick } from "../../hooks/useClickOutSide";
import { Options, Errors } from "../../types";
import Icon from "@mdi/react";
import "./SelectInput.scss";

interface SelectInputProps {
  id: string;
  options: Options[];
  label?: string;
  value: Options;
  onChange: (value: Options) => void;
  errors?: Errors[];
  setErrors?: (value: Errors[]) => void;
}

const SelectInput: FunctionComponent<SelectInputProps> = ({ ...props }) => {
  const [isFocused, setFocused] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState<boolean[]>(
    new Array(props.options.length).fill(false)
  );
  // VARIANTS
  const variantsArray = props.options.map((item) =>
    item.variants ? item.variants : null
  );
  const variantsLength = variantsArray.map((item) => (item ? item.length : 0));
  const checkedVariants = variantsArray.map<boolean[]>((item, index) =>
    item ? new Array(variantsLength[index]).fill(false) : []
  );
  const [checkedVariantsState, setCheckedVariantsState] =
    useState<boolean[][]>(checkedVariants);

  // SUBOPTIONS
  const suboptionsArray = props.options.map((item) =>
    item.options ? item.options : null
  );
  const suboptionsLength = suboptionsArray.map((item) =>
    item ? item.length : 0
  );
  const checkedSuboptions = variantsArray.map<boolean[]>((item, index) =>
    item ? new Array(suboptionsLength[index]).fill(false) : []
  );
  const [checkedSuboptionsState, setCheckedSuboptions] =
    useState<boolean[][]>(checkedSuboptions);
  const isError = props.errors?.flat().some((value) => value.invoke === true);
  const isValue = props.value.variants !== undefined;
  const errorCondition = !isValue && !isOpen && isFocused === 2;

  const handleOptions = (position: number) => {
    const updatedOptions = checkedOptions.map<boolean>((item, index) =>
      index === position ? !item : false
    );

    setCheckedOptions(updatedOptions);

    if (updatedOptions[position]) {
      props.onChange({
        name: props.options[position].name,
        id: props.options[position].id,
      });
    }

    const errors = props.errors?.map((error) => ({ ...error, invoke: false }));

    props.setErrors && errors && props.setErrors(errors);
  };

  const handleVariants = (optionPosition: number, position: number) => {
    const updatedVariants = checkedVariantsState.map((item, index) =>
      index === optionPosition
        ? item.map((variant, pos) => (pos === position ? !variant : variant))
        : item
    );

    setCheckedVariantsState(updatedVariants);

    const selected = variantsArray[optionPosition]!.filter(
      (_, index) => updatedVariants[optionPosition][index]
    ).map((item) => item);

    props.onChange({ ...props.value, variants: selected });
  };

  const handleSuboptions = (optionPosition: number, position: number) => {
    const updatedSuboptions = checkedSuboptionsState.map((item, index) =>
      index === optionPosition
        ? item.map((option, pos) => (pos === position ? !option : false))
        : item
    );

    setCheckedSuboptions(updatedSuboptions);

    const selected = suboptionsArray[optionPosition]!.filter(
      (_, index) => updatedSuboptions[optionPosition][index]
    ).map((item) => item);

    props.onChange({ ...props.value, options: selected });
  };

  const showValidationError = (extraCondition: boolean = false) => {
    const condition = extraCondition
      ? true
      : !isValue && isFocused === 2 && props.value.name !== "Не палю";
    if (condition && props.errors?.length) {
      const errors = props.errors.map((error) =>
        error.name === "selection" ? { ...error, invoke: true } : error
      );
      props.setErrors && props.setErrors(errors);
    }
  };

  const close = (e?: SyntheticEvent) => {
    e?.stopPropagation();
    setIsOpen(false);
    if (!isValue && props.value.name !== "Не палю") {
      clear();
    }
    showValidationError();
  };
  const clear = (e?: SyntheticEvent) => {
    e?.stopPropagation();
    props.onChange({ name: "", id: "" });
    setCheckedOptions(Array(props.options.length).fill(false));
    setCheckedVariantsState(checkedVariants);
    setCheckedSuboptions(checkedSuboptions);
    !isOpen ? showValidationError(true) : showValidationError();
  };

  const ref = useOutsideClick(close);

  return (
    <>
      <div
        className={`select ${isOpen ? "select--opened" : ""} ${
          errorCondition && isError ? "select--error" : ""
        }`}
      >
        {props.label && (
          <label className="select__label" htmlFor={props.id}>
            {props.label}
          </label>
        )}
        <div
          className="select__container"
          ref={ref}
          onClick={() => {
            setIsOpen(!isOpen);
            setFocused(2);
            showValidationError();
          }}
        >
          <div className="select__content" id={props.id}>
            {/* VALUE && ERRORS */}
            {props.value.name &&
              !isError &&
              (props.value.variants
                ? props.value.name +
                  " " +
                  props.value.variants.map((item) => item.name).join(",")
                : props.value.name)}
            {errorCondition &&
              props.errors?.map(
                (error) =>
                  error.invoke && (
                    <span className="select__error" key={error.name}>
                      {error.message}
                    </span>
                  )
              )}
          </div>
          {props.value.variants || props.value.name === "Не палю" ? (
            <div className="select__icon-close" onClick={clear}>
              <Icon path={mdiClose} size={1} color="black" />
            </div>
          ) : isOpen ? (
            <div className="select__icon-close" onClick={(e) => close(e)}>
              <Icon path={mdiChevronUp} size={1} color="black" />
            </div>
          ) : (
            <div
              className="select__icon-close"
              onClick={() => {
                setIsOpen(!isOpen);
                setFocused(2);
              }}
            >
              <Icon path={mdiChevronDown} size={1} color="black" />
            </div>
          )}
          {isOpen && (
            <div
              className="select__selection-block"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Options */}
              {props.options?.map((item, itemIndex) => {
                return (
                  <div className="select__selection-item" key={item.id}>
                    <label>
                      <input
                        type="radio"
                        id={item.name + item.id}
                        name={item.name}
                        value={item.name}
                        checked={checkedOptions[itemIndex]}
                        onChange={() => handleOptions(itemIndex)}
                      />
                      <span className="checkmark-radio"></span>
                      <span>{item.name}</span>
                    </label>
                    {/* Variants */}
                    {checkedOptions[itemIndex] && item.variants && (
                      <div className="select__selection-item__variants">
                        {item.variants.map((variant, variantIndex) => {
                          return (
                            <label key={variant.name} id={variant.id}>
                              <input
                                type="checkbox"
                                id={variant.id}
                                name={variant.name}
                                value={variant.name}
                                checked={
                                  checkedVariantsState[itemIndex][variantIndex]
                                }
                                onChange={() =>
                                  handleVariants(itemIndex, variantIndex)
                                }
                              />
                              <span className="checkmark"></span>
                              <span>{variant.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                    {/* SubOptions */}
                    {checkedOptions[itemIndex] && item.options && (
                      <div className="select__selection-item__suboptions">
                        {item.optionsTitle && <p>{item.optionsTitle}</p>}
                        {item.options.map((option, subOptionIndex) => {
                          return (
                            <label key={option.name} id={option.id}>
                              <input
                                type="radio"
                                id={option.id}
                                name={option.name}
                                value={option.name}
                                checked={
                                  checkedSuboptionsState[itemIndex][
                                    subOptionIndex
                                  ]
                                }
                                onChange={() =>
                                  handleSuboptions(itemIndex, subOptionIndex)
                                }
                              />
                              <span className="checkmark-radio"></span>
                              <span>{option.name}</span>
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
      </div>
    </>
  );
};

export default SelectInput;
