type HeaderProps = {
    string: string;
}

export default function Header(props: HeaderProps) {
    return (
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">{props.string}</h1>
    );
}