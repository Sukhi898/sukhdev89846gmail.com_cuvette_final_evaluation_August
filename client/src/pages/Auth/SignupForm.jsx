import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Button, FormInput } from "../../components";
import styles from "./styles/SignupForm.module.css";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userSchema = yup
  .object({
    name: yup.string().required("Please enter a name"),
    email: yup
      .string()
      .matches(emailRegex, { message: "Email is not valid" })
      .required("Please enter a valid email address"),
    password: yup.string().min(6).required("Please provide a valid password"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  })
  .required();

export default function SignupForm({ onSuccess }) {
  const [isSafeToReset, setIsSafeToReset] = useState(false);
  const navigate = useNavigate();

  const defaultValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(userSchema),
  });

  useEffect(() => {
    if (isSafeToReset) {
      reset(defaultValues);
      setIsSafeToReset(false);
    }
  }, [reset, isSafeToReset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        console.log(errJson);
        const { errors } = errJson;

        for (const property in errors) {
          setError(property, { type: "custom", message: errors[property] });
        }

        throw new Error(errJson.message);
      }

      toast.success("Successfully registered!");
      setIsSafeToReset(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormInput
        error={errors.name}
        field="name"
        label="Name"
        register={register}
      />
      <FormInput
        error={errors.email}
        field="email"
        label="Email"
        register={register}
      />
      <FormInput
        error={errors.password}
        field="password"
        label="Password"
        register={register}
        type="password"
      />
      <FormInput
        error={errors.confirmPassword}
        field="confirmPassword"
        label="Confirm Password"
        register={register}
        type="password"
      />

      <Button variant="secondary">
        {isSubmitting ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  );
}
