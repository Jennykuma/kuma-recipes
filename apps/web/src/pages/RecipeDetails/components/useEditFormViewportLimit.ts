import { useEffect, type RefObject } from 'react';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const MIN_FORM_HEIGHT = 160;
const VIEWPORT_PADDING = 32;

const useEditFormViewportLimit = (
  formRef: RefObject<HTMLFormElement | null>,
  isEditing: boolean
) => {
  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const updateFormMaxHeight = () => {
      const formElement = formRef.current;
      if (!formElement) {
        return;
      }

      if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
        formElement.style.maxHeight = '';
        return;
      }

      const formTop = formElement.getBoundingClientRect().top;
      const maxHeight = Math.max(
        MIN_FORM_HEIGHT,
        window.innerHeight - formTop - VIEWPORT_PADDING
      );

      formElement.style.maxHeight = `${maxHeight}px`;
    };

    updateFormMaxHeight();
    window.addEventListener('resize', updateFormMaxHeight);
    window.addEventListener('scroll', updateFormMaxHeight, true);

    return () => {
      window.removeEventListener('resize', updateFormMaxHeight);
      window.removeEventListener('scroll', updateFormMaxHeight, true);
    };
  }, [formRef, isEditing]);
};

export default useEditFormViewportLimit;
