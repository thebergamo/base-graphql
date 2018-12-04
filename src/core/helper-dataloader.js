import DataLoader from "dataloader";
import sort from "dataloader-sort";

export const getAllByIds = Model => async ids => {
  const model = await Model.query().whereIn("id", ids);

  return sort(ids, model);
};

export default db => ({
  campains: new DataLoader(getAllByIds(db.Campains))
});
