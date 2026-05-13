import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Pencil, Tag as TagIcon } from 'lucide-react';
import Tags from '../../../components/Tags';
import type { Tag } from '../../../../../api/src/services/tags/tags.types';

type TagsSectionProps = {
    tags?: Tag[];
    isEditing: boolean;
    onEdit: () => void;
    onSave: (tagIds: string[]) => void;
    onCancel: () => void;
};

type TagsFormValues = {
    tagIds: string[];
};

const TagsSection = ({ tags, isEditing, onEdit, onSave, onCancel }: TagsSectionProps) => {
    const form = useForm<TagsFormValues>({
        defaultValues: {
            tagIds: tags?.map((tag) => tag.id) ?? [],
        },
    });
    const selectedTagIds = useWatch({ control: form.control, name: 'tagIds' }) ?? [];

    useEffect(() => {
        form.reset({ tagIds: tags?.map((tag) => tag.id) ?? [] });
    }, [tags, form]);

    const handleCancel = () => {
        form.reset({ tagIds: tags?.map((tag) => tag.id) ?? [] });
        onCancel();
    };

    const handleSave = () => {
        onSave(selectedTagIds);
    };

    return (
        <div className="w-full">
            <div className="flex flex-row items-baseline gap-1 mb-1 text-gray-600 dark:text-gray-300">
                <span className="inline-flex text-[10px] items-center gap-1 uppercase tracking-wide rounded-full">
                    <TagIcon className="h-3 w-3 text-gray-400" aria-hidden="true" />
                    Tags
                </span>
                {!isEditing && (
                    <button
                        type="button"
                        onClick={onEdit}
                        aria-label="Edit tags"
                        className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300"
                    >
                        <Pencil
                            className="w-3 h-4 pt-1 cursor-pointer link-blush"
                            aria-hidden="true"
                        />
                    </button>
                )}
            </div>

            {isEditing ? (
                <FormProvider {...form}>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSave();
                        }}
                    >
                        <Tags autoFocusInput />
                        <div className="mt-1 flex gap-2 justify-end">
                            <button
                                className="font-jua text-xs text-gray-400 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-sm"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="font-jua text-xs text-blush-400 hover:text-blush-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 rounded-sm"
                                type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </FormProvider>
            ) : tags?.length ? (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag: Tag) => (
                        <span
                            key={tag.id}
                            className="inline-flex h-6 items-center rounded-full bg-sage-50 px-2.5 text-xs text-gray-700 dark:bg-sage-300/20 dark:text-sage-100"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                    Add tags to categorize your recipe.
                </p>
            )}
        </div>
    );
};

export default TagsSection;
