import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";

export default function LoginForm() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
      <p className="text-sm text-gray-600 text-center mb-8">
        Silakan login untuk mengakses dashboard
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error Alert */}
        {loginMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "Login gagal. Periksa email dan password Anda."}
            </p>
          </div>
        )}

        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="nama@sekolah.id"
          {...register("email")}
          error={errors.email?.message}
          disabled={loginMutation.isPending}
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder="Masukkan password"
          {...register("password")}
          error={errors.password?.message}
          disabled={loginMutation.isPending}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-blue-600 hover:text-blue-700">
            Lupa password?
          </a>
        </div>

        {/* Submit Button */}
        <Button type="submit" fullWidth isLoading={loginMutation.isPending} size="lg">
          Login
        </Button>
      </form>

      {/* Demo credentials helper */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-2 font-medium">Demo Credentials:</p>
        <div className="space-y-1 text-xs text-gray-400">
          <p>Super Admin: admin@school.id / Admin123</p>
          <p>Teacher: teacher@school.id / Teacher123</p>
          <p>Student: student@school.id / Student123</p>
        </div>
      </div>
    </div>
  );
}
