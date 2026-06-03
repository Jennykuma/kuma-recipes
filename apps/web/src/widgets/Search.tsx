import { SearchIcon, X } from 'lucide-react';

type SearchProps = {
    value: string;
    onChange: (value: string) => void;
};

const Search = ({ value, onChange }: SearchProps) => {
    return (
        <div className="relative w-full sm:w-100">
            <SearchIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blush-400 pointer-events-none"
            />
            <input
                type="search"
                placeholder="Search recipes by name"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    border border-blush-200 w-full bg-white text-gray-800
                    pl-10 pr-9 py-1 rounded-xl text-sm
                    outline-none focus:border-blush-300 focus:ring-2 focus:ring-blush-100
                    placeholder:text-gray-400
                    dark:border-blush-300/70 dark:bg-[#2a2a2a] dark:text-gray-100
                    dark:placeholder:text-gray-400 dark:focus:ring-blush-400/20"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                    className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-blush-500"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default Search;
