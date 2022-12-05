import {
  DEFAULT_TABLE_PARAMS,
  DeleteButton,
  OffCanvas,
  SectionBox,
  SoftButton,
  Stack,
  Table,
} from "@hadmean/chromista";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { LINK_TO_DOCS } from "frontend/views/constants";
import {
  IBEPaginatedDataState,
  IFEPaginatedDataState,
  useFEPaginatedData,
} from "@hadmean/protozoa";
import { useCallback, useState } from "react";
import {
  INTEGRATIONS_GROUP_ENDPOINT,
  useIntegrationConfigurationDeletionMutation,
  useIntegrationConfigurationUpdationMutation,
} from "./configurations.store";
import { KeyValueForm } from "./Form";
import { IKeyValue } from "./types";
import { INTEGRATIONS_GROUP_LABEL } from "./constants";

const NEW_CONFIG_ITEM = "__new_config_item__";

export function BaseIntegrationsConfiguration({
  group,
}: {
  group: IntegrationsConfigurationGroup;
}) {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IKeyValue> | IBEPaginatedDataState
  >({ ...DEFAULT_TABLE_PARAMS, pageIndex: 1 });

  const upsertConfigurationMutation =
    useIntegrationConfigurationUpdationMutation(group);
  const deleteConfigurationMutation =
    useIntegrationConfigurationDeletionMutation(group);

  const tableData = useFEPaginatedData<IKeyValue>(
    INTEGRATIONS_GROUP_ENDPOINT(group),
    {
      ...paginatedDataState,
      sortBy: undefined,
      pageIndex: 1,
      filters: undefined,
    }
  );

  const [currentConfigItem, setCurrentConfigItem] = useState("");

  const closeConfigItem = () => {
    setCurrentConfigItem("");
  };

  const MemoizedAction = useCallback(
    ({ row }: any) => (
      <Stack spacing={4} align="center">
        <SoftButton
          action={() => setCurrentConfigItem((row.original as IKeyValue).key)}
          label="Edit"
          justIcon
          icon="edit"
        />
        <DeleteButton
          onDelete={() =>
            deleteConfigurationMutation.mutateAsync(
              (row.original as IKeyValue).key
            )
          }
          isMakingDeleteRequest={deleteConfigurationMutation.isLoading}
          shouldConfirmAlert
        />
      </Stack>
    ),
    [deleteConfigurationMutation.isLoading]
  );

  return (
    <>
      <SectionBox
        title={`Manage ${INTEGRATIONS_GROUP_LABEL[group].label}`}
        iconButtons={[
          {
            action: () => {
              setCurrentConfigItem(NEW_CONFIG_ITEM);
            },
            icon: "add",
            label: `Add New ${INTEGRATIONS_GROUP_LABEL[group].singular}`,
          },
          {
            action: LINK_TO_DOCS(`integrations-configuration/${group}`),
            icon: "help",
            // TODO documentation
            label: `What are ${INTEGRATIONS_GROUP_LABEL[group].label}`,
          },
        ]}
      >
        <Table
          {...{
            tableData,
            setPaginatedDataState,
            paginatedDataState,
          }}
          emptyMessage={`No ${INTEGRATIONS_GROUP_LABEL[group].label} Has Been Added Yet`}
          columns={[
            {
              Header: "Key",
              accessor: "key",
              disableSortBy: true,
              // eslint-disable-next-line react/no-unstable-nested-components
              Cell: ({ value }: { value: unknown }) => (
                <span
                  dangerouslySetInnerHTML={{ __html: `{{ ENV.${value} }}` }}
                />
              ),
            },
            {
              Header: "Value",
              accessor: "value",
              disableSortBy: true,
            },
            {
              Header: "Action",
              Cell: MemoizedAction,
            },
          ]}
        />
      </SectionBox>

      <OffCanvas
        title={
          currentConfigItem === NEW_CONFIG_ITEM
            ? `Create ${INTEGRATIONS_GROUP_LABEL[group].singular}`
            : `Update ${INTEGRATIONS_GROUP_LABEL[group].singular}`
        }
        onClose={closeConfigItem}
        show={!!currentConfigItem}
      >
        <KeyValueForm
          initialValues={(tableData?.data?.data || []).find(
            ({ key }) => key === currentConfigItem
          )}
          onSubmit={async (values: { key: string; value: string }) => {
            await upsertConfigurationMutation.mutateAsync(values);
            closeConfigItem();
          }}
        />
      </OffCanvas>
    </>
  );
}
