import React from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '../../components/ui/select';

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-xl shadow-none border-none">
        <CardHeader className="space-y-1 p-4 pb-0 text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <form>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-normal"> Email address</Label>
                <Input id="email" placeholder="Enter your email address" type="email" required className="h-12"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-normal">Password</Label>
                <Input
                  id="password" placeholder="Create a password" type="password" required className="h-12"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base font-normal">First name</Label>
                <Input id="firstName" placeholder="Enter your first name" type="text" required className="h-12"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base font-normal">Last name</Label>
                <Input id="lastName" placeholder="Enter your last name" type="text" required className="h-12"/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-base font-normal">Country/Region</Label>
                <Select>
                  <SelectTrigger id="country" className="h-12">
                    <SelectValue placeholder="Select your country/region" />
                  </SelectTrigger>
                  <SelectContent className="" >
                    <SelectItem className="" value="us">United States</SelectItem>
                    <SelectItem className=""value="ca">Canada</SelectItem>
                    <SelectItem className=""value="uk">United Kingdom</SelectItem>
                    <SelectItem className=""value="au">Australia</SelectItem>
                    <SelectItem className=""value="de">Germany</SelectItem>
                    <SelectItem className=""value="fr">France</SelectItem>
                    <SelectItem className=""value="jp">Japan</SelectItem>
                    <SelectItem className=""value="cn">China</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-normal">Phone number</Label>
                <Input id="phone" placeholder="Enter your phone number" type="tel" className="h-12"/>
              </div>

              <Button
                size={'lg'} variant={'outline'} type="submit"
                className="w-full h-12 bg-blue-200 hover:bg-blue-300 text-gray-800 font-medium transition-colors rounded-full"
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;
