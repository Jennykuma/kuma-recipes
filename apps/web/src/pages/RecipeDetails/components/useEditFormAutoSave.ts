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

    const handleFocusOut = () => {
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

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (target instanceof Node && formElement.contains(target)) {
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

    formElement.addEventListener('focusout', handleFocusOut);
    formElement.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      clearPendingSave();
      formElement.removeEventListener('focusout', handleFocusOut);
      formElement.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [formRef, isEditing, onCancel, onSave]);
};

export default useEditFormAutoSave;
