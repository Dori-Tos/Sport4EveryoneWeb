import { MainCentered } from "./Main";

type SportTableProps = {
    data: Array<Record<string, any>>;
    columns: Array<string>;
}

export default function SportTable(props: SportTableProps) {
    return (
        <MainCentered>
            <div class="mb-4 flex border-3 border-gray-500 rounded-md items-center">
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            {props.columns.map((column) => (
                                <th class="px-4 py-2 text-center">{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.map((row) => (
                            <tr class="border-t">
                                {props.columns.map((column) => (
                                    <td class="px-4 py-2">{row[column]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainCentered>
    );
}