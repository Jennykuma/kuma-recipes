import { useEffect, type RefObject } from 'react';

type UseEditFormAutoSaveOptions = {
  formRef: RefObject<HTMLFormElement | null>;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
};

const useEditFormAutoSave = ({
  formRef,
  isEditing,
  onSave,
  onCancel,
}: UseEditFormAutoSaveOptions) => {
  useEffect(() => {
    const formElement = formRef.current;
    if (!formElement || !isEditing) {
      return;
    }

    let saveTimeoutId: number | null = null;

    const clearPendingSave = () => {
      if (saveTimeoutId === null) {
        return;
      }

      window.clearTimeout(saveTimeoutId);
      saveTimeoutId = null;
    };

    const handleFocusOut = (event: FocusEvent) => {
      const nextFocusedElement = event.relatedTarget as Node | null;

      if (nextFocusedElement instanceof Node && formElement.contains(nextFocusedElement)) {
        return;
      }

      clearPendingSave();
      saveTimeoutId = window.setTimeout(() => {
        saveTimeoutId = null;

        if (formElement.contains(document.activeElement)) {
          return;
        }

        onSave();
      }, 0);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      clearPendingSave();
      onCancel();
    };

    formElement.addEventListener('focusout', handleFocusOut);
    formElement.addEventListener('keydown', handleKeyDown);

    return () => {
      clearPendingSave();
      formElement.removeEventListener('focusout', handleFocusOut);
      formElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [formRef, isEditing, onCancel, onSave]);
};

export default useEditFormAutoSave;
