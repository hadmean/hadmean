import { AppLayout } from "../../../_layouts/app";
import {
  ErrorAlert,
  SectionBox,
  SectionCenter,
  Spacer,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityDiction,
  useEntityFieldLabels,
  useEntityFieldTypes,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../../hooks/entity/entity.store";
import { useEntityDataCreationMutation } from "../../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { useEntityConfiguration } from "../../../hooks/configuration/configration.store";
import { CreateEntityForm } from "./CreateEntity.form";
import { fitlerOutHiddenScalarColumns } from "../utils";

export function EntityCreate() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityDataCreationMutation = useEntityDataCreationMutation(entity);
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.CRUD,
    EntityActionTypes.Fields,
  ]);
  const hiddenCreateColumns = useSelectedEntityColumns(
    "hidden_entity_create_columns"
  );
  const entityFieldTypesMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_types",
    entity
  );
  const getEntityFieldLabels = useEntityFieldLabels();
  const entityFieldTypes = useEntityFieldTypes();

  const error =
    hiddenCreateColumns.error ||
    entityFieldTypesMap.error ||
    entityScalarFields.error;

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        { label: "Create", value: NAVIGATION_LINKS.ENTITY.CREATE(entity) },
      ]}
      actionItems={actionItems}
    >
      <SectionCenter>
        {error ? (
          <>
            <Spacer />
            <ErrorAlert message={error} />
            <Spacer />
          </>
        ) : null}
        <SectionBox
          title={TitleLang.create(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.TABLE(entity),
            label: entityDiction.plural,
          }}
        >
          {hiddenCreateColumns.isLoading ||
          entityScalarFields.isLoading ||
          entityFieldTypesMap.isLoading ? (
            <>TODO Loading</>
          ) : (
            <CreateEntityForm
              entityFieldTypes={entityFieldTypes}
              getEntityFieldLabels={getEntityFieldLabels}
              onSubmit={entityDataCreationMutation.mutateAsync}
              fields={fitlerOutHiddenScalarColumns(entityScalarFields, hiddenCreateColumns)}
            />
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
