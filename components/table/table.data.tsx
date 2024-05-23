import classNames from "classnames";

export type ITableData = {
  row: any;
  col: any;
  className?: string;
};

function TableData({ row, col, className }: ITableData) {
  let template;
  switch (col.dataIndex) {
    default:
      template = (
        <span className="text-xs pt-4 pb-5 grid grid-flow-col grid-cols-[max-content_auto_max-content] items-center gap-2">
          {col.render ? <>{col.render(row[col.key])}</> : row[col.key]}
        </span>
      );
      break;
  }

  return (
    <td
      className={classNames(
        `flex-1 cursor-pointer border-[1px] transition-none ease-in-out duration-700 border-gray-700 text-white hover:bg-dark py-2 px-3 text-xs font-normal`,

        className
      )}
    >
      {template}
    </td>
  );
}

export default TableData;
