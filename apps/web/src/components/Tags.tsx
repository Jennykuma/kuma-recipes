import { useState } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { type RecipeFormValues } from '../types/recipeForm';

const Tags = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // const { control, register, setFocus } = useFormContext<RecipeFormValues>();
    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: 'tags',
    // });

    return (
        <div>
            {/* {fields.map((field, index) => {
                return <div key={field.id}>tag</div>;
            })} */}
            <div className="w-full">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                ></input>
                <div className="border border-gray-100">
                    <a href="/" className="block w-full border-b-1 border-gray-200">
                        hmm
                    </a>
                    <a href="/" className="block w-full border-b-1 border-gray-200">
                        hmmm
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Tags;
