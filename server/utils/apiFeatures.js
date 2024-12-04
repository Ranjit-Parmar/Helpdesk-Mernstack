export class ApiFeatures {
    
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

// Filter Query
  filter() {

    let queryCopy = { ...this.queryStr };
    
    // Exclude field

    let excludeFiels = ["page", "sort", "limit", "fields"];

    excludeFiels.forEach((val) => delete queryCopy[val]);

    this.query = this.query.find(queryCopy);

    return this;
  }

  // Sort Query
  sort() {
    if (this.queryStr.sort) {
      this.query.find().sort({ lastUpdated: 1 });
    }
    return this;
  }

  // Pagination
  pagination(ticketPerPage) {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || ticketPerPage * 1;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}
