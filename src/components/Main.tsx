import { JSXElement } from "solid-js"

type MainProps = {
    children: JSXElement
}

export function MainCentered(props: MainProps) {
    return (
        <main class="text-center mx-auto text-gray-700 p-4">
            {props.children}
        </main>
    )
}