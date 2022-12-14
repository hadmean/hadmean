import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

export interface IActivatedAction {
  activationId: string;
  integrationKey: string;
  credentialsGroupKey: string;
}

export enum BaseAction {
  Create = "create",
  Update = "update",
  Delete = "delete",
}

export type IActionInstance = {
  instanceId: string;
  activatedActionId: string;
  integrationKey: string;
  entity: string;
  implementationKey: string;
  triggerLogic: string;
  formAction: BaseAction | string;
  configuration: Record<string, string>;
};

export interface IPerformsImplementation {
  label: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  do: (connection: unknown, configuration: unknown) => Promise<any>;
}

export interface IActionIntegrationsImplemention {
  title: string;
  description: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  connect: (config: Record<string, unknown>) => Promise<unknown>;
  performsImplementation: Record<string, IPerformsImplementation>;
}

export type IIntegrationsList = { key: string } & Pick<
  IActionIntegrationsImplemention,
  "title" | "description" | "configurationSchema"
>;

export type IIntegrationImplementationList = { key: string } & Pick<
  IPerformsImplementation,
  "label" | "configurationSchema"
>;

export const HTTP_INTEGRATION_KEY = "http";
export const HTTP_ACTIVATION_ID = "http";
