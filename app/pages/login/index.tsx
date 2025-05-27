import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { data, Form, redirect } from 'react-router';
import type { Route } from './+types';
import { findMemberByAuthInfo } from '@/database/members';
import { commitSession, getSession } from '@/utils/session.server';

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(
    request.headers.get('Cookie'),
  );
  if (session.has('memberId')) {
    return redirect(`/`);
  }
  return data(
    { error: session.get('error') },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
}

export async function action({request}: Route.ActionArgs) {
  const session = await getSession(
    request.headers.get('Cookie'),
  );
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  if (!email || !password) {
    session.flash('error', '올바른 이메일과 비밀번호를 입력하세요.');

    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
  const memberInfo = await findMemberByAuthInfo(email.toString(),
    password.toString());
  if (!memberInfo || !memberInfo.isAdmin) {
    session.flash('error', '인증 정보가 올바르지 않거나 존재하지 않는 계정입니다.');

    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
  session.set('memberId', memberInfo.id);
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { error } = loaderData;

  return (
    <div
      className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>로그인</CardTitle>
          <CardDescription className='text-center'>계정에 로그인하여 서비스를
            이용하세요</CardDescription>
        </CardHeader>
        <Form method='POST'>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>이메일</Label>
              <Input id='email' type='email' name='email'
                placeholder='example@email.com'
                required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>비밀번호</Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='비밀번호를 입력하세요'
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ?
                    <EyeOff className='h-4 w-4' /> :
                    <Eye className='h-4 w-4' />}
                </Button>
              </div>
            </div>
            <p className="text-red-400 text-sm">{error}</p>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4 mt-4'>
            <Button type='submit' className='w-full cursor-pointer'>
              로그인
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
