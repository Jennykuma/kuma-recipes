type RemakeToggleProps = {
    checked?: boolean;
    onToggle: () => void;
};

const RemakeToggle = ({ checked, onToggle }: RemakeToggleProps) => {
    return (
        <span className="flex items-center gap-2 text-xs text-gray-500">
            <input type="checkbox" checked={checked} onClick={onToggle} />
            Would remake
        </span>
    );
};

export default RemakeToggle;
