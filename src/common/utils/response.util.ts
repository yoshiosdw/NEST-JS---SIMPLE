import dayjs from 'dayjs';

interface MetaData {
  per_page?: number;
  current_page?: number;
  from?: number;
  to?: number;
  prev?: boolean;
  next?: boolean;
  last?: number;
  total?: number;
  timestamp?: string;
  token?: string;
}

export function successResponse(
  data: any,
  message = 'Data retrieved successfully',
  meta: MetaData = {},
) {
  return {
    status: true,
    message,
    data,
    meta: {
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ...meta,
    },
  };
}

export function errorResponse(message: string, code = 400) {
  return {
    status: false,
    message,
    code,
    data: [],
  };
}

export function crudSuccessResponse(data: any, message: string) {
  return {
    status: true,
    message: `Data ${message} successfully`,
    data,
    meta: {
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  };
}

export function paginateResponse(
  data: any,
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    next: boolean;
    prev: boolean;
  },
) {
  return {
    status: true,
    message: 'Data retrieved successfully',
    data: data.items ?? data,
    meta: {
      ...pagination,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  };
}
