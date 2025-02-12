import { JSXElement } from "solid-js";

type LinkProps = {
    href: string;
    children: JSXElement;
}

export function UnderlinedLink(props: LinkProps) {
    return (
        <a href={props.href} target="_blank" class="text-sky-600 hover:underline">
            {props.children}
        </a>
    );
}