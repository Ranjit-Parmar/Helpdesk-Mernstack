export class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Filter Query
  filter() {
    let queryCopy = { ...this.queryStr };

    // Exclude page, sort, limit, fields from query
    let excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach((val) => delete queryCopy[val]);

    // If any filters are provided, apply them
    this.query = this.query.find(queryCopy);

    return this;
  }

  // Sort Query
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort if no sort param is provided
      this.query = this.query.sort({ lastUpdated: -1 });
    }
    return this;
  }

  // Pagination
  pagination(ticketPerPage) {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || ticketPerPage * 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
