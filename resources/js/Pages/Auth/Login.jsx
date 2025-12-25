import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back!</h1>
                <p className="text-slate-400 text-sm">Please enter your details to sign in.</p>
            </div>

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="john@example.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <InputLabel htmlFor="password" value="Password" className="mb-0" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) =>
                            setData('remember', e.target.checked)
                        }
                    />
                    <span className="ms-2 text-sm text-slate-400">
                        Stay signed in for 30 days
                    </span>
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Sign In to Your Account
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                        >
                            Create one now
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
