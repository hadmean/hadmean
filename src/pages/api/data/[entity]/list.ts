import { dataController } from "../../../../backend/data/data.controller";
import { requestHandler } from "../../../../backend/lib/request";

export default requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      "entity",
      {
        _type: "requestQuery",
        options: "search",
      },
    ]);
    return await dataController.listData(
      validatedRequest.entity,
      validatedRequest.requestQuery
    );
  },
});
