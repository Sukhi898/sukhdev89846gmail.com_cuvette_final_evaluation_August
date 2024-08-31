import { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button, FormInput } from "../../components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/authContext";
import styles from "./styles/LoginForm.module.css";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userSchema = yup
  .object({
    email: yup
      .string()
      .matches(emailRegex, { message: "Email is not valid" })
      .required(),
    password: yup.string().required(),
  })
  .required();

export default function LoginForm() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(userSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "api/auth/login",
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
        throw new Error(errJson.message);
      }

      const resJson = await res.json();
      authCtx.saveUser(resJson.data.token);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
      <Button variant="secondary">
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}
