export interface ComponentWithChildren {
  children: React.ReactNode;
  className?: string;
}

export interface BaseResponse<T> {
  data: T;
  status: "success" | "error";
}
