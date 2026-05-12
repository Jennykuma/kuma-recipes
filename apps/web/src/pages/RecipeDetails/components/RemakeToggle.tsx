import { useId } from 'react';

type RemakeToggleProps = {
    checked?: boolean;
    onToggle: () => void;
    label?: string;
};

const RemakeToggle = ({
    checked,
    onToggle,
    label = 'Would remake',
}: RemakeToggleProps) => {
    const remakeId = useId();

    return (
        <label
            htmlFor={remakeId}
            className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer whitespace-nowrap dark:text-gray-200"
        >
            <input
                id={remakeId}
                type="checkbox"
                checked={checked ?? false}
                onChange={onToggle}
                className="h-4 w-4 accent-blush-200 border border-gray-300/70 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300"
            />
            {label}
        </label>
    );
};

export default RemakeToggle;
