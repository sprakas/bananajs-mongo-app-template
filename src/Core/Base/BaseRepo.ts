import { FilterQuery, Model, Types } from 'mongoose'
import { IResource, IResourceOptions, IRepoOptions } from './BaseType'

export abstract class BaseRepo<T> {
  protected collection: Model<T>

  constructor(model: Model<T>) {
    this.collection = model
  }

  /**
   * Creates a new document in the collection.
   *
   * @param data - The data of type T to be inserted into the collection.
   * @param options - Optional settings for the creation process, including session control.
   * @returns The created document as a plain JavaScript object.
   */

  async create(data: T, options?: IRepoOptions) {
    const created = await this.collection.create([data], { session: options?.session })
    return created?.[0]?.toObject()
  }

  /**
   * Inserts multiple documents into the collection.
   *
   * @param data - The documents of type T to be inserted into the collection.
   * @param options - Optional settings for the insertion process, including session control.
   * @returns The inserted documents as a plain JavaScript array.
   */
  async insertMany(data: T[], options?: IRepoOptions) {
    return await this.collection.insertMany(data, { session: options?.session })
  }

  /**
   * Updates a document in the collection by its ID.
   *
   * @param id - The ObjectId of the document to be updated.
   * @param data - The data to update the document with.
   * @param options - Optional settings for the update process, including session control and return options.
   * @returns The updated document as a plain JavaScript object.
   */
  async update(id: Types.ObjectId, data: any, options?: IRepoOptions): Promise<any> {
    return this.collection
      .findByIdAndUpdate(id, data, {
        new: options?.new !== undefined ? options?.new : true,
        session: options?.session,
      })
      .lean()
      .exec()
  }

