
type LinkProps = {
    href: string;
    string: string;
}

export function UnderlinedLink(props: LinkProps) {
    return (
        <a href={props.href} target="_blank" class="text-sky-600 hover:underline">
            {props.string}
        </a>
    );
}