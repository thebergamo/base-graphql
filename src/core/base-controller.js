import R from "ramda";
import { castToArray } from "core/helper-castToDatabase";

class Controller {
  constructor(context) {
    this.context = context;
    this.request = context.request;
    this.database = context.db;
    this.loggedUser = context.user;
  }

  _castToArray(record, prop, type = "text[]") {
    return castToArray(prop, type)(record);
  }

  _generateEdges(data, skiped) {
    return R.map(
      (item, index) => ({
        cursor: skiped + index + 1,
        node: item
      }),
      data
    );
  }

  _makeCursor(totalCount = 0, nodes = [], skipped = 0, hasNextPage = false) {
    const edges = this._generateEdges(nodes, skipped);

    return {
      totalCount,
      pageInfo: {
        endCursor: !R.isNil(edges) ? R.last(edges).cursor : null,
        startCursor: !R.isNil(edges) ? R.head(edges).cursor : null,
        hasNextPage
      },
      edges,
      nodes
    };
  }

  async _paginate(params = {}, query) {
    const { first, last, orderBy } = params;
    let { after, before } = params;
    let order = "created_at";
    let direction = "DESC";

    if (orderBy) {
      ({ direction } = orderBy);
      order = orderBy.field.toLowerCase();
    }

    let totalCount;

    try {
      const total = await this.Model.query()
        .where(query)
        .count()
        .first();
      totalCount = parseInt(total.count, 10);
    } catch (_err) {
      totalCount = 0;
    }

    let offset = 0;
    let limit = first || last || 30;
    let hasNextPage = false;
    if (after || !before) {
      after = parseInt(after || 0, 10);
      offset = after;
      hasNextPage = offset + limit < totalCount;
    } else if (before) {
      before = parseInt(before, 10);
      offset = before;
      if (offset <= limit) {
        limit = offset;
        offset = 0;
      }
      hasNextPage = offset > 0;
    }

    const nodes = await this.Model.query()
      .where(qb => {
        query(qb);
      })
      .limit(limit)
      .offset(offset)
      .orderBy(order, direction);

    const skipped = before || offset;

    return this._makeCursor(totalCount, nodes, skipped, hasNextPage);
  }

  _get(params = {}, where = {}, whereRaw = null) {
    const applyWhere = qb => {
      const { user_id: userId, ...customWhere } = where;
      if (userId) {
        qb.whereRaw("(user_id = :userId OR user_id IS NULL)", { userId });
      }

      if (this.Model.softDelete) {
        qb.whereNull("deleted_at");
      }

      qb.where(customWhere);

      if (whereRaw) {
        qb.whereRaw(whereRaw.where, whereRaw.args);
      }

      const paginationArgs = ["first", "after", "last", "before", "orderBy"];

      // Exclude pagination args above and get first parameter as key search
      const searchTerms = R.omit(paginationArgs, params);
      const key = Object.keys(searchTerms)[0];

      if (key && searchTerms[key]) {
        let search = searchTerms[key];
        search = escapeString(search);
        search = search.replace(/'/g, "");
        search = search.replace(/\s/g, "+");

        return qb.whereRaw(`${key} @@ to_tsquery('${search} | ${search}:*')`);
      }

      return qb;
    };

    return this._paginate(params, applyWhere);
  }

  getAll(userId, params, where = {}, whereRaw = null) {
    return this._get(params, { user_id: userId, ...where }, whereRaw);
  }

  async get(id, checkDeleted = false) {
    if (!id) {
      return null;
    }

    if (this.loader && !checkDeleted) {
      return this.loader.load(id);
    }

    const query = this.Model.query().where("id", id);

    const model =
      !this.Model.softDelete || checkDeleted
        ? await query
        : await query.whereNull("deleted_at");

    return model[0];
  }

  async getByWhere(where, checkDeleted = false) {
    if (!where) {
      return null;
    }

    const query = this.Model.query().where(where);

    const model =
      !this.Model.softDelete || checkDeleted
        ? await query
        : await query.whereNull("deleted_at");

    return model[0];
  }

  _create(data) {
    return this.Model.query()
      .insert(data)
      .returning("*");
  }

  create(data) {
    const userId = this.loggedUser.id;

    return this._create({ ...data, userId });
  }

  update(id, data) {
    return this.Model.query()
      .patch(data)
      .where("id", id)
      .returning("*")
      .first();
  }

  updateWhere(where, data) {
    return this.Model.query()
      .patch(data)
      .where(where)
      .returning("*")
      .first();
  }

  async destroy(id) {
    const deleted = await this.Model.query()
      .delete()
      .where("id", id);

    return this.get(id, true);
  }

  async destroyWhere(where) {
    const deleted = await this.Model.query()
      .delete()
      .where(where);

    return this.get(id, true);
  }
}

export default Controller;
