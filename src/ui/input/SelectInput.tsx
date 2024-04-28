import { FunctionComponent, SyntheticEvent, useState } from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import "./SelectInput.scss";
import { useOutsideClick } from "../../hooks/useClickOutSide";

interface Options {
  id: string;
  option: {
    name: string;
    variants?: Options[];
    optionsTitle?: string;
    options?: Options[];
  };
}

interface SelectInputProps {
  id: string;
  options?: Options[];
  label?: string;
  clear?: boolean;
}

const SelectInput: FunctionComponent<SelectInputProps> = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="select__content" id={props.id}></div>
          {isOpen && props.clear && (
            <div className="select__icon-close" onClick={(e) => close(e)}>
              <Icon path={mdiClose} size={0.8} color="black" />
            </div>
          )}
        </div>
        {isOpen && (
          <div className="select__selection-block">
            {props.options?.map((item) => {
              return (
                <label className="select__selection-item" key={item.id}>
                  <input
                    type="checkbox"
                    id={item.option.name + item.id}
                    name={item.option.name}
                    value={item.option.name}
                  />
                  {item.option.name}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectInput;


