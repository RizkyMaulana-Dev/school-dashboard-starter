import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from "@/stores/auth.store"; // 1. Import useAuthStore

export default function LoginForm() {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    // 2. Ambil fungsi setAuth dari Zustand Store
    const setAuth = useAuthStore((state) => state.setAuth);

    // State untuk error & loading khusus Google Auth
    const [googleError, setGoogleError] = useState<string | null>(null);
    const [isGooglePending, setIsGooglePending] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        setGoogleError(null);
        loginMutation.mutate(data);
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setGoogleError(null);
        setIsGooglePending(true);

        const idToken = credentialResponse.credential;

        if (!idToken) {
            setGoogleError("Token Google tidak ditemukan.");
            setIsGooglePending(false);
            return;
        }

        try {
            // 1. Kirim ID token ke backend
            const response = await fetch("http://localhost:3000/api/v1/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: idToken }),
            });

            const resData = await response.json();

            if (response.ok) {
                // Sesuai struktur response backend: resData.data berisi { accessToken, user }
                const { accessToken, refreshToken, user } = resData.data || resData;

                // 3. PANGGIL setAuth DARI ZUSTAND STORE
                // Signature: setAuth(user, accessToken, refreshToken)
                setAuth(user, accessToken, refreshToken || "");

                // 4. Redirect ke halaman target
                navigate("/activity/home");
            } else {
                setGoogleError(resData.message || "Gagal melakukan autentikasi dengan server.");
            }
        } catch (error) {
            console.error("Error menghubungi backend:", error);
            setGoogleError("Gagal terhubung ke server backend.");
        } finally {
            setIsGooglePending(false);
        }
    };

    const handleGoogleError = () => {
        setGoogleError("Proses login Google dibatalkan atau gagal.");
    };

    const isAnyLoading = loginMutation.isPending || isGooglePending;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-600 text-center mb-8">
                Silakan login untuk mengakses dashboard
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Alert (Email/Password & Google) */}
                {(loginMutation.isError || googleError) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">
                            {googleError
                                ? googleError
                                : loginMutation.error instanceof Error
                                    ? loginMutation.error.message
                                    : "Login gagal. Periksa email dan password Anda."}
                        </p>
                    </div>
                )}

                {/* Email */}
                <Input
                    className="text-black"
                    label="Email"
                    type="email"
                    placeholder="nama@sekolah.id"
                    {...register("email")}
                    error={errors.email?.message}
                    disabled={isAnyLoading}
                />

                {/* Password */}
                <Input
                    className="text-black"
                    label="Password"
                    type="password"
                    placeholder="Masukkan password"
                    {...register("password")}
                    error={errors.password?.message}
                    disabled={isAnyLoading}
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={isAnyLoading}
                        />
                        <span className="text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                        Lupa password?
                    </a>
                </div>

                {/* Submit Button */}
                <Button type="submit" fullWidth isLoading={loginMutation.isPending} disabled={isAnyLoading} size="lg">
                    Login
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Atau masuk dengan</span>
                </div>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center">
                {isGooglePending ? (
                    <p className="text-sm text-gray-500">Memproses login Google...</p>
                ) : (
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                    />
                )}
            </div>

            {/* Demo credentials helper */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2 font-medium font-sans">Demo Credentials:</p>
                <div className="space-y-1 text-xs text-gray-400">
                    <p>Super Admin: admin@school.id / Admin123</p>
                    <p>Teacher: teacher@school.id / Teacher123</p>
                    <p>Student: student@school.id / Student123</p>
                </div>
            </div>
        </div>
    );
}