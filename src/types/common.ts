export type ServerMode = "share" | "private";

export interface ComponentWithChildren {
  children: React.ReactNode;
  className?: string;
}

export interface BaseResponse<T> {
  data: T;
  status: "success" | "error";
}

export type ConfigType = Record<string, string>;

export type ExtendOnServerMode<
  TBase,
  TServerMode extends ServerMode,
  On extends ServerMode,
  TExtension extends {}
> = TBase & (TServerMode extends On ? TExtension : {});
