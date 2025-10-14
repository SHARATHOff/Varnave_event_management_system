import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CertificatesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Generate Certificates</h1>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>
                Fill in the details to generate certificates for participants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event">Event</Label>
                  <Select>
                    <SelectTrigger id="event">
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="varanave-2024">VaraNave 2024</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="template">Certificate Template</Label>
                  <Select>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Template</SelectItem>
                      <SelectItem value="speaker">Speaker Template</SelectItem>
                      <SelectItem value="participant">Participant Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="participants">Participants</Label>
                  <Textarea
                    id="participants"
                    placeholder="Enter participant emails, one per line"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Custom Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter a custom message for the certificate"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Preview
                  </Button>
                  <Button type="submit">Generate Certificates</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Generated Certificates</CardTitle>
              <CardDescription>
                View and manage previously generated certificates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <p>No certificates generated yet.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
