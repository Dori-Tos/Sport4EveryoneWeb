import { For } from "solid-js";
import { MainCentered } from "./Main";

type SportTableProps = {
  data: Array<Record<string, any>>;
  columns: Array<string>;
};

export default function SportTable(props: SportTableProps) {
  return (
    <MainCentered>
      <div class="mb-4 flex border border-gray-500 rounded-md items-center">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <For each={props.columns}>
                {(column) => (
                  <th class="px-4 py-2 text-center">{column}</th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={props.data} fallback={
              <tr>
                <td colSpan={props.columns.length || 1} class="px-4 py-2 text-center">
                  No data available.
                </td>
              </tr>
            }>
              {(row) => (
                <tr class="border-t">
                  <For each={props.columns}>
                    {(column) => (
                      <td class="px-4 py-2">{row[column]}</td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </MainCentered>
  );
}
