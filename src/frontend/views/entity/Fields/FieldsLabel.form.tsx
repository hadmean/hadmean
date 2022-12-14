import {
  FormButton,
  FormInput,
  FormSkeleton,
  FormSkeletonSchema,
} from "@hadmean/chromista";
import { Form, Field } from "react-final-form";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  minLength,
} from "@hadmean/protozoa";

interface IProps {
  fields: string[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
}

export const loadingFieldsLabelForm = (
  <FormSkeleton
    schema={[
      FormSkeletonSchema.Input,
      FormSkeletonSchema.Input,
      FormSkeletonSchema.Input,
      FormSkeletonSchema.Input,
    ]}
  />
);

export function FieldsLabelForm({ onSubmit, initialValues, fields }: IProps) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <Field
              key={field}
              name={field}
              validate={composeValidators(minLength(2), maxLength(64))}
              validateFields={[]}
            >
              {({ input, meta }) => (
                <FormInput label={field} input={input} meta={meta} />
              )}
            </Field>
          ))}
          <FormButton
            text={`${ButtonLang.upsert} Labels`}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
