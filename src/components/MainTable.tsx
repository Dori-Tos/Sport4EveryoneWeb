import { JSXElement } from "solid-js"
import { MainCentered } from "./Main"

type TableProps = {
    children: JSXElement
}

export function TableCentered(props: TableProps) {
    return (
        <MainCentered>
            <div class="border-4 border-gray-600 p-4 rounded-md">
                {props.children}
            </div>
        </MainCentered>
    )
}