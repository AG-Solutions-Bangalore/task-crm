import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const ErrorLoader = ({ onSuccess }) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-destructive">Error Fetching Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onSuccess} variant="outline">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorLoader;
