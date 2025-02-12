import { MainCentered } from "./Main";

type SportTableProps = {
    data: Array<Record<string, any>>;
    columns: Array<string>;
}

export default function SportTable(props: SportTableProps) {
    return (
        <MainCentered>
            <div class="border-4 border-gray-600 p-4 rounded-md">
                <table class="table-auto w-full">
                    <thead>
                        <tr>
                            {props.columns.map((column) => (
                                <th class="px-4 py-2 text-center">{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.map((row, rowIndex) => (
                            <tr key={rowIndex} class="border-t">
                                {props.columns.map((column, colIndex) => (
                                    <td key={colIndex} class="px-4 py-2">{row[column]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainCentered>
    );
}