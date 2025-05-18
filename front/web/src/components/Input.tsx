import "./Input.css";

export type InputProps = {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  type: string;
  icon?: string;
  required?: boolean;
  name?: string;
};

export default function Input(props: InputProps) {
  return (
    <div className="input-icon-container">
      {props.icon && <img src={props.icon} alt="Icon" className="input-icon" />}
      <input
        type={props.type}
        className={props.icon ? "input input-padding" : "input no-icon-padding"}
        placeholder={props.placeholder}
        value={props.value}
        required={props.required === undefined ? false : props.required}
        onChange={props.onChange}
        name={props.name}
      />
    </div>
  );
}
