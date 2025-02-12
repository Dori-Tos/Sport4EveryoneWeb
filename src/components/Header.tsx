type HeaderProps = {
    string: string;
}

export function MainHeader(props: HeaderProps) {
    return (
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-8">{props.string}</h1>
    );
}

export function MediumHeader(props: HeaderProps) {
    return (
        <h1 class="max-6-xs text-5xl text-sky-700 font-thin uppercase my-8">{props.string}</h1>
    );
}