import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

const BackButton = () => {
    return (
        <Link
            tabIndex={0}
            className="
                text-xs text-gray-400
                visited:text-gray-400 hover:text-accent
                inline-flex items-center gap-1
                cursor-pointer transition-colors"
            to={`/`}
        >
            <MoveLeft className="w-3 h-3 translate-y-[0.5px]" />
            Back
        </Link>
    );
};

export default BackButton;
