import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { type RecipeFormValues } from '../types/recipeForm';

const Tags = () => {
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
        </div>
    );
};

export default Tags;
