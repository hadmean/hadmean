import { ErrorAlert, Tabs, SectionBox } from "@gothicgeeks/design-system";
import {
  IEntityCrudSettings,
  useEntityCrudSettings,
  useEntityFieldLabels,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../../hooks/entity/entity.config";
import noop from "lodash/noop";
import { NAVIGATION_LINKS } from "../../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "../_Base";
import { useUpsertConfigurationMutation } from "../../../../hooks/configuration/configration.store";
import { useEntityScalarFields } from "../../../../hooks/entity/entity.store";
import { SelectionTab } from "./SelectionTab";

import { useEffect, useState } from "react";
import { ENTITY_TABLE_PATH } from "frontend/hooks/data/data.store";
import { useRouteParam } from "@gothicgeeks/shared";

// TODO "List Able",

export const EntityCrudSettings = () => {
  const entity = useEntitySlug();
  const entityCrudSettings = useEntityCrudSettings();
  const entityScalarFields = useEntityScalarFields(entity);
  const getEntityFieldLabels = useEntityFieldLabels();

  const tabFromUrl = useRouteParam("tab");

  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns"
  );
  const hiddenCreateColumns = useSelectedEntityColumns(
    "hidden_entity_create_columns"
  );
  const hiddenUpdateColumns = useSelectedEntityColumns(
    "hidden_entity_update_columns"
  );
  const hiddenDetailsColumns = useSelectedEntityColumns(
    "hidden_entity_details_columns"
  );

  const upsertTableColumnsMutation = useUpsertConfigurationMutation(
    "hidden_entity_table_columns",
    entity,
    {
      otherEndpoints: [ENTITY_TABLE_PATH(entity)],
    }
  );

  const upsertCreateColumnsMutation = useUpsertConfigurationMutation(
    "hidden_entity_create_columns",
    entity
  );

  const upsertUpdateColumnsMutation = useUpsertConfigurationMutation(
    "hidden_entity_update_columns",
    entity
  );

  const upsertDetailsColumnsMutation = useUpsertConfigurationMutation(
    "hidden_entity_details_columns",
    entity
  );

  const upsertCrudSettingsMutation = useUpsertConfigurationMutation(
    "entity_crud_settings",
    entity
  );

  const [entityCrudSettingsState, setEntityCrudSettingsState] =
    useState<IEntityCrudSettings>({
      create: true,
      delete: true,
      details: true,
      table: true,
      update: true,
    });

  useEffect(() => {
    if (entityCrudSettings.data) {
      setEntityCrudSettingsState(entityCrudSettings.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityCrudSettings.data]);

  const toggleCrudSettings = (field: keyof IEntityCrudSettings) => {
    const newState = {
      ...entityCrudSettingsState,
      [field]: !entityCrudSettingsState[field],
    };
    setEntityCrudSettingsState(newState);
    upsertCrudSettingsMutation.mutateAsync(
      newState as unknown as Record<string, string>
    );
  };

  const sharedFields = {
    getEntityFieldLabels,
    entityFields: entityScalarFields.data || [],
  };

  const sharedLoading =
    entityScalarFields.isLoading || entityCrudSettings.isLoading;

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity),
        name: "CRUD Settings",
      }}
    >
      <ErrorAlert
        message={entityScalarFields.error || entityCrudSettings.error}
      />
      <SectionBox title="CRUD Settings">
        <Tabs
          currentTab={tabFromUrl}
          contents={[
            {
              content: (
                <SelectionTab
                  {...sharedFields}
                  description="Toggle the fields that are allowed to be created in the Form"
                  isLoading={sharedLoading || hiddenCreateColumns.isLoading}
                  hiddenColumns={hiddenCreateColumns.data || []}
                  onSubmit={async (data) => {
                    await upsertCreateColumnsMutation.mutateAsync(data);
                  }}
                  onToggle={() => toggleCrudSettings("create")}
                  enabled={entityCrudSettingsState.create}
                  labels={["Hide Create Button", "Show Create Button"]}
                />
              ),
              label: "Create",
            },
            {
              content: (
                <SelectionTab
                  {...sharedFields}
                  description="Toggle the fields that are allowed to be updated in the Form"
                  isLoading={sharedLoading || hiddenUpdateColumns.isLoading}
                  hiddenColumns={hiddenUpdateColumns.data || []}
                  onToggle={() => toggleCrudSettings("update")}
                  onSubmit={async (data) => {
                    await upsertUpdateColumnsMutation.mutateAsync(data);
                  }}
                  enabled={entityCrudSettingsState.update}
                  labels={["Hide Edit Button", "Show Edit Button"]}
                />
              ),
              label: "Update",
            },
            {
              content: (
                <SelectionTab
                  {...sharedFields}
                  description="Toggle the fields that should be shown in the details page"
                  isLoading={sharedLoading || hiddenDetailsColumns.isLoading}
                  hiddenColumns={hiddenDetailsColumns.data || []}
                  onToggle={() => toggleCrudSettings("details")}
                  onSubmit={async (data) => {
                    upsertDetailsColumnsMutation.mutateAsync(data);
                  }}
                  enabled={entityCrudSettingsState.details}
                  labels={["Hide Details Button", "Show Details Button"]}
                />
              ),
              label: "Details",
            },
            {
              content: (
                <SelectionTab
                  {...sharedFields}
                  description="Toggle the columns that should be shown in the table"
                  isLoading={sharedLoading || hiddenTableColumns.isLoading}
                  onToggle={() => toggleCrudSettings("table")}
                  hiddenColumns={hiddenTableColumns.data || []}
                  onSubmit={async (data) => {
                    upsertTableColumnsMutation.mutateAsync(data);
                  }}
                  enabled={entityCrudSettingsState.table}
                  labels={["Hide In Table List", "Show In Table List"]}
                />
              ),
              label: "Table",
            },
            {
              content: (
                <SelectionTab
                  description=""
                  entityFields={[]}
                  isLoading={false}
                  onToggle={() => toggleCrudSettings("delete")}
                  hiddenColumns={[]}
                  getEntityFieldLabels={() => "Shoud not see this"}
                  onSubmit={async () => noop()}
                  enabled={entityCrudSettingsState.delete}
                  labels={["Hide Delete Button", "Show Delete Button"]}
                />
              ),
              label: "Delete",
            },
          ]}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
};