import { useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pencil, Tag as TagIcon } from 'lucide-react';
import Tags from '../../../components/Tags';
import type { Tag } from '../../../../../api/src/services/tags/tags.types';
import useEditFormAutoSave from './useEditFormAutoSave';

type TagsSectionProps = {
  tags?: Tag[];
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (tagIds: string[]) => void;
  onCancel?: () => void;
};

type TagsFormValues = {
  tagIds: string[];
};

const getDefaultTagFormValues = (tags?: Tag[]): TagsFormValues => ({
  tagIds: tags?.map((tag) => tag.id) ?? [],
});

const TagsSection = ({
  tags,
  editable = true,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
}: TagsSectionProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<TagsFormValues>({
    defaultValues: getDefaultTagFormValues(tags),
  });

  const resetForm = useCallback(() => {
    form.reset(getDefaultTagFormValues(tags));
  }, [form, tags]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleCancel = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [onCancel, resetForm]);

  const handleSave = useCallback(() => {
    onSave?.(form.getValues('tagIds') ?? []);
  }, [form, onSave]);

  useEditFormAutoSave({
    formRef,
    isEditing,
    onSave: handleSave,
    onCancel: handleCancel,
  });

  return (
    <div className="w-full">
      <div className="flex flex-row items-baseline gap-1 mb-1 text-gray-600 dark:text-gray-300">
        <span className="inline-flex text-[10px] items-center gap-1 uppercase font-bold text-gray-500 dark:text-gray-300 tracking-widest rounded-full">
          <TagIcon className="h-3 w-3 text-gray-400" aria-hidden="true" />
          Tags
        </span>
        {editable && !isEditing && (
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
          <form ref={formRef}>
            <Tags autoFocusInput />
          </form>
        </FormProvider>
      ) : tags?.length ? (
        <div className="flex flex-wrap gap-1.5 max-h-15">
          {tags.map((tag: Tag) => (
            <span
              key={tag.id}
              className="inline-flex min-h-6 items-center rounded-full bg-sage-50 px-2.5 py-0.5 text-xs leading-tight text-gray-700 dark:bg-sage-300/20 dark:text-sage-100"
            >
              {tag.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {editable ? 'Add tags to categorize your recipe.' : 'No tags added'}
        </p>
      )}
    </div>
  );
};

export default TagsSection;
