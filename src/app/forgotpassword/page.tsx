'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  // const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    // setButtonDisabled(user.email.length === 0);
  }, [user.email]);

  const onForgotPassword = async () => {
    try {
      if(user.email.length === 0){
        setError("Email is required");
        return;
      }
      setError(""); 
      setLoading(true);
      const response = await axios.post("/api/auth/forgotpassword", { email: user.email });
      console.log(response.data);
      toast.success("Reset password link sent to your email.");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setError("Failed to reset password. Please check your email and try again.");
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-teal-500">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full"
            />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md"
            >
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-teal-500 hover:bg-teal-600 cursor-pointer"
            onClick={onForgotPassword}
            // disabled={buttonDisabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
