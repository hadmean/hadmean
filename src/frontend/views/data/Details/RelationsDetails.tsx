import { SectionBox } from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import {
  NAVIGATION_LINKS,
  useNavigationStack,
  useSetPageDetails,
  useRouteParam,
} from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types/user";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout } from "./_Layout";

export function EntityRelationDetails() {
  const childEntity = useRouteParam("childEntity");
  const childEntityDiction = useEntityDiction(childEntity);

  const childId = useRouteParam("childId");
  const entity = useEntitySlug();
  const childEntityCrudSettings = useEntityCrudSettings(childEntity);

  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: `${childEntityDiction.singular} Details`,
    viewKey: ENTITY_DETAILS_VIEW_KEY,
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(childEntity),
  });

  const actions = [
    {
      icon: "eye" as const,
      action: NAVIGATION_LINKS.ENTITY.DETAILS(childEntity, childId),
      label: "Details",
      crudSetting: childEntityCrudSettings.data?.details,
    },
    {
      icon: "edit" as const,
      action: NAVIGATION_LINKS.ENTITY.UPDATE(childEntity, childId),
      label: "Edit",
      crudSetting: childEntityCrudSettings.data?.update,
    },
  ];

  return (
    <DetailsLayout entity={entity} menuKey={childEntity}>
      <SectionBox
        title={TitleLang.details(childEntityDiction.singular)}
        backLink={backLink}
        iconButtons={actions.filter(({ crudSetting }) => crudSetting)}
      >
        <EntityDetailsView
          displayFrom="details"
          id={childId}
          entity={childEntity}
        />
      </SectionBox>
    </DetailsLayout>
  );
}