  /**
   * Deletes a document in the collection by its ID.
   *
   * @param id - The ObjectId of the document to be deleted.
   * @param options - Optional settings for the deletion process, including session control and return options.
   * @returns The deleted document as a plain JavaScript object.
   */
  async delete(id: Types.ObjectId, options?: IRepoOptions): Promise<any> {
    return this.collection
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true, session: options?.session })
      .lean()
      .exec()
  }

  /**
   * Updates a single document in the collection based on the provided search object.
   *
   * @param searchObject - The search object to find the document to update.
   * @param data - The data to update the document with.
   * @param options - Optional settings for the update process, including session control and return options.
   * @returns The updated document as a plain JavaScript object.
   */
  async updateOne(searchObject: object, data: any, options?: IRepoOptions): Promise<any> {
    return this.collection
      .findOneAndUpdate(searchObject, data, {
        new: options?.new !== undefined ? options?.new : true,
        session: options?.session,
      })
      .lean()
      .exec()
  }

  /**
   * Soft deletes a single document in the collection based on the provided filter.
   *
   * @param data - The filter object to find the document to delete.
   * @param options - Optional settings for the deletion process, including session control.
   * @returns The soft-deleted document as a plain JavaScript object.
   */
  async deleteOne(data: object, options?: IRepoOptions): Promise<any> {
    return this.collection
      .findOneAndUpdate(data, { isDeleted: true }, { new: true, session: options?.session })
      .lean()
      .exec()
  }

  /**
   * Finds a single document in the collection by its ObjectId.
   *
   * @param id - The ObjectId of the document to find.
   * @returns The found document as a plain JavaScript object.
   */
  async findById<T>(id: Types.ObjectId) {
    return this.collection.findOne({ _id: id }).lean().exec() as Promise<T>
  }

  /**
   * Finds a single document in the collection that matches the query.
   *
   * @param query - The query object to filter the documents.
   * @returns The found document as a plain JavaScript object.
   */
  async findOne(query: FilterQuery<T>) {
    return this.collection.findOne(query).lean().exec() as Promise<T>
  }

  /**
   * Finds multiple documents in the collection that match the query.
   *
   * @param data - The query object to filter the documents.
   * @param options - Optional settings for the find process, including select projection.
   * @returns The found documents as a plain JavaScript array.
   */
  async find(data: FilterQuery<T>, options?: { select?: { [key: string]: number } }): Promise<T[]> {
    const query = this.collection.find(data)
    if (options?.select) {
      return query?.select(options?.select)
    }
    return query.lean().exec() as Promise<T[]>
  }

  /**
   * Retrieves a list of documents from the collection that match the given query.
   * The following parameters can be used to filter the results:
   * - `search`: The search keyword to filter the documents.
   * - `orderBy`: The field to sort the documents on.
   * - `sort`: The sorting order to use.
   * - `limit`: The maximum number of documents to return.
   * - `page`: The page number to return.
   * - `filters`: The filters to apply on the documents.
   * - `dateFrom` and `dateTo`: The date range to filter the documents on.
   * @param params - The query object to filter the documents.
   * @param options - The optional settings for the query, including the search fields and date range.
   * @returns The filtered documents as a plain JavaScript array, along with the total count of matching documents.
   */
  async list(params?: IResource, options?: IResourceOptions) {
    const {
      search,
      orderBy = 'updatedAt',
      sort = 'desc',
      limit = '100',
      page = '0',
      filters,
      dateFrom,
      dateTo,
    } = params || {}
    const query = this.collection.find({ isDeleted: false })

    if (search && options?.searchFields) {
      // @FixMe Replace any with strong type
      const item = { $regex: search, $options: 'i' }
      query.or([
        ...options.searchFields.map((searchField) => {
          return { [searchField]: item }
        }),
      ] as any)
    }
    if (filters) {
      let parsedFilters
      try {
        parsedFilters = JSON.parse(filters)
      } catch (err) {
        parsedFilters = {}
      }
      // @Todo: Handle null checks
      Object.keys(parsedFilters).forEach((field: string) => {
        if (typeof field === 'object') {
          query.where(field).in(parsedFilters[field as string] as string[])
        } else {
          query.where(field).equals(parsedFilters[field])
        }
      })
    }

    if (dateFrom && dateTo) {
      // @Todo: Handle Timezone
      query.where({ createdAt: { $gte: dateFrom, $lte: dateTo } })
    }

    const totalCount = await query.countDocuments()

    const items = (await this.collection
      .find({ isDeleted: false })
      .merge(query)
      .sort({ [orderBy]: sort })
      .skip(parseInt(page) * parseInt(limit))
      .limit(parseInt(limit))
      .lean()
      .exec()) as T[]
    return {
      items,
      totalCount,
    }
  }

  /**
   * Adds a filter to the query object, allowing it to filter documents based on the given filters.
   * @param query - The query to modify.
   * @param filters - The filters to apply to the query. The filters should be given in the format of a JSON string.
   * @returns The modified query.
   */
  withFilters(query: FilterQuery<T>, filters: any) {
    if (filters) {
      let parsedFilters: any
      try {
        parsedFilters = JSON.parse(filters)
      } catch (err) {
        parsedFilters = {}
      }
      // @Todo: Handle null checks
      Object.keys(parsedFilters).forEach((field: string) => {
        if (typeof field === 'object') {
          query.where(field).in(parsedFilters[field as string] as string[])
        } else {
          query.where(field).equals(parsedFilters[field])
        }
      })
    }
    return query
  }

  /**
   * @description
   * Adds a search query to the query object, allowing it to search for the given searchKey in the given fields.
   * @param query - The query to modify.
   * @param searchKey - The search key to search for.
   * @param searchFields - The fields to search in.
   * @returns The modified query.
   */
  withSearch(query: FilterQuery<T>, searchKey: string, searchFields: string[]) {
    if (searchKey && searchFields) {
      const item = { $regex: searchKey, $options: 'i' }
      query.or([
        ...searchFields.map((searchField) => {
          return { [searchField]: item }
        }),
      ])
    }
    return query
  }

  /**
   * Paginates the results of a query.
   *
   * @param query - The query object used to filter and retrieve documents from the collection.
   * @param limit - The maximum number of documents to return per page. Defaults to '10'.
   * @param page - The page number to retrieve. Defaults to '0'.
   * @returns An object containing the paginated items and the total count of matching documents.
   */

  async withPagination<T>(query: FilterQuery<T>, limit = '10', page = '0') {
    const totalCount: number = await query.countDocuments()
    const items = (await this.collection
      .find()
      .merge(query)
      .skip(parseInt(page) * parseInt(limit))
      .limit(parseInt(limit))
      .lean()
      .exec()) as T[]
    return {
      items,
      totalCount,
    }
  }

  /**
   * Performs multiple write operations in bulk on the collection.
   *
   * @param data - An array of write operations to perform in bulk.
   * @param options - Optional settings for the bulk write process, including session control.
   * @returns The result of the bulk write operation.
   */

  async bulkWrite(data: any, options?: IRepoOptions): Promise<unknown> {
    return this.collection.bulkWrite(data, { session: options?.session })
  }

  /**
   * Updates multiple documents in the collection based on the provided query object.
   *
   * @param query - The query object used to filter and retrieve documents from the collection.
   * @param data - The data to update the documents with.
   * @param options - Optional settings for the update process, including session control and return options.
   * @returns The updated documents as plain JavaScript objects.
   */
  async updateMany(query: object, data: object, options?: IRepoOptions) {
    return this.collection
      .updateMany(query, data, {
        new: options?.new !== undefined ? options?.new : true,
        session: options?.session,
      })
      .lean()
      .exec()
  }

  /**
   * Deletes multiple documents in the collection based on the provided query object.
   *
   * @param filters - The query object used to filter and retrieve documents from the collection.
   * @param options - Optional settings for the deletion process, including session control.
   * @returns The deleted count of documents.
   */
  async deleteMany(filters: object, options?: IRepoOptions) {
    return await this.collection
      .deleteMany(filters, {
        session: options?.session,
      })
      .lean()
      .exec()
  }
}
