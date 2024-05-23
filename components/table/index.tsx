import classNames from "classnames";
import Spinner from "../loader";
import TableData from "./table.data";
import { ITable } from "./types";

function CustomTable({
  cols,
  rows,
  isLoading,
  emptyTableStyle,
  availability,
  isHeight,
}: ITable) {
  return (
    <div
      className={`g:w-full ${isHeight && "min-h-[300px]"}  overflow-x-scroll`}
    >
      <table
        className={classNames(
          `text-left border-spacing-y-3.5 border-spacing-x-3.5 bg-gray-800`,
          isLoading ? "animate-pulsed" : ""
        )}
      >
        <thead className={`sticky top-0 left-0 z-10 bg-secondary`}>
          <tr>
            {cols.map((col, idx) => (
              <th
                className={classNames("py-5 px-3 font-medium text-xs")}
                key={idx}
              >
                {col.dataIndex !== "checkbox" && col.title ? (
                  <div className="flex gap-2">{col.title}</div>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="px-5">
          {isLoading ? (
            <tr>
              <td colSpan={9999}>
                <div className="w-full grid justify-center items-center py-10">
                  <Spinner />
                </div>
              </td>
            </tr>
          ) : null}

          {rows?.length === 0 || emptyTableStyle ? (
            <tr>
              <td colSpan={9999} className={emptyTableStyle}>
                {!isLoading && (
                  <div className="grid justify-items-center py-5 text-sm">
                    <p>{availability}</p>
                  </div>
                )}
              </td>
            </tr>
          ) : null}

          {rows?.length > 0
            ? rows?.map((row, idx) => (
                <tr key={idx} className="text-sm text-[#464F54] ">
                  {cols.map((col, id) => (
                    <TableData key={id} row={row} col={col} />
                  ))}
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
