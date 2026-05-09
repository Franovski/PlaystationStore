import { useState } from 'react';

export const useFormFields = <T extends Record<string, unknown>>(initialValues: T) => {
  const [fields, setFields] = useState<T>(initialValues);

  const updateField = (name: keyof T, value: T[keyof T]) => {
    setFields((current) => ({ ...current, [name]: value }));
  };

  const resetFields = () => {
    setFields(initialValues);
  };

  return { fields, setFields, updateField, resetFields };
};
