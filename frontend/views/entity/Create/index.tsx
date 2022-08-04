import {
  ErrorAlert,
  FormSkeleton,
  SectionBox,
  SectionCenter,
  FormSkeletonSchema,
} from "@gothicgeeks/design-system";
import { SLUG_LOADING_VALUE, TitleLang } from "@gothicgeeks/shared";
import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityDiction,
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityFieldTypes,
  useEntityFieldValidations,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityFields } from "../../../hooks/entity/entity.store";
import { useEntityDataCreationMutation } from "../../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { useEntityConfiguration } from "../../../hooks/configuration/configration.store";
import { CreateEntityForm } from "./CreateEntity.form";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { useViewStateMachine } from "../useViewStateMachine";

export function EntityCreate() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityFields = useEntityFields(entity);
  const entityDataCreationMutation = useEntityDataCreationMutation(entity);
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Create,
    EntityActionTypes.Types,
  ]);
  const hiddenCreateColumns = useSelectedEntityColumns(
    "hidden_entity_create_columns"
  );
  const entityFieldTypesMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_types",
    entity
  );
  const entityValidationsMap = useEntityFieldValidations();

  const getEntityFieldLabels = useEntityFieldLabels();
  const entityFieldTypes = useEntityFieldTypes();
  const entityFieldSelections = useEntityFieldSelections();

  const error =
    hiddenCreateColumns.error ||
    entityFieldTypesMap.error ||
    entityFields.error;

  const isLoading =
    hiddenCreateColumns.isLoading ||
    entityFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFieldTypesMap.isLoading;

  const viewState = useViewStateMachine(isLoading, error, "create");
  const { canGoBack, goBack } = useNavigationStack();
  useSetPageTitle(`Create ${entityDiction.plural}`, "CREATE_ENTITY");

  return (
    <AppLayout actionItems={actionItems}>
      <SectionCenter>
        <SectionBox
          title={TitleLang.create(entityDiction.singular)}
          backLink={
            canGoBack()
              ? {
                  action: goBack,
                  label: "Go Back",
                }
              : undefined
          }
        >
          {viewState.type === "loading" && (
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Textarea,
              ]}
            />
          )}
          {viewState.type === "error" && (
            <ErrorAlert message={viewState.message} />
          )}
          {viewState.type === "render" && (
            <CreateEntityForm
              entityFieldTypes={entityFieldTypes}
              entityValidationsMap={entityValidationsMap}
              getEntityFieldLabels={getEntityFieldLabels}
              entityFieldSelections={entityFieldSelections}
              onSubmit={entityDataCreationMutation.mutateAsync}
              fields={fitlerOutHiddenScalarColumns(
                entityFields,
                hiddenCreateColumns
              ).map(({ name }) => name)}
            />
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
