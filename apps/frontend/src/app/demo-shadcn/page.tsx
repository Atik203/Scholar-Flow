import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DemoShadcnPage() {
  return (
    <div className="min-h-[60vh] py-24 container mx-auto max-w-3xl space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          UI Components Demo
        </h1>
        <p className="text-muted-foreground text-sm">
          Quick smoke test that shadcn/ui primitives are wired in Tailwind v4 +
          Yarn Berry.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            Sample form using Input, Textarea, Label & Buttons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Ada Lovelace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="ada@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Your thoughts..." />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="gradient" size="sm">
            Submit
          </Button>
        </CardFooter>
      </Card>
      <div className="text-xs text-muted-foreground text-center">
        If you can see styles & focus rings, setup succeeded.
      </div>
    </div>
  );
}
