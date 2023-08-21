export const classNames = (...classNames: (string | undefined)[]) => {
    return classNames.filter(Boolean).join(" ");
}