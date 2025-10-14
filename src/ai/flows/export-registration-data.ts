'use server';

/**
 * @fileOverview Allows Super Admins to export registration data as CSV or Excel for analysis and reporting.
 *
 * - exportRegistrationData - A function that handles the export process.
 * - ExportRegistrationDataInput - The input type for the exportRegistrationData function.
 * - ExportRegistrationDataOutput - The return type for the exportRegistrationData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExportRegistrationDataInputSchema = z.object({
  format: z.enum(['CSV', 'Excel']).describe('The desired format for the exported data.'),
  registrationData: z.array(z.record(z.any())).describe('An array of registration data objects.'),
});
export type ExportRegistrationDataInput = z.infer<typeof ExportRegistrationDataInputSchema>;

const ExportRegistrationDataOutputSchema = z.object({
  fileContent: z.string().describe('The exported data as a raw string for CSV, or a base64 encoded string for Excel.'),
  mimeType: z.string().describe('The MIME type of the exported file (e.g., text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet).'),
});
export type ExportRegistrationDataOutput = z.infer<typeof ExportRegistrationDataOutputSchema>;

export async function exportRegistrationData(input: ExportRegistrationDataInput): Promise<ExportRegistrationDataOutput> {
  return exportRegistrationDataFlow(input);
}

const exportRegistrationDataPrompt = ai.definePrompt({
  name: 'exportRegistrationDataPrompt',
  input: {schema: ExportRegistrationDataInputSchema},
  output: {schema: ExportRegistrationDataOutputSchema},
  prompt: `You are an expert data converter. You take registration data and convert it to a specified format like CSV or Excel.

      The registration data is provided in JSON format. The desired format is {{{format}}}.
      
      When creating Excel data, return a base64 encoded string in the fileContent field.
      For CSV, return a raw CSV string.

      Here is the registration data:
      {{#each registrationData}}
      {{@index}}: {{this}}
      {{/each}}

      Return the data in the 'fileContent' field, and the corresponding mime type in the 'mimeType' field. 
      For CSV, the mimeType should be 'text/csv'.
      For Excel, the mimeType should be 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.
      Do NOT base64 encode the CSV data. ONLY base64 encode the Excel data.`, 
});

const exportRegistrationDataFlow = ai.defineFlow(
  {
    name: 'exportRegistrationDataFlow',
    inputSchema: ExportRegistrationDataInputSchema,
    outputSchema: ExportRegistrationDataOutputSchema,
  },
  async input => {
    const {output} = await exportRegistrationDataPrompt(input);
    // The prompt now handles returning the correct format (raw string for CSV, base64 for Excel).
    // No further processing is needed on the server.
    return output!;
  }
);
