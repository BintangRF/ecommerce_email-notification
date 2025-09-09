import React from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormWrapperProps = {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  className?: string;
};

export const FormWrapper = ({
  onSubmit,
  children,
  className,
}: FormWrapperProps) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <div className="w-full flex items-center justify-center">
        <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
          {children}
        </form>
      </div>
    </FormProvider>
  );
};
