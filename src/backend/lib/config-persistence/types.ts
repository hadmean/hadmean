export type ConfigDomain =
  | "users"
  | "schema"
  | "credentials"
  | "constants"
  | "environment-variables"
  | "dashboard"
  | "app-config"
  | "packages"
  | "action_instances"
  | "activated_actions"
  | "activated_storage"
  | "roles";

export enum ConfigAdaptorTypes {
  JsonFile = "json-file",
  Database = "database",
  Memory = "memory",
  Redis = "redis",
}
