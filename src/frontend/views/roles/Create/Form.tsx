import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  CREATE_ROLE_FORM_SCHEMA,
  ICreateRoleForm,
} from "shared/form-schemas/roles/create";

export function CreateRoleForm({ onSubmit }: IFormProps<ICreateRoleForm>) {
  return (
    <SchemaForm<ICreateRoleForm>
      onSubmit={onSubmit}
      buttonText={`${ButtonLang.create} Role`}
      fields={CREATE_ROLE_FORM_SCHEMA}
      resetForm
    />
  );
}
