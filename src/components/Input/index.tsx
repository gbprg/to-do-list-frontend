import { formatCurrency } from "@/helpers/formatCurrency";
import { Controller, Control, FieldValues, FieldError, Path } from "react-hook-form";

interface IInput<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  control: Control<T>;
  errors: Partial<Record<Path<T>, FieldError | undefined>>;
  format?: "money" | "text" | "time" | "datetime-local" | "number";
  min?: string | number;
  login?: boolean;
}

export const Input = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  type,
  format,
  min,
}: IInput<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;

          if (format === "money") {
            const numericValue = value.replace(/\D/g, "");
            const formattedValue = formatCurrency(numericValue);
            field.onChange(formattedValue);
          } else {
            field.onChange(value);
          }
        };

        return (
          <div>
            <input
              {...field}
              type={type}
              placeholder={label}
              min={min}
              value={field.value || ""}
              onChange={handleChange}
              className="p-[1rem] rounded-[0.5rem] border-letter-bold border-[0.125rem] w-full"
            />
            {errors[name]?.message && (
              <p className="text-red-600">{errors[name]?.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};
