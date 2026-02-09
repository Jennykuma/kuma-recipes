type RemakeToggleProps = {
    checked?: boolean;
    onToggle: () => void;
    label?: string;
};

const RemakeToggle = ({ checked, onToggle, label = 'Would remake' }: RemakeToggleProps) => {
    return (
        <span className="flex items-center gap-2 text-xs text-gray-500">
            <input
                type="checkbox"
                checked={checked ?? false}
                onChange={onToggle}
                className="h-4 w-4 accent-blush-200 border border-gray-300/70"
            />
            {label}
        </span>
    );
};

export default RemakeToggle;
