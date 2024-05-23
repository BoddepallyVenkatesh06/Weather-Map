import { ReactNode } from "react";

export type IContextTable = {
  data: any[];
};

export type THeaderObj = {
  title: string;
  dataIndex?: string;
  key: string;
  icon?: ReactNode;
  render?: (text: string) => ReactNode;
};

export type ITableBase = {
  cols: THeaderObj[];
  isLoading?: boolean;
  emptyTableStyle?: string;
};

export interface ITable extends ITableBase {
  title?: string;
  rows: any[];
  selected?: boolean;
  availability?: string;
  isHeight?: boolean;
}
