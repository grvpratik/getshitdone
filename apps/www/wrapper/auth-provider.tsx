'use client'
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { getGoogleUrl } from "www/lib/auth";
import { NEXT_PUBLIC_API } from "www/lib/constant";


// types.ts
interface AuthError {
  message: string;
  code: string;
}

interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
  user: any | null;
}

const AuthContext = createContext<{
	authState: AuthState;
	login: () => void;
	logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] = useState<AuthState>({
		isLoading: true,
		error: null,
		user: null,
	});

	// Check for existing session on mount
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const response = await axios.get(`${NEXT_PUBLIC_API}/user/session`, {
			
			});

			if (response.status!==200) throw new Error("Session check failed");

			const data = await response.data;
			setAuthState({
				isLoading: false,
				error: null,
				user: data.user,
			});
		} catch (error) {
			setAuthState({
				isLoading: false,
				error: null,
				user: null,
			});
		}
	};

	const login = () => {
		// Store the current URL for redirect after login
		sessionStorage.setItem("authRedirect", window.location.pathname);

		// Start login flow
		window.location.href = getGoogleUrl();
	};

	const logout = async () => {
		try {
			await fetch(`${NEXT_PUBLIC_API}/user/logout`, {
				method: "POST",
				credentials: "include",
			});
			setAuthState({
				isLoading: false,
				error: null,
				user: null,
			});
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<AuthContext.Provider value={{ authState, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};

// "use client";
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function AuthCallback() {
// 	const router = useRouter();
// 	const searchParams = useSearchParams();

// 	useEffect(() => {
// 		const handleCallback = async () => {
// 			const code = searchParams.get("code");
// console.log(code)
// 			if (!code) {
// 				router.push("/login?error=no_code");
// 				return;
// 			}

// 			try {
// 				const response = await fetch(
// 					`${process.env.NEXT_PUBLIC_API_URL}/user/auth/google`,
// 					{
// 						method: "POST",
// 						credentials: "include",
// 						headers: {
// 							"Content-Type": "application/json",
// 						},
// 						body: JSON.stringify({ code }),
// 					}
// 				);

// 				if (!response.ok) {
// 					throw new Error("Auth failed");
// 				}

// 				router.push("/dashboard");
// 			} catch (error) {
// 				console.error("Auth error:", error);
// 				router.push("/login?error=auth_failed");
// 			}
// 		};

// 		handleCallback();
// 	}, [router, searchParams]);

// 	return <div>Processing login...</div>;
// }
