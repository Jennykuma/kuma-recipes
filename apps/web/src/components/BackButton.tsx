import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type BackButtonProps = {
    to?: string;
    onClick?: () => void;
};

const BackButton = ({ to, onClick }: BackButtonProps) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        if (to) {
            navigate(to);
            return;
        }
        navigate(-1);
    };

    return (
        <button
            type="button"
            tabIndex={0}
            className="
                text-xs text-gray-400 p-0
                visited:text-gray-400 hover:text-accent
                inline-flex items-center gap-1
                cursor-pointer transition-colors"
            onClick={handleClick}
        >
            <MoveLeft className="w-3 h-3 translate-y-[0.5px]" />
            Back
        </button>
    );
};

export default BackButton;
