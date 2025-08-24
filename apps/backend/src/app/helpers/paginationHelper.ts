import {
  IPaginationOptions,
  IPaginationResult,
} from "../interfaces/pagination";

export const calculatePagination = (options: IPaginationOptions) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const formatPaginationResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): IPaginationResult<T> => {
  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};
